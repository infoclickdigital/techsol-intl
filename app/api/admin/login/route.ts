import { NextRequest, NextResponse } from 'next/server';
import sql, { initDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await initDb();
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required.' },
        { status: 400 }
      );
    }

    // Verify credentials directly in PostgreSQL
    const admins = await sql`
      SELECT * FROM techsol_admins 
      WHERE username = ${username} AND password = ${password}
      LIMIT 1
    `;

    if (admins.length > 0) {
      return NextResponse.json({
        success: true,
        token: admins[0].password,
        username: admins[0].username,
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password.' },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error('API Admin login error:', error);
    return NextResponse.json(
      { success: false, error: 'Database transaction failed: ' + error.message },
      { status: 500 }
    );
  }
}
