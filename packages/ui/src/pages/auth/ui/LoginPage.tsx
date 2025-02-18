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
      dispatch(setToken(jwt));
      message.success('Login successful');
    } catch (error) {
      const msg = 'Login failed. The API server did not respond properly.';
      message.error(msg, 5);
      throw new Error(msg);
    }
  };

  return (
    <AuthPageLayout title="Login">
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
