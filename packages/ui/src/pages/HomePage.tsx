import { Layout, theme } from 'antd';
import { MainHeader } from 'src/widgets/header';

export default function HomePage() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <MainHeader />
      <div
        style={{
          background: colorBgContainer,
          minHeight: 280,
          padding: 24,
          borderRadius: borderRadiusLG,
        }}
      >
        <span className="material-icons-outlined">home</span> hello
      </div>
    </Layout>
  );
}
