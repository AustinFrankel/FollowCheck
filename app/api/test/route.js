import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Test API working!' })
}

export async function POST(request) {
  const data = await request.json()
  return NextResponse.json({ 
    message: 'Test POST working!',
    received: data 
  })
} 