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

// Simple Guard
// const ProtectedRoute = ({ children }) => {
//   const user = localStorage.getItem('user');
//   if (!user) return <Navigate to='/login' />;
//   return children;
// };

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RouterProvider router={router} />
          {/* <BrowserRouter>
            <Routes>
  
              <Route path='/' element={<Landing />} />
              <Route path='/signup' element={<Signup />} />
              <Route path='/login' element={<Login />} />

         
              <Route
                path='/dashboard'
                element={
             
                  <DashboardLayout />
               
                }
              >
                <Route index element={<DashboardHome />} />
                <Route
                  path='messages'
                  element={
                    <div className='p-10'>Messages Page Coming Soon</div>
                  }
                />
                <Route
                  path='settings'
                  element={
                    <div className='p-10'>Settings Page Coming Soon</div>
                  }
                />
                <Route path='create-pitch' element={<CreatePitch />} />
                <Route path='opportunities' element={<Opportunities />} />
                <Route path='opportunities/:id' element={<PitchDetails />} />
                <Route path='profile' element={<Profile />} />
              </Route>
            </Routes>
          </BrowserRouter> */}
        </PersistGate>
      </Provider>
    </Suspense>
  </React.StrictMode>
);
