import { PUBLIC_URL } from '@/constants/auth/auth.const';
import { createClient } from '@/utils/supabase/server';
import { Provider } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get('provider');
  const cookieStore = await cookies();
  const next = searchParams.get('next') ?? '/';

  const supabase = await createClient(cookieStore);

  if (!PUBLIC_URL) {
    return NextResponse.json({ message: 'PUBLIC_URL is not set' }, { status: 401 });
  }

  const getURL = () => {
    let url =
      PUBLIC_URL ?? // Set this to your site URL in production env.
      process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
      'http://localhost:3000/';
    // Make sure to include `https://` when not localhost.
    url = url.startsWith('http') ? url : `https://${url}`;
    // Make sure to include a trailing `/`.
    url = url.endsWith('/') ? url : `${url}/`;
    return url;
  };

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as Provider,
    options: {
      redirectTo: `${getURL()}api/auth/callback?next=${next}`,
    },
  });

  if (error) {
    return NextResponse.json({ message: error?.message }, { status: 401 });
  }

  return NextResponse.json(data, { status: 200 });
}
