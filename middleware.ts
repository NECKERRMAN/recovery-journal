import { NextResponse, NextRequest } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

let headers = { 'accept-language': 'nl,en;q=0.5' }

let locales = ['en', 'nl']

// Get the preferred locale, similar to the above or using a library
function getLocale(request: NextRequest) {
    let languages = new Negotiator({ headers }).languages()
    let defaultLocale = 'nl'

    return match(languages, locales, defaultLocale)
}

export function middleware(request: NextRequest) {
    // Check if there is any supported locale in the pathname
    const { pathname } = request.nextUrl
    if (pathname.startsWith('/api')) return

    const pathnameHasLocale = locales.some(
        (locale) =>
            pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )

    if (pathnameHasLocale) return

    // Redirect if there is no locale
    const locale = getLocale(request)
    request.nextUrl.pathname = `/${locale}${pathname}`
    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(request.nextUrl)
}

export const config = {
    matcher: [
        // Skip all internal paths (_next)
        '/((?!_next).*)',
        // Skip api routes

        // Optional: only run on root (/) URL
        // '/'
    ],
}