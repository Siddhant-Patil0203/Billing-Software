import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { withAuth } from '@/app/lib/auth';
import Project from '@/app/models/Project';
import User from '@/app/models/User'; // For validating userId

// POST: Create a new project
export const POST = withAuth(async (request, params, decodedToken) => {
  try {
    await clientPromise;
    const { userId } = decodedToken;
    const body = await request.json();

    const {
      name,
      clientName, // Optional
      clientEmail, // Optional
      letterhead, // Optional
      footer, // Optional
    } = body;

    // Basic Validation
    if (!name) {
      return NextResponse.json({ message: 'Project name is required' }, { status: 400 });
    }

    // Validate user exists (though withAuth should handle this, an extra check is fine)
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const newProject = new Project({
      userId,
      name,
      clientName,
      clientEmail,
      letterhead,
      footer,
    });

    await newProject.save();
    return NextResponse.json(newProject, { status: 201 });

  } catch (error) {
    console.error('Create Project Error:', error);
    if (error.name === 'ValidationError') {
      return NextResponse.json({ message: 'Validation Error', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
});

// GET: List all projects for the authenticated user
export const GET = withAuth(async (request, params, decodedToken) => {
  try {
    await clientPromise;
    const { userId } = decodedToken;

    const projects = await Project.find({ userId }).sort({ createdAt: -1 }); // Sort by most recent
    return NextResponse.json(projects, { status: 200 });

  } catch (error) {
    console.error('List Projects Error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
});
