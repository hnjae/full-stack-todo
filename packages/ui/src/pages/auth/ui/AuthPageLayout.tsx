import { Layout, theme } from 'antd';
import { Card } from 'antd';
import { MainHeader } from 'src/widgets/header';

const { Content } = Layout;

interface AuthPageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function AuthPageLayout({
  title,
  children,
}: AuthPageLayoutProps) {
  const { token } = theme.useToken();

  return (
    <Layout className="h-dvh">
      <MainHeader />
      <Content
        className="flex items-center justify-center pb-[20vh]"
        style={{
          background: `color-mix(in srgb, ${token.colorBgLayout}, black 2%)`,
        }}
      >
        <Card title={title} className="shadow-md">
          {children}
        </Card>
      </Content>
    </Layout>
  );
}
