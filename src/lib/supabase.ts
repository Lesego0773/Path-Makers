import { createClient } from '@supabase/supabase-js'

// Ensure we have default values if environment variables are not set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Create the Supabase client with proper error handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

// Database types
export interface Worker {
  id: string
  email: string
  full_name: string
  phone: string
  location: string
  skills: string
  experience: string
  availability: string
  is_verified: boolean
  id_document_url?: string
  selfie_url?: string
  rating: number
  completed_jobs: number
  created_at: string
  updated_at: string
}

export interface Employer {
  id: string
  email: string
  full_name: string
  id_number: string
  is_verified: boolean
  id_document_url?: string
  selfie_url?: string
  created_at: string
  updated_at: string
}

export interface Job {
  id: string
  employer_id: string
  worker_id?: string
  title: string
  description: string
  category: string
  location: string
  budget: number
  status: 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

// Auth functions
export const signUpWorker = async (email: string, password: string, workerData: Partial<Worker>) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
      options: {
        data: {
          user_type: 'worker',
          ...workerData
        }
      }
    })
    
    if (error) throw error
    
    if (data.user) {
      const { error: insertError } = await supabase
        .from('workers')
        .insert([{
          id: data.user.id,
          email,
          ...workerData
        }])
      
      if (insertError) throw insertError
    }
    
    return data
  } catch (error) {
    throw error
  }
}

export const signUpEmployer = async (email: string, password: string, employerData: Partial<Employer>) => {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password: password,
    options: {
      data: {
        user_type: 'employer',
        ...employerData
      }
    }
  })
  
  if (error) throw error
  
  if (data.user) {
    const { error: insertError } = await supabase
      .from('employers')
      .insert([{
        id: data.user.id,
        email,
        ...employerData
      }])
    
    if (insertError) throw insertError
  }
  
  return data
}

export const signInUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password: password
  })
  
  if (error) throw error
  return data
}

export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Worker functions
export const getWorkerProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('workers')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      // Handle the specific case where no rows are returned
      if (error.code === 'PGRST116') {
        return null
      }
      throw error
    }
    return data
  } catch (error) {
    console.error('Error fetching worker profile:', error)
    return null
  }
}

export const updateWorkerProfile = async (userId: string, updates: Partial<Worker>) => {
  try {
    const { data, error } = await supabase
      .from('workers')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating worker profile:', error)
    throw error
  }
}

export const verifyWorker = async (userId: string, idDocumentUrl: string, selfieUrl: string) => {
  const { data, error } = await supabase
    .from('workers')
    .update({
      is_verified: true,
      id_document_url: idDocumentUrl,
      selfie_url: selfieUrl,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Employer functions
export const getEmployerProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('employers')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw error
    }
    return data
  } catch (error) {
    console.error('Error fetching employer profile:', error)
    return null
  }
}

export const updateEmployerProfile = async (userId: string, updates: Partial<Employer>) => {
  const { data, error } = await supabase
    .from('employers')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const verifyEmployer = async (userId: string, idDocumentUrl: string, selfieUrl: string) => {
  const { data, error } = await supabase
    .from('employers')
    .update({
      is_verified: true,
      id_document_url: idDocumentUrl,
      selfie_url: selfieUrl,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Worker search functions
export const getNearbyWorkers = async (location?: string, category?: string) => {
  let query = supabase
    .from('workers')
    .select('*')
    .eq('is_verified', true)
  
  if (category && category !== 'all') {
    query = query.ilike('skills', `%${category}%`)
  }
  
  if (location) {
    query = query.ilike('location', `%${location}%`)
  }
  
  const { data, error } = await query.order('rating', { ascending: false })
  
  if (error) throw error
  return data
}

// File upload functions
export const uploadFile = async (file: File, bucket: string, path: string) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file)
  
  if (error) throw error
  
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  
  return publicUrl
}

// Job functions
export const createJob = async (jobData: Omit<Job, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('jobs')
    .insert([jobData])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getJobsByEmployer = async (employerId: string) => {
  const { data, error } = await supabase
    .from('jobs')
    .select(`
      *,
      worker:workers(full_name, rating)
    `)
    .eq('employer_id', employerId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const getJobsByWorker = async (workerId: string) => {
  const { data, error } = await supabase
    .from('jobs')
    .select(`
      *,
      employer:employers(full_name)
    `)
    .eq('worker_id', workerId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}