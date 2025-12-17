import { useEffect } from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';
import { Button } from './button';

export function ErrorBoundaryFallback() {
  const error = useRouteError();
  const navigate = useNavigate();

  const reloadHandler = () => {
    if (window) window.location.reload();
  };

  useEffect(() => {
    // Send error to monitoring tool
    if (error) console.log(error);
  }, [error]);

  return (
    <div className='flex items-center justify-center h-screen w-full'>
      <div className='flex flex-col max-w-[400px] space-y-2 w-full'>
        {/* <ErrorIcon /> */}

        <p className='text-xl font-bold text-center'>
          Oops! something went wrong
        </p>

        <div className='flex flex-col space-y-3'>
          <Button className='w-full' onClick={reloadHandler}>
            Reload Page
          </Button>

          <Button
            className='w-full bg-[#F2F2F2] text-black '
            onClick={() => navigate('/', { replace: true })}
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
