import { getBlogBySlug } from '@/sanity/lib/sanityQueries'; // Import the function to fetch a blog post by slug
import { notFound } from 'next/navigation'; // For handling 404
import BlogComments from './BlogComments';
import { urlFor } from '@/sanity/lib/image';
import { PortableText } from '@portabletext/react';

// Adjust the type of params to not be a Promise
interface BlogProps {
  params: {
    slug: string;
  };
}

// Make the component async since you're doing async operations
const BlogPost = async ({ params }: BlogProps) => {
  const { slug } = params; // No need for await here as params are directly available
  const blog = await getBlogBySlug(slug); // Fetch blog data

  if (!blog) {
    notFound(); // If no blog found, return a 404
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">{blog.name}</h1>
      <p className="text-xl mb-4 text-gray-600">{blog.subheading}</p>
      {blog.poster && blog.poster.asset && (
        <img
          src={urlFor(blog.poster.asset).width(800).auto('format').url()}
          alt={blog.poster.caption || 'Blog Post Image'}
          className="w-full h-auto mb-4"
        />
      )}
      <div className="prose">
        {/* Use PortableText to render the rich text */}
        <PortableText value={blog.content} />
      </div>
      <BlogComments/>
    </div>
  );
};

export default BlogPost;
