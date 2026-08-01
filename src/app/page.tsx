'use client';

import { useState, useEffect, use } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, Heart, Calendar, MessageSquare, Play, Video, Search, ChevronRight, ChevronLeft } from 'lucide-react';
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

  // Lấy các bài viết nổi bật (hoặc tối đa 4 bài đầu tiên) cho Carousel
  const featuredPosts = posts.filter(p => p.is_featured);
  const carouselPosts: Post[] = [...featuredPosts];
  for (const post of posts) {
    if (carouselPosts.length >= 4) break;
    if (!carouselPosts.find(p => p.id === post.id)) {
      carouselPosts.push(post);
    }
  }

  const remainingPosts = posts.filter(p => !carouselPosts.find(cp => cp.id === p.id));
  const secondaryFeaturedPosts = remainingPosts.slice(0, 3);
  const finalRemainingPosts = remainingPosts;

  // State quản lý slide hiện tại của Carousel
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredScanIdx, setHoveredScanIdx] = useState<number | null>(0); // Quản lý dòng mở rộng ở Bảng quét tin nhanh (mặc định dòng đầu)
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (carouselPosts.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % carouselPosts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselPosts.length, isHovered]);

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

      {/* Main Layout: Featured Hero Grid on Top & Quick Scan List Below */}
      {posts.length > 0 ? (
        <div className="space-y-10">
          {/* Hybrid Grid Layout: Carousel (2/3 width) & Side Posts (1/3 width) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Featured Auto-play Carousel */}
            {carouselPosts.length > 0 && (
              <div className="lg:col-span-2">
                <div 
                  className="relative rounded-3xl overflow-hidden border border-border shadow-xl bg-black h-[320px] sm:h-[460px] w-full group"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  {/* Slides */}
                  <div className="absolute inset-0 w-full h-full">
                    {carouselPosts.map((post, idx) => (
                      <div
                        key={post.id}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                          idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                      >
                        {/* Background Image with Zoom */}
                        <div className="absolute inset-0 w-full h-full overflow-hidden">
                          <img
                            src={post.cover_image}
                            alt={post.title}
                            className={`object-cover w-full h-full opacity-70 transition-transform duration-[8000ms] ease-out ${
                              idx === currentSlide ? 'scale-105' : 'scale-100'
                            }`}
                          />
                          {/* Dark Overlay with Emerald Hint */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                          <div className="absolute inset-0 bg-radial-gradient from-transparent to-emerald-950/20" />
                        </div>

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-12 z-20 text-white flex flex-col justify-end h-full max-w-4xl">
                          <div className="space-y-3 sm:space-y-4">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="bg-primary/95 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-xs">
                                {getCategoryName(post.category_id)}
                              </span>
                              {post.is_longform && (
                                <span className="bg-accent/95 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs">
                                  Longform
                                </span>
                              )}
                            </div>

                            <Link href={`/posts/${post.slug}`} className="block">
                              <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white hover:text-accent transition-colors duration-300 leading-tight">
                                {post.title}
                              </h2>
                            </Link>

                            <p className="text-gray-200/90 text-xs sm:text-sm lg:text-base leading-relaxed line-clamp-2 max-w-2xl">
                              {post.summary}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300/90 font-medium pt-3 sm:pt-4 border-t border-white/10">
                              <div className="flex items-center gap-1.5">
                                <Calendar size={14} className="text-accent" />
                                <span>{formatDate(post.created_at)}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1">
                                  <Eye size={14} /> {post.views} lượt xem
                                </span>
                                <span className="flex items-center gap-1">
                                  <Heart size={14} className="text-red-400 fill-red-400/20" /> {post.likes} lượt thích
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Navigation Arrows */}
                  {carouselPosts.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentSlide(prev => (prev - 1 + carouselPosts.length) % carouselPosts.length);
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-primary text-white flex items-center justify-center backdrop-blur-xs transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100"
                        aria-label="Slide trước"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentSlide(prev => (prev + 1) % carouselPosts.length);
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-primary text-white flex items-center justify-center backdrop-blur-xs transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100"
                        aria-label="Slide tiếp theo"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}

                  {/* Indicator Dots */}
                  {carouselPosts.length > 1 && (
                    <div className="absolute bottom-4 right-6 sm:bottom-6 sm:right-10 z-30 flex items-center gap-2">
                      {carouselPosts.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentSlide(idx)}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            idx === currentSlide ? 'w-6 bg-primary' : 'w-2 bg-white/50 hover:bg-white'
                          }`}
                          aria-label={`Go to slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

             {/* Secondary Featured Posts (1/3 width) - Trending News Style */}
            <div className="lg:col-span-1 flex flex-col justify-between h-full bg-card-bg border border-border rounded-3xl p-5 shadow-xs">
              <div className="flex items-center gap-2 pb-3 border-b border-border">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider">Tiêu điểm mới nhất</h3>
              </div>
              <div className="divide-y divide-border/60 flex-grow flex flex-col justify-between mt-2">
                {secondaryFeaturedPosts.map((post, idx) => (
                  <div key={post.id} className="group/item py-4 first:pt-2 last:pb-2 flex gap-4 items-start transition-all duration-300">
                    {/* Big Trend Number */}
                    <span className="font-extrabold text-3xl text-muted/30 group-hover/item:text-primary transition-colors duration-300 leading-none">
                      {`0${idx + 1}`}
                    </span>
                    
                    <div className="flex-grow min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                          {getCategoryName(post.category_id)}
                        </span>
                        {post.is_longform && (
                          <span className="text-[9px] font-extrabold text-accent bg-accent/10 px-1 rounded uppercase">
                            Longform
                          </span>
                        )}
                      </div>
                      <Link href={`/posts/${post.slug}`} className="block">
                        <h4 className="text-sm font-bold text-foreground group-hover/item:text-primary transition-colors duration-300 leading-snug line-clamp-2">
                          {post.title}
                        </h4>
                      </Link>
                      <div className="flex items-center gap-3 text-[10px] text-muted pt-1">
                        <span>{formatDate(post.created_at)}</span>
                        <span>•</span>
                        <span>{post.views} lượt xem</span>
                      </div>
                    </div>

                    {/* Small Image Thumbnail on Right */}
                    <Link href={`/posts/${post.slug}`} className="relative block w-16 h-16 overflow-hidden rounded-xl bg-black flex-shrink-0 shadow-xs border border-border/40">
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="object-cover w-full h-full opacity-90 group-hover/item:scale-110 transition-transform duration-500"
                      />
                    </Link>
                  </div>
                ))}
                {secondaryFeaturedPosts.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-muted text-xs">
                    Không có tiêu điểm nào khác.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Scan List (Bảng quét tin nhanh) - Accordion Layout */}
          <div className="bg-card-bg border border-border rounded-3xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-border bg-muted-bg/30 flex items-center justify-between">
              <h3 className="font-extrabold text-foreground text-sm sm:text-md uppercase tracking-wider border-l-4 border-primary pl-3">
                Bảng quét tin nhanh (Scan Dashboard)
              </h3>
              <span className="text-xs text-muted font-semibold">Tổng số: {finalRemainingPosts.length} tin bài</span>
            </div>
            
            <div className="divide-y divide-border text-foreground">
              {finalRemainingPosts.map((post, idx) => {
                const isExpanded = idx === hoveredScanIdx;
                return (
                  <div 
                    key={post.id}
                    onMouseEnter={() => setHoveredScanIdx(idx)}
                    className="hover:bg-muted-bg/5 transition-all duration-300 overflow-hidden"
                  >
                    {/* Collapsed Header Bar */}
                    <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 cursor-pointer">
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-xs font-mono text-muted">{formatDate(post.created_at)}</span>
                        <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          {getCategoryName(post.category_id)}
                        </span>
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="font-bold text-foreground group-hover:text-primary transition-colors duration-300 text-sm sm:text-base line-clamp-1">
                          {post.title}
                          {post.is_longform && (
                            <span className="ml-2 bg-accent/10 text-accent text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase inline-block">
                              Longform
                            </span>
                          )}
                        </h4>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted font-mono flex-shrink-0">
                        <span>{post.views} xem</span>
                        <span>{post.likes} thích</span>
                      </div>
                    </div>

                    {/* Expandable Content Panel */}
                    <div
                      className={`transition-all duration-500 ease-in-out overflow-hidden ${
                        isExpanded ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                      }`}
                    >
                      <div className="px-4 pb-4 flex flex-col md:flex-row gap-4 items-start border-t border-border/40 pt-3">
                        <Link href={`/posts/${post.slug}`} className="relative block w-24 h-16 sm:w-32 sm:h-20 overflow-hidden rounded-lg bg-black flex-shrink-0 shadow-xs border border-border/30">
                          <img
                            src={post.cover_image}
                            alt=""
                            className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-500"
                          />
                        </Link>
                        <div className="flex-grow min-w-0 space-y-2">
                          <p className="text-xs sm:text-sm text-muted leading-relaxed line-clamp-2">
                            {post.summary}
                          </p>
                          <Link 
                            href={`/posts/${post.slug}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-hover"
                          >
                            Đọc bài viết <ChevronRight size={14} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {finalRemainingPosts.length === 0 && (
                <div className="p-8 text-center text-muted text-sm border-t border-border">
                  Không có tin bài nào khác.
                </div>
              )}
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
                <Play size={24} className="fill-primary text-primary" /> Arito Multimedia
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
