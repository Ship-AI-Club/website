import {NextResponse} from 'next/server';
// Authorization runs in each server route. Middleware sets private response
// headers even on redirects/denials/Flight requests; it is not an auth gate.
export function middleware(){const response=NextResponse.next();
  for(const [key,value] of Object.entries({'Cache-Control':'private, no-store, max-age=0, must-revalidate','CDN-Cache-Control':'no-store','Vercel-CDN-Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow, noarchive','X-Content-Type-Options':'nosniff','Vary':'Cookie'}))response.headers.set(key,value);
  return response;
}
export const config={matcher:['/workshops/:slug/materials/:path*','/workshops/materials','/api/workshops/:slug/materials/:path*','/api/fx-showcase']};
