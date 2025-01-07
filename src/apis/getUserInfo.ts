import { IUser } from '@/types/user';
import axiosInstance from './axiosInstance';

export const getUserInfo = async (): Promise<IUser> => {
  const token = localStorage.getItem('dudemeet-token');
  if (!token) {
    throw new Error('인증 토큰이 없습니다.');
  }
  const response = await axiosInstance.get('/auths/user', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
