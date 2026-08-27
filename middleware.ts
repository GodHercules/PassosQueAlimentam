import { type NextRequest, NextResponse } from "next/server";
export async function middleware(request:NextRequest){return NextResponse.next({request});}
export const config={matcher:['/conta/:path*','/pre-inscricao/:path*','/admin/:path*']};
