import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, getCurrentUser, Worker, Employer, getWorkerProfile, getEmployerProfile } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  userProfile: Worker | Employer | null
  userType: 'worker' | 'employer' | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<Worker | Employer | null>(null)
  const [userType, setUserType] = useState<'worker' | 'employer' | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUserProfile = async (currentUser: User) => {
    try {
      const userTypeFromMetadata = currentUser.user_metadata?.user_type || null
      console.log('User type from metadata:', userTypeFromMetadata)
      setUserType(userTypeFromMetadata)

      if (userTypeFromMetadata === 'worker') {
        const workerProfile = await getWorkerProfile(currentUser.id)
        console.log('Worker profile fetched:', workerProfile)
        setUserProfile(workerProfile)
      } else if (userTypeFromMetadata === 'employer') {
        const employerProfile = await getEmployerProfile(currentUser.id)
        console.log('Employer profile fetched:', employerProfile)
        setUserProfile(employerProfile)
      } else {
        console.log('No user type found in metadata')
        setUserProfile(null)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      setUserProfile(null)
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user)
    }
  }

  useEffect(() => {
    const getInitialUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
        
        if (currentUser) {
          await fetchUserProfile(currentUser)
        }
      } catch (error) {
        console.error('Error getting initial user:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id)
        try {
          setUser(session?.user ?? null)
          
          if (session?.user) {
            await fetchUserProfile(session.user)
          } else {
            setUserProfile(null)
            setUserType(null)
          }
        } catch (error) {
          console.error('Auth state change error:', error)
        } finally {
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setUserProfile(null)
    setUserType(null)
  }

  const value = {
    user,
    userProfile,
    userType,
    loading,
    signOut,
    refreshProfile
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}