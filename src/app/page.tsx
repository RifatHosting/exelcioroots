'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Code2, Layout, Briefcase, Building, User, Rocket, Star,
  ChevronRight, Menu, X, Phone, Mail, MapPin, ExternalLink,
  Zap, Shield, Clock, Check, MessageCircle, ArrowRight,
  Settings, LogIn, LogOut, Save, Plus, Trash2, Edit, Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { ToastAction } from '@/components/ui/toast'

interface SiteConfig {
  id: string
  siteName: string
  tagline: string
  description: string
  heroTitle: string
  heroSubtitle: string
  heroCtaText: string
  whatsappNumber: string
  ownerName: string
  ownerAge: number
  ownerBio: string
  ownerLocation: string
  footerText: string
}

interface Service {
  id: string
  title: string
  description: string
  icon: string
}

interface Pricing {
  id: string
  name: string
  price: number
  description: string
  features: string
  isPopular: boolean
}

interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  rating: number
}

interface Portfolio {
  id: string
  title: string
  description: string
  technologies: string
  image?: string
}

interface AdminUser {
  email: string
  name: string
}

const iconMap: Record<string, React.ReactNode> = {
  layout: <Layout className="w-6 h-6" />,
  briefcase: <Briefcase className="w-6 h-6" />,
  building: <Building className="w-6 h-6" />,
  user: <User className="w-6 h-6" />,
  code: <Code2 className="w-6 h-6" />,
}

const iconOptions = ['layout', 'briefcase', 'building', 'user', 'code']

