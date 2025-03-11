// NOTE: This page assumes that the user is logged in when loaded.

import { Layout, theme } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUserId } from 'src/entities/auth';
import { env } from 'src/shared/config';
import { MainHeader } from 'src/widgets/header';

const { Content } = Layout;

interface User {
  id: string;
  email: string;
  createdAt: string;
}

export default function WebAppPage() {
  const { token } = theme.useToken();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const userId = useSelector(selectUserId);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (accessToken == null) {
        // raise error
      }

      const response = await fetch(`${env.API_URL}/users/${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const user = await response.json();
      console.log(user);
      setUser(user);
    };

    fetchUserData();
  }, []);

  return (
    <Layout
      style={{
        height: '100dvh',
      }}
    >
      <MainHeader />
      <Content
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: '20vh',
          background: `color-mix(in srgb, ${token.colorBgLayout}, black 2%)`,
        }}
      >
        Todo-app should be implemented here
        {user != null ? (
          <div>
            <br />
            User Id: {user.id}
            <br />
            User Email: {user.email}
            <br />
            User createdAt: {user.createdAt}
          </div>
        ) : null}
      </Content>
    </Layout>
  );
}
