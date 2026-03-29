/* eslint-disable react-refresh/only-export-components */
import React, { Suspense, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

// Layouts

// Pages
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastContainer } from 'react-toastify';
import router from './router';
import { persistor, store } from './store/store';

const SplashFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#111113] text-white font-sans">
    <div className="flex flex-col items-center gap-3">
      <div className="size-14 rounded-2xl bg-primary flex items-center justify-center text-black font-bold text-xl shadow-lg shadow-primary/20">
        N
      </div>
      <div className="text-lg font-bold">NaajihBiz</div>
      <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Loading</div>
      <div className="h-6 w-6 rounded-full border-2 border-white/20 border-t-primary animate-spin"></div>
    </div>
  </div>
);

const AppRoot = () => {
  useEffect(() => {
    const splash = document.getElementById('app-splash');
    if (splash) {
      splash.classList.add('hidden');
      window.setTimeout(() => splash.remove(), 250);
    }
  }, []);

  return <RouterProvider router={router} />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback={<SplashFallback />}>
      <Provider store={store}>
        <PersistGate loading={<SplashFallback />} persistor={persistor}>
          <AppRoot />
        </PersistGate>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </Provider>
    </Suspense>
  </React.StrictMode>
);
