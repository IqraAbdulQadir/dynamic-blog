import { client } from '@/sanity/lib/client';
import { PortableText } from '@portabletext/react';
import BlogComments from './BlogComments';
import Image from 'next/image';

// Define the BlogPost type
interface BlogPost {
  name: string;
  subheading: string;
  content: any[];
  author: string;
  publishedAt: string;
  poster: string;
}

// Generate metadata for the blog post
export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = await params; // Await params to access the id
  const blogPost = await client.fetch(
    `*[_type == 'blog' && _id == $id][0]{ name }`,
    { id }
  );
  return { title: blogPost?.name || 'Blog Post Not Found' };
}

// Blog post page component
export default async function BlogPostPage({ params }: { params: { id: string } }) {
  const { id } = await params; // Await params to access the id
  const blogPost = await client.fetch(
    `*[_type == 'blog' && _id == $id][0]{
      name,
      subheading,
      content,
      author,
      publishedAt,
      "poster": poster.asset->url
    }`,
    { id }
  );

  if (!blogPost) {
    return <div className="text-center">Blog post not found!</div>;
  }

  const { name, author, publishedAt, poster, content } = blogPost;

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-4xl font-bold text-[#2f4f4f] mb-4">{name}</h1>
      <p className="text-sm text-[#555] mb-4">
        By {author} | {new Date(publishedAt).toLocaleDateString()}
      </p>
      {poster && (
        <Image
          src={poster}
          alt={name}
          width={800}
          height={600}
          className="w-full h-96 object-cover rounded-lg mb-6"
        />
      )}
      <div className="prose mb-12">
        <PortableText
          value={content}
          components={{
            block: {
              h1: ({ children }) => <h1 className="text-2xl font-bold">{children}</h1>,
              h2: ({ children }) => <h2 className="text-xl font-semibold">{children}</h2>,
              normal: ({ children }) => <p className="text-base leading-relaxed">{children}</p>,
            },
          }}
        />
      </div>
      <BlogComments />
    </div>
  );
}
