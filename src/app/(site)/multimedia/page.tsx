'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db, MediaItem, Post } from '@/lib/supabase';
import { Play, Video, Eye, Calendar, ArrowLeft, Headphones, Radio } from 'lucide-react';

export default function MultimediaPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [longformPosts, setLongformPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'podcast' | 'video'>('all');
  const [loading, setLoading] = useState(true);
  const [playingItem, setPlayingItem] = useState<MediaItem | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [fetchedMedia, fetchedPosts] = await Promise.all([
          db.getMedia(),
          db.getPosts(),
        ]);
        setMediaList(fetchedMedia);
        // Lấy bài viết dạng Longform
        setLongformPosts(fetchedPosts.filter(p => p.is_longform));
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu multimedia:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredMedia = mediaList.filter(item => {
    if (activeTab === 'all') return true;
    return item.type === activeTab;
  });

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted text-sm font-medium">Đang tải trải nghiệm đa phương tiện...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover transition-colors">
          <ArrowLeft size={16} /> Quay lại trang chủ
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground flex items-center gap-2">
              <Radio className="text-accent animate-pulse" /> Arito Multimedia
            </h1>
            <p className="text-sm text-muted mt-1">Nơi tổng hợp các nội dung số: Podcast, Video và các chuyên đề Longform sắc nét.</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex bg-muted-bg p-1 rounded-full border border-border self-start">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTab === 'all' ? 'bg-primary text-white shadow-xs' : 'text-muted hover:text-foreground'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setActiveTab('podcast')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                activeTab === 'podcast' ? 'bg-primary text-white shadow-xs' : 'text-muted hover:text-foreground'
              }`}
            >
              <Headphones size={12} /> Podcast
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                activeTab === 'video' ? 'bg-primary text-white shadow-xs' : 'text-muted hover:text-foreground'
              }`}
            >
              <Video size={12} /> Video
            </button>
          </div>
        </div>
      </div>

      {/* Main Player Area if playing */}
      {playingItem && (
        <section className="bg-card-bg border border-primary/20 rounded-3xl p-6 shadow-xl animate-fade-in text-foreground">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Player Container */}
            <div className="lg:w-2/3 bg-black rounded-2xl overflow-hidden aspect-video flex items-center justify-center relative border border-border">
              {playingItem.type === 'video' ? (
                <video src={playingItem.url} controls autoPlay className="w-full h-full object-contain" />
              ) : (
                <div className="flex flex-col items-center justify-center space-y-4 p-8 w-full text-center">
                  <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                    <Headphones size={48} className="text-primary" />
                  </div>
                  <h4 className="text-lg font-bold px-4">{playingItem.title}</h4>
                  <audio src={playingItem.url} controls autoPlay className="w-full max-w-md pt-4" />
                </div>
              )}
            </div>

            {/* Now Playing Info */}
            <div className="lg:w-1/3 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-extrabold text-accent bg-accent/10 px-3 py-1 rounded-full uppercase tracking-wider">
                  Đang phát {playingItem.type}
                </span>
                <h3 className="text-xl font-extrabold text-foreground leading-tight">
                  {playingItem.title}
                </h3>
                <div className="flex items-center gap-4 text-xs text-muted font-medium pt-3">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {formatDate(playingItem.created_at)}</span>
                  <span className="flex items-center gap-1"><Eye size={14} /> {playingItem.views} lượt xem</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-muted-bg border border-border">
                <p className="text-xs text-muted leading-relaxed">
                  Nghe trực tuyến chất lượng cao. Các bản tin podcast được sản xuất hàng tuần bởi Ban biên tập Tin tức Công nghệ doanh nghiệp.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Grid of Podcasts & Videos */}
      <section className="space-y-6">
        <h3 className="text-lg font-bold text-foreground border-l-4 border-primary pl-3 uppercase tracking-wider">
          Danh sách nghe nhìn
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setPlayingItem(item);
                // Scroll to top player if set
                window.scrollTo({ top: 120, behavior: 'smooth' });
              }}
              className="bg-card-bg border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full cursor-pointer group"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-black">
                <img
                  src={item.cover_image}
                  alt={item.title}
                  className="object-cover w-full h-full opacity-90 group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <span className="w-12 h-12 rounded-full bg-white/95 text-primary flex items-center justify-center shadow-md group-hover:scale-105 active:scale-95 transition-all">
                    {item.type === 'video' ? <Video size={20} className="fill-primary" /> : <Play size={20} className="fill-primary ml-0.5" />}
                  </span>
                </div>
                <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-semibold px-2 py-0.5 rounded">
                  {item.duration}
                </span>
                <span className="absolute top-3 left-3 bg-accent text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {item.type}
                </span>
              </div>
              <div className="p-4 flex-grow flex flex-col justify-between">
                <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                  {item.title}
                </h4>
                <div className="flex items-center justify-between text-xs text-muted font-medium mt-4 pt-3 border-t border-border">
                  <span>{formatDate(item.created_at)}</span>
                  <span className="flex items-center gap-1">
                    <Eye size={12} /> {item.views} lượt xem
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Longform Specials (Bài viết chuyên sâu) */}
      {longformPosts.length > 0 && (
        <section className="space-y-6 pt-10 border-t border-border">
          <div>
            <span className="text-xs font-bold text-accent uppercase tracking-widest">Định dạng đặc biệt</span>
            <h3 className="text-2xl font-extrabold text-foreground flex items-center gap-2 mt-1">
              Chuyên mục Longform & Ký sự
            </h3>
            <p className="text-sm text-muted mt-1">Các bài viết chuyên sâu được trình bày với thiết kế đồ họa ấn tượng.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {longformPosts.map((post) => (
              <div key={post.id} className="relative bg-black rounded-3xl overflow-hidden aspect-[16/9] border border-border group">
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="absolute inset-0 object-cover w-full h-full opacity-60 group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-6 sm:p-8 flex flex-col justify-end">
                  <div className="space-y-3">
                    <span className="bg-primary text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                      LONGFORM SPECIAL
                    </span>
                    <Link href={`/posts/${post.slug}`}>
                      <h4 className="text-lg sm:text-xl font-extrabold text-white hover:text-primary transition-colors line-clamp-2 leading-tight">
                        {post.title}
                      </h4>
                    </Link>
                    <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                      {post.summary}
                    </p>
                    <div className="flex items-center gap-4 text-[11px] text-gray-400 pt-3 border-t border-white/10">
                      <span>{formatDate(post.created_at)}</span>
                      <span>•</span>
                      <span>{post.views} lượt xem</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
