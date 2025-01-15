import { Layout, theme } from 'antd';
import { Button, Card, Form, Input, message } from 'antd';
import { useState } from 'react';
import { env } from 'src/shared/config';
import { MainHeader } from 'src/shared/ui';

const { Content } = Layout;

// TODO: handle-jwt <2024-12-31>
// TODO: forgot password? 기능 <2024-12-31>

interface FormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const onFinish = async function (data: FormData) {
    setIsLoading(true);

    const response = await fetch(`${env.API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let msg = 'Login failed';

      if (!['basic', 'cors'].includes(response.type)) {
        msg = 'Login failed. The API server did not respond properly.';
      } else if (response.status === 400 || response.status === 401) {
        // Bad Request (400) / Unauthorized (401)
        msg = 'The password does not match, or the user does not exist.';
      }

      setIsLoading(false);
      message.error(msg, 5);
      throw new Error(msg);
    }

    try {
      const jwt = (await response.json()).accessToken;
      console.log(jwt);
      message.success('Login successful');
    } catch (error) {
      const msg = 'Login failed. The API server did not respond properly.';
      message.error(msg, 5);
      throw new Error(msg);
    }
  };

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
        <Card
          title="Login"
          className="shadow-md"
          style={{
            maxWidth: 500,
          }}
        >
          <Form
            name="login"
            disabled={isLoading}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{
              maxWidth: 500,
            }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item<FormData>
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                {
                  type: 'email',
                  message: 'The input is not valid E-mail',
                },
              ]}
            >
              <Input placeholder="example@example.org" />
            </Form.Item>

            <Form.Item<FormData>
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <Input.Password placeholder="input password" />
            </Form.Item>

            <Form.Item label={null}>
              <Button type="primary" htmlType="submit">
                Login
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
}