export default function Home() {
  const [view, setView] = useState<'home' | 'market'>('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [adminModalOpen, setAdminModalOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loginLoading, setLoginLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [pricing, setPricing] = useState<Pricing[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [portfolio, setPortfolio] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  
  // Edit states
  const [editConfig, setEditConfig] = useState<SiteConfig | null>(null)
  const [editService, setEditService] = useState<Service | null>(null)
  const [editPricing, setEditPricing] = useState<Pricing | null>(null)
  const [editTestimonial, setEditTestimonial] = useState<Testimonial | null>(null)
  const [editPortfolio, setEditPortfolio] = useState<Portfolio | null>(null)
  const [newFeatures, setNewFeatures] = useState('')
  
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
    checkAuth()
  }, [])

  async function fetchData() {
    try {
      const [configRes, servicesRes, pricingRes, testimonialsRes, portfolioRes] = await Promise.all([
        fetch('/api/site-config'),
        fetch('/api/services'),
        fetch('/api/pricing'),
        fetch('/api/testimonials'),
        fetch('/api/portfolio')
      ])

      const configData = await configRes.json()
      const servicesData = await servicesRes.json()
      const pricingData = await pricingRes.json()
      const testimonialsData = await testimonialsRes.json()
      const portfolioData = await portfolioRes.json()

      setSiteConfig(configData)
      setEditConfig(configData)
      setServices(servicesData)
      setPricing(pricingData)
      setTestimonials(testimonialsData)
      setPortfolio(portfolioData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function checkAuth() {
    try {
      const res = await fetch('/api/admin/login')
      const data = await res.json()
      if (data.authenticated) {
        setIsAuthenticated(true)
        setAdmin(data.admin)
      }
    } catch {
      // Not authenticated
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      })
      const data = await res.json()
      if (data.success) {
        setIsAuthenticated(true)
        setAdmin(data.admin)
        setAdminModalOpen(false)
        setLoginForm({ email: '', password: '' })
        toast({
          title: 'Login Berhasil',
          description: `Selamat datang, ${data.admin.name}!`
        })
      } else {
        toast({
          title: 'Login Gagal',
          description: data.error || 'Email atau password salah',
          variant: 'destructive'
        })
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Terjadi kesalahan saat login',
        variant: 'destructive'
      })
    } finally {
      setLoginLoading(false)
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/admin/login', { method: 'DELETE' })
      setIsAuthenticated(false)
      setAdmin(null)
      toast({ title: 'Logout Berhasil' })
    } catch {
      // Silent error
    }
  }

  async function handleSaveConfig() {
    if (!editConfig) return
    setSaving(true)
    try {
      const res = await fetch('/api/site-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editConfig)
      })
      const data = await res.json()
      setSiteConfig(data)
      setEditConfig(data)
      toast({ title: 'Berhasil', description: 'Konfigurasi website berhasil disimpan' })
    } catch {
      toast({ title: 'Error', description: 'Gagal menyimpan konfigurasi', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  async function handleSaveService() {
    if (!editService) return
    setSaving(true)
    try {
      const method = editService.id ? 'PUT' : 'POST'
      const res = await fetch('/api/services', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editService)
      })
      const data = await res.json()
      if (method === 'POST') {
        setServices([...services, data])
      } else {
        setServices(services.map(s => s.id === data.id ? data : s))
      }
      setEditService(null)
      toast({ title: 'Berhasil', description: 'Service berhasil disimpan' })
      fetchData()
    } catch {
      toast({ title: 'Error', description: 'Gagal menyimpan service', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  async function handleSavePricing() {
    if (!editPricing) return
    setSaving(true)
    try {
      const method = editPricing.id ? 'PUT' : 'POST'
      const res = await fetch('/api/pricing', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editPricing)
      })
      const data = await res.json()
      if (method === 'POST') {
        setPricing([...pricing, data])
      } else {
        setPricing(pricing.map(p => p.id === data.id ? data : p))
      }
      setEditPricing(null)
      toast({ title: 'Berhasil', description: 'Pricing berhasil disimpan' })
      fetchData()
    } catch {
      toast({ title: 'Error', description: 'Gagal menyimpan pricing', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  async function handleSaveTestimonial() {
    if (!editTestimonial) return
    setSaving(true)
    try {
      const method = editTestimonial.id ? 'PUT' : 'POST'
      const res = await fetch('/api/testimonials', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editTestimonial)
      })
      const data = await res.json()
      if (method === 'POST') {
        setTestimonials([...testimonials, data])
      } else {
        setTestimonials(testimonials.map(t => t.id === data.id ? data : t))
      }
      setEditTestimonial(null)
      toast({ title: 'Berhasil', description: 'Testimonial berhasil disimpan' })
      fetchData()
    } catch {
      toast({ title: 'Error', description: 'Gagal menyimpan testimonial', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  async function handleSavePortfolio() {
    if (!editPortfolio) return
    setSaving(true)
    try {
      const method = editPortfolio.id ? 'PUT' : 'POST'
      const res = await fetch('/api/portfolio', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editPortfolio)
      })
      const data = await res.json()
      if (method === 'POST') {
        setPortfolio([...portfolio, data])
      } else {
        setPortfolio(portfolio.map(p => p.id === data.id ? data : p))
      }
      setEditPortfolio(null)
      toast({ title: 'Berhasil', description: 'Portfolio berhasil disimpan' })
      fetchData()
    } catch {
      toast({ title: 'Error', description: 'Gagal menyimpan portfolio', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteService(id: string) {
    if (!confirm('Hapus service ini?')) return
    try {
      await fetch(`/api/services?id=${id}`, { method: 'DELETE' })
      setServices(services.filter(s => s.id !== id))
      toast({ title: 'Berhasil', description: 'Service berhasil dihapus' })
    } catch {
      toast({ title: 'Error', description: 'Gagal menghapus service', variant: 'destructive' })
    }
  }

  async function handleDeletePricing(id: string) {
    if (!confirm('Hapus pricing ini?')) return
    try {
      await fetch(`/api/pricing?id=${id}`, { method: 'DELETE' })
      setPricing(pricing.filter(p => p.id !== id))
      toast({ title: 'Berhasil', description: 'Pricing berhasil dihapus' })
    } catch {
      toast({ title: 'Error', description: 'Gagal menghapus pricing', variant: 'destructive' })
    }
  }

  async function handleDeleteTestimonial(id: string) {
    if (!confirm('Hapus testimonial ini?')) return
    try {
      await fetch(`/api/testimonials?id=${id}`, { method: 'DELETE' })
      setTestimonials(testimonials.filter(t => t.id !== id))
      toast({ title: 'Berhasil', description: 'Testimonial berhasil dihapus' })
    } catch {
      toast({ title: 'Error', description: 'Gagal menghapus testimonial', variant: 'destructive' })
    }
  }

  async function handleDeletePortfolio(id: string) {
    if (!confirm('Hapus portfolio ini?')) return
    try {
      await fetch(`/api/portfolio?id=${id}`, { method: 'DELETE' })
      setPortfolio(portfolio.filter(p => p.id !== id))
      toast({ title: 'Berhasil', description: 'Portfolio berhasil dihapus' })
    } catch {
      toast({ title: 'Error', description: 'Gagal menghapus portfolio', variant: 'destructive' })
    }
  }

  const handleWhatsApp = () => {
    if (siteConfig?.whatsappNumber) {
      window.open(`https://wa.me/${siteConfig.whatsappNumber}`, '_blank')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Code2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">{siteConfig?.siteName || 'RRH Web Studio'}</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <Button
                variant={view === 'home' ? 'default' : 'ghost'}
                onClick={() => setView('home')}
                className="gap-2"
              >
                Home
              </Button>
              <Button
                variant={view === 'market' ? 'default' : 'ghost'}
                onClick={() => setView('market')}
                className="gap-2"
              >
                <Zap className="w-4 h-4" />
                Market
              </Button>
              <Button
                onClick={handleWhatsApp}
                className="bg-green-600 hover:bg-green-700 text-white gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Hubungi Kami
              </Button>
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAdminModalOpen(true)}
                    className="gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Admin Dashboard
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAdminModalOpen(true)}
                  className="gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Admin
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border bg-background"
            >
              <div className="px-4 py-4 space-y-2">
                <Button
                  variant={view === 'home' ? 'default' : 'ghost'}
                  onClick={() => { setView('home'); setMobileMenuOpen(false) }}
                  className="w-full justify-start"
                >
                  Home
                </Button>
                <Button
                  variant={view === 'market' ? 'default' : 'ghost'}
                  onClick={() => { setView('market'); setMobileMenuOpen(false) }}
                  className="w-full justify-start gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Market
                </Button>
                <Button
                  onClick={handleWhatsApp}
                  className="w-full bg-green-600 hover:bg-green-700 text-white gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Hubungi Kami
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => { setAdminModalOpen(true); setMobileMenuOpen(false) }}
                  className="w-full justify-start gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Admin
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Admin Modal */}
      <Dialog open={adminModalOpen} onOpenChange={setAdminModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          {!isAuthenticated ? (
            <>
              <DialogHeader>
                <DialogTitle>Admin Login</DialogTitle>
                <DialogDescription>
                  Masuk untuk mengelola website Anda
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    placeholder="admin@rrhstudio.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="Enter password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loginLoading}>
                  {loginLoading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
              <p className="text-sm text-muted-foreground text-center">
                Default: admin@rrhstudio.com / (password generated on first run)
              </p>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>Admin Dashboard</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    Welcome, {admin?.name}
                  </span>
                </DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="config" className="w-full">
                <TabsList className="grid grid-cols-5 w-full">
                  <TabsTrigger value="config">Config</TabsTrigger>
                  <TabsTrigger value="services">Services</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                  <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
                  <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                </TabsList>
                
                {/* Site Config Tab */}
                <TabsContent value="config" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Website Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Site Name</Label>
                          <Input
                            value={editConfig?.siteName || ''}
                            onChange={(e) => setEditConfig({ ...editConfig!, siteName: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Tagline</Label>
                          <Input
                            value={editConfig?.tagline || ''}
                            onChange={(e) => setEditConfig({ ...editConfig!, tagline: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={editConfig?.description || ''}
                          onChange={(e) => setEditConfig({ ...editConfig!, description: e.target.value })}
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label>Hero Title</Label>
                        <Input
                          value={editConfig?.heroTitle || ''}
                          onChange={(e) => setEditConfig({ ...editConfig!, heroTitle: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Hero Subtitle</Label>
                        <Textarea
                          value={editConfig?.heroSubtitle || ''}
                          onChange={(e) => setEditConfig({ ...editConfig!, heroSubtitle: e.target.value })}
                          rows={2}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Hero CTA Text</Label>
                          <Input
                            value={editConfig?.heroCtaText || ''}
                            onChange={(e) => setEditConfig({ ...editConfig!, heroCtaText: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>WhatsApp Number</Label>
                          <Input
                            value={editConfig?.whatsappNumber || ''}
                            onChange={(e) => setEditConfig({ ...editConfig!, whatsappNumber: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-4">Owner Information</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Owner Name</Label>
                            <Input
                              value={editConfig?.ownerName || ''}
                              onChange={(e) => setEditConfig({ ...editConfig!, ownerName: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Owner Age</Label>
                            <Input
                              type="number"
                              value={editConfig?.ownerAge || 0}
                              onChange={(e) => setEditConfig({ ...editConfig!, ownerAge: parseInt(e.target.value) })}
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <Label>Owner Bio</Label>
                          <Textarea
                            value={editConfig?.ownerBio || ''}
                            onChange={(e) => setEditConfig({ ...editConfig!, ownerBio: e.target.value })}
                            rows={3}
                          />
                        </div>
                        <div className="mt-4">
                          <Label>Owner Location</Label>
                          <Input
                            value={editConfig?.ownerLocation || ''}
                            onChange={(e) => setEditConfig({ ...editConfig!, ownerLocation: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="border-t pt-4">
                        <Label>Footer Text</Label>
                        <Input
                          value={editConfig?.footerText || ''}
                          onChange={(e) => setEditConfig({ ...editConfig!, footerText: e.target.value })}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={handleSaveConfig} disabled={saving} className="gap-2">
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Configuration'}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                {/* Services Tab */}
                <TabsContent value="services" className="space-y-4 mt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Services</h3>
                    <Button
                      onClick={() => setEditService({ id: '', title: '', description: '', icon: 'code' })}
                      size="sm"
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Service
                    </Button>
                  </div>
                  <div className="grid gap-4">
                    {services.map((service) => (
                      <Card key={service.id}>
                        <CardContent className="flex items-center justify-between py-4">
                          <div className="flex items-center gap-4">
                            <div className="text-primary">{iconMap[service.icon]}</div>
                            <div>
                              <div className="font-semibold">{service.title}</div>
                              <div className="text-sm text-muted-foreground">{service.description}</div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setEditService(service)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteService(service.id)}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                {/* Pricing Tab */}
                <TabsContent value="pricing" className="space-y-4 mt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Pricing Plans</h3>
                    <Button
                      onClick={() => setEditPricing({ id: '', name: '', price: 0, description: '', features: '[]', isPopular: false })}
                      size="sm"
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Plan
                    </Button>
                  </div>
                  <div className="grid gap-4">
                    {pricing.map((plan) => (
                      <Card key={plan.id} className={plan.isPopular ? 'border-primary' : ''}>
                        <CardContent className="flex items-center justify-between py-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{plan.name}</span>
                              {plan.isPopular && <Badge>Popular</Badge>}
                            </div>
                            <div className="text-xl font-bold text-primary">{formatPrice(plan.price)}</div>
                            <div className="text-sm text-muted-foreground">{plan.description}</div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setEditPricing(plan)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeletePricing(plan.id)}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                {/* Testimonials Tab */}
                <TabsContent value="testimonials" className="space-y-4 mt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Testimonials</h3>
                    <Button
                      onClick={() => setEditTestimonial({ id: '', name: '', role: '', content: '', rating: 5 })}
                      size="sm"
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Testimonial
                    </Button>
                  </div>
                  <div className="grid gap-4">
                    {testimonials.map((testimonial) => (
                      <Card key={testimonial.id}>
                        <CardContent className="flex items-center justify-between py-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{testimonial.name}</span>
                              <div className="flex">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                  <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                                ))}
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                            <div className="text-sm mt-1 italic">&quot;{testimonial.content}&quot;</div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setEditTestimonial(testimonial)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteTestimonial(testimonial.id)}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                {/* Portfolio Tab */}
                <TabsContent value="portfolio" className="space-y-4 mt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Portfolio</h3>
                    <Button
                      onClick={() => setEditPortfolio({ id: '', title: '', description: '', technologies: '' })}
                      size="sm"
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Portfolio
                    </Button>
                  </div>
                  <div className="grid gap-4">
                    {portfolio.map((item) => (
                      <Card key={item.id}>
                        <CardContent className="flex items-center justify-between py-4">
                          <div>
                            <div className="font-semibold">{item.title}</div>
                            <div className="text-sm text-muted-foreground">{item.description}</div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {item.technologies.split(',').map((tech, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">{tech.trim()}</Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setEditPortfolio(item)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeletePortfolio(item.id)}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Service Dialog */}
      <Dialog open={!!editService} onOpenChange={() => setEditService(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editService?.id ? 'Edit' : 'Add'} Service</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={editService?.title || ''}
                onChange={(e) => setEditService({ ...editService!, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={editService?.description || ''}
                onChange={(e) => setEditService({ ...editService!, description: e.target.value })}
              />
            </div>
            <div>
              <Label>Icon</Label>
              <div className="flex gap-2 flex-wrap">
                {iconOptions.map((icon) => (
                  <Button
                    key={icon}
                    type="button"
                    variant={editService?.icon === icon ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setEditService({ ...editService!, icon })}
                  >
                    {iconMap[icon]}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditService(null)}>Cancel</Button>
            <Button onClick={handleSaveService} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Pricing Dialog */}
      <Dialog open={!!editPricing} onOpenChange={() => setEditPricing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editPricing?.id ? 'Edit' : 'Add'} Pricing Plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Plan Name</Label>
                <Input
                  value={editPricing?.name || ''}
                  onChange={(e) => setEditPricing({ ...editPricing!, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Price (IDR)</Label>
                <Input
                  type="number"
                  value={editPricing?.price || 0}
                  onChange={(e) => setEditPricing({ ...editPricing!, price: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={editPricing?.description || ''}
                onChange={(e) => setEditPricing({ ...editPricing!, description: e.target.value })}
              />
            </div>
            <div>
              <Label>Features (one per line)</Label>
              <Textarea
                value={editPricing ? JSON.parse(editPricing.features).join('\n') : ''}
                onChange={(e) => setEditPricing({ ...editPricing!, features: JSON.stringify(e.target.value.split('\n').filter(f => f.trim())) })}
                rows={4}
                placeholder="1 Halaman&#10;Desain Responsif&#10;Free Revisi 1x"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={editPricing?.isPopular || false}
                onCheckedChange={(checked) => setEditPricing({ ...editPricing!, isPopular: checked })}
              />
              <Label>Mark as Popular</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditPricing(null)}>Cancel</Button>
            <Button onClick={handleSavePricing} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Testimonial Dialog */}
      <Dialog open={!!editTestimonial} onOpenChange={() => setEditTestimonial(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editTestimonial?.id ? 'Edit' : 'Add'} Testimonial</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={editTestimonial?.name || ''}
                  onChange={(e) => setEditTestimonial({ ...editTestimonial!, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Role</Label>
                <Input
                  value={editTestimonial?.role || ''}
                  onChange={(e) => setEditTestimonial({ ...editTestimonial!, role: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Content</Label>
              <Textarea
                value={editTestimonial?.content || ''}
                onChange={(e) => setEditTestimonial({ ...editTestimonial!, content: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label>Rating</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditTestimonial({ ...editTestimonial!, rating })}
                  >
                    <Star className={`w-5 h-5 ${rating <= (editTestimonial?.rating || 0) ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTestimonial(null)}>Cancel</Button>
            <Button onClick={handleSaveTestimonial} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Portfolio Dialog */}
      <Dialog open={!!editPortfolio} onOpenChange={() => setEditPortfolio(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editPortfolio?.id ? 'Edit' : 'Add'} Portfolio</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={editPortfolio?.title || ''}
                onChange={(e) => setEditPortfolio({ ...editPortfolio!, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={editPortfolio?.description || ''}
                onChange={(e) => setEditPortfolio({ ...editPortfolio!, description: e.target.value })}
                rows={2}
              />
            </div>
            <div>
              <Label>Technologies (comma separated)</Label>
              <Input
                value={editPortfolio?.technologies || ''}
                onChange={(e) => setEditPortfolio({ ...editPortfolio!, technologies: e.target.value })}
                placeholder="HTML, CSS, JavaScript"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditPortfolio(null)}>Cancel</Button>
            <Button onClick={handleSavePortfolio} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AnimatePresence mode="wait">
        {view === 'home' ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
              {/* Background Effects */}
              <div className="absolute inset-0 animated-gradient" />
              <div className="absolute inset-0 grid-pattern" />
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px]" />

              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Badge className="mb-6 bg-primary/20 text-primary border-primary/30">
                      <Rocket className="w-3 h-3 mr-1" />
                      {siteConfig?.tagline || 'Professional Frontend Development'}
                    </Badge>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
                  >
                    {siteConfig?.heroTitle || 'Transform Your Ideas'}{' '}
                    <span className="gradient-text">Into Reality</span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
                  >
                    {siteConfig?.heroSubtitle || 'Layanan pembuatan website frontend statis HTML profesional dengan desain modern dan responsif'}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                  >
                    <Button
                      size="lg"
                      onClick={handleWhatsApp}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-12 px-8 text-lg"
                    >
                      {siteConfig?.heroCtaText || 'Hubungi Kami'}
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => setView('market')}
                      className="gap-2 h-12 px-8 text-lg border-border hover:bg-secondary"
                    >
                      <Zap className="w-5 h-5" />
                      Lihat Harga
                    </Button>
                  </motion.div>

                  {/* Stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
                  >
                    {[
                      { label: 'Projects Completed', value: '50+' },
                      { label: 'Happy Clients', value: '40+' },
                      { label: 'Years Experience', value: '2+' },
                      { label: 'Satisfaction Rate', value: '100%' },
                    ].map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className="text-3xl sm:text-4xl font-bold gradient-text">{stat.value}</div>
                        <div className="text-muted-foreground text-sm mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>

              {/* Scroll indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
              >
                <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center">
                  <div className="w-1 h-3 bg-muted-foreground rounded-full mt-2 animate-bounce" />
                </div>
              </motion.div>
            </section>

            {/* Services Section */}
            <section className="py-20 relative">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <Badge className="mb-4">Layanan Kami</Badge>
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                    Website yang <span className="gradient-text">Anda Butuhkan</span>
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Kami menyediakan berbagai layanan pembuatan website untuk memenuhi kebutuhan Anda
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {services.map((service, index) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Card className="card-hover h-full bg-card/50 border-border backdrop-blur-sm">
                        <CardHeader>
                          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 text-primary">
                            {iconMap[service.icon] || <Code2 className="w-6 h-6" />}
                          </div>
                          <CardTitle className="text-lg">{service.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-muted-foreground">
                            {service.description}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Portfolio Section */}
            <section className="py-20 relative bg-card/30">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <Badge className="mb-4">Portfolio</Badge>
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                    Karya <span className="gradient-text">Terbaik Kami</span>
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Beberapa project yang telah kami kerjakan
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {portfolio.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Card className="card-hover bg-card border-border overflow-hidden group">
                        <div className="aspect-video bg-gradient-to-br from-primary/20 to-orange-500/20 flex items-center justify-center">
                          <Code2 className="w-12 h-12 text-primary/50" />
                        </div>
                        <CardHeader>
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                          <CardDescription>{item.description}</CardDescription>
                        </CardHeader>
                        <CardFooter>
                          <div className="flex flex-wrap gap-2">
                            {item.technologies.split(',').map((tech, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {tech.trim()}
                              </Badge>
                            ))}
                          </div>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 relative">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <Badge className="mb-4">Testimoni</Badge>
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                    Apa Kata <span className="gradient-text">Klien Kami</span>
                  </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {testimonials.map((testimonial, index) => (
                    <motion.div
                      key={testimonial.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Card className="card-hover bg-card/50 border-border backdrop-blur-sm">
                        <CardHeader>
                          <div className="flex gap-1 mb-2">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                            ))}
                          </div>
                          <CardDescription className="text-foreground italic">
                            &quot;{testimonial.content}&quot;
                          </CardDescription>
                        </CardHeader>
                        <CardFooter>
                          <div>
                            <div className="font-semibold">{testimonial.name}</div>
                            <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                          </div>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* About Section */}
            <section className="py-20 relative bg-card/30">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <Badge className="mb-4">Tentang Kami</Badge>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                      Hi, Saya{' '}
                      <span className="gradient-text">{siteConfig?.ownerName || 'Rifat Radli Hidayat'}</span>
                    </h2>
                    <div className="space-y-4 text-muted-foreground">
                      <p>{siteConfig?.ownerBio}</p>
                      <div className="flex flex-wrap gap-4 pt-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-primary" />
                          <span>{siteConfig?.ownerAge || 16} Tahun</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span>{siteConfig?.ownerLocation || 'Indonesia'}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-2 gap-4"
                  >
                    {[
                      { icon: <Zap className="w-6 h-6" />, title: 'Fast Delivery', desc: 'On-time project completion' },
                      { icon: <Shield className="w-6 h-6" />, title: 'Quality Code', desc: 'Clean & maintainable' },
                      { icon: <Clock className="w-6 h-6" />, title: '24/7 Support', desc: 'Always available' },
                      { icon: <Check className="w-6 h-6" />, title: 'Satisfaction', desc: '100% client happy' },
                    ].map((item, index) => (
                      <Card key={index} className="bg-card/50 border-border">
                        <CardContent className="pt-6">
                          <div className="text-primary mb-2">{item.icon}</div>
                          <div className="font-semibold">{item.title}</div>
                          <div className="text-sm text-muted-foreground">{item.desc}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </motion.div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 relative">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                    Siap Memulai <span className="gradient-text">Project Anda?</span>
                  </h2>
                  <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                    Hubungi kami sekarang untuk konsultasi gratis dan dapatkan penawaran terbaik untuk website impian Anda
                  </p>
                  <Button
                    size="lg"
                    onClick={handleWhatsApp}
                    className="bg-green-600 hover:bg-green-700 text-white gap-2 h-12 px-8 text-lg"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Chat via WhatsApp
                  </Button>
                </motion.div>
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.div
            key="market"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-24 pb-20 min-h-screen"
          >
            {/* Pricing Section */}
            <section className="py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <Badge className="mb-4">Pricelist</Badge>
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                    Pilih Paket <span className="gradient-text">Terbaik</span>
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Harga transparan tanpa biaya tersembunyi. Pilih paket yang sesuai dengan kebutuhan Anda.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  {pricing.map((plan, index) => (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className={`relative h-full bg-card border-border ${plan.isPopular ? 'border-primary glow' : ''}`}>
                        {plan.isPopular && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <Badge className="bg-primary text-primary-foreground">
                              Paling Populer
                            </Badge>
                          </div>
                        )}
                        <CardHeader className="text-center pt-8">
                          <CardTitle className="text-2xl">{plan.name}</CardTitle>
                          <CardDescription>{plan.description}</CardDescription>
                          <div className="mt-4">
                            <span className="text-4xl font-bold gradient-text">
                              {formatPrice(plan.price)}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-3">
                            {JSON.parse(plan.features).map((feature: string, i: number) => (
                              <li key={i} className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                                  <Check className="w-3 h-3 text-primary" />
                                </div>
                                <span className="text-muted-foreground">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                        <CardFooter>
                          <Button
                            className="w-full gap-2"
                            variant={plan.isPopular ? 'default' : 'outline'}
                            onClick={handleWhatsApp}
                          >
                            Pilih Paket
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Custom Package */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-12"
                >
                  <Card className="bg-gradient-to-r from-primary/20 to-orange-500/20 border-primary/30">
                    <CardContent className="py-8 text-center">
                      <h3 className="text-2xl font-bold mb-2">Butuh Paket Custom?</h3>
                      <p className="text-muted-foreground mb-4">
                        Hubungi kami untuk mendiskusikan kebutuhan spesifik Anda
                      </p>
                      <Button onClick={handleWhatsApp} className="gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Konsultasi Gratis
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* FAQ */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mt-16"
                >
                  <h3 className="text-2xl font-bold text-center mb-8">Pertanyaan Umum</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      {
                        q: 'Berapa lama waktu pengerjaan?',
                        a: 'Waktu pengerjaan tergantung kompleksitas project. Untuk website sederhana biasanya 3-5 hari kerja.'
                      },
                      {
                        q: 'Apakah bisa revisi?',
                        a: 'Ya, setiap paket sudah termasuk revisi. Jumlah revisi disesuaikan dengan paket yang dipilih.'
                      },
                      {
                        q: 'Bagaimana cara pembayaran?',
                        a: 'Pembayaran bisa melalui transfer bank atau e-wallet. DP 50% di awal, sisanya setelah project selesai.'
                      },
                      {
                        q: 'Apakah website sudah responsif?',
                        a: 'Ya, semua website yang kami buat sudah responsif dan tampil sempurna di semua device.'
                      },
                    ].map((faq, index) => (
                      <Card key={index} className="bg-card/50 border-border">
                        <CardHeader>
                          <CardTitle className="text-lg">{faq.q}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription>{faq.a}</CardDescription>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">{siteConfig?.siteName || 'RRH Web Studio'}</span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-sm">
                {siteConfig?.description || 'Kami membuat website HTML statis yang stunning dan profesional untuk bisnis Anda'}
              </p>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon" onClick={handleWhatsApp}>
                  <MessageCircle className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <button onClick={() => setView('home')} className="hover:text-foreground transition-colors">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => setView('market')} className="hover:text-foreground transition-colors">
                    Market
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+{siteConfig?.whatsappNumber || '6285779127761'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{siteConfig?.ownerLocation || 'Indonesia'}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>{siteConfig?.footerText || '© 2024 RRH Web Studio. All rights reserved.'}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
