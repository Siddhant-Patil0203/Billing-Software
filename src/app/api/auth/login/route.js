import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@/app/models/User';
import clientPromise from '@/app/lib/mongodb';

if (!process.env.JWT_SECRET) {
  throw new Error('Invalid/Missing environment variable: "JWT_SECRET"');
}

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
  try {
    await clientPromise; // Ensure MongoDB connection
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, companyName: user.companyName },
      JWT_SECRET,
      { expiresIn: '7d' } // Token expires in 7 days
    );

    // Return token and user details (excluding password)
    const { password: _, ...userWithoutPassword } = user.toObject();

    return NextResponse.json({ token, user: userWithoutPassword }, { status: 200 });
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
