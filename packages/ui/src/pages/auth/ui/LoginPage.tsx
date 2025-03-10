import { Button, Form, Input, message, Typography } from 'antd';
import { useState } from 'react';
import { setToken } from 'src/entities/auth';
import { env } from 'src/shared/config';
import { useAppDispatch } from 'src/shared/model';

import FormData from '../model/FormData';
import AuthForm from './AuthForm';
import AuthPageLayout from './AuthPageLayout';

const { Text, Link } = Typography;

// TODO: forgot password? 기능 <2024-12-31>

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async function (data: FormData) {
    setIsLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append('grant_type', 'password');
      formData.append('username', data.email);
      formData.append('password', data.password);

      const response = await fetch(`${env.API_URL}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      let responseBody;
      try {
        responseBody = await response.json();
      } catch (parseError) {
        throw new Error('The API server returned an invalid response format.');
      }

      if (!response.ok) {
        if (!['basic', 'cors'].includes(response.type)) {
          const msg = 'The API server did not respond properly.';
          throw new Error(msg);
        }

        if (response.status === 400 && responseBody.error === 'invalid_grant') {
          const msg =
            'Login failed. The password does not match, or the user does not exist.';
          throw new Error(msg);
        }

        const msg = `Login failed for following reason: '${responseBody.error}'`;
        throw new Error(msg);
      }

      const { access_token: accessToken } = responseBody;
      if (!accessToken) {
        throw new Error(
          'Login succeed but no access token was provided by the server.',
        );
      }

      dispatch(setToken(accessToken));

      // should redirect to else where
      // messageApi.success('Login successful');
    } catch (error) {
      const msg =
        error instanceof Error
          ? error.message
          : 'Login failed. An unexpected error occurred.';

      // message.error(msg, 5);
      messageApi.error(msg);
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthPageLayout title="Login">
      {contextHolder}
      <AuthForm
        name="login"
        isLoading={isLoading}
        onFinish={onFinish}
        labelCol={{ span: 7 }}
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
          <Input placeholder="example@example.org" autoComplete="email" />
        </Form.Item>

        <Form.Item<FormData>
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password placeholder="input password" />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </AuthForm>
      <Text>
        Do not have an account? <Link href="/signup">Create an account!</Link>
      </Text>
    </AuthPageLayout>
  );
}
