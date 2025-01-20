// 데이터 상태를 관리하는 Tanstack query 커스텀 훅
import { useQuery } from "@tanstack/react-query";
import { getDetail } from "@/apis/detail/detail.api";
import { IMoimDetail, ApiDetailResponse } from "@/types/detail/i-moim";

// 커스텀 훅의 반환 타입 정의
interface MoimDetailResult {
  detail: IMoimDetail | undefined;
  isLoading: boolean;
  error: Error | null;
}

export const useMoimDetail = (id: number): MoimDetailResult => {
  const detailQuery = useQuery<ApiDetailResponse, Error>({
    queryKey: ['detail', id],
    queryFn: () => getDetail(id),
    staleTime: 1000 * 60 * 5,
    // select: (data) => data.isSuccess ? data : undefined,
  });

  return {
    detail: detailQuery.data?.data,
    isLoading: detailQuery.isLoading,
    error: detailQuery.error,
  };
};
