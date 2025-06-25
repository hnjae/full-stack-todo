import './style.css';

import { RouterProvider } from '@tanstack/react-router';
import { Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { initializeAuth } from 'src/shared/auth';
import { selectAuthInitialized } from 'src/shared/auth';
import { useAppDispatch, useAppSelector } from 'src/shared/model';

import router from './router';
import { store } from './store';

const App = function () {
  const authInitialized = useAppSelector(selectAuthInitialized);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, []);

  return !authInitialized ? (
    <Spin
      style={{
        display: 'grid',
        placeItems: 'center',
        height: '100svh',
        width: '100%',
      }}
      size="large"
    />
  ) : (
    <RouterProvider router={router} />
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
