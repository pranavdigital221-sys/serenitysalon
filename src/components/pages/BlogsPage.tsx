import React, { useState } from 'react';
import { Calendar, User, Clock, ArrowRight, ArrowLeft, Share2, Sparkles, BookOpen, Quote } from 'lucide-react';
import { BLOG_POSTS } from '../../data/mockData';
import { BlogPost, PageView } from '../../types';
import { SafeImage } from '../common/SafeImage';

interface BlogsPageProps {
  selectedPost: BlogPost | null;
  onSelectPost: (post: BlogPost | null) => void;
  onNavigate: (page: PageView) => void;
}

export const BlogsPage: React.FC<BlogsPageProps> = ({
  selectedPost,
  onSelectPost,
  onNavigate,
}) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Skincare Rituals', 'Ingredient Spotlight', 'Self Care Rituals'];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    if (activeCategory === 'All') return true;
    return post.category === activeCategory;
  });

  // Single Article View (as specified in 6.3)
  if (selectedPost) {
    const relatedPosts = BLOG_POSTS.filter((p) => p.id !== selectedPost.id);

    return (
      <div className="bg-[#F7F5F1] min-h-screen py-10 sm:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-[32px] p-6 sm:p-12 shadow-sm border border-[#1F3A26]/8">
          
          {/* Back to Blog List */}
          <button
            onClick={() => onSelectPost(null)}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#1F3A26] hover:text-[#C9A66B] mb-6 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Blogs</span>
          </button>

          {/* Category Badge & Meta */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#6E6E6E] mb-4">
            <span className="bg-[#FDF1E4] text-[#1F3A26] font-bold px-3 py-1 rounded-full border border-[#C9A66B]/30">
              {selectedPost.category}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#C9A66B]" />
              {selectedPost.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#C9A66B]" />
              {selectedPost.readTime}
            </span>
          </div>

          {/* Article Title */}
          <h1 className="font-heading font-bold text-2xl sm:text-4xl md:text-[40px] text-[#1A1A1A] leading-tight mb-6">
            {selectedPost.title}
          </h1>

          {/* Author Card */}
          <div className="flex items-center gap-3 pb-6 mb-8 border-b border-gray-100">
            <SafeImage
              src={selectedPost.author.avatar}
              alt={selectedPost.author.name}
              className="w-12 h-12 rounded-full object-cover border border-[#C9A66B]/40"
              fallbackType="avatar"
            />
            <div>
              <span className="font-heading font-bold text-sm text-[#1A1A1A] block">
                {selectedPost.author.name}
              </span>
              <span className="text-xs text-[#6E6E6E]">
                {selectedPost.author.role}
              </span>
            </div>
          </div>

          {/* Featured Large Image */}
          <div className="aspect-[16/9] rounded-[24px] overflow-hidden mb-8 shadow-md">
            <SafeImage
              src={selectedPost.image}
              alt={selectedPost.title}
              className="w-full h-full object-cover"
              fallbackType="blog"
            />
          </div>

          {/* Article Body Content */}
          <div className="prose max-w-none text-[#1A1A1A] space-y-5 text-sm sm:text-base leading-relaxed">
            {selectedPost.content.map((paragraph, idx) => (
              <p key={idx} className="text-[#4A4A4A]">
                {paragraph}
              </p>
            ))}

            {/* Pull-Quote styled in Gold (as requested in 6.3) */}
            <div className="my-8 p-6 rounded-2xl bg-[#F7F5F1] border-l-4 border-[#C9A66B] flex items-start gap-4">
              <Quote className="w-8 h-8 text-[#C9A66B] shrink-0 fill-current" />
              <div>
                <p className="font-heading font-semibold text-base sm:text-lg text-[#1F3A26] italic">
                  "True dermal restoration does not come from stripping the protective acid mantle, but feeding the microbiome with unadulterated cold-pressed seed omegas."
                </p>
                <span className="text-xs font-bold text-[#C9A66B] uppercase tracking-wider block mt-2">
                  — Holistic Esthetic Principles
                </span>
              </div>
            </div>

            <p className="text-[#4A4A4A]">
              When curating your personalized skincare ritual, listen to your skin's daily feedback. Atmospheric changes, stress levels, and hydration all influence lipid barrier resilience.
            </p>
          </div>

          {/* Tags */}
          <div className="pt-8 mt-8 border-t border-gray-100 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-[#1F3A26]">Tags:</span>
            {selectedPost.tags.map((tag) => (
              <span key={tag} className="text-xs bg-[#F7F5F1] text-[#1F3A26] px-3 py-1 rounded-full font-medium">
                #{tag}
              </span>
            ))}
          </div>

          {/* Related Posts Section (as requested in 6.3) */}
          <div className="mt-14 pt-10 border-t border-gray-200">
            <h3 className="font-heading font-bold text-xl text-[#1F3A26] mb-6">
              Related Botanical Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.slice(0, 2).map((post) => (
                <div
                  key={post.id}
                  onClick={() => onSelectPost(post)}
                  className="bg-[#F7F5F1] p-4 rounded-2xl flex gap-4 items-center group cursor-pointer hover:shadow-md transition-all"
                >
                  <SafeImage
                    src={post.image}
                    alt={post.title}
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                    fallbackType="blog"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-[#C9A66B] uppercase block">
                      {post.category}
                    </span>
                    <h4 className="font-heading font-bold text-xs sm:text-sm text-[#1A1A1A] group-hover:text-[#1F3A26] line-clamp-2">
                      {post.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Blog Listing View
  return (
    <div className="bg-[#F7F5F1] min-h-screen">
      
      {/* Banner */}
      <section className="relative bg-[#1F3A26] text-white py-14 sm:py-20 px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#C9A66B] uppercase tracking-wider mb-3">
            <button onClick={() => onNavigate('home')} className="hover:underline">Home</button>
            <span>/</span>
            <span className="text-white">Botanical Journals</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl font-bold mb-3">
            Our Latest <span className="text-[#C9A66B]">News &amp; Blogs</span>
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-xl mx-auto">
            Expert esthetician advice, ingredient breakdowns, and daily holistic self-care rituals for glowing skin.
          </p>
        </div>
      </section>

      {/* Blog Cards & Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        
        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#1F3A26] text-white shadow-md'
                  : 'bg-white text-[#1A1A1A] hover:bg-gray-200 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="bg-white rounded-[24px] overflow-hidden border border-[#1F3A26]/8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#F7F5F1]">
                <SafeImage
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  fallbackType="blog"
                />
                <span className="absolute top-3 left-3 bg-[#FDF1E4] text-[#1F3A26] text-[11px] font-bold px-3 py-1 rounded-full shadow-xs border border-[#C9A66B]/30">
                  {post.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs text-[#6E6E6E] mb-3">
                    <span className="flex items-center gap-1 font-medium">
                      <User className="w-3.5 h-3.5 text-[#C9A66B]" />
                      {post.author.name}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#C9A66B]" />
                      {post.date}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-lg text-[#1A1A1A] group-hover:text-[#1F3A26] transition-colors line-clamp-2 leading-snug mb-3">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#6E6E6E] line-clamp-3 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1F3A26] group-hover:text-[#C9A66B] inline-flex items-center gap-1.5 transition-colors">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="text-[11px] text-gray-400 font-medium">
                    {post.readTime}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
