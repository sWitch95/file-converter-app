import { createBrowserClient } from "@supabase/ssr"

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseClient() {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase environment variables")
    }

    supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey)
  }

  return supabaseClient
}

export type ConversionHistory = {
  id: string
  user_id: string
  file_name: string
  source_format: string
  target_format: string
  file_size_bytes: number
  created_at: string
}

export type UserPreferences = {
  id: string
  user_id: string
  theme: "light" | "dark" | "system"
  default_compression: number
  created_at: string
}

export async function saveConversion(
  file_name: string,
  source_format: string,
  target_format: string,
  file_size: number,
) {
  const supabase = getSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  const { data, error } = await supabase
    .from("conversion_history")
    .insert([
      {
        user_id: user.id,
        file_name,
        source_format,
        target_format,
        file_size_bytes: file_size,
      },
    ])
    .select()

  if (error) throw new Error(`Failed to save conversion: ${error.message}`)
  return data
}

export async function getConversionHistory() {
  const supabase = getSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from("conversion_history")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) throw new Error(`Failed to fetch history: ${error.message}`)
  return data as ConversionHistory[]
}

export async function getUserPreferences() {
  const supabase = getSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase.from("user_preferences").select("*").eq("user_id", user.id).single()

  if (error && error.code !== "PGRST116") {
    throw new Error(`Failed to fetch preferences: ${error.message}`)
  }

  return (data as UserPreferences) || null
}

export async function updateUserPreferences(updates: Partial<UserPreferences>) {
  const supabase = getSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  const prefs = await getUserPreferences()

  if (prefs) {
    const { data, error } = await supabase.from("user_preferences").update(updates).eq("user_id", user.id).select()

    if (error) throw new Error(`Failed to update preferences: ${error.message}`)
    return data
  } else {
    const { data, error } = await supabase
      .from("user_preferences")
      .insert([{ user_id: user.id, ...updates }])
      .select()

    if (error) throw new Error(`Failed to create preferences: ${error.message}`)
    return data
  }
}
