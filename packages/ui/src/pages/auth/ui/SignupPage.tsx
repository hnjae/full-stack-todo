import { Button, Form, Input, message } from 'antd';
import { useState } from 'react';
import { env } from 'src/shared/config';

import FormData from '../model/FormData';
import AuthForm from './AuthForm';
import AuthPageLayout from './AuthPageLayout';

// TODO: 이메일 인증? <2024-12-23>
// TODO: card 를 적당히 화면 중앙에 뛰우기 <2024-12-24>

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const onFinish = async function (data: FormData) {
    setIsLoading(true);

    const response = await fetch(`${env.API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let msg: string;

      if (!['basic', 'cors'].includes(response.type)) {
        msg = 'Registration failed. The API server did not respond properly.';
      } else if (response.status === 400) {
        // Bad Request (validated on the frontend, should not be displayed)
        try {
          const data = await response.json();
          if (data && data.message) {
            msg = 'Registration failed: ';
            msg = msg.concat('\n', data.message.join(';\n\t'));
          } else {
            msg = 'Registration failed';
          }
        } catch (error) {
          msg = 'Registration failed';
        }
      } else if (response.status === 409) {
        // Conflict
        msg = 'A user with this email already exists.';
      } else {
        // fallback
        msg = 'Registration failed';
      }

      setIsLoading(false);
      message.error(msg, 5);
      throw new Error(msg);
    }

    // TODO: redirect <2024-12-30>
    message.success('Registration successful');
  };

  return (
    <AuthPageLayout title="Sign up">
      <AuthForm
        name="signup"
        isLoading={isLoading}
        onFinish={onFinish}
        labelCol={{ span: 10 }}
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
          rules={[
            { required: true, message: 'Please input your password!' },
            {
              type: 'string',
              min: 8,
              max: 72,
              message: 'The password must be between 8 and 72 characters long.',
            },
          ]}
        >
          <Input.Password placeholder="input password" />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('The new password that you entered do not match!'),
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </AuthForm>
    </AuthPageLayout>
  );
}
