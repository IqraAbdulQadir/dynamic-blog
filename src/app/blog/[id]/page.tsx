import { client } from '@/sanity/lib/client';
import { PortableText } from '@portabletext/react';
import BlogComments from './BlogComments';

// Define the blog interface
interface BlogPost {
  name: string;
  subheading: string;
  content: any[];
  author: string;
  publishedAt: string;
  poster: string;
}

interface Props {
  params: {
    id: string;
  };
}

export default async function BlogPostPage({ params }: Props) {
  // Await params
  const { id } = await params; // This line ensures we await the params

  // Fetch blog post data
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
        <img
          src={blogPost.poster}
          alt={blogPost.name}
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

      {/* Pass control to the Client Component */}
      <BlogComments />
    </div>
  );
}
