import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { withAuth } from '@/app/lib/auth';
import Project from '@/app/models/Project';

// GET: Fetch a single project by ID
export const GET = withAuth(async (request, { params }, decodedToken) => {
  try {
    await clientPromise;
    const { userId } = decodedToken;
    const { projectId } = params;

    if (!projectId.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ message: 'Invalid Project ID format' }, { status: 400 });
    }

    const project = await Project.findOne({ _id: projectId, userId });

    if (!project) {
      return NextResponse.json({ message: 'Project not found or access denied' }, { status: 404 });
    }

    return NextResponse.json(project, { status: 200 });

  } catch (error) {
    console.error('Get Project Error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
});

// PUT: Update an existing project by ID
export const PUT = withAuth(async (request, { params }, decodedToken) => {
  try {
    await clientPromise;
    const { userId } = decodedToken;
    const { projectId } = params;
    const body = await request.json();

    if (!projectId.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ message: 'Invalid Project ID format' }, { status: 400 });
    }

    const {
      name,
      clientName,
      clientEmail,
      letterhead,
      footer,
    } = body;

    // Basic Validation
    if (!name) {
      return NextResponse.json({ message: 'Project name cannot be empty' }, { status: 400 });
    }
    
    const updatedData = {
      name,
      clientName: clientName !== undefined ? clientName : '', // Allow clearing optional fields
      clientEmail: clientEmail !== undefined ? clientEmail : '',
      letterhead: letterhead !== undefined ? letterhead : '',
      footer: footer !== undefined ? footer : '',
    };


    const updatedProject = await Project.findOneAndUpdate(
      { _id: projectId, userId },
      { $set: updatedData },
      { new: true, runValidators: true } // new: true returns the updated document
    );

    if (!updatedProject) {
      return NextResponse.json({ message: 'Project not found or access denied' }, { status: 404 });
    }

    return NextResponse.json(updatedProject, { status: 200 });

  } catch (error) {
    console.error('Update Project Error:', error);
    if (error.name === 'ValidationError') {
      return NextResponse.json({ message: 'Validation Error', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
});

// DELETE: Delete a project by ID
export const DELETE = withAuth(async (request, { params }, decodedToken) => {
  try {
    await clientPromise;
    const { userId } = decodedToken;
    const { projectId } = params;

    if (!projectId.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ message: 'Invalid Project ID format' }, { status: 400 });
    }

    const result = await Project.deleteOne({ _id: projectId, userId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Project not found or access denied' }, { status: 404 });
    }

    // Optionally: also delete associated invoices or handle that logic elsewhere
    // For now, just deleting the project itself.

    return NextResponse.json({ message: 'Project deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Delete Project Error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
});
