'use server';

import axios from 'axios';
import { cookies } from 'next/headers';
import { ApiErrorResponse, User } from '../utils/model';
import { COOKIES_KEY } from '../utils/constants';
import { redirect } from 'next/navigation';

export type formState = {
  message: string;
};

export type LoginResp = {
  jwt: string;
  user?: User;
};

export async function loginAciton(prevState: formState, formData: FormData): Promise<formState> {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const response = await axios.post<LoginResp>(`${process.env.STRAPI_API_URL}/auth/local`, {
      identifier: email,
      password,
    });

    const isProd = process.env.NODE_ENV === 'production';
    const cookieStore = await cookies();
    cookieStore.set(COOKIES_KEY.SESSION_TOKEN, response.data.jwt ?? '', {
      secure: isProd,
      httpOnly: true, // Secure against XSS
      sameSite: isProd ? 'none' : 'lax', // CSRF protection
      maxAge: 60 * 60 * 24, // 1 day
    });
  } catch (error) {
    console.log('🚀 ~ loginAciton ~ error:', error);
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      const errorResponse = error.response?.data;
      return { message: errorResponse?.error?.message ?? 'Login failed' };
    }
    return { message: 'Login failed' };
  }

  redirect('/special-blogs');
}
