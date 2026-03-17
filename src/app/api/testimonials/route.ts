import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    let testimonials = await db.testimonial.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    })
    
    if (testimonials.length === 0) {
      await db.testimonial.createMany({
        data: [
          {
            name: 'Ahmad Fauzi',
            role: 'CEO, StartupXYZ',
            content: 'Website yang dibuat sangat profesional dan sesuai dengan yang diharapkan. Recommended!',
            rating: 5,
            order: 1
          },
          {
            name: 'Siti Nurhaliza',
            role: 'Owner, Boutique Store',
            content: 'Pelayanan sangat ramah dan hasil website sangat memuaskan. Terima kasih!',
            rating: 5,
            order: 2
          },
          {
            name: 'Budi Santoso',
            role: 'Freelancer',
            content: 'Fast response dan hasil kerja yang berkualitas. Pasti akan pakai jasa ini lagi.',
            rating: 5,
            order: 3
          }
        ]
      })
      testimonials = await db.testimonial.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' }
      })
    }
    
    return NextResponse.json(testimonials)
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const testimonial = await db.testimonial.create({
      data: body
    })
    return NextResponse.json(testimonial)
  } catch (error) {
    console.error('Error creating testimonial:', error)
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...data } = body
    const testimonial = await db.testimonial.update({
      where: { id },
      data
    })
    return NextResponse.json(testimonial)
  } catch (error) {
    console.error('Error updating testimonial:', error)
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }
    await db.testimonial.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting testimonial:', error)
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 })
  }
}
