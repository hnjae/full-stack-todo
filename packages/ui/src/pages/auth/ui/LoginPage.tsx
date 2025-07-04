import { unwrapResult } from '@reduxjs/toolkit';
import { Button, Form, Input, message, Typography } from 'antd';
import { useState } from 'react';
import { login, logout } from 'src/shared/auth';
import { useAppDispatch } from 'src/shared/model';

import { FormData } from '../model/FormData';
import AuthForm from './AuthForm';
import AuthPageLayout from './AuthPageLayout';

const { Text, Link } = Typography;

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async function (data: FormData) {
    setIsLoading(true);

    try {
      const formParams = new URLSearchParams();
      formParams.append('grant_type', 'password');
      formParams.append('username', data.email);
      formParams.append('password', data.password);

      unwrapResult(await dispatch(login(formParams)));
    } catch (error) {
      let msgFailedReason;
      if (error != null && typeof error === 'object' && 'message' in error) {
        msgFailedReason = error.message;
      } else {
        msgFailedReason = 'An unexpected error occurred.';
      }
      const msg = `Failed to login. ${msgFailedReason}`;

      messageApi.error(msg);
      console.error('Login error:', error);

      dispatch(logout());
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
