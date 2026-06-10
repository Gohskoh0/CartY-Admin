import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(req: NextRequest) {
  try {
    const updates: Record<string, string> = await req.json();

    const promises = Object.entries(updates).map(([key, value]) =>
      supabase.from('app_config').upsert(
        {
          key,
          value,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      )
    );

    await Promise.all(promises);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Config update error:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to update config' },
      { status: 500 }
    );
  }
}