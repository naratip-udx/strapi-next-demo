'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { COOKIES_KEY } from '../utils/constants';

export async function logoutAction() {
  const cookiesStore = await cookies();
  cookiesStore.delete(COOKIES_KEY.SESSION_TOKEN);

  redirect('/login');
}
