import { SubmitHandler, useForm } from 'react-hook-form';
import getApiUrl from 'src/shared/getApiUrl';

// TODO: 이메일 인증? <2024-12-23>
// TODO: 패스워드를 한번 더 입력하게 하기 <2024-12-23>
// TODO: 어떤 버튼을 눌러서 패스워드를 보이게 하기 <2024-12-23>
// TODO: 패스워드 규칙을 뛰우고, 현재 입력이 해당 규칙에 맞는지 노출하기 <2024-12-23>
// TODO: 실시간 이메일 규격 validate <2024-12-23>
// TODO: error-handling <2024-12-23>

interface FormData {
  email: string;
  password: string;
}

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    // watch,
    // formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async function (data) {
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
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
            <div className="text-xl">Sign up</div>
            <div className="form-control">
              <label className="input input-bordered flex items-center gap-2">
                <span className="material-icons-outlined">email</span>
                <input
                  type="text"
                  className="grow"
                  placeholder="example@example.org"
                  {...register('email', { required: true })}
                />
              </label>
            </div>
            <div className="form-control">
              <label className="input input-bordered flex items-center gap-2">
                <span className="material-icons-outlined">password</span>
                <input
                  type="password"
                  className="grow"
                  placeholder="password"
                  {...register('password', { required: true })}
                />
              </label>
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
