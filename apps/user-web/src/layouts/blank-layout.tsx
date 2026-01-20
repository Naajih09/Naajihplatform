import { useAuth } from '@/hooks/useAuth';
import { PropsWithChildren } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';

export default function BlankLayout({ children }: PropsWithChildren) {
  const { isAuth } = useAuth();
  const [searchParams] = useSearchParams();

  if (isAuth) {
    return <Navigate to={searchParams.get('returnUrl') ?? '/'} />;
  }

  return <div className='min-h-screen'>{children}</div>;
}
