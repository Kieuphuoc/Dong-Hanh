'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Eye, Heart, Calendar, MessageSquare, ArrowLeft, Send, Share2, Award } from 'lucide-react';
import { db, Post, Category, Comment } from '@/lib/supabase';

interface PostDetailProps {
  params: Promise<{ slug: string }>;
}

export default function PostDetail({ params }: PostDetailProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [post, setPost] = useState<Post | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [commentName, setCommentName] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    async function loadPostData() {
      setLoading(true);
      try {
        const fetchedPost = await db.getPostBySlug(slug);
        if (fetchedPost) {
          setPost(fetchedPost);

          // Increment views
          await db.incrementViews(fetchedPost.id);

          // Fetch category, comments, related posts
          const [fetchedCategories, fetchedComments, fetchedPosts] = await Promise.all([
            db.getCategories(),
            db.getComments(fetchedPost.id),
            db.getPosts({ categoryId: fetchedPost.category_id }),
          ]);

          const cat = fetchedCategories.find(c => c.id === fetchedPost.category_id);
          setCategory(cat || null);
          setComments(fetchedComments);
          // Lọc bài viết liên quan (loại trừ bài viết hiện tại)
          setRelatedPosts(fetchedPosts.filter(p => p.id !== fetchedPost.id).slice(0, 3));
        }
      } catch (err) {
        console.error('Lỗi khi tải bài viết:', err);
      } finally {
        setLoading(false);
      }
    }

    loadPostData();
  }, [slug]);

  const handleLike = async () => {
    if (!post || hasLiked) return;
    try {
      const newLikes = await db.incrementLikes(post.id);
      setPost(prev => prev ? { ...prev, likes: newLikes } : null);
      setHasLiked(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !commentContent.trim()) return;

    setSubmittingComment(true);
    try {
      const newComment = await db.createComment(post.id, commentName.trim(), commentContent.trim());
      setComments(prev => [...prev, newComment]);
      setCommentContent('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} lúc ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted text-sm font-medium">Đang tải nội dung bài viết...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20 bg-card-bg rounded-3xl border border-border">
        <h2 className="text-xl font-bold text-foreground">Bài viết không tồn tại</h2>
        <p className="text-muted text-sm mt-2">Bài viết bạn đang tìm kiếm có thể đã bị xóa hoặc đường dẫn bị sai.</p>
        <Link href="/" className="inline-block mt-6 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold shadow-sm hover:bg-primary-hover transition-colors">
          Quay lại trang chủ
        </Link>
      </div>
    );
  }

  return (
    <article className="space-y-8">
      {/* Breadcrumb & Navigation Back */}
      <div className="flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover transition-colors">
          <ArrowLeft size={16} /> Quay lại trang chủ
        </Link>
        {category && (
          <span className="text-xs font-bold text-accent bg-accent/10 px-3 py-1 rounded-full uppercase tracking-wider">
            {category.name}
          </span>
        )}
      </div>

      {/* Hero Header */}
      <div className="space-y-4">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground leading-tight">
          {post.title}
        </h1>
        <p className="text-md sm:text-lg text-muted font-medium border-l-4 border-primary pl-4 leading-relaxed">
          {post.summary}
        </p>

        {/* Post Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-border text-xs sm:text-sm text-muted font-medium">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Calendar size={16} />
              <span>{formatDate(post.created_at)}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Eye size={16} />
              <span>{post.views} lượt xem</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-300 ${
                hasLiked
                  ? 'bg-red-500 text-white border-red-500'
                  : 'hover:bg-muted-bg text-foreground border-border'
              }`}
            >
              <Heart size={16} className={hasLiked ? 'fill-white' : 'text-red-500'} />
              <span>{post.likes}</span>
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Đã sao chép link bài viết vào bộ nhớ tạm!');
              }}
              className="p-2 rounded-full border border-border hover:bg-muted-bg text-foreground transition-colors"
              title="Chia sẻ bài viết"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Cover Image */}
      <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-lg border border-border bg-black">
        <img
          src={post.cover_image}
          alt={post.title}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Rich text Content */}
      <div className="prose prose-slate dark:prose-invert max-w-none text-foreground leading-relaxed text-base sm:text-lg space-y-6">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      {/* Writer Credits / End of post */}
      <div className="p-6 rounded-2xl bg-muted-bg border border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold">
            ĐH
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">Ban biên tập DongHanh.vn</h4>
            <p className="text-xs text-muted">Bản tin thông tin nội bộ của các thành viên</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-primary font-bold">
          <Award size={16} /> Tin cậy • Kịp thời • Sâu sắc
        </div>
      </div>

      {/* Comments Segment */}
      <section className="space-y-6 pt-8 border-t border-border">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          <MessageSquare size={22} className="text-primary" /> Bình luận ({comments.length})
        </h3>

        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit} className="bg-card-bg p-5 rounded-2xl border border-border shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                placeholder="Nhập tên của bạn (hoặc ẩn danh)"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-muted-bg border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm text-foreground"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
              Nội dung bình luận
            </label>
            <textarea
              required
              rows={3}
              placeholder="Nhập nội dung chia sẻ của bạn về bài viết..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-muted-bg border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm text-foreground"
            />
          </div>
          <button
            type="submit"
            disabled={submittingComment}
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors"
          >
            {submittingComment ? 'Đang gửi...' : 'Gửi bình luận'}
            <Send size={14} />
          </button>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="bg-card-bg p-4 rounded-xl border border-border flex gap-3">
                <div className="w-8 h-8 rounded-full bg-muted-bg flex items-center justify-center font-bold text-sm text-primary flex-shrink-0">
                  {comment.author_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">{comment.author_name}</span>
                    <span className="text-[10px] text-muted">{formatDate(comment.created_at)}</span>
                  </div>
                  <p className="text-sm text-foreground/90 mt-1 leading-relaxed">{comment.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted italic">Chưa có bình luận nào cho bài viết này. Hãy là người đầu tiên chia sẻ ý kiến của bạn!</p>
          )}
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="space-y-6 pt-8 border-t border-border">
          <h3 className="text-lg font-bold text-foreground border-l-4 border-accent pl-3 uppercase tracking-wider">
            Bài viết liên quan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((post) => (
              <div key={post.id} className="bg-card-bg border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full group">
                <Link href={`/posts/${post.slug}`} className="block aspect-[16/10] overflow-hidden">
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="object-cover w-full h-full group-hover:scale-102 transition-transform duration-300"
                  />
                </Link>
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <Link href={`/posts/${post.slug}`}>
                    <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h4>
                  </Link>
                  <p className="text-xs text-muted mt-3">{formatDate(post.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
