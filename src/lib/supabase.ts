import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Khởi tạo Supabase client. Nếu không có biến môi trường, client sẽ là null
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Khai báo kiểu dữ liệu cho bài viết
export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  cover_image: string;
  category_id: string;
  is_featured: boolean;
  is_longform: boolean;
  views: number;
  likes: number;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_name: string;
  content: string;
  created_at: string;
}

export interface MediaItem {
  id: string;
  title: string;
  type: 'podcast' | 'video';
  url: string;
  duration: string;
  cover_image: string;
  views: number;
  created_at: string;
}

export interface KudosMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  user_points: number;
  points_to_give: number;
  created_at?: string;
}

export interface KudosRecord {
  id: string;
  sender_name: string;
  sender_avatar: string;
  receiver_name: string;
  receiver_avatar: string;
  badge_id: string;
  badge_label: string;
  badge_icon: string;
  badge_color: string;
  badge_text_color: string;
  message: string;
  points: number;
  likes: number;
  has_liked: boolean;
  created_at: string;
}

export interface KudosRedemption {
  id: string;
  member_name: string;
  reward_id: string;
  reward_title: string;
  points_cost: number;
  voucher_code: string;
  created_at: string;
}

// Dữ liệu Mock mặc định khi chưa kết nối Supabase
const defaultKudosMembers: KudosMember[] = [
  { id: 'm-1', name: 'Nguyễn Văn Nam', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', role: 'Ban Công nghệ', user_points: 450, points_to_give: 150 },
  { id: 'm-2', name: 'Lê Minh Thảo', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', role: 'Ban Kỹ thuật', user_points: 300, points_to_give: 150 },
  { id: 'm-3', name: 'Trần Hoàng Long', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', role: 'Ban Kinh doanh', user_points: 500, points_to_give: 150 },
  { id: 'm-4', name: 'Phạm Thị Mai', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80', role: 'Phòng Nhân sự', user_points: 250, points_to_give: 150 },
  { id: 'm-5', name: 'Hoàng Anh Tuấn', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', role: 'Ban Truyền thông', user_points: 150, points_to_give: 150 }
];

const defaultKudosRecords: KudosRecord[] = [
  {
    id: 'k-1',
    sender_name: 'Phạm Thị Mai',
    sender_avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    receiver_name: 'Nguyễn Văn Nam',
    receiver_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    badge_id: 'team-player',
    badge_label: 'Đồng Đội Vàng',
    badge_icon: '🏆',
    badge_color: 'bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800',
    badge_text_color: 'text-emerald-700 dark:text-emerald-400',
    message: 'Cảm ơn anh Nam đã hỗ trợ nhóm HR tối ưu hóa hệ thống điểm danh mới trong tuần qua. Anh giải thích rất dễ hiểu và nhiệt tình làm thêm giờ để fix lỗi giúp tụi em!',
    points: 50,
    likes: 12,
    has_liked: false,
    created_at: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: 'k-2',
    sender_name: 'Nguyễn Văn Nam',
    sender_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    receiver_name: 'Lê Minh Thảo',
    receiver_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    badge_id: 'problem-solver',
    badge_label: 'Giải Quyết Vấn Đề',
    badge_icon: '⚡',
    badge_color: 'bg-purple-100 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-800',
    badge_text_color: 'text-purple-700 dark:text-purple-400',
    message: 'Thảo có kỹ năng phân tích lỗi xuất sắc! Cảm ơn bạn đã nhanh chóng tìm ra lỗi memory leak trên môi trường staging trước giờ release. Bạn đã cứu cả team một bàn thua trông thấy!',
    points: 100,
    likes: 8,
    has_liked: false,
    created_at: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    id: 'k-3',
    sender_name: 'Trần Hoàng Long',
    sender_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    receiver_name: 'Phạm Thị Mai',
    receiver_avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    badge_id: 'creative-mind',
    badge_label: 'Sáng Tạo Không Giới Hạn',
    badge_icon: '💡',
    badge_color: 'bg-[#fae8ff] dark:bg-[#701a75]/20 border border-[#f5d0fe] dark:border-[#701a75]',
    badge_text_color: 'text-[#a21caf] dark:text-[#f472b6]',
    message: 'Ý tưởng tổ chức ngày hội Family Day vô cùng sáng tạo của Mai đã gắn kết mọi thành viên trong công ty. Lũ trẻ nhà mình cực kỳ thích hoạt động vẽ tranh cát!',
    points: 50,
    likes: 15,
    has_liked: true,
    created_at: new Date(Date.now() - 3600000 * 32).toISOString()
  }
];

const defaultCategories: Category[] = [
  { id: '1', name: 'Tin tức', slug: 'tin-tuc' },
  { id: '2', name: 'Kinh doanh', slug: 'kinh-doanh' },
  { id: '3', name: 'Công nghệ', slug: 'cong-nghe' },
  { id: '4', name: 'Nhân sự', slug: 'nhan-su' },
  { id: '5', name: 'Văn hóa', slug: 'van-hoa' },
];

const defaultPosts: Post[] = [
  {
    id: 'post-1',
    title: 'Arito Cloud ra mắt giải pháp AI tiên tiến cho doanh nghiệp',
    slug: 'arito-cloud-ra-mat-giai-phap-ai-doanh-nghiep',
    summary: 'Giải pháp mới giúp tối ưu hóa hiệu suất làm việc lên tới 40% và giảm chi phí vận hành cho các doanh nghiệp vừa và nhỏ.',
    content: '<p>Arito Cloud vừa chính thức công bố giải pháp trí tuệ nhân tạo mới dành riêng cho phân khúc doanh nghiệp. Với sự kết hợp giữa mô hình ngôn ngữ lớn (LLM) và các tính năng nghiệp vụ chuyên biệt, công cụ này hứa hẹn sẽ cách mạng hóa quy trình làm việc hành chính.</p><p>Đại diện Arito Cloud chia sẻ: "Chúng tôi hướng tới việc đưa AI trở thành trợ lý đắc lực của từng nhân viên. Hệ thống này không chỉ tự động hóa các tác vụ lặp đi lặp lại mà còn phân tích dữ liệu để đưa ra các đề xuất kinh doanh chính xác."</p>',
    cover_image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60',
    category_id: '3',
    is_featured: true,
    is_longform: false,
    views: 1240,
    likes: 85,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'post-2',
    title: 'Hành trình số hóa ngành bán lẻ đạt cột mốc mới',
    slug: 'hanh-trinh-so-hoa-ban-le-dat-cot-moc-moi',
    summary: 'Doanh thu trực tuyến của chuỗi nhà thuốc thông minh tăng trưởng vượt bậc nhờ áp dụng hệ thống quản lý kho mới.',
    content: '<p>Chuỗi bán lẻ vừa công bố báo cáo kết quả hoạt động số hóa trong nửa đầu năm. Nhờ áp dụng đồng bộ giải pháp quản lý chuỗi cung ứng thông minh, hệ thống đã tối ưu hóa thời gian giao nhận hàng đến tay khách hàng chỉ trong 30 phút.</p><p>Hệ thống tự động dự báo nhu cầu thị trường dựa trên máy học giúp lượng hàng tồn kho giảm đáng kể, đồng thời tỷ lệ đáp ứng đơn hàng tăng lên mức 98%.</p>',
    cover_image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=60',
    category_id: '2',
    is_featured: false,
    is_longform: false,
    views: 890,
    likes: 42,
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'post-3',
    title: 'Arito Podcast: Bí quyết giữ lửa nhiệt huyết của nhân viên',
    slug: 'bi-quyet-giu-lua-nhiet-huyet-nhan-vien',
    summary: 'Lắng nghe những chia sẻ đầy cảm hứng từ các quản lý trẻ xuất sắc lọt top Arito 13 Under 35 về hành trình vượt qua áp lực công việc.',
    content: '<p>Trong tập podcast tuần này, chúng ta sẽ được gặp gỡ các gương mặt tiêu biểu của Arito 13 Under 35. Họ là những người trẻ, đầy hoài bão và đang dẫn dắt các dự án quan trọng tại nhiều bộ phận thành viên.</p><p>Làm thế nào để duy trì năng lượng tích cực và đổi mới sáng tạo không ngừng? Hãy cùng lắng nghe buổi trò chuyện thú vị này.</p>',
    cover_image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=60',
    category_id: '4',
    is_featured: false,
    is_longform: true,
    views: 560,
    likes: 67,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'post-4',
    title: 'Giải bóng đá Arito Cup chính thức khởi tranh vòng loại khu vực',
    slug: 'giai-bong-da-arito-cup-chinh-thuc-khoi-tranh-vong-loai',
    summary: 'Hơn 20 đội bóng đến từ các bộ phận thành viên tham dự tranh tài tại giải đấu thể thao lớn nhất trong năm.',
    content: '<p>Arito Cup là giải đấu thường niên thu hút đông đảo cán bộ nhân viên tham gia cổ vũ. Giải đấu năm nay hứa hẹn sẽ mang đến những trận cầu hấp dẫn, kịch tính ngay từ vòng bảng.</p><p>Ban tổ chức cho biết chất lượng các đội bóng năm nay rất đồng đều và có sự chuẩn bị kỹ lưỡng về cả mặt thể lực lẫn chiến thuật.</p>',
    cover_image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=60',
    category_id: '5',
    is_featured: false,
    is_longform: false,
    views: 430,
    likes: 19,
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  }
];

const defaultMedia: MediaItem[] = [
  {
    id: 'media-1',
    title: 'Arito Podcast Tập 12: Đổi mới sáng tạo bắt đầu từ đâu?',
    type: 'podcast',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '12:45',
    cover_image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=60',
    views: 350,
    created_at: new Date().toISOString()
  },
  {
    id: 'media-2',
    title: 'Video toàn cảnh ngày hội văn hóa doanh nghiệp kỷ niệm ngày thành lập',
    type: 'video',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '03:15',
    cover_image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=60',
    views: 1280,
    created_at: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'media-3',
    title: 'Arito Podcast Tập 13: Xu hướng công nghệ AI năm 2026',
    type: 'podcast',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '18:20',
    cover_image: 'https://images.unsplash.com/photo-1484755560695-a4c7402a50e5?w=800&auto=format&fit=crop&q=60',
    views: 290,
    created_at: new Date(Date.now() - 3600000 * 10).toISOString()
  }
];

const defaultComments: Comment[] = [
  {
    id: 'comment-1',
    post_id: 'post-1',
    author_name: 'Nguyễn Văn Nam (Ban Công nghệ)',
    content: 'Giải pháp AI rất hữu ích, mong sớm được áp dụng tại bộ phận của mình.',
    created_at: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: 'comment-2',
    post_id: 'post-1',
    author_name: 'Lê Minh Thảo (Ban Kỹ thuật)',
    content: 'Hy vọng bản demo này hỗ trợ xử lý tiếng Việt tốt và nhận diện chính xác tài liệu nội bộ.',
    created_at: new Date(Date.now() - 900000).toISOString()
  }
];

// Lớp giả lập cơ sở dữ liệu lưu vào LocalStorage
class LocalDb {
  private isBrowser = typeof window !== 'undefined';

  private get<T>(key: string, defaultValue: T): T {
    if (!this.isBrowser) return defaultValue;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  }

  private set<T>(key: string, value: T): void {
    if (!this.isBrowser) return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  constructor() {
    if (this.isBrowser) {
      if (!localStorage.getItem('ct_categories')) this.set('ct_categories', defaultCategories);
      if (!localStorage.getItem('ct_posts')) this.set('ct_posts', defaultPosts);
      if (!localStorage.getItem('ct_media')) this.set('ct_media', defaultMedia);
      if (!localStorage.getItem('ct_comments')) this.set('ct_comments', defaultComments);
      if (!localStorage.getItem('kudos_members')) this.set('kudos_members', defaultKudosMembers);
      if (!localStorage.getItem('kudos_records')) this.set('kudos_records', defaultKudosRecords);
      if (!localStorage.getItem('kudos_redemptions')) this.set('kudos_redemptions', [] as KudosRedemption[]);
    }
  }

  async getCategories(): Promise<Category[]> {
    if (supabase) {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (!error && data) return data;
    }
    return this.get('ct_categories', defaultCategories);
  }

  async getPosts(options?: { categoryId?: string; isFeatured?: boolean; search?: string }): Promise<Post[]> {
    if (supabase) {
      let query = supabase.from('posts').select('*').order('created_at', { ascending: false });
      if (options?.categoryId) query = query.eq('category_id', options.categoryId);
      if (options?.isFeatured !== undefined) query = query.eq('is_featured', options.isFeatured);
      if (options?.search) query = query.ilike('title', `%${options.search}%`);
      const { data, error } = await query;
      if (!error && data) return data;
    }

    let posts = this.get('ct_posts', defaultPosts);
    if (options?.categoryId) {
      posts = posts.filter(p => p.category_id === options.categoryId);
    }
    if (options?.isFeatured !== undefined) {
      posts = posts.filter(p => p.is_featured === options.isFeatured);
    }
    if (options?.search) {
      const s = options.search.toLowerCase();
      posts = posts.filter(p => p.title.toLowerCase().includes(s) || p.summary.toLowerCase().includes(s));
    }
    return posts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  async getPostBySlug(slug: string): Promise<Post | null> {
    if (supabase) {
      const { data, error } = await supabase.from('posts').select('*').eq('slug', slug).maybeSingle();
      if (!error && data) return data;
    }
    const posts = this.get('ct_posts', defaultPosts);
    return posts.find(p => p.slug === slug) || null;
  }

  async createPost(post: Omit<Post, 'id' | 'views' | 'likes' | 'created_at'>): Promise<Post> {
    const newPost: Post = {
      ...post,
      id: 'post-' + Math.random().toString(36).substr(2, 9),
      views: 0,
      likes: 0,
      created_at: new Date().toISOString()
    };

    if (supabase) {
      const { data, error } = await supabase.from('posts').insert([newPost]).select().single();
      if (!error && data) return data;
    }

    const posts = this.get('ct_posts', defaultPosts);
    posts.unshift(newPost);
    this.set('ct_posts', posts);
    return newPost;
  }

  async deletePost(id: string): Promise<boolean> {
    if (supabase) {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (!error) return true;
    }
    const posts = this.get('ct_posts', defaultPosts);
    const filtered = posts.filter(p => p.id !== id);
    this.set('ct_posts', filtered);
    return true;
  }

  async updatePost(id: string, updates: Partial<Post>): Promise<Post | null> {
    if (supabase) {
      const { data, error } = await supabase.from('posts').update(updates).eq('id', id).select().single();
      if (!error && data) return data;
    }
    const posts = this.get('ct_posts', defaultPosts);
    const idx = posts.findIndex(p => p.id === id);
    if (idx === -1) return null;
    posts[idx] = { ...posts[idx], ...updates };
    this.set('ct_posts', posts);
    return posts[idx];
  }

  async incrementViews(id: string): Promise<void> {
    const posts = this.get('ct_posts', defaultPosts);
    const idx = posts.findIndex(p => p.id === id);
    if (idx !== -1) {
      posts[idx].views += 1;
      this.set('ct_posts', posts);
      if (supabase) {
        try {
          await supabase.rpc('increment_views', { post_id: id });
        } catch (e) {
          console.error(e);
        }
      }
    }
  }

  async incrementLikes(id: string): Promise<number> {
    const posts = this.get('ct_posts', defaultPosts);
    const idx = posts.findIndex(p => p.id === id);
    let newLikes = 0;
    if (idx !== -1) {
      posts[idx].likes += 1;
      newLikes = posts[idx].likes;
      this.set('ct_posts', posts);
      if (supabase) {
        try {
          await supabase.rpc('increment_likes', { post_id: id });
        } catch (e) {
          console.error(e);
        }
      }
    }
    return newLikes;
  }

  async getComments(postId: string): Promise<Comment[]> {
    if (supabase) {
      const { data, error } = await supabase.from('comments').select('*').eq('post_id', postId).order('created_at', { ascending: true });
      if (!error && data) return data;
    }
    const comments = this.get('ct_comments', defaultComments);
    return comments.filter(c => c.post_id === postId);
  }

  async createComment(postId: string, authorName: string, content: string): Promise<Comment> {
    const newComment: Comment = {
      id: 'comment-' + Math.random().toString(36).substr(2, 9),
      post_id: postId,
      author_name: authorName || 'Độc giả ẩn danh',
      content,
      created_at: new Date().toISOString()
    };

    if (supabase) {
      const { data, error } = await supabase.from('comments').insert([newComment]).select().single();
      if (!error && data) return data;
    }

    const comments = this.get('ct_comments', defaultComments);
    comments.push(newComment);
    this.set('ct_comments', comments);
    return newComment;
  }

  async getMedia(): Promise<MediaItem[]> {
    if (supabase) {
      const { data, error } = await supabase.from('podcasts_videos').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    return this.get('ct_media', defaultMedia);
  }

  async createMedia(media: Omit<MediaItem, 'id' | 'views' | 'created_at'>): Promise<MediaItem> {
    const newMedia: MediaItem = {
      ...media,
      id: 'media-' + Math.random().toString(36).substr(2, 9),
      views: 0,
      created_at: new Date().toISOString()
    };

    if (supabase) {
      const { data, error } = await supabase.from('podcasts_videos').insert([newMedia]).select().single();
      if (!error && data) return data;
    }

    const items = this.get('ct_media', defaultMedia);
    items.unshift(newMedia);
    this.set('ct_media', items);
    return newMedia;
  }

  async getKudosMembers(): Promise<KudosMember[]> {
    if (supabase) {
      const { data, error } = await supabase.from('kudos_members').select('*').order('name');
      if (!error && data) return data;
    }
    return this.get('kudos_members', defaultKudosMembers);
  }

  async getKudosRecords(): Promise<KudosRecord[]> {
    if (supabase) {
      const { data, error } = await supabase.from('kudos_records').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    return this.get('kudos_records', defaultKudosRecords);
  }

  async getKudosRedemptions(memberName?: string): Promise<KudosRedemption[]> {
    if (supabase) {
      let query = supabase.from('kudos_redemptions').select('*').order('created_at', { ascending: false });
      if (memberName) query = query.eq('member_name', memberName);
      const { data, error } = await query;
      if (!error && data) return data;
    }
    const redemptions = this.get('kudos_redemptions', [] as KudosRedemption[]);
    if (memberName) {
      return redemptions.filter(r => r.member_name === memberName);
    }
    return redemptions;
  }

  async createKudosRecord(record: Omit<KudosRecord, 'id' | 'likes' | 'has_liked' | 'created_at'>): Promise<KudosRecord> {
    const newRecord: KudosRecord = {
      ...record,
      id: 'kudos-rec-' + Math.random().toString(36).substr(2, 9),
      likes: 0,
      has_liked: false,
      created_at: new Date().toISOString()
    };

    if (supabase) {
      const { data, error } = await supabase.from('kudos_records').insert([newRecord]).select().single();
      if (!error && data) {
        try {
          await supabase.rpc('send_kudos_transaction', {
            sender: record.sender_name,
            receiver: record.receiver_name,
            pts: record.points
          });
        } catch (e) {
          console.error(e);
        }
        return data;
      }
    }

    const records = this.get('kudos_records', defaultKudosRecords);
    records.unshift(newRecord);
    this.set('kudos_records', records);

    const members = this.get('kudos_members', defaultKudosMembers);
    const senderIdx = members.findIndex(m => m.name === record.sender_name);
    const receiverIdx = members.findIndex(m => m.name === record.receiver_name);

    if (senderIdx !== -1) {
      members[senderIdx].points_to_give = Math.max(0, members[senderIdx].points_to_give - record.points);
    }
    if (receiverIdx !== -1) {
      members[receiverIdx].user_points += record.points;
    }
    this.set('kudos_members', members);

    return newRecord;
  }

  async createKudosRedemption(redemption: Omit<KudosRedemption, 'id' | 'created_at'>): Promise<KudosRedemption> {
    const newRedemption: KudosRedemption = {
      ...redemption,
      id: 'kudos-red-' + Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString()
    };

    if (supabase) {
      const { data, error } = await supabase.from('kudos_redemptions').insert([newRedemption]).select().single();
      if (!error && data) {
        try {
          await supabase.rpc('redeem_kudos_points', {
            username: redemption.member_name,
            pts: redemption.points_cost
          });
        } catch (e) {
          console.error(e);
        }
        return data;
      }
    }

    const redemptions = this.get('kudos_redemptions', [] as KudosRedemption[]);
    redemptions.unshift(newRedemption);
    this.set('kudos_redemptions', redemptions);

    const members = this.get('kudos_members', defaultKudosMembers);
    const memberIdx = members.findIndex(m => m.name === redemption.member_name);
    if (memberIdx !== -1) {
      members[memberIdx].user_points = Math.max(0, members[memberIdx].user_points - redemption.points_cost);
      this.set('kudos_members', members);
    }

    return newRedemption;
  }

  async toggleKudosLike(id: string): Promise<KudosRecord | null> {
    const records = this.get('kudos_records', defaultKudosRecords);
    const idx = records.findIndex(r => r.id === id);
    if (idx !== -1) {
      const hasLiked = records[idx].has_liked;
      records[idx].likes = hasLiked ? records[idx].likes - 1 : records[idx].likes + 1;
      records[idx].has_liked = !hasLiked;
      this.set('kudos_records', records);
      
      if (supabase) {
        try {
          const { data, error } = await supabase.from('kudos_records')
            .update({ likes: records[idx].likes, has_liked: records[idx].has_liked })
            .eq('id', id)
            .select()
            .single();
          if (!error && data) return data;
        } catch (e) {
          console.error(e);
        }
      }
      return records[idx];
    }
    return null;
  }
}

export const db = new LocalDb();
