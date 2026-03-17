import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    let config = await db.siteConfig.findFirst()
    
    if (!config) {
      config = await db.siteConfig.create({
        data: {
          siteName: 'RRH Web Studio',
          tagline: 'Professional Frontend Development',
          description: 'Kami membuat website HTML statis yang stunning dan profesional untuk bisnis Anda',
          heroTitle: 'Transform Your Ideas Into Reality',
          heroSubtitle: 'Layanan pembuatan website frontend statis HTML profesional dengan desain modern dan responsif',
          heroCtaText: 'Hubungi Kami',
          whatsappNumber: '6285779127761',
          ownerName: 'Rifat Radli Hidayat',
          ownerAge: 16,
          ownerBio: 'Seorang web developer muda yang passionate dalam menciptakan website yang indah dan fungsional. Dengan semangat belajar dan kreativitas, saya siap membantu mewujudkan website impian Anda.',
          ownerLocation: 'Indonesia',
          footerText: '© 2024 RRH Web Studio. All rights reserved.',
        }
      })
    }
    
    return NextResponse.json(config)
  } catch (error) {
    console.error('Error fetching site config:', error)
    return NextResponse.json({ error: 'Failed to fetch site config' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const existingConfig = await db.siteConfig.findFirst()
    
    if (!existingConfig) {
      return NextResponse.json({ error: 'Config not found' }, { status: 404 })
    }
    
    const config = await db.siteConfig.update({
      where: { id: existingConfig.id },
      data: body
    })
    
    return NextResponse.json(config)
  } catch (error) {
    console.error('Error updating site config:', error)
    return NextResponse.json({ error: 'Failed to update site config' }, { status: 500 })
  }
}
