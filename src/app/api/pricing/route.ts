import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    let pricing = await db.pricing.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    })
    
    if (pricing.length === 0) {
      pricing = [
        {
          id: '1',
          name: 'Basic',
          price: 100000,
          description: 'Cocok untuk personal website sederhana',
          features: JSON.stringify(['1 Halaman', 'Desain Responsif', 'Free Revisi 1x', 'Delivery 3-5 Hari']),
          isPopular: false,
          order: 1,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          name: 'Standard',
          price: 250000,
          description: 'Ideal untuk landing page bisnis',
          features: JSON.stringify(['3 Halaman', 'Desain Responsif', 'Free Revisi 3x', 'SEO Basic', 'Delivery 5-7 Hari']),
          isPopular: true,
          order: 2,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '3',
          name: 'Premium',
          price: 500000,
          description: 'Solusi lengkap untuk bisnis Anda',
          features: JSON.stringify(['5 Halaman', 'Desain Responsif', 'Free Revisi 5x', 'SEO Optimized', 'Free Domain .com 1 Tahun', 'Delivery 7-14 Hari']),
          isPopular: false,
          order: 3,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
      
      await db.pricing.createMany({
        data: pricing.map(p => ({
          name: p.name,
          price: p.price,
          description: p.description,
          features: p.features,
          isPopular: p.isPopular,
          order: p.order,
          isActive: p.isActive
        }))
      })
      
      pricing = await db.pricing.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' }
      })
    }
    
    return NextResponse.json(pricing)
  } catch (error) {
    console.error('Error fetching pricing:', error)
    return NextResponse.json({ error: 'Failed to fetch pricing' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (typeof body.features === 'object') {
      body.features = JSON.stringify(body.features)
    }
    const pricing = await db.pricing.create({
      data: body
    })
    return NextResponse.json(pricing)
  } catch (error) {
    console.error('Error creating pricing:', error)
    return NextResponse.json({ error: 'Failed to create pricing' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...data } = body
    if (typeof data.features === 'object') {
      data.features = JSON.stringify(data.features)
    }
    const pricing = await db.pricing.update({
      where: { id },
      data
    })
    return NextResponse.json(pricing)
  } catch (error) {
    console.error('Error updating pricing:', error)
    return NextResponse.json({ error: 'Failed to update pricing' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }
    await db.pricing.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting pricing:', error)
    return NextResponse.json({ error: 'Failed to delete pricing' }, { status: 500 })
  }
}
