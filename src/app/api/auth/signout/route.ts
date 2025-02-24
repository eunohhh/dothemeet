import { deleteCookie } from '@/utils/auth/auth-server.util';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function DELETE() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signOut();

  deleteCookie('access_token');
  deleteCookie('refresh_token');

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: '로그아웃 성공' }, { status: 200 });
}
