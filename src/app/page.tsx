'use client';

import { useState, useEffect, use } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, Heart, Calendar, MessageSquare, Play, Video, Search, ChevronRight } from 'lucide-react';
import { db, Post, Category, MediaItem } from '@/lib/supabase';

// Định nghĩa props để nhận searchParams trong Next.js 15+
interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function Home({ searchParams }: PageProps) {
  // Giải nén các search params bằng React.use()
  const params = use(searchParams);
  const categoryId = typeof params.category === 'string' ? params.category : undefined;
  const searchQuery = typeof params.search === 'string' ? params.search : undefined;

  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [fetchedCategories, fetchedPosts, fetchedMedia] = await Promise.all([
          db.getCategories(),
          db.getPosts({ categoryId, search: searchQuery }),
          db.getMedia(),
        ]);
        setCategories(fetchedCategories);
        setPosts(fetchedPosts);
        setMediaItems(fetchedMedia.slice(0, 3)); // Lấy 3 mục đa phương tiện mới nhất
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu trang chủ:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [categoryId, searchQuery]);

  // Tìm tên danh mục đang chọn
  const activeCategory = categories.find(c => c.id === categoryId);

  // Tìm bài viết nổi bật (featured) hoặc bài viết đầu tiên nếu không có bài nổi bật
  const featuredPost = posts.find(p => p.is_featured) || posts[0];
  const otherPosts = posts.filter(p => p.id !== featuredPost?.id);

  // Trình phát nhạc podcast nhỏ / Video preview
  const [playingMedia, setPlayingMedia] = useState<MediaItem | null>(null);

  const getCategoryName = (id: string) => {
    return categories.find(c => c.id === id)?.name || 'Tin tức';
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted text-sm font-medium">Đang tải tin tức mới nhất...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Search/Category Title Header */}
      {(activeCategory || searchQuery) && (
        <div className="bg-card-bg p-6 rounded-2xl border border-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Kết quả lọc</span>
            <h1 className="text-2xl font-bold mt-1 text-foreground">
              {activeCategory ? `Chuyên mục: ${activeCategory.name}` : `Tìm kiếm cho: "${searchQuery}"`}
            </h1>
          </div>
          <Link href="/" className="text-sm font-medium text-accent hover:underline flex items-center gap-1">
            Xóa bộ lọc <ChevronRight size={16} />
          </Link>
        </div>
      )}

      {/* Main Layout: Featured Hero on Top & Quick Scan List Below */}
      {posts.length > 0 ? (
        <div className="space-y-10">
          {/* Featured Hero (Full Width / Split with premium gradient backdrop) */}
          {featuredPost && (
            <div className="group">
              <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-emerald-900 rounded-3xl overflow-hidden border border-emerald-800 hover:shadow-2xl transition-all duration-500 grid grid-cols-1 lg:grid-cols-2 gap-6 relative shadow-lg">
                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-accent/15 rounded-full blur-3xl pointer-events-none" />
                
                <Link href={`/posts/${featuredPost.slug}`} className="relative block aspect-[16/10] lg:aspect-auto h-64 lg:h-full min-h-[320px] overflow-hidden bg-black">
                  <img
                    src={featuredPost.cover_image}
                    alt={featuredPost.title}
                    className="object-cover w-full h-full opacity-90 group-hover:scale-103 transition-transform duration-700"
                  />
                  {featuredPost.is_longform && (
                    <span className="absolute top-4 left-4 bg-accent text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                      Longform
                    </span>
                  )}
                  <span className="absolute bottom-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                    {getCategoryName(featuredPost.category_id)}
                  </span>
                </Link>

                <div className="p-6 sm:p-8 flex flex-col justify-between relative z-10 text-white">
                  <div className="space-y-4">
                    <span className="text-xs font-bold text-accent uppercase tracking-widest">Tiêu điểm nổi bật</span>
                    <Link href={`/posts/${featuredPost.slug}`} className="block">
                      <h2 className="text-xl sm:text-3xl font-extrabold text-white group-hover:text-accent transition-colors leading-tight">
                        {featuredPost.title}
                      </h2>
                    </Link>
                    <p className="text-emerald-100/80 text-sm sm:text-base leading-relaxed line-clamp-4">
                      {featuredPost.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-emerald-200/80 font-medium mt-6 pt-6 border-t border-emerald-800/60">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-accent" />
                      <span>{formatDate(featuredPost.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Eye size={14} /> {featuredPost.views} lượt xem
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart size={14} className="text-red-400 fill-red-400/20" /> {featuredPost.likes} lượt thích
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Scan List (Bảng quét tin nhanh) */}
          <div className="bg-card-bg border border-border rounded-3xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-border bg-muted-bg/30 flex items-center justify-between">
              <h3 className="font-extrabold text-foreground text-sm sm:text-md uppercase tracking-wider border-l-4 border-primary pl-3">
                Bảng quét tin nhanh (Scan Dashboard)
              </h3>
              <span className="text-xs text-muted font-semibold">Tổng số: {otherPosts.length} tin bài</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted-bg/10 text-muted font-bold text-xs uppercase tracking-wider">
                    <th className="p-4 w-28 sm:w-36">Thời gian</th>
                    <th className="p-4 w-28 sm:w-32">Chuyên mục</th>
                    <th className="p-4">Tiêu đề bài viết</th>
                    <th className="p-4 w-20 sm:w-24 text-right">Lượt đọc</th>
                    <th className="p-4 w-20 sm:w-24 text-right">Thích</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground">
                  {otherPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-muted-bg/15 transition-colors group">
                      <td className="p-4 text-xs font-mono text-muted">
                        {formatDate(post.created_at)}
                      </td>
                      <td className="p-4">
                        <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-block">
                          {getCategoryName(post.category_id)}
                        </span>
                      </td>
                      <td className="p-4">
                        <Link href={`/posts/${post.slug}`} className="font-bold text-foreground group-hover:text-primary transition-colors block line-clamp-1 leading-snug">
                          {post.title}
                          {post.is_longform && (
                            <span className="ml-2 bg-accent/10 text-accent text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase inline-block">
                              Longform
                            </span>
                          )}
                        </Link>
                      </td>
                      <td className="p-4 text-right font-mono text-xs text-muted">
                        {post.views}
                      </td>
                      <td className="p-4 text-right font-mono text-xs text-muted">
                        {post.likes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-card-bg rounded-3xl border border-border">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted-bg flex items-center justify-center text-muted mb-4">
            <Search size={28} />
          </div>
          <h2 className="text-xl font-bold text-foreground">Không tìm thấy bài viết nào</h2>
          <p className="text-muted text-sm mt-2">Hãy thử đổi từ khóa tìm kiếm hoặc lọc danh mục khác.</p>
          <Link href="/" className="inline-block mt-6 px-6 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow-sm transition-all duration-300">
            Quay lại trang chủ
          </Link>
        </div>
      )}

      {/* Multimedia Segment (Bản tin Đa phương tiện) */}
      {mediaItems.length > 0 && (
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 border border-primary/20 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-accent uppercase tracking-widest">Không gian trải nghiệm</span>
              <h2 className="text-2xl font-extrabold text-foreground flex items-center gap-2 mt-1">
                <Play size={24} className="fill-primary text-primary" /> Đồng Hành Multimedia
              </h2>
            </div>
            <Link href="/multimedia" className="text-sm font-semibold text-primary hover:text-primary-hover flex items-center gap-1">
              Xem tất cả Podcast & Video <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mediaItems.map((item) => (
              <div key={item.id} className="bg-card-bg border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                <div className="relative aspect-[16/10] overflow-hidden group bg-black">
                  <img
                    src={item.cover_image}
                    alt={item.title}
                    className="object-cover w-full h-full opacity-90 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <button
                      onClick={() => setPlayingMedia(item)}
                      className="w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-300"
                      aria-label="Play Media"
                    >
                      {item.type === 'video' ? <Video size={20} className="fill-primary" /> : <Play size={20} className="fill-primary ml-0.5" />}
                    </button>
                  </div>
                  <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-semibold px-2 py-0.5 rounded backdrop-blur-xs">
                    {item.duration}
                  </span>
                  <span className="absolute top-3 left-3 bg-accent text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {item.type === 'podcast' ? 'Podcast' : 'Video'}
                  </span>
                </div>
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <h4 className="text-sm font-bold text-foreground line-clamp-2 leading-snug">
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

          {/* Quick Media Player (Audio/Video Modal or bottom bar) */}
          {playingMedia && (
            <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-card-bg border border-primary/30 rounded-2xl shadow-2xl p-4 animate-slide-up text-foreground">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <img
                    src={playingMedia.cover_image}
                    alt=""
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-primary uppercase">{playingMedia.type}</h5>
                    <p className="text-xs font-semibold text-foreground line-clamp-2 mt-0.5 leading-snug">{playingMedia.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setPlayingMedia(null)}
                  className="text-muted hover:text-foreground text-sm font-bold p-1 rounded-full hover:bg-muted-bg"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4">
                {playingMedia.type === 'video' ? (
                  <video src={playingMedia.url} controls autoPlay className="w-full rounded-lg max-h-40" />
                ) : (
                  <audio src={playingMedia.url} controls autoPlay className="w-full mt-2" />
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Grid Categories Section */}
      {posts.length > 0 && !categoryId && !searchQuery && (
        <section className="space-y-6">
          <h3 className="text-lg font-bold text-foreground border-l-4 border-primary pl-3 uppercase tracking-wider">
            Chuyên mục chọn lọc
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.slice(0, 3).map((cat) => {
              const catPosts = posts.filter(p => p.category_id === cat.id).slice(0, 3);
              if (catPosts.length === 0) return null;
              return (
                <div key={cat.id} className="bg-card-bg border border-border p-5 rounded-2xl shadow-xs space-y-4 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <h4 className="font-extrabold text-foreground text-md uppercase tracking-wider">{cat.name}</h4>
                    <Link href={`/?category=${cat.id}`} className="text-xs font-semibold text-primary hover:underline">
                      Xem tất cả
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {catPosts.map((post) => (
                      <Link key={post.id} href={`/posts/${post.slug}`} className="block group">
                        <h5 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                          {post.title}
                        </h5>
                        <p className="text-[11px] text-muted mt-1">{formatDate(post.created_at)}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
