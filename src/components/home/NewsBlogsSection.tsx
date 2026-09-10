import React from 'react';
import { ArrowRight, Calendar, User, Clock } from 'lucide-react';
import { BLOG_POSTS } from '../../data/mockData';
import { BlogPost, PageView } from '../../types';
import { SafeImage } from '../common/SafeImage';

interface NewsBlogsSectionProps {
  onSelectBlog: (post: BlogPost) => void;
  onNavigate: (page: PageView) => void;
}

export const NewsBlogsSection: React.FC<NewsBlogsSectionProps> = ({ onSelectBlog, onNavigate }) => {
  return (
    <section id="news-blogs-section" className="py-16 sm:py-24 px-4 sm:px-6 bg-[#F7F5F1]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6E6E6E] block mb-2">
              News & Blogs
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1A1A1A]">
              Our Latest <span className="text-[#C9A66B]">News & Blogs</span>
            </h2>
          </div>

          <button
            onClick={() => onNavigate('blogs')}
            className="px-6 py-2.5 rounded-full bg-[#1F3A26] hover:bg-[#4F7358] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <span>View All Blogs</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C9A66B]" />
          </button>
        </div>

        {/* 3 Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {BLOG_POSTS.map((post) => (
            <div
              key={post.id}
              onClick={() => onSelectBlog(post)}
              className="bg-white rounded-[24px] overflow-hidden border border-[#1F3A26]/8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              {/* Image with Tag Badge */}
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

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Meta: Author & Date & Read Time */}
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

                  {/* 2-line Title */}
                  <h3 className="font-heading font-bold text-lg text-[#1A1A1A] group-hover:text-[#1F3A26] transition-colors line-clamp-2 leading-snug mb-3">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs sm:text-sm text-[#6E6E6E] line-clamp-2 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                </div>

                {/* Read More Link */}
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
    </section>
  );
};
