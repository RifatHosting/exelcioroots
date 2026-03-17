import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { randomBytes } from 'crypto'

// Simple in-memory session store (for demo - use proper session management in production)
const sessions = new Map<string, { email: string; name: string; expiresAt: number }>()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body
    
    const admin = await db.adminUser.findUnique({
      where: { email }
    })
    
    if (!admin || admin.password !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    
    // Create session
    const sessionId = randomBytes(32).toString('hex')
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    
    sessions.set(sessionId, {
      email: admin.email,
      name: admin.name,
      expiresAt
    })
    
    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('admin_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    })
    
    return NextResponse.json({
      success: true,
      admin: {
        email: admin.email,
        name: admin.name
      }
    })
  } catch (error) {
    console.error('Error logging in:', error)
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('admin_session')?.value
    
    if (!sessionId) {
      return NextResponse.json({ authenticated: false })
    }
    
    const session = sessions.get(sessionId)
    
    if (!session || session.expiresAt < Date.now()) {
      sessions.delete(sessionId)
      return NextResponse.json({ authenticated: false })
    }
    
    return NextResponse.json({
      authenticated: true,
      admin: {
        email: session.email,
        name: session.name
      }
    })
  } catch (error) {
    console.error('Error checking session:', error)
    return NextResponse.json({ authenticated: false })
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('admin_session')?.value
    
    if (sessionId) {
      sessions.delete(sessionId)
    }
    
    cookieStore.delete('admin_session')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error logging out:', error)
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 })
  }
}

// Export sessions for use in other routes
export { sessions }
