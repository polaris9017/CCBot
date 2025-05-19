'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function Error() {
  const searchParams = useSearchParams();
  const error = (searchParams.get('error') || 'Default') as ErrorType;
  const code = searchParams.get('code');

  enum ErrorType {
    CredentialsSignin = 'CredentialsSignin',
    Default = 'Default',
  }

  const message = {
    [ErrorType.CredentialsSignin]: (
      <div>
        로그인 중 오류가 발생했습니다. 오류가 지속될 때에는 연락 바랍니다.
        <p className="p-2">
          Error code: <code className="rounded-md bg-slate-200 p-1">{code}</code>
        </p>
      </div>
    ),
    [ErrorType.Default]: (
      <div>
        로그인 중 알 수 없는 오류가 발생했습니다. 오류가 지속될 때에는 연락 바랍니다.
        <p className="p-2">
          Error code: <code className="rounded-sm bg-slate-100 p-1">{code}</code>
        </p>
      </div>
    ),
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-xl shadow-lg space-y-6">
        <h1 className="text-2xl font-bold text-center">이런!</h1>
        <div className="font-normal text-center text-gray-700 dark:text-gray-400">
          {message[error] || message[ErrorType.Default]}
        </div>
        <div className="items-center justify-center flex gap-x-6">
          <Link
            href="/"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
