'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { db, Post, Category, MediaItem } from '@/lib/supabase';
import { Trash2, Edit3, Plus, ArrowLeft, Radio, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

const BlockNoteEditor = dynamic(() => import('@/components/BlockNoteEditor'), {
  ssr: false,
});

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Active view: 'list' | 'create-post' | 'create-media'
  const [view, setView] = useState<'list' | 'create-post' | 'create-media'>('list');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // Form Post State
  const [postTitle, setPostTitle] = useState('');
  const [postSummary, setPostSummary] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCoverImage, setPostCoverImage] = useState('');
  const [postCategoryId, setPostCategoryId] = useState('');
  const [postIsFeatured, setPostIsFeatured] = useState(false);
  const [postIsLongform, setPostIsLongform] = useState(false);

  // Form Media State
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaType, setMediaType] = useState<'podcast' | 'video'>('podcast');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaDuration, setMediaDuration] = useState('');
  const [mediaCoverImage, setMediaCoverImage] = useState('');

  // Status Notification
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function loadAdminData() {
      setLoading(true);
      try {
        const [fetchedCategories, fetchedPosts, fetchedMedia] = await Promise.all([
          db.getCategories(),
          db.getPosts(),
          db.getMedia(),
        ]);
        setCategories(fetchedCategories);
        setPosts(fetchedPosts);
        setMediaList(fetchedMedia);
        if (fetchedCategories.length > 0) {
          setPostCategoryId(fetchedCategories[0].id);
        }
      } catch (err) {
        console.error('Lỗi nạp dữ liệu admin:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle || !postSummary || !postContent) {
      showStatus('error', 'Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }

    // Tự động tạo slug từ tiêu đề bài viết
    const slug = postTitle
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/([^0-9a-z-\s])/g, '')
      .replace(/(\s+)/g, '-')
      .replace(/^-+|-+$/g, '');

    const postData = {
      title: postTitle,
      slug,
      summary: postSummary,
      content: postContent,
      cover_image: postCoverImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=60',
      category_id: postCategoryId,
      is_featured: postIsFeatured,
      is_longform: postIsLongform,
    };

    try {
      if (editingPostId) {
        const updated = await db.updatePost(editingPostId, postData);
        if (updated) {
          setPosts(prev => prev.map(p => p.id === editingPostId ? updated : p));
          showStatus('success', 'Đã cập nhật bài viết thành công!');
        }
      } else {
        const created = await db.createPost(postData);
        setPosts(prev => [created, ...prev]);
        showStatus('success', 'Đã tạo bài viết mới thành công!');
      }

      resetPostForm();
      setView('list');
    } catch (err) {
      showStatus('error', 'Đã xảy ra lỗi trong quá trình xử lý.');
      console.error(err);
    }
  };

  const handleMediaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaTitle || !mediaUrl) {
      showStatus('error', 'Vui lòng nhập tiêu đề và liên kết đa phương tiện.');
      return;
    }

    const mediaData = {
      title: mediaTitle,
      type: mediaType,
      url: mediaUrl,
      duration: mediaDuration || '05:00',
      cover_image: mediaCoverImage || (mediaType === 'video'
        ? 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=60'
        : 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=60')
    };

    try {
      const created = await db.createMedia(mediaData);
      setMediaList(prev => [created, ...prev]);
      showStatus('success', 'Đã thêm nội dung Multimedia thành công!');
      resetMediaForm();
      setView('list');
    } catch (err) {
      showStatus('error', 'Đã xảy ra lỗi khi thêm nội dung đa phương tiện.');
      console.error(err);
    }
  };

  const handleEditClick = (post: Post) => {
    setEditingPostId(post.id);
    setPostTitle(post.title);
    setPostSummary(post.summary);
    setPostContent(post.content);
    setPostCoverImage(post.cover_image);
    setPostCategoryId(post.category_id);
    setPostIsFeatured(post.is_featured);
    setPostIsLongform(post.is_longform);
    setView('create-post');
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) return;
    try {
      await db.deletePost(id);
      setPosts(prev => prev.filter(p => p.id !== id));
      showStatus('success', 'Đã xóa bài viết thành công.');
    } catch (err) {
      showStatus('error', 'Lỗi khi xóa bài viết.');
      console.error(err);
    }
  };

  const resetPostForm = () => {
    setEditingPostId(null);
    setPostTitle('');
    setPostSummary('');
    setPostContent('');
    setPostCoverImage('');
    setPostIsFeatured(false);
    setPostIsLongform(false);
  };

  const resetMediaForm = () => {
    setMediaTitle('');
    setMediaType('podcast');
    setMediaUrl('');
    setMediaDuration('');
    setMediaCoverImage('');
  };

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const getCategoryName = (id: string) => {
    return categories.find(c => c.id === id)?.name || 'Tin tức';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted text-sm font-medium">Đang mở bảng điều khiển quản trị viên...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover transition-colors">
            <ArrowLeft size={16} /> Quay lại trang chủ
          </Link>
          <h1 className="text-3xl font-extrabold text-foreground">Trang Quản Trị Tòa Soạn</h1>
          <p className="text-sm text-muted">Đăng tin tức mới, quản lý podcast, video và nội dung trên hệ thống.</p>
        </div>

        {view === 'list' && (
          <div className="flex gap-3">
            <button
              onClick={() => { resetPostForm(); setView('create-post'); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow-xs transition-colors"
            >
              <Plus size={16} /> Đăng bài viết
            </button>
            <button
              onClick={() => { resetMediaForm(); setView('create-media'); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-semibold shadow-xs transition-colors"
            >
              <Plus size={16} /> Thêm Multimedia
            </button>
          </div>
        )}
      </div>

      {/* Notifications */}
      {statusMsg && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 animate-fade-in ${
          statusMsg.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-800/40 dark:text-emerald-300'
            : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/20 dark:border-red-800/40 dark:text-red-300'
        }`}>
          {statusMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm font-medium">{statusMsg.text}</span>
        </div>
      )}

      {/* View: List of content */}
      {view === 'list' && (
        <div className="space-y-8">
          {/* Posts Table */}
          <div className="bg-card-bg border border-border rounded-2xl overflow-hidden shadow-xs">
            <div className="p-5 border-b border-border bg-muted-bg/50">
              <h2 className="font-extrabold text-foreground text-md uppercase tracking-wider flex items-center gap-2">
                <FileText size={18} className="text-primary" /> Quản lý bài viết ({posts.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted-bg/20 text-muted font-bold text-xs uppercase tracking-wider">
                    <th className="p-4">Tiêu đề bài viết</th>
                    <th className="p-4">Chuyên mục</th>
                    <th className="p-4">Lượt xem</th>
                    <th className="p-4 text-center">Nổi bật</th>
                    <th className="p-4 text-center">Longform</th>
                    <th className="p-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground">
                  {posts.length > 0 ? (
                    posts.map((post) => (
                      <tr key={post.id} className="hover:bg-muted-bg/30 transition-colors">
                        <td className="p-4 max-w-xs sm:max-w-md font-semibold line-clamp-1 mt-3">
                          {post.title}
                        </td>
                        <td className="p-4 text-xs font-medium text-primary">
                          {getCategoryName(post.category_id)}
                        </td>
                        <td className="p-4 font-mono text-xs">{post.views}</td>
                        <td className="p-4 text-center">
                          {post.is_featured ? (
                            <span className="text-emerald-500 font-bold text-xs">✓</span>
                          ) : '-'}
                        </td>
                        <td className="p-4 text-center">
                          {post.is_longform ? (
                            <span className="text-accent font-bold text-xs">✓</span>
                          ) : '-'}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleEditClick(post)}
                            className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors inline-flex"
                            title="Sửa bài viết"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors inline-flex"
                            title="Xóa bài viết"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted italic">Chưa có bài viết nào trên hệ thống.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Media Table */}
          <div className="bg-card-bg border border-border rounded-2xl overflow-hidden shadow-xs">
            <div className="p-5 border-b border-border bg-muted-bg/50">
              <h2 className="font-extrabold text-foreground text-md uppercase tracking-wider flex items-center gap-2">
                <Radio size={18} className="text-accent" /> Danh sách Multimedia ({mediaList.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted-bg/20 text-muted font-bold text-xs uppercase tracking-wider">
                    <th className="p-4">Tiêu đề bản tin</th>
                    <th className="p-4">Phân loại</th>
                    <th className="p-4">Thời lượng</th>
                    <th className="p-4">Lượt nghe/xem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground">
                  {mediaList.length > 0 ? (
                    mediaList.map((item) => (
                      <tr key={item.id} className="hover:bg-muted-bg/30 transition-colors">
                        <td className="p-4 font-semibold">{item.title}</td>
                        <td className="p-4">
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            item.type === 'podcast'
                              ? 'bg-primary/10 text-primary'
                              : 'bg-accent/10 text-accent'
                          }`}>
                            {item.type}
                          </span>
                        </td>
                        <td className="p-4 text-xs font-mono">{item.duration}</td>
                        <td className="p-4 text-xs font-mono">{item.views}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-muted italic">Chưa có nội dung đa phương tiện nào.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* View: Form Post Create/Edit */}
      {view === 'create-post' && (
        <form onSubmit={handlePostSubmit} className="bg-card-bg border border-border p-6 sm:p-8 rounded-2xl shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-foreground border-b border-border pb-4">
            {editingPostId ? 'Chỉnh Sửa Bài Viết' : 'Tạo Bài Viết Tin Tức Mới'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-border pb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                  Tiêu đề bài viết <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nhập tiêu đề hấp dẫn..."
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-muted-bg border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm text-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                  Tóm tắt bài viết (Summary) <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tóm tắt ngắn gọn nội dung bài viết..."
                  value={postSummary}
                  onChange={(e) => setPostSummary(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-muted-bg border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm text-foreground"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                    Chuyên mục
                  </label>
                  <select
                    value={postCategoryId}
                    onChange={(e) => setPostCategoryId(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-muted-bg border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm text-foreground"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                    Ảnh bìa (URL)
                  </label>
                  <input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    value={postCoverImage}
                    onChange={(e) => setPostCoverImage(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-muted-bg border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm text-foreground"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-6 items-center pt-4">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-foreground">
                  <input
                    type="checkbox"
                    checked={postIsFeatured}
                    onChange={(e) => setPostIsFeatured(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                  />
                  Đặt làm tin nổi bật (Featured)
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-foreground">
                  <input
                    type="checkbox"
                    checked={postIsLongform}
                    onChange={(e) => setPostIsLongform(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                  />
                  Bài viết dạng Longform
                </label>
              </div>
            </div>
          </div>

          {/* Content Editor in a Notion-style Paper Sheet */}
          <div className="space-y-4 pt-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted">
              Nội dung bài viết <span className="text-red-500">*</span>
            </label>
            <div className="max-w-4xl mx-auto bg-white border border-border rounded-2xl shadow-md p-6 sm:p-10 min-h-[480px]">
              <BlockNoteEditor
                initialHTML={postContent}
                onChange={(html) => setPostContent(html)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => { resetPostForm(); setView('list'); }}
              className="px-5 py-2.5 rounded-xl border border-border hover:bg-muted-bg text-sm font-semibold text-foreground transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow-xs transition-colors"
            >
              {editingPostId ? 'Cập nhật bài viết' : 'Đăng bài viết'}
            </button>
          </div>
        </form>
      )}

      {/* View: Form Media Create */}
      {view === 'create-media' && (
        <form onSubmit={handleMediaSubmit} className="bg-card-bg border border-border p-6 sm:p-8 rounded-2xl shadow-xs space-y-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-foreground border-b border-border pb-4">
            Đăng Bản Tin Multimedia Mới
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                Tiêu đề bản tin <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Nhập tiêu đề podcast/video..."
                value={mediaTitle}
                onChange={(e) => setMediaTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-muted-bg border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm text-foreground"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                  Phân loại
                </label>
                <select
                  value={mediaType}
                  onChange={(e) => setMediaType(e.target.value as 'podcast' | 'video')}
                  className="w-full px-4 py-2 rounded-xl bg-muted-bg border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm text-foreground"
                >
                  <option value="podcast">Podcast (File âm thanh)</option>
                  <option value="video">Video (File MP4/Youtube)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                  Thời lượng (Ví dụ: 12:45)
                </label>
                <input
                  type="text"
                  placeholder="08:30"
                  value={mediaDuration}
                  onChange={(e) => setMediaDuration(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-muted-bg border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm text-foreground"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                Liên kết nguồn đa phương tiện (URL File phát nhạc/video) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-muted-bg border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm text-foreground font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                Ảnh bìa hiển thị (URL)
              </label>
              <input
                type="text"
                placeholder="Để trống để sử dụng ảnh bìa mặc định"
                value={mediaCoverImage}
                onChange={(e) => setMediaCoverImage(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-muted-bg border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm text-foreground"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => { resetMediaForm(); setView('list'); }}
              className="px-5 py-2.5 rounded-xl border border-border hover:bg-muted-bg text-sm font-semibold text-foreground transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-semibold shadow-xs transition-colors"
            >
              Thêm Multimedia
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
