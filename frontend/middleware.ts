import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';

  // Only handle requests to the root path
  if (pathname === '/') {
    const isCurl = userAgent.toLowerCase().includes('curl');
    const isPowershell = userAgent.toLowerCase().includes('powershell');

    if (isCurl || isPowershell) {
      if (isPowershell) {
        // Windows PowerShell command
        return new Response(
          `powershell -Command "Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/openSVM/aea/main/install.ps1' -OutFile 'install.ps1'; .\\install.ps1"`,
          {
            status: 200,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
          }
        );
      } else {
        // Linux, macOS, etc.
        return new Response(
          `curl -sSf https://raw.githubusercontent.com/openSVM/aea/main/install.sh | sh`,
          {
            status: 200,
            headers: { 'Content-Type': 'text/x-shellscript; charset=utf-8' },
          }
        );
      }
    }
  }

  // Continue to Next.js routing for all other requests
  return NextResponse.next();
}

export const config = {
  matcher: '/',
};
