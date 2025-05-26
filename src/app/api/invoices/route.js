import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { withAuth } from '@/app/lib/auth';
import Invoice from '@/app/models/Invoice';
import Project from '@/app/models/Project'; // For validating projectId if provided
import User from '@/app/models/User'; // For validating userId
import Setting from '@/app/models/Setting'; // For invoice numbering

// Helper to generate a unique invoice number based on user settings
const generateInvoiceNumber = async (userId) => {
  // Find user's settings, or create if not exist, and atomically increment sequence
  let settings = await Setting.findOneAndUpdate(
    { userId },
    { $inc: { invoiceSequence: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true } 
  );

  const sequence = settings.invoiceSequence; // This is the new, incremented sequence
  const prefix = settings.invoicePrefix || 'INV-'; // Default prefix if not set
  const format = settings.invoiceNumberFormat || '{PREFIX}{YYYY}-{SEQ}'; // Default format

  const year = new Date().getFullYear().toString();
  const shortYear = year.slice(-2);
  const paddedSequence = sequence.toString().padStart(4, '0'); // Pad to 4 digits, e.g., 0001

  let invoiceNumber = format;
  invoiceNumber = invoiceNumber.replace('{PREFIX}', prefix);
  invoiceNumber = invoiceNumber.replace('{YYYY}', year);
  invoiceNumber = invoiceNumber.replace('{YY}', shortYear);
  invoiceNumber = invoiceNumber.replace('{SEQ}', paddedSequence);
  
  return invoiceNumber;
};

// POST: Create a new invoice
export const POST = withAuth(async (request, params, decodedToken) => {
  try {
    await clientPromise;
    const { userId } = decodedToken;
    const body = await request.json();

    const {
      projectId, // Optional
      issueDate,
      dueDate, // Optional
      items,
      status = 'draft', // Default status
      notes, // Optional
      taxRate = 0, // Default taxRate
    } = body;

    // Basic Validation
    if (!issueDate || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: 'Issue date and at least one item are required' }, { status: 400 });
    }

    for (const item of items) {
      if (item.quantity == null || item.unitPrice == null || !item.description) {
        return NextResponse.json({ message: 'Each item must have description, quantity, and unit price' }, { status: 400 });
      }
      if (typeof item.quantity !== 'number' || typeof item.unitPrice !== 'number' || item.quantity <= 0 || item.unitPrice < 0) {
        return NextResponse.json({ message: 'Item quantity must be > 0 and unit price must be >= 0' }, { status: 400 });
      }
    }

    if (projectId) {
      const projectExists = await Project.findOne({ _id: projectId, userId });
      if (!projectExists) {
        return NextResponse.json({ message: 'Project not found or does not belong to user' }, { status: 404 });
      }
    }
    
    // Calculations
    let subtotal = 0;
    const calculatedItems = items.map(item => {
      const totalPrice = Number((item.quantity * item.unitPrice).toFixed(2));
      subtotal += totalPrice;
      return { ...item, totalPrice };
    });
    subtotal = Number(subtotal.toFixed(2));

    let taxAmount = 0;
    // Expect taxRate as a decimal, e.g., 0.05 for 5%
    if (taxRate > 0 && taxRate < 1) { // Basic validation for decimal format
      taxAmount = Number((subtotal * taxRate).toFixed(2));
    } else if (taxRate >= 1) { // Handle cases where percentage might still be passed
      taxAmount = Number((subtotal * (taxRate / 100)).toFixed(2));
    }


    const total = Number((subtotal + taxAmount).toFixed(2));
    const invoiceNumber = await generateInvoiceNumber(userId); // Now async

    const newInvoice = new Invoice({
      userId,
      projectId,
      invoiceNumber, // Use the new generated invoice number
      issueDate: new Date(issueDate),
      dueDate: dueDate ? new Date(dueDate) : undefined,
      items: calculatedItems,
      subtotal,
      // Store taxRate as provided (decimal or percentage, ensure consistency if needed)
      // For now, storing as is. If it was a percentage, it will be stored as e.g. 5.0. If decimal, e.g. 0.05
      taxRate: taxRate, 
      taxAmount: taxAmount,
      total,
      status,
      notes,
    });

    await newInvoice.save();
    return NextResponse.json(newInvoice, { status: 201 });

  } catch (error) {
    console.error('Create Invoice Error:', error);
    if (error.name === 'ValidationError') {
      return NextResponse.json({ message: 'Validation Error', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
});

// GET: List all invoices for the authenticated user with filtering, sorting, and pagination
export const GET = withAuth(async (request, params, decodedToken) => {
  try {
    await clientPromise;
    const { userId } = decodedToken;
    const { searchParams } = new URL(request.url);

    // Filtering
    const filter = { userId };
    if (searchParams.has('status')) {
      filter.status = searchParams.get('status');
    }
    if (searchParams.has('projectId')) {
      const projectId = searchParams.get('projectId');
      // Basic validation for projectId format if needed, e.g., ObjectId check
      if (projectId.match(/^[0-9a-fA-F]{24}$/)) {
        filter.projectId = projectId;
      } else {
        return NextResponse.json({ message: 'Invalid projectId format' }, { status: 400 });
      }
    }

    // Sorting
    const sortBy = searchParams.get('sortBy') || 'issueDate'; // Default sort field
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1; // Default to descending
    const sortOptions = { [sortBy]: sortOrder };

    // Pagination
    const page = parseInt(searchParams.get('page'), 10) || 1;
    const limit = parseInt(searchParams.get('limit'), 10) || 10; // Default limit to 10
    const skip = (page - 1) * limit;

    const totalInvoices = await Invoice.countDocuments(filter);
    const invoices = await Invoice.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      currentPage: page,
      totalPages: Math.ceil(totalInvoices / limit),
      totalInvoices,
      invoices,
    }, { status: 200 });

  } catch (error) {
    console.error('List Invoices Error:', error);
    // Consider more specific error messages based on error type
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
});
