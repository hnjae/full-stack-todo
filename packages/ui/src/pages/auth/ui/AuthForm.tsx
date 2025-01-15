import { Form } from 'antd';

import FormData from '../model/FormData';

interface AuthFormProps {
  name: string;
  isLoading: boolean;
  onFinish: (data: FormData) => Promise<void>;
  children: React.ReactNode;
}

export default function AuthForm({
  name,
  isLoading,
  onFinish,
  children,
}: AuthFormProps) {
  return (
    <Form
      name={name}
      disabled={isLoading}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 400 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
    >
      {children}
    </Form>
  );
}
