import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';

// Layouts

// Pages
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import router from './router';
import { persistor, store } from './store/store';



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RouterProvider router={router} />
         
        </PersistGate>
      </Provider>
    </Suspense>
  </React.StrictMode>
);
