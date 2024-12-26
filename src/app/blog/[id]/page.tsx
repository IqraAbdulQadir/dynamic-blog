import { client } from '@/sanity/lib/client';
import { PortableText } from '@portabletext/react';
import BlogComments from './BlogComments';
import Image from 'next/image';

// Define the content interface
interface ContentBlock {
  _type: string;
  children?: { _key?: string; _type: 'span'; text: string; marks?: string[] }[]; // More specific type for children
  markDefs?: { _key: string; _type: string; href: string }[]; // More specific type for markDefs
}

// Define the blog interface
interface BlogPost {
  name: string;
  subheading: string;
  content: ContentBlock[]; // Use the ContentBlock type instead of any[]
  author: string;
  publishedAt: string;
  poster: string;
}

// Adjust the type for `generateMetadata`
export async function generateMetadata({ params }: { params: { id: string } }) {
  const blogPost = await client.fetch(
    `*[_type == 'blog' && _id == $id][0]{
      name
    }`,
    { id: params.id }
  );

  if (blogPost) {
    return { title: blogPost.name };
  }

  return { title: 'Blog Post Not Found' };
}

// Adjust the type for dynamic route
export default async function BlogPostPage({ params }: { params: { id: string } }) {
  const { id } = params; // Get the dynamic route parameter 'id'

  // Fetch the blog post data from Sanity CMS
  const blogPost: BlogPost | null = await client.fetch(
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

  // If no blog post is found, display a not found message
  if (!blogPost) {
    return <div className="text-center">Blog post not found!</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen flex flex-col">
      <h1 className="text-4xl font-bold text-[#2f4f4f] mb-4">{blogPost.name}</h1>
      <p className="text-[#555] text-sm mb-4">
        By {blogPost.author} | {new Date(blogPost.publishedAt).toLocaleDateString()}
      </p>
      {blogPost.poster && (
        <Image
          src={blogPost.poster}
          alt={blogPost.name}
          width={800} // Specify appropriate width
          height={600} // Specify appropriate height
          className="w-full h-96 object-cover rounded-lg mb-6"
        />
      )}
      <div className="prose mb-12">
        <PortableText
          value={blogPost.content}
          components={{
            block: {
              h1: ({ children }) => <h1 className="text-2xl font-bold">{children}</h1>,
              h2: ({ children }) => <h2 className="text-xl font-semibold">{children}</h2>,
              normal: ({ children }) => <p className="text-base leading-relaxed">{children}</p>,
            },
          }}
        />
      </div>

      {/* Pass control to the Client Component for Blog Comments */}
      <BlogComments />
    </div>
  );
}
