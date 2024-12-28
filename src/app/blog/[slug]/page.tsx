// import { client } from '@/sanity/lib/client';
// import { PortableText } from '@portabletext/react';
// import BlogComments from './BlogComments';
// import Image from 'next/image';
// import { PortableTextBlock } from '@portabletext/types';

// // Define the BlogPost type
// interface BlogPost {
//   name: string;
//   subheading: string;
//   content: PortableTextBlock[];
//   author: string;
//   publishedAt: string;
//   poster: string;
// }

// // Generate metadata for the blog post
// export async function generateMetadata({ params }: { params: { id: string } }) {
//   const { id } = params;
//   const blogPost = await client.fetch(
//     `*[_type == 'blog' && _id == $id][0]{ name }`,
//     { id }
//   );
//   return { title: blogPost?.name || 'Blog Post Not Found' };
// }

// // Blog post page component
// export default async function BlogPostPage({ params }: { params: { id: string } }) {
//   const { id } = params;
//   const blogPost: BlogPost | null = await client.fetch(
//     `*[_type == 'blog' && _id == $id][0]{
//       name,
//       subheading,
//       content,
//       author,
//       publishedAt,
//       "poster": poster.asset->url
//     }`,
//     { id }
//   );

//   if (!blogPost) {
//     return <div className="text-center">Blog post not found!</div>;
//   }

//   const { name, author, publishedAt, poster, content } = blogPost;

//   return (
//     <div className="container mx-auto px-4 py-12 min-h-screen">
//       <h1 className="text-4xl font-bold text-[#2f4f4f] mb-4">{name}</h1>
//       <p className="text-sm text-[#555] mb-4">
//         By {author} | {new Date(publishedAt).toLocaleDateString()}
//       </p>
//       {poster && (
//         <Image
//           src={poster}
//           alt={name}
//           width={800}
//           height={600}
//           className="w-full h-96 object-cover rounded-lg mb-6"
//         />
//       )}
//       <div className="prose mb-12">
//         <PortableText
//           value={content}
//           components={{
//             block: {
//               h1: ({ children }) => <h1 className="text-2xl font-bold">{children}</h1>,
//               h2: ({ children }) => <h2 className="text-xl font-semibold">{children}</h2>,
//               normal: ({ children }) => <p className="text-base leading-relaxed">{children}</p>,
//             },
//           }}
//         />
//       </div>
//       <BlogComments />
//     </div>
//   );
// }


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
