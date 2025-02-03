import { MOIMS_ITEMS_PER_PAGE } from '@/constants/common/common.const';
import { TMoimClient, TMoims, TMoimsJoined } from '@/types/supabase/supabase-custom.type';
import convertToWebP from '@/utils/common/converToWebp';
import { mapMoimsToClient } from '@/utils/common/mapMoims';
import { createClient } from '@/utils/supabase/server';
import { PostgrestError } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pageQuery = searchParams.get('page');
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 총 아이템 수를 가져옵니다.
  const { count: totalItems, error: countError } = await supabase
    .from('moims')
    .select('id', { count: 'exact', head: true });

  if (countError) {
    console.error(countError);
    return NextResponse.json({ message: countError?.message }, { status: 401 });
  }

  if (!totalItems) {
    return NextResponse.json({ message: '아이템이 하나도 없어요' }, { status: 404 });
  }

  if (pageQuery !== 'null') {
    const page = Number(pageQuery);
    const start = page === 1 || page === 0 ? 0 : (page - 1) * MOIMS_ITEMS_PER_PAGE;
    const end = start + MOIMS_ITEMS_PER_PAGE - 1;

    const {
      data: moims,
      error: moimError,
    }: {
      data: TMoimsJoined[] | null;
      error: PostgrestError | null;
    } = await supabase
      .from('moims')
      .select('*, reviews (*), participated_moims (*)')
      .order('created_at', { ascending: false })
      .range(start, end);

    if (moimError) {
      console.error(moimError);
      return NextResponse.json({ message: moimError?.message }, { status: 401 });
    }

    if (!moims) {
      return NextResponse.json({ message: '모임이 하나도 없어요' }, { status: 404 });
    }

    const totalPages = Math.ceil(totalItems / MOIMS_ITEMS_PER_PAGE);

    const moimsToClient: TMoimClient[] = mapMoimsToClient(moims);

    return NextResponse.json(
      {
        data: moimsToClient,
        pagination: {
          totalItems,
          totalPages,
          currentPage: page, // 1부터 시작하는 페이지 번호
        },
      },
      { status: 200 },
    );
  }

  // 페이지 파라미터가 없는 경우 전체 데이터를 가져옵니다.
  const {
    data: moims,
    error: moimError,
  }: {
    data: TMoimsJoined[] | null;
    error: PostgrestError | null;
  } = await supabase
    .from('moims')
    .select('*, reviews (*), participated_moims (*)')
    .order('created_at', { ascending: false });

  if (moimError) {
    console.error(moimError);
    return NextResponse.json({ message: moimError?.message }, { status: 401 });
  }
  if (!moims) {
    return NextResponse.json({ message: '모임이 하나도 없어요' }, { status: 404 });
  }

  const totalPages = Math.ceil(totalItems / MOIMS_ITEMS_PER_PAGE);

  const moimsToClient: TMoimClient[] = mapMoimsToClient(moims);

  return NextResponse.json(
    {
      data: moimsToClient,
      pagination: {
        totalItems,
        totalPages,
        currentPage: 1, // 페이지 파라미터가 없으므로 첫 번째 페이지로 간주
      },
    },
    { status: 200 },
  );
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return NextResponse.json({ message: error?.message }, { status: 401 });
  }

  const formData = await req.formData();
  const moimDataString = formData.get('moim_json'); // 클라이언트에서 json으로 묶어줘야 함

  if (!moimDataString) {
    return NextResponse.json({ message: 'formData에 moim_json이 없습니다' }, { status: 400 });
  }

  const moimImageFile = formData.get('moim_image') as File;
  const moimDataOrigin = JSON.parse(moimDataString as string);

  if (!moimDataOrigin) {
    return NextResponse.json({ message: '잘못된 페이로드 입니다' }, { status: 400 });
  }

  // 현재 시간 가져오기 (UTC)
  const now = new Date().toISOString();

  // 상태 결정 로직
  let status: 'RECRUIT' | 'PROGRESS' | 'END';
  if (now < moimDataOrigin.recruitmentDeadline) {
    status = 'RECRUIT';
  } else if (now >= moimDataOrigin.startDate && now <= moimDataOrigin.endDate) {
    status = 'PROGRESS';
  } else {
    status = 'END';
  }

  const moimData: Partial<TMoims> = {
    title: moimDataOrigin.title,
    content: moimDataOrigin.content,
    address: moimDataOrigin.roadAddress,
    recruitment_deadline: moimDataOrigin.recruitmentDeadline,
    start_date: moimDataOrigin.startDate,
    end_date: moimDataOrigin.endDate,
    min_participants: moimDataOrigin.minParticipants,
    max_participants: moimDataOrigin.maxParticipants,
    category: moimDataOrigin.moimType,
    status,
    master_email: user?.email,
    images: null,
  };

  // 이미지 파일이 있는 경우
  if (moimImageFile) {
    const imageBuffer = await convertToWebP(moimImageFile, 1080);
    const filePath = `moims_${Date.now()}.webp`;

    if (!imageBuffer) {
      return NextResponse.json({ message: '이미지 변환 중 오류 발생' }, { status: 500 });
    }

    const { data: imageData, error: imageError } = await supabase.storage
      .from('moims')
      .upload(filePath, imageBuffer, {
        contentType: 'image/webp',
      });

    if (imageError) {
      return NextResponse.json({ message: '이미지 업로드 중 오류 발생' }, { status: 500 });
    }

    const { data: imageUrlData } = supabase.storage.from('moims').getPublicUrl(filePath);
    moimData.images = [imageUrlData.publicUrl];
  }

  // 이미지 파일이 없어도 'moims' 테이블에 모임 데이터를 삽입
  const {
    data: moim,
    error: moimError,
  }: { data: TMoimsJoined | null; error: PostgrestError | null } = await supabase
    .from('moims')
    .upsert({ ...moimData })
    .select('*, reviews (*), participated_moims (*)')
    .single();

  if (moimError) {
    return NextResponse.json({ message: moimError?.message }, { status: 401 });
  }

  if (!moim) {
    return NextResponse.json({ message: '모임 생성 실패' }, { status: 404 });
  }

  const moimsToClient: TMoimClient[] = mapMoimsToClient([moim]);

  return NextResponse.json(moimsToClient[0], { status: 200 });
}

// const deadlineDate = new Date(moimDataOrigin.recruitmentDeadline);
// const startDate = new Date(moimDataOrigin.startDate);
// const endDate = new Date(moimDataOrigin.endDate);

// const isDeadlinePassed = deadlineDate < new Date();
// const isStartDatePassed = startDate < new Date();
// const isEndDatePassed = endDate < new Date();

// let status = '';
// if (isDeadlinePassed) {
//   status = 'RECRUIT';
// } else if (isStartDatePassed) {
//   status = 'PROGRESS';
// } else if (isEndDatePassed) {
//   status = 'END';
// }
