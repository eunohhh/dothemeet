import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return NextResponse.json({ message: error?.message }, { status: 401 });
  }

  if (!user) {
    return NextResponse.json({ message: '로그인 후 이용해주세요' }, { status: 401 });
  }

  const { data: foundUser, error: foundUserError } = await supabase
    .from('users')
    .select('*')
    .eq('email', user.email)
    .single();

  if (foundUserError) {
    return NextResponse.json({ message: foundUserError?.message }, { status: 401 });
  }

  if (!foundUser) {
    return NextResponse.json({ message: '사용자 정보가 없어요' }, { status: 401 });
  }

  const { data: existingLike } = await supabase
    .from('liked_moims')
    .select('*')
    .eq('moim_uuid', id)
    .eq('user_uuid', foundUser.id)
    .single();

  if (existingLike) {
    return NextResponse.json({ message: '이미 찜한 모임이에요' }, { status: 401 });
  }

  const { data: likeData, error: likeError } = await supabase
    .from('liked_moims')
    .upsert({ moim_uuid: id, user_uuid: foundUser.id })
    .select();

  if (likeError) {
    return NextResponse.json({ message: likeError?.message }, { status: 401 });
  }

  if (!likeData) {
    return NextResponse.json({ message: '모임 찜하기 실패' }, { status: 401 });
  }

  const { data: likes, error: likesError } = await supabase
    .from('liked_moims')
    .select('*')
    .eq('moim_uuid', id);

  if (likesError) {
    return NextResponse.json({ message: likesError?.message }, { status: 401 });
  }

  const response = {
    message: '모임 찜하기가 성공적으로 완료되었습니다',
    data: {
      moimId: id,
      likes: likes?.length,
    },
  };

  return NextResponse.json(response, { status: 200 });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return NextResponse.json({ message: error?.message }, { status: 401 });
  }

  if (!user) {
    return NextResponse.json({ message: '로그인 후 이용해주세요' }, { status: 401 });
  }

  const { data: foundUser, error: foundUserError } = await supabase
    .from('users')
    .select('*')
    .eq('email', user.email)
    .single();

  if (foundUserError) {
    return NextResponse.json({ message: foundUserError?.message }, { status: 401 });
  }

  if (!foundUser) {
    return NextResponse.json({ message: '사용자 정보가 없어요' }, { status: 401 });
  }

  const { data: deletedLike, error: deletedLikeError } = await supabase
    .from('liked_moims')
    .delete()
    .eq('moim_uuid', id)
    .eq('user_uuid', foundUser.id)
    .select()
    .single();

  if (deletedLikeError) {
    return NextResponse.json({ message: deletedLikeError?.message }, { status: 401 });
  }

  if (!deletedLike) {
    return NextResponse.json({ message: '찜한 모임이 없어요' }, { status: 401 });
  }

  const { data: likes, error: likesError } = await supabase
    .from('liked_moims')
    .select('*')
    .eq('moim_uuid', id);

  if (likesError) {
    return NextResponse.json({ message: likesError?.message }, { status: 401 });
  }

  const response = {
    message: '모임 찜 해제가 성공적으로 완료되었습니다',
    data: {
      moimId: id,
      likes: likes?.length,
    },
  };

  return NextResponse.json(response, { status: 200 });
}
