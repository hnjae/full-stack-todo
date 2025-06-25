import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { baseQueryWithReAuth } from 'src/shared/api';
import { selectUserId } from 'src/shared/auth';

interface User {
  id: string;
  email: string;
  createdAt: string;
}

const dynamicBaseQuery: BaseQueryFn<
  string | FetchArgs, // Args
  unknown, // Result
  FetchBaseQueryError // Error
> = async (args, api, extraOptions) => {
  const userId = selectUserId(api.getState() as RootState);

  if (userId == null) {
    return {
      error: {
        status: 401,
        statusText: 'Unauthorized',
        data: 'No user id was found.',
      },
    };
  }

  const urlEnd = typeof args === 'string' ? args : args.url;
  const adjustedUrl = `users/${userId}/${urlEnd}`;
  const adjustedArgs =
    typeof args === 'string' ? adjustedUrl : { ...args, url: adjustedUrl };

  return baseQueryWithReAuth(adjustedArgs, api, extraOptions);
};

/*
NOTE:
- It request API under "<api server>/users/<user id>/"
*/
const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: dynamicBaseQuery,
  endpoints: (build) => ({
    getUserInfo: build.query<User, void>({
      query: () => '',
    }),
  }),
});

export default userApi;
export const { useGetUserInfoQuery } = userApi;
