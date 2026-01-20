import { useAppSelector } from '@/store/store';

export const useAuth = () => {
  const { user, isAuth } = useAppSelector((state) => state.auth);

  return { user, isAuth };
};
