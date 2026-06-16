import BlogDetailPage from '@/components/blog-detail-page';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return (
    <BlogDetailPage
      id={id}
      type="blogs"
    />
  );
}
