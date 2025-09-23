// Test environment variables loading
console.log('Environment Variables Test:')
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing')

export default function EnvTest() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Test</h1>
      <div className="space-y-2">
        <p><strong>Supabase URL:</strong> {supabaseUrl || 'Missing'}</p>
        <p><strong>Supabase Key:</strong> {supabaseKey ? 'Present' : 'Missing'}</p>
        <p><strong>URL Valid:</strong> {supabaseUrl?.startsWith('http') ? 'Yes' : 'No'}</p>
      </div>
    </div>
  )
}