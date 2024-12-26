import { Button, Card, Form, Input } from 'antd';
import getApiUrl from 'src/shared/getApiUrl';

// TODO: 이메일 인증? <2024-12-23>
// TODO: error-handling <2024-12-23>
// TODO: card 를 적당히 화면 중앙에 뛰우기 <2024-12-24>

interface FormData {
  email: string;
  password: string;
}

export default function SignupPage() {
  const onFinish = async function (data: FormData) {
    const apiUrl = getApiUrl();
    try {
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        // TODO: DO SOMETHING <2024-12-23>
        console.error('API Server error: ', response);
      }
    } catch (error) {
      // TODO: DO SOMETHING <2024-12-23>
      console.error('Signup error: ', error);
    }
  };

  return (
    <Card title="Sign up" className="">
      <Form
        name="Sign up"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 400 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
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
      </Form>
    </Card>
  );
}
