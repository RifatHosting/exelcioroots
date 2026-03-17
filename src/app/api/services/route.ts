import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    let services = await db.service.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    })
    
    if (services.length === 0) {
      services = await db.service.createMany({
        data: [
          {
            title: 'Website Landing Page',
            description: 'Landing page profesional untuk bisnis Anda dengan desain modern dan responsif',
            icon: 'layout',
            order: 1
          },
          {
            title: 'Portfolio Website',
            description: 'Showcase karya dan proyek Anda dengan website portfolio yang menarik',
            icon: 'briefcase',
            order: 2
          },
          {
            title: 'Company Profile',
            description: 'Website company profile untuk membangun kredibilitas bisnis Anda',
            icon: 'building',
            order: 3
          },
          {
            title: 'Personal Website',
            description: 'Website personal untuk memperkenalkan diri dan karya Anda',
            icon: 'user',
            order: 4
          }
        ]
      })
      services = await db.service.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' }
      })
    }
    
    return NextResponse.json(services)
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const service = await db.service.create({
      data: body
    })
    return NextResponse.json(service)
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...data } = body
    const service = await db.service.update({
      where: { id },
      data
    })
    return NextResponse.json(service)
  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }
    await db.service.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 })
  }
}
