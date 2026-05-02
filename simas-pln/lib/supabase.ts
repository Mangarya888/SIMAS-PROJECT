import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ─── TIPE DATA ──────────────────────────────────────────────
export type Category = {
  id: string
  name: string
  description: string | null
  created_at: string
}

export type Location = {
  id: string
  name: string
  address: string | null
  created_at: string
}

export type Asset = {
  id: string
  name: string
  serial_number: string
  category_id: string | null
  location_id: string | null
  status: 'Tersedia' | 'Digunakan' | 'Rusak'
  notes: string | null
  created_at: string
  updated_at: string
  // join
  category_name?: string
  location_name?: string
}

export type AssetLog = {
  id: string
  asset_id: string
  asset_name: string
  serial_number: string
  action: 'INSERT' | 'UPDATE' | 'DELETE'
  old_data: Record<string, unknown> | null
  new_data: Record<string, unknown> | null
  changed_by: string
  changed_at: string
}

// ─── FUNGSI API ──────────────────────────────────────────────

// Kategori
export const getCategories = () =>
  supabase.from('categories').select('*').order('name')

export const createCategory = (data: { name: string; description: string }) =>
  supabase.from('categories').insert(data).select().single()

export const updateCategory = (id: string, data: { name: string; description: string }) =>
  supabase.from('categories').update(data).eq('id', id).select().single()

export const deleteCategory = (id: string) =>
  supabase.from('categories').delete().eq('id', id)

// Lokasi
export const getLocations = () =>
  supabase.from('locations').select('*').order('name')

export const createLocation = (data: { name: string; address: string }) =>
  supabase.from('locations').insert(data).select().single()

export const updateLocation = (id: string, data: { name: string; address: string }) =>
  supabase.from('locations').update(data).eq('id', id).select().single()

export const deleteLocation = (id: string) =>
  supabase.from('locations').delete().eq('id', id)

// Aset
export const getAssets = () =>
  supabase
    .from('assets')
    .select(`
      *,
      category:categories(name),
      location:locations(name)
    `)
    .order('created_at', { ascending: false })

export const createAsset = (data: {
  name: string
  serial_number: string
  category_id: string
  location_id: string
  status: string
  notes: string
}) => supabase.from('assets').insert(data).select().single()

export const updateAsset = (id: string, data: Partial<Asset>) =>
  supabase.from('assets').update(data).eq('id', id).select().single()

export const deleteAsset = (id: string) =>
  supabase.from('assets').delete().eq('id', id)

// Riwayat
export const getAssetLogs = () =>
  supabase
    .from('asset_logs')
    .select('*')
    .order('changed_at', { ascending: false })
    .limit(100)

// Dashboard stats
export const getDashboardStats = async () => {
  const { data: assets } = await supabase.from('assets').select('status')
  const total = assets?.length || 0
  const tersedia = assets?.filter(a => a.status === 'Tersedia').length || 0
  const digunakan = assets?.filter(a => a.status === 'Digunakan').length || 0
  const rusak = assets?.filter(a => a.status === 'Rusak').length || 0
  return { total, tersedia, digunakan, rusak }
}
