import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    let portfolios = await db.portfolio.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    })
    
    if (portfolios.length === 0) {
      await db.portfolio.createMany({
        data: [
          {
            title: 'E-Commerce Landing Page',
            description: 'Landing page modern untuk toko online fashion',
            technologies: 'HTML, CSS, JavaScript',
            order: 1
          },
          {
            title: 'Restaurant Website',
            description: 'Website company profile untuk restoran',
            technologies: 'HTML, CSS, Bootstrap',
            order: 2
          },
          {
            title: 'Personal Portfolio',
            description: 'Website portfolio untuk fotografer',
            technologies: 'HTML, CSS, JavaScript',
            order: 3
          }
        ]
      })
      portfolios = await db.portfolio.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' }
      })
    }
    
    return NextResponse.json(portfolios)
  } catch (error) {
    console.error('Error fetching portfolios:', error)
    return NextResponse.json({ error: 'Failed to fetch portfolios' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const portfolio = await db.portfolio.create({
      data: body
    })
    return NextResponse.json(portfolio)
  } catch (error) {
    console.error('Error creating portfolio:', error)
    return NextResponse.json({ error: 'Failed to create portfolio' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...data } = body
    const portfolio = await db.portfolio.update({
      where: { id },
      data
    })
    return NextResponse.json(portfolio)
  } catch (error) {
    console.error('Error updating portfolio:', error)
    return NextResponse.json({ error: 'Failed to update portfolio' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }
    await db.portfolio.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting portfolio:', error)
    return NextResponse.json({ error: 'Failed to delete portfolio' }, { status: 500 })
  }
}
