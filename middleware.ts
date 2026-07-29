import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedPaths = ['/mentor-dashboard', '/researcher-dashboard', '/coordinator-dashboard']
const authPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-otp']

function parseUser(userCookie: string | undefined) {
  if (!userCookie) return null
  try {
    return JSON.parse(decodeURIComponent(userCookie))
  } catch {
    return null
  }
}

function getDashboardForRole(role?: string) {
  if (role === 'mentor') return '/mentor-dashboard'
  if (role === 'researcher') return '/researcher-dashboard'
  if (role === 'coordinator') return '/coordinator-dashboard'
  return '/'
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const userCookie = request.cookies.get('user')?.value
  const { pathname } = request.nextUrl
  const user = parseUser(userCookie)

  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))

  if (isProtectedPath) {
    if (!token || !user) {
      const url = new URL('/login', request.url)
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    if (pathname.startsWith('/mentor-dashboard') && user.role !== 'mentor') {
      return NextResponse.redirect(new URL(getDashboardForRole(user.role), request.url))
    }

    if (pathname.startsWith('/researcher-dashboard') && user.role !== 'researcher') {
      return NextResponse.redirect(new URL(getDashboardForRole(user.role), request.url))
    }

    if (pathname.startsWith('/coordinator-dashboard') && user.role !== 'coordinator') {
      return NextResponse.redirect(new URL(getDashboardForRole(user.role), request.url))
    }
  }

  const isAuthPath = authPaths.some(path => pathname.startsWith(path))
  if (isAuthPath && token && user) {
    return NextResponse.redirect(new URL(getDashboardForRole(user.role), request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/mentor-dashboard/:path*',
    '/researcher-dashboard/:path*',
    '/coordinator-dashboard/:path*',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-otp'
  ],
}
