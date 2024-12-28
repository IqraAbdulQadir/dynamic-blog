// src/components/CommentForm.tsx

import { useState } from 'react';

interface CommentFormProps {
  onSubmit: (comment: string) => void;
}

const CommentForm = ({ onSubmit }: CommentFormProps) => {
  const [comment, setComment] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      onSubmit(comment); // Pass the comment back to the parent component
      setComment(''); // Clear the form after submission
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={comment}
        onChange={handleChange}
        rows={4}
        placeholder="Write a comment..."
        className="w-full p-2 border border-gray-300 rounded-md"
      />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
        Submit
      </button>
    </form>
  );
};

export default CommentForm;
