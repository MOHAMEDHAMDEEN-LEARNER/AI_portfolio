import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from './supabase'

export const createServerSupabaseClient = () => {
  return createServerComponentClient<Database>({ cookies })
}

export const createRouteHandlerSupabaseClient = () => {
  return createRouteHandlerClient<Database>({ cookies })
}