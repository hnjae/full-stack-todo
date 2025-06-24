import './style.css';

import { RouterProvider } from '@tanstack/react-router';
import { Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { login } from 'src/features/auth';
import { refreshTokenService } from 'src/shared/lib';

import router from './router';
import { store } from './store';

const App = function () {
  const [authInitialized, setAuthInitialized] = useState<boolean | null>(null);

  useEffect(() => {
    const initAccessToken = async function () {
      try {
        const refreshToken = refreshTokenService.get();

        if (refreshToken == null) {
          throw new Error('No refresh token found');
        }

        const formParams = new URLSearchParams();
        formParams.append('grant_type', 'refresh_token');
        formParams.append('refresh_token', refreshToken);
        store.dispatch(login(formParams));
        setAuthInitialized(true);
      } catch (error) {
        console.log('Failed to get access token:', error);
        refreshTokenService.remove();
        setAuthInitialized(false);
      }
    };

    initAccessToken();
  }, []);

  return (
    <React.StrictMode>
      {authInitialized == null ? (
        <Spin
          style={{
            display: 'grid',
            placeItems: 'center',
            height: '98svh',
            width: '100%',
          }}
          size="large"
        />
      ) : (
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      )}
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
