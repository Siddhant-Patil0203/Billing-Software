import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.warn(
    'Missing JWT_SECRET environment variable. Authentication will not work.'
  );
}

export async function verifyToken(request) {
  const token = request.headers.get('authorization')?.split(' ')[1]; // Bearer <token>

  if (!token) {
    return null; // No token found
  }

  if (!JWT_SECRET) {
    console.error('JWT_SECRET is not defined. Cannot verify token.');
    return null; 
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded; // Token is valid, return decoded payload
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    return null; // Token is invalid or expired
  }
}

// Middleware example (can be used in specific API routes or pages)
export async function authMiddleware(request, handler) {
  const decodedToken = await verifyToken(request);

  if (!decodedToken) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  // Add user to the request object or pass to handler
  request.user = decodedToken; 
  return handler(request);
}

// Higher-order function to protect API routes
export function withAuth(handler) {
  return async (request, params) => {
    const decodedToken = await verifyToken(request);
    if (!decodedToken) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }
    // Pass user to the handler, params might contain route parameters like [id]
    return handler(request, params, decodedToken); 
  };
}
