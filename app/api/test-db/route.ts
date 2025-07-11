import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function GET() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: true
  });

  try {
    const result = await pool.query('SELECT NOW() as time');
    await pool.end();
    
    return NextResponse.json({ 
      message: 'Conexión exitosa',
      data: result.rows[0]
    });
  } catch (error: any) {
    console.error('Error:', error);
    await pool.end();
    
    return NextResponse.json({ 
      message: 'Error de conexión',
      error: error.message
    }, { status: 500 });
  }
}