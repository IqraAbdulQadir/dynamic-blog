import React from 'react'
import FeaturedSection from '../components/Featured'

export default function Blog() {
  return (
    <main className="bg-[#f0f8ff] py-12 min-h-screen flex flex-col">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-[#2f4f4f]">
          AI Insights Blog Posts
        </h2>
        <FeaturedSection/>
        </div>
        </main>
  )
}
