import { COOKIES_KEY } from '@/app/utils/constants';
import { ApiBlogResponse, Blog } from '@/app/utils/model';
import axios from 'axios';
import { cookies } from 'next/headers';
import Image from 'next/image';
import qs from 'qs';
import { cache } from 'react';

type PageProps = {
  id: string;
  type: 'blogs' | 'special-blogs';
};

const getBlog: (endpoint: string, options?: object) => Promise<Blog> = cache(async (endpoint, options) => {
  try {
    const { data } = await axios.get<ApiBlogResponse>(`${process.env.STRAPI_API_URL}/${endpoint}`, { ...options });
    return data?.data ?? ({} as Blog);
  } catch (error) {
    console.log('🚀 ~ getBlog ~ error:', error);
    return {} as Blog;
  }
});

export default async function BlogDetailPage({ id, type }: PageProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIES_KEY.SESSION_TOKEN)?.value ?? '';

  const query = qs.stringify(
    {
      populate: ['thumbnail', 'author'],
    },
    { encodeValuesOnly: true },
  );

  const options =
    type === 'special-blogs'
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : {};

  const blog = await getBlog(`${type}/${id}?${query}`, options);

  return (
    <div className="mx-8 my-4 grid gap-2">
      Blog ID: {blog.id}
      {blog.thumbnail && (
        <Image
          src={`${process.env.STRAPI_BASE_URL}${blog.thumbnail.url}`}
          alt={blog.title}
          width={260}
          height={260}
          loading="eager"
          className="w-auto h-auto"
        />
      )}
      <div>{blog.title}</div>
      <div>author by: {blog.author?.name}</div>
    </div>
  );
}
