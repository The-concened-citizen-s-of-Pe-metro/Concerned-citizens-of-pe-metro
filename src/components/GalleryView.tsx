import React, { useState } from 'react';
import { Image as ImageIcon, MapPin, Calendar, X, Eye, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GalleryItem } from '../types';

export const GalleryView: React.FC = () => {
  const { gallery } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);

  const filteredGallery = gallery.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
            Field Evidence & Community Moments
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Photo Gallery: Community Relief in Action
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Real photos capturing our volunteers, soup kitchens, cleanups, water tankers, and patrols across Nelson Mandela Bay.
          </p>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'All Photos' },
            { id: 'soup-kitchen', label: 'Soup Kitchens' },
            { id: 'water-relief', label: 'Water Relief' },
            { id: 'cleanup', label: 'Cleanups' },
            { id: 'patrol', label: 'Patrols' },
            { id: 'school-outreach', label: 'School Outreach' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                selectedCategory === tab.id
                  ? 'bg-red-600 text-white font-bold shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGallery.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveImage(item)}
            className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden cursor-pointer hover:border-red-500/50 transition transform hover:-translate-y-1 shadow-md"
          >
            <div className="h-64 overflow-hidden relative">
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

              <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur">
                {item.category.replace('-', ' ')}
              </span>

              <div className="absolute bottom-3 left-3 right-3 space-y-1">
                <h4 className="text-white font-bold text-sm leading-snug group-hover:text-amber-300 transition-colors">
                  {item.title}
                </h4>
                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-red-400" />
                    {item.location}
                  </span>
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveImage(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activeImage.image_url}
                alt={activeImage.title}
                className="max-h-[70vh] w-full object-contain"
              />
            </div>

            <div className="p-6 space-y-2 bg-slate-900">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-red-400">
                  {activeImage.category.replace('-', ' ')}
                </span>
                <span className="text-xs text-slate-400">{activeImage.date}</span>
              </div>
              <h3 className="text-xl font-bold text-white">{activeImage.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300">{activeImage.description}</p>
              <div className="flex items-center gap-2 pt-2 text-xs text-slate-400">
                <MapPin className="w-4 h-4 text-red-400" />
                <span>{activeImage.location}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
