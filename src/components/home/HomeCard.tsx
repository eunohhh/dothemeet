// src/components/HomeCard.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import HeartIcon from './icons/HeartIcon';
import { IMoim } from '@/types/home/i-moim';
import { useLikeStore } from '@/stores/home/likeStore';

export default function HomeCard({ data }: { data: IMoim }) {
  const router = useRouter();

  const { moimId, moimType, title, address, startDate, endDate, participants, likes, isConfirmed } =
    data;

  const { likes: likedMoims, toggleLike, likeDeltas } = useLikeStore();
  const isLiked = likedMoims.has(String(moimId));

  const baseLikes = likes ?? 0;
  const optimisticDelta = likeDeltas[moimId] || 0;
  const displayLikes = baseLikes + optimisticDelta;

  const today = new Date();
  const start = new Date(startDate);
  const diffTime = start.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const deadlineText = diffDays >= 0 ? `D-${diffDays}` : '';
  const confirmedText = isConfirmed ? '개설확정' : '진행중';

  const handleLike = (event: React.MouseEvent) => {
    event.stopPropagation();
    toggleLike(String(moimId));
  };

  const handleNavigate = () => {
    router.push(`/detail/${moimId}`);
  };

  return (
    <article
      className="flex min-w-[343px] h-[174px] bg-white p-4 space-x-5 cursor-pointer"
      onClick={handleNavigate}
    >
      <section className="w-9 h-9">
        <Image
          src={`/svgs/ic_color-${moimType}.svg`}
          alt={`${moimType} icon`}
          width={36}
          height={36}
          priority
        />
      </section>
      <section className="flex-1 flex-col">
        <div className="flex justify-between items-center">
          <div className="space-x-1">
            <span className="text-caption-normal bg-background400 px-1.5 py-[3px] rounded-md">
              {moimType}
            </span>
            {deadlineText && (
              <span className="text-caption-normal bg-background400 px-1.5 py-[3px] rounded-md">
                {deadlineText}
              </span>
            )}
            <span className="text-caption-normal bg-gray800 text-white px-1.5 py-[3px] rounded-md">
              {confirmedText}
            </span>
          </div>
          <button onClick={handleLike} aria-label={isLiked ? 'Remove from likes' : 'Add to likes'}>
            <HeartIcon className={`w-6 h-6 ${isLiked ? 'fill-red-500' : 'fill-gray-300'}`} />
          </button>
        </div>
        <div className="pt-3 space-y-2">
          <h3 className="text-body-1-normal">{title}</h3>
          <p className="text-sm text-gray-600">
            {address} | {participants}명 참여 | 좋아요: {displayLikes}
          </p>
          <p className="text-sm text-gray-500 pt-3">
            {`${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`}
          </p>
        </div>
      </section>
    </article>
  );
}
