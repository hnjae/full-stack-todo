import { Layout, theme } from 'antd';
import { MainHeader } from 'src/widgets/header';

const { Content } = Layout;

export default function WebAppPage() {
  const { token } = theme.useToken();

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
      </Content>
    </Layout>
  );
}
