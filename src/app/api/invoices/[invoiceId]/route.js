import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { withAuth } from '@/app/lib/auth';
import Invoice from '@/app/models/Invoice';
import Project from '@/app/models/Project'; // For validating projectId if provided during update

// GET: Fetch a single invoice by ID
export const GET = withAuth(async (request, { params }, decodedToken) => {
  try {
    await clientPromise;
    const authUserId = decodedToken.userId; // Renaming to avoid conflict with invoice.userId
    const { invoiceId } = params;

    if (!invoiceId.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ message: 'Invalid Invoice ID format' }, { status: 400 });
    }

    // Ensure the invoice belongs to the authenticated user
    const invoice = await Invoice.findOne({ _id: invoiceId, userId: authUserId })
      .populate('projectId') // Populate project details
      .populate({ // Populate user details from userId field on Invoice
          path: 'userId',
          select: 'email companyName' // Select specific fields from User model
      });


    if (!invoice) {
      return NextResponse.json({ message: 'Invoice not found or access denied' }, { status: 404 });
    }
    
    // Manually fetch user settings if needed for defaults
    // This is done because User model doesn't directly embed Settings.
    // We use authUserId from the token, which is the owner of the invoice.
    let userSettings = null;
    if ((!invoice.projectId?.letterhead || !invoice.projectId?.footer)) {
        userSettings = await Setting.findOne({ userId: authUserId }).select('defaultLetterhead defaultFooter');
    }

    // Combine invoice data with settings for the response if needed,
    // or let frontend handle conditional display based on what's available.
    // For simplicity here, we'll send the populated invoice.
    // The frontend already has logic to check invoice.projectId.letterhead then invoice.userId.settings.defaultLetterhead
    // We need to make sure invoice.userId.settings is available if we go that route in frontend.
    // The current frontend logic for ViewInvoicePage is:
    // {invoice.projectId?.letterhead && ...}
    // {!invoice.projectId?.letterhead && invoice.userId?.settings?.defaultLetterhead && ...}
    // This implies invoice.userId needs to be populated with a settings object.
    // The populate for 'userId' above only gets email/companyName.

    // Let's adjust the response to include settings directly for easier frontend consumption
    const invoiceObject = invoice.toObject();
    if (userSettings) {
        invoiceObject.userSettings = userSettings;
    }


    return NextResponse.json(invoiceObject, { status: 200 });

  } catch (error) {
    console.error('Get Invoice Error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
});

// PUT: Update an existing invoice by ID
export const PUT = withAuth(async (request, { params }, decodedToken) => {
  try {
    await clientPromise;
    const { userId } = decodedToken;
    const { invoiceId } = params;
    const body = await request.json();

    if (!invoiceId.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ message: 'Invalid Invoice ID format' }, { status: 400 });
    }

    const {
      projectId, // Optional
      issueDate,
      dueDate, // Optional
      items,
      status,
      notes, // Optional
      taxRate, // Optional, if not provided, existing or 0 will be used
    } = body;

    // Basic Validation for updatable fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: 'At least one item is required' }, { status: 400 });
    }
    
    for (const item of items) {
      if (item.quantity == null || item.unitPrice == null || !item.description) {
        return NextResponse.json({ message: 'Each item must have description, quantity, and unit price' }, { status: 400 });
      }
      if (typeof item.quantity !== 'number' || typeof item.unitPrice !== 'number' || item.quantity <= 0 || item.unitPrice < 0) {
         return NextResponse.json({ message: 'Item quantity must be > 0 and unit price must be >= 0' }, { status: 400 });
      }
    }
    
    const existingInvoice = await Invoice.findOne({ _id: invoiceId, userId });
    if (!existingInvoice) {
      return NextResponse.json({ message: 'Invoice not found or access denied' }, { status: 404 });
    }

    if (projectId) {
      const projectExists = await Project.findOne({ _id: projectId, userId });
      if (!projectExists) {
        return NextResponse.json({ message: 'Project not found or does not belong to user' }, { status: 404 });
      }
      existingInvoice.projectId = projectId;
    } else {
      existingInvoice.projectId = undefined; // Or null, depending on schema preference for optional refs
    }

    // Calculations
    let subtotal = 0;
    const calculatedItems = items.map(item => {
      const totalPrice = Number((item.quantity * item.unitPrice).toFixed(2));
      subtotal += totalPrice;
      return { ...item, totalPrice }; // Ensure all item fields are preserved
    });
    subtotal = Number(subtotal.toFixed(2));
    
    const newTaxRate = taxRate !== undefined ? taxRate : existingInvoice.taxRate;
    let taxAmount = 0;
    // Expect taxRate as a decimal, e.g., 0.05 for 5%
    if (newTaxRate > 0 && newTaxRate < 1) { // Basic validation for decimal format
      taxAmount = Number((subtotal * newTaxRate).toFixed(2));
    } else if (newTaxRate >= 1) { // Handle cases where percentage might still be passed
      // If old value was percentage, or new value is percentage, calculate accordingly
      taxAmount = Number((subtotal * (newTaxRate / 100)).toFixed(2));
    }
    // If newTaxRate is 0, taxAmount remains 0

    const total = Number((subtotal + taxAmount).toFixed(2));

    // Update fields
    existingInvoice.issueDate = issueDate ? new Date(issueDate) : existingInvoice.issueDate;
    existingInvoice.dueDate = dueDate ? new Date(dueDate) : existingInvoice.dueDate;
    existingInvoice.items = calculatedItems;
    existingInvoice.status = status || existingInvoice.status;
    existingInvoice.notes = notes !== undefined ? notes : existingInvoice.notes;
    existingInvoice.subtotal = subtotal;
    existingInvoice.taxRate = newTaxRate; // Store the taxRate as provided/updated
    existingInvoice.taxAmount = taxAmount;
    existingInvoice.total = total;
    // invoiceNumber is generally not updated

    const updatedInvoice = await existingInvoice.save();
    return NextResponse.json(updatedInvoice, { status: 200 });

  } catch (error) {
    console.error('Update Invoice Error:', error);
    if (error.name === 'ValidationError') {
      return NextResponse.json({ message: 'Validation Error', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
});

// DELETE: Delete an invoice by ID
export const DELETE = withAuth(async (request, { params }, decodedToken) => {
  try {
    await clientPromise;
    const { userId } = decodedToken;
    const { invoiceId } = params;

    if (!invoiceId.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ message: 'Invalid Invoice ID format' }, { status: 400 });
    }

    const result = await Invoice.deleteOne({ _id: invoiceId, userId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Invoice not found or access denied' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Invoice deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Delete Invoice Error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
});
