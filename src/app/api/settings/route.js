import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { withAuth } from '@/app/lib/auth';
import Setting from '@/app/models/Setting';
import User from '@/app/models/User'; // For validating userId

// GET: Fetch settings for the authenticated user
export const GET = withAuth(async (request, params, decodedToken) => {
  try {
    await clientPromise;
    const { userId } = decodedToken;

    let settings = await Setting.findOne({ userId });

    if (!settings) {
      // If no settings exist, create default settings for the user
      // This ensures that a settings object is always available
      const user = await User.findById(userId);
      if (!user) {
        return NextResponse.json({ message: 'User not found, cannot create default settings' }, { status: 404 });
      }
      
      settings = new Setting({
        userId,
        taxRates: [{ name: 'Default VAT', rate: 0 }], // Example default
        defaultLetterhead: '',
        defaultFooter: '',
      });
      await settings.save();
    }

    return NextResponse.json(settings, { status: 200 });

  } catch (error) {
    console.error('Get Settings Error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
});

// PUT: Update or create (upsert) settings for the authenticated user
export const PUT = withAuth(async (request, params, decodedToken) => {
  try {
    await clientPromise;
    const { userId } = decodedToken;
    const body = await request.json();

    const {
      taxRates, // Array of { name: string, rate: number }
      defaultLetterhead,
      defaultFooter,
    } = body;

    // Basic Validation for taxRates if provided
    if (taxRates && Array.isArray(taxRates)) {
      for (const tax of taxRates) {
        if (typeof tax.rate !== 'number' || tax.rate < 0) {
          return NextResponse.json({ message: 'Tax rates must be non-negative numbers.' }, { status: 400 });
        }
        if (tax.name && typeof tax.name !== 'string') {
          return NextResponse.json({ message: 'Tax rate names must be strings.' }, { status: 400 });
        }
      }
    } else if (taxRates !== undefined) { // if taxRates is provided but not an array
        return NextResponse.json({ message: 'taxRates must be an array.' }, { status: 400 });
    }

    const updateData = {};
    if (taxRates !== undefined) updateData.taxRates = taxRates;
    if (defaultLetterhead !== undefined) updateData.defaultLetterhead = defaultLetterhead;
    if (defaultFooter !== undefined) updateData.defaultFooter = defaultFooter;
    
    // Upsert operation
    const updatedSettings = await Setting.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json(updatedSettings, { status: 200 });

  } catch (error) {
    console.error('Update Settings Error:', error);
    if (error.name === 'ValidationError') {
      return NextResponse.json({ message: 'Validation Error', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
});
