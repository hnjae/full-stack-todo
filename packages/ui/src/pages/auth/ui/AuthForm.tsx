import { ColProps, Form } from 'antd';

import FormData from '../model/FormData';

interface AuthFormProps {
  name: string;
  isLoading: boolean;
  onFinish: (data: FormData) => Promise<void>;
  children: React.ReactNode;
  labelCol?: ColProps;
}

export default function AuthForm({
  name,
  isLoading,
  onFinish,
  children,
  labelCol = {},
}: AuthFormProps) {
  return (
    <Form
      name={name}
      disabled={isLoading}
      labelCol={labelCol}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
    >
      {children}
    </Form>
  );
}
