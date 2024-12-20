import supabase from "@supabase/supabase-js"
import dotenv from "dotenv"
dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL 
const supabaseKey = process.env.SUPABASE_KEY
const db = supabase.createClient(supabaseUrl, supabaseKey)

export default db