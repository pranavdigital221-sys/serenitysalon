import React from 'react';
import { Instagram, Heart, Sparkles } from 'lucide-react';
import { INSTAGRAM_POSTS } from '../../data/mockData';
import { SafeImage } from '../common/SafeImage';

export const InstagramFeedSection: React.FC = () => {
  return (
    <section id="instagram-feed" className="py-16 sm:py-20 px-4 sm:px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6E6E6E] block mb-2">
            Follow Us
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-2">
            Follow Us On <span className="text-[#C9A66B]">Instagram</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#6E6E6E]">
            Tag <span className="text-[#1F3A26] font-bold">@serenitysalon</span> to be featured in our weekly organic clean beauty community gallery.
          </p>
        </div>

        {/* 8 Square Instagram Thumbnails Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4 items-center">
          {INSTAGRAM_POSTS.map((item, idx) => (
            <a
              key={item.id}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative rounded-[18px] overflow-hidden bg-[#F7F5F1] shadow-xs hover:shadow-lg transition-all duration-300 block ${
                item.isFeatured ? 'aspect-square ring-2 ring-[#C9A66B] ring-offset-2 scale-105 z-10' : 'aspect-square'
              }`}
            >
              <SafeImage
                src={item.image}
                alt={item.caption}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                fallbackType="blog"
              />
              
              {/* Dark Green Hover Overlay with Likes */}
              <div className="absolute inset-0 bg-[#1F3A26]/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-2 text-white text-center">
                <Instagram className="w-5 h-5 text-[#C9A66B] mb-1" />
                <span className="text-xs font-bold flex items-center gap-1">
                  <Heart className="w-3 h-3 fill-[#C9A66B] text-[#C9A66B]" />
                  {item.likes}
                </span>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};
