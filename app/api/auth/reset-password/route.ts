import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST(request: NextRequest) {
  try {
    const { email, newPassword } = await request.json()

    if (!email || !newPassword) {
      return NextResponse.json({ 
        error: 'Email and new password are required' 
      }, { status: 400 })
    }

    // Get user by email
    const { data: users, error: fetchError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (fetchError) {
      console.error('Error fetching users:', fetchError)
      return NextResponse.json({ 
        error: 'Failed to find user' 
      }, { status: 500 })
    }

    const user = users.users.find(u => u.email === email)
    
    if (!user) {
      return NextResponse.json({ 
        error: 'User not found' 
      }, { status: 404 })
    }

    // Update user password
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    )

    if (updateError) {
      console.error('Error updating password:', updateError)
      return NextResponse.json({ 
        error: 'Failed to update password' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Password updated successfully' 
    })

  } catch (error) {
    console.error('Error resetting password:', error)
    return NextResponse.json(
      { error: 'Failed to reset password' }, 
      { status: 500 }
    )
  }
}