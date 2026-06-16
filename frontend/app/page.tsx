import { format } from '@formkit/tempo';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import qs from 'qs';
import { cache } from 'react';
import { ApiBlogsResponse, Blog } from './utils/model';

const getBlogs: () => Promise<Blog[]> = cache(async () => {
  try {
    const query = qs.stringify(
      {
        populate: ['author'],
        sort: ['publishedAt:desc'],
      },
      { encodeValuesOnly: true },
    );

    const { data } = await axios.get<ApiBlogsResponse>(`${process.env.STRAPI_API_URL}/blogs?${query}`);
    return data?.data ?? [];
  } catch (error) {
    console.log('🚀 ~ getBlogs ~ error:', error);
    return [];
  }
});

export default async function Page() {
  const blogs = await getBlogs();

  return (
    <div className="bg-white py-24 sm:py-32">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-6 lg:px-8 mx-auto max-w-7xl px-6 lg:px-8"
        >
          <div className="hidden lg:flex lg:gap-x-12">
            <a
              href="#"
              className="text-sm/6 font-semibold text-gray-900"
            >
              Product
            </a>
            <a
              href="#"
              className="text-sm/6 font-semibold text-gray-900"
            >
              Features
            </a>
            <a
              href="#"
              className="text-sm/6 font-semibold text-gray-900"
            >
              Marketplace
            </a>
            <a
              href="#"
              className="text-sm/6 font-semibold text-gray-900"
            >
              Company
            </a>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Link
              href={`/login`}
              className="text-sm/6 font-semibold text-gray-900"
            >
              Log in <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </nav>
      </header>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">Blog Page</h2>
          <p className="mt-2 text-lg/8 text-gray-600">Strapi CMS and Next.js Demo</p>
        </div>
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="flex max-w-xl flex-col items-start justify-between"
            >
              <div className="flex items-center gap-x-4 text-xs">
                <time
                  dateTime={blog.publishedAt}
                  className="text-gray-500"
                >
                  {format(blog.publishedAt, { date: 'medium', time: 'short' })}
                </time>
              </div>
              <div className="group relative grow">
                <h3 className="mt-3 text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600">
                  <Link href={`/blogs/${blog.documentId}`}>
                    <span className="absolute inset-0"></span>
                    {blog.title}
                  </Link>
                </h3>
                <p className="mt-5 line-clamp-3 text-sm/6 text-gray-600">{blog.description}</p>
              </div>
              <div className="relative mt-8 flex items-center gap-x-4 justify-self-end">
                <Image
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt={blog.author?.name ?? 'Author'}
                  width={40}
                  height={40}
                  className="rounded-full bg-gray-50"
                />
                <div className="text-sm/6">
                  <div className="font-semibold text-gray-900">
                    <span className="absolute inset-0"></span>
                    {blog.author?.name}
                  </div>
                  <p className="text-gray-600">Co-Founder / CTO</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
