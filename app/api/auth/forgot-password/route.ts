import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map<string, { otp: string; timestamp: number }>()

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Generate OTP
    const otp = generateOTP()
    
    // Store OTP with timestamp (expires in 10 minutes)
    otpStore.set(email, { 
      otp, 
      timestamp: Date.now() 
    })

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    })

    // Email template
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Password Reset OTP</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .otp-code { background: #fff; border: 2px solid #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #667eea; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Hello!</h2>
              <p>We received a request to reset your password for your AI Portfolio Generator account.</p>
              
              <p>Your verification code is:</p>
              <div class="otp-code">${otp}</div>
              
              <p><strong>Important:</strong></p>
              <ul>
                <li>This code will expire in 10 minutes</li>
                <li>Enter this code on the password reset page to continue</li>
                <li>If you didn't request this reset, please ignore this email</li>
              </ul>
              
              <p>If you're having trouble, please contact our support team.</p>
            </div>
            <div class="footer">
              <p>This is an automated email from AI Portfolio Generator. Please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🔐 Password Reset OTP - AI Portfolio Generator',
      html: htmlTemplate,
    })

    return NextResponse.json({ 
      success: true, 
      message: 'OTP sent successfully' 
    })

  } catch (error) {
    console.error('Error sending OTP email:', error)
    return NextResponse.json(
      { error: 'Failed to send OTP email' }, 
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 })
    }

    // Get stored OTP
    const storedData = otpStore.get(email)
    
    if (!storedData) {
      return NextResponse.json({ error: 'OTP not found or expired' }, { status: 400 })
    }

    // Check if OTP is expired (10 minutes)
    const isExpired = Date.now() - storedData.timestamp > 10 * 60 * 1000
    
    if (isExpired) {
      otpStore.delete(email)
      return NextResponse.json({ error: 'OTP has expired' }, { status: 400 })
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })
    }

    // OTP is valid, remove from store
    otpStore.delete(email)

    return NextResponse.json({ 
      success: true, 
      message: 'OTP verified successfully' 
    })

  } catch (error) {
    console.error('Error verifying OTP:', error)
    return NextResponse.json(
      { error: 'Failed to verify OTP' }, 
      { status: 500 }
    )
  }
}