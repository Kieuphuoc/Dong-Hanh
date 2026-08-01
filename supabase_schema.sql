-- Bảng chuyên mục (categories)
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bảng bài viết tin tức (posts)
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image VARCHAR(512),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  is_longform BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bảng bình luận (comments)
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  author_name VARCHAR(255) DEFAULT 'Độc giả ẩn danh',
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bảng nội dung đa phương tiện: podcast và video (podcasts_videos)
CREATE TABLE podcasts_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('podcast', 'video')),
  url VARCHAR(512) NOT NULL,
  duration VARCHAR(50),
  cover_image VARCHAR(512),
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Functions để tăng số lượt xem và lượt thích bài viết
CREATE OR REPLACE FUNCTION increment_views(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE posts
  SET views = views + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_likes(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE posts
  SET likes = likes + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- Thêm dữ liệu mẫu vào danh mục
INSERT INTO categories (name, slug) VALUES
  ('Tin tức', 'tin-tuc'),
  ('Kinh doanh', 'kinh-doanh'),
  ('Công nghệ', 'cong-nghe'),
  ('Nhân sự', 'nhan-su'),
  ('Văn hóa', 'van-hoa')
ON CONFLICT (slug) DO NOTHING;

-- Bảng thành viên Kudos (kudos_members)
CREATE TABLE IF NOT EXISTS kudos_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  avatar VARCHAR(512),
  role VARCHAR(255),
  user_points INTEGER DEFAULT 450,
  points_to_give INTEGER DEFAULT 150,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bảng lịch sử gửi Kudos (kudos_records)
CREATE TABLE IF NOT EXISTS kudos_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_name VARCHAR(255) NOT NULL,
  sender_avatar VARCHAR(512),
  receiver_name VARCHAR(255) NOT NULL,
  receiver_avatar VARCHAR(512),
  badge_id VARCHAR(100) NOT NULL,
  badge_label VARCHAR(255) NOT NULL,
  badge_icon VARCHAR(50) NOT NULL,
  badge_color VARCHAR(255) NOT NULL,
  badge_text_color VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  points INTEGER DEFAULT 50,
  likes INTEGER DEFAULT 0,
  has_liked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bảng lịch sử đổi quà (kudos_redemptions)
CREATE TABLE IF NOT EXISTS kudos_redemptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_name VARCHAR(255) NOT NULL,
  reward_id VARCHAR(100) NOT NULL,
  reward_title VARCHAR(255) NOT NULL,
  points_cost INTEGER NOT NULL,
  voucher_code VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed dữ liệu thành viên Kudos mẫu
INSERT INTO kudos_members (name, avatar, role, user_points, points_to_give) VALUES
  ('Nguyễn Văn Nam', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', 'Ban Công nghệ', 450, 150),
  ('Lê Minh Thảo', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', 'Ban Kỹ thuật', 300, 150),
  ('Trần Hoàng Long', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'Ban Kinh doanh', 500, 150),
  ('Phạm Thị Mai', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80', 'Phòng Nhân sự', 250, 150),
  ('Hoàng Anh Tuấn', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 'Ban Truyền thông', 150, 150)
ON CONFLICT (name) DO NOTHING;

