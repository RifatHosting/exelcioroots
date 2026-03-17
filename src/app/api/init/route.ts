import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'

export async function GET() {
  try {
    // Check if admin exists
    const adminCount = await db.adminUser.count()
    
    if (adminCount === 0) {
      // Create default admin
      const defaultPassword = randomBytes(8).toString('hex')
      await db.adminUser.create({
        data: {
          email: 'admin@rrhstudio.com',
          password: defaultPassword,
          name: 'Admin'
        }
      })
      
      return NextResponse.json({
        initialized: true,
        message: 'Database initialized successfully',
        defaultPassword
      })
    }
    
    return NextResponse.json({
      initialized: true,
      message: 'Database already initialized'
    })
  } catch (error) {
    console.error('Error initializing database:', error)
    return NextResponse.json({ error: 'Failed to initialize database' }, { status: 500 })
  }
}
