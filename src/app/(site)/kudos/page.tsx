'use client';

import { useState, useEffect } from 'react';
import { 
  Award, 
  Heart, 
  Sparkles, 
  Send, 
  Gift, 
  Trophy, 
  Users, 
  TrendingUp, 
  Plus, 
  Check, 
  MessageSquare,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

// Định nghĩa kiểu dữ liệu cho Kudos
interface KudosItem {
  id: string;
  senderName: string;
  senderAvatar: string;
  receiverName: string;
  receiverAvatar: string;
  badge: {
    id: string;
    label: string;
    icon: string;
    color: string; // Tailwind bg color
    textColor: string;
  };
  message: string;
  points: number;
  likes: number;
  hasLiked: boolean;
  createdAt: string;
}

interface Member {
  name: string;
  avatar: string;
  role: string;
}

interface Reward {
  id: string;
  title: string;
  pointsCost: number;
  description: string;
  image: string;
  category: string;
}

const BADGES = [
  { id: 'team-player', label: 'Đồng Đội Vàng', icon: '🏆', color: 'bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800', textColor: 'text-emerald-700 dark:text-emerald-400' },
  { id: 'problem-solver', label: 'Giải Quyết Vấn Đề', icon: '⚡', color: 'bg-purple-100 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-800', textColor: 'text-purple-700 dark:text-purple-400' },
  { id: 'creative-mind', label: 'Sáng Tạo Không Giới Hạn', icon: '💡', color: 'bg-[#fae8ff] dark:bg-[#701a75]/20 border border-[#f5d0fe] dark:border-[#701a75]', textColor: 'text-[#a21caf] dark:text-[#f472b6]' },
  { id: 'above-beyond', label: 'Vượt Trội Kỳ Vọng', icon: '🚀', color: 'bg-[#f0fdf4] dark:bg-[#14532d]/20 border border-[#bbf7d0] dark:border-[#14532d]', textColor: 'text-[#16a34a] dark:text-[#4ade80]' },
  { id: 'customer-centric', label: 'Khách Hàng Là Trọng Tâm', icon: '🤝', color: 'bg-amber-100 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800', textColor: 'text-amber-700 dark:text-amber-400' }
];

const MEMBERS: Member[] = [
  { name: 'Nguyễn Văn Nam', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', role: 'Ban Công nghệ' },
  { name: 'Lê Minh Thảo', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', role: 'Ban Kỹ thuật' },
  { name: 'Trần Hoàng Long', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', role: 'Ban Kinh doanh' },
  { name: 'Phạm Thị Mai', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80', role: 'Phòng Nhân sự' },
  { name: 'Hoàng Anh Tuấn', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', role: 'Ban Truyền thông' }
];

const REWARDS: Reward[] = [
  { id: 'rw-1', title: 'Ly Cà Phê Đồng Hành', pointsCost: 100, description: 'Một ly cà phê Highlands/Starbucks tiếp thêm năng lượng ngày làm việc.', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&auto=format&fit=crop&q=80', category: 'F&B' },
  { id: 'rw-2', title: 'Áo Thun Arito Polo Cao Cấp', pointsCost: 350, description: 'Áo thun đồng phục phiên bản giới hạn mềm mát, phong cách.', image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&auto=format&fit=crop&q=80', category: 'Merchandise' },
  { id: 'rw-3', title: 'Nửa Ngày Nghỉ Phép Đặc Quyền', pointsCost: 800, description: 'Tận hưởng 0.5 ngày nghỉ phép hưởng nguyên lương tự chọn.', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&auto=format&fit=crop&q=80', category: 'Privilege' },
  { id: 'rw-4', title: 'Bữa Trưa Thân Mật Cùng CEO', pointsCost: 1500, description: 'Buổi ăn trưa thân mật trao đổi ý tưởng trực tiếp với CEO.', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80', category: 'Privilege' },
  { id: 'rw-5', title: 'Sách Hay Tùy Chọn Từ HR', pointsCost: 200, description: 'Một cuốn sách kỹ năng/kinh doanh bất kỳ do bạn lựa chọn.', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&auto=format&fit=crop&q=80', category: 'Learning' }
];

const INITIAL_KUDOS: KudosItem[] = [
  {
    id: 'kudos-1',
    senderName: 'Phạm Thị Mai',
    senderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    receiverName: 'Nguyễn Văn Nam',
    receiverAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    badge: BADGES[0],
    message: 'Cảm ơn anh Nam đã hỗ trợ nhóm HR tối ưu hóa hệ thống điểm danh mới trong tuần qua. Anh giải thích rất dễ hiểu và nhiệt tình làm thêm giờ để fix lỗi giúp tụi em!',
    points: 50,
    likes: 12,
    hasLiked: false,
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: 'kudos-2',
    senderName: 'Nguyễn Văn Nam',
    senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    receiverName: 'Lê Minh Thảo',
    receiverAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    badge: BADGES[1],
    message: 'Thảo có kỹ năng phân tích lỗi xuất sắc! Cảm ơn bạn đã nhanh chóng tìm ra lỗi memory leak trên môi trường staging trước giờ release. Bạn đã cứu cả team một bàn thua trông thấy!',
    points: 100,
    likes: 8,
    hasLiked: false,
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    id: 'kudos-3',
    senderName: 'Trần Hoàng Long',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    receiverName: 'Phạm Thị Mai',
    receiverAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    badge: BADGES[2],
    message: 'Ý tưởng tổ chức ngày hội Family Day vô cùng sáng tạo của Mai đã gắn kết mọi thành viên trong công ty. Lũ trẻ nhà mình cực kỳ thích hoạt động vẽ tranh cát!',
    points: 50,
    likes: 15,
    hasLiked: true,
    createdAt: new Date(Date.now() - 3600000 * 32).toISOString()
  }
];

export default function KudosPortal() {
  const [kudosList, setKudosList] = useState<KudosItem[]>([]);
  const [userPoints, setUserPoints] = useState(450); // Điểm để đổi quà
  const [pointsToGive, setPointsToGive] = useState(150); // Điểm còn lại để tặng trong tháng
  const [selectedReceiver, setSelectedReceiver] = useState('');
  const [selectedBadge, setSelectedBadge] = useState(BADGES[0].id);
  const [message, setMessage] = useState('');
  const [pointsAmount, setPointsAmount] = useState(50);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Notification States
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [redeemedRewards, setRedeemedRewards] = useState<string[]>([]);

  // Tải dữ liệu từ LocalStorage hoặc dữ liệu mặc định
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedKudos = localStorage.getItem('kudos_list');
      const storedPoints = localStorage.getItem('kudos_user_points');
      const storedGivePoints = localStorage.getItem('kudos_give_points');
      const storedRedeemed = localStorage.getItem('kudos_redeemed');

      if (storedKudos) setKudosList(JSON.parse(storedKudos));
      else {
        setKudosList(INITIAL_KUDOS);
        localStorage.setItem('kudos_list', JSON.stringify(INITIAL_KUDOS));
      }

      if (storedPoints) setUserPoints(Number(storedPoints));
      if (storedGivePoints) setPointsToGive(Number(storedGivePoints));
      if (storedRedeemed) setRedeemedRewards(JSON.parse(storedRedeemed));
    }
  }, []);

  const saveToLocalStorage = (newList: KudosItem[], newPoints: number, newGivePoints: number, newRedeemed?: string[]) => {
    localStorage.setItem('kudos_list', JSON.stringify(newList));
    localStorage.setItem('kudos_user_points', newPoints.toString());
    localStorage.setItem('kudos_give_points', newGivePoints.toString());
    if (newRedeemed) localStorage.setItem('kudos_redeemed', JSON.stringify(newRedeemed));
  };

  const handleSendKudos = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedReceiver) {
      setErrorMsg('Vui lòng chọn đồng nghiệp muốn gửi Kudos.');
      return;
    }
    if (!message.trim()) {
      setErrorMsg('Vui lòng nhập lời chúc/cảm ơn.');
      return;
    }
    if (pointsAmount > pointsToGive) {
      setErrorMsg('Bạn không đủ điểm gửi trong tháng này.');
      return;
    }

    const badgeObj = BADGES.find(b => b.id === selectedBadge) || BADGES[0];
    const receiverMember = MEMBERS.find(m => m.name === selectedReceiver);

    const newKudos: KudosItem = {
      id: 'kudos-' + Date.now(),
      senderName: 'Bạn (User)',
      senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      receiverName: selectedReceiver,
      receiverAvatar: receiverMember?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      badge: badgeObj,
      message: message.trim(),
      points: pointsAmount,
      likes: 0,
      hasLiked: false,
      createdAt: new Date().toISOString()
    };

    const updatedList = [newKudos, ...kudosList];
    const updatedGivePoints = pointsToGive - pointsAmount;

    setKudosList(updatedList);
    setPointsToGive(updatedGivePoints);
    setSelectedReceiver('');
    setMessage('');
    setErrorMsg('');
    setSuccessMsg(`Đã gửi Kudos thành công tới ${selectedReceiver}!`);

    saveToLocalStorage(updatedList, userPoints, updatedGivePoints);

    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleLike = (id: string) => {
    const updated = kudosList.map(item => {
      if (item.id === id) {
        return {
          ...item,
          likes: item.hasLiked ? item.likes - 1 : item.likes + 1,
          hasLiked: !item.hasLiked
        };
      }
      return item;
    });
    setKudosList(updated);
    saveToLocalStorage(updated, userPoints, pointsToGive);
  };

  const handleRedeem = (reward: Reward) => {
    if (userPoints < reward.pointsCost) {
      setErrorMsg(`Bạn không đủ điểm để đổi ${reward.title}. Cần thêm ${reward.pointsCost - userPoints} Kudos.`);
      setTimeout(() => setErrorMsg(''), 4000);
      return;
    }

    const newPoints = userPoints - reward.pointsCost;
    const newRedeemed = [...redeemedRewards, reward.id];

    setUserPoints(newPoints);
    setRedeemedRewards(newRedeemed);
    setSuccessMsg(`Chúc mừng! Bạn đã đổi thành công phần quà "${reward.title}". Mã nhận quà đã được gửi tới email của bạn!`);

    saveToLocalStorage(kudosList, newPoints, pointsToGive, newRedeemed);

    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const filteredKudos = kudosList.filter(item => 
    item.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.receiverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.badge.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Tính toán bảng xếp hạng động
  const leaderboard = MEMBERS.map(m => {
    // Điểm nhận được
    const received = kudosList
      .filter(k => k.receiverName === m.name)
      .reduce((sum, curr) => sum + curr.points, 0);
    // Điểm đã gửi đi
    const sent = kudosList
      .filter(k => k.senderName === m.name)
      .reduce((sum, curr) => sum + curr.points, 0);

    return {
      ...m,
      receivedPoints: received,
      sentPoints: sent
    };
  }).sort((a, b) => b.receivedPoints - a.receivedPoints);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} - ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  return (
    <div className="space-y-10 py-4 max-w-6xl mx-auto" style={{ fontFamily: 'var(--font-quicksand), sans-serif' }}>
      
      {/* Top Banner & Profile Info */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-[#8f3f71] to-[#701a75] p-8 sm:p-12 text-white shadow-xl">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-4 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles size={12} className="text-emerald-300" /> Arito Recognition System
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Arito Kudos & Gamification
            </h1>
            <p className="text-emerald-100 max-w-xl text-sm sm:text-base font-medium">
              Vinh danh đồng nghiệp, lan tỏa văn hóa biết ơn và đổi những phần quà hấp dẫn bằng điểm Kudos tích lũy!
            </p>
            <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-4">
              <Link 
                href="#send-kudos" 
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-bold text-sm shadow-md transition-all duration-300 flex items-center gap-1.5"
              >
                <Send size={15} /> Gửi Kudos Ngay
              </Link>
              <Link 
                href="#store" 
                className="px-6 py-2.5 bg-white text-[#701a75] hover:bg-emerald-50 rounded-full font-bold text-sm shadow-md transition-all duration-300 flex items-center gap-1.5"
              >
                <Gift size={15} /> Cửa Hàng Đổi Quà
              </Link>
            </div>
          </div>

          {/* User Status Panels */}
          <div className="flex gap-4 sm:gap-6 flex-shrink-0 w-full md:w-auto max-w-md">
            {/* Box 1: Points To Give */}
            <div className="flex-1 bg-white/10 backdrop-blur-lg border border-white/10 p-5 rounded-2xl text-center flex flex-col justify-center items-center shadow-lg">
              <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-emerald-200">Điểm Tháng Này</span>
              <span className="text-3xl sm:text-4xl font-black mt-1 text-white">{pointsToGive}</span>
              <span className="text-[10px] text-emerald-100 mt-1">để gửi đi</span>
            </div>
            
            {/* Box 2: Total Balance */}
            <div className="flex-1 bg-white/15 backdrop-blur-lg border border-white/20 p-5 rounded-2xl text-center flex flex-col justify-center items-center shadow-lg relative group">
              <div className="absolute -top-3 right-3 bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase">Sẵn sàng</div>
              <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-[#f5d0fe]">Quỹ Kudos Đổi Quà</span>
              <span className="text-3xl sm:text-4xl font-black mt-1 text-[#fdf4ff] flex items-center gap-1">
                {userPoints} <span className="text-xs font-medium">pts</span>
              </span>
              <span className="text-[10px] text-purple-100 mt-1">nhận từ đồng nghiệp</span>
            </div>
          </div>
        </div>
      </section>

      {/* Notifications bar */}
      {(successMsg || errorMsg) && (
        <div className="animate-slide-in">
          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 shadow-xs">
              <CheckCircle2 className="text-emerald-500 flex-shrink-0" />
              <p className="text-sm font-semibold">{successMsg}</p>
            </div>
          )}
          {errorMsg && (
            <div className="bg-red-50 border border-red-300 text-red-800 p-4 rounded-2xl flex items-center gap-3 shadow-xs">
              <AlertCircle className="text-red-500 flex-shrink-0" />
              <p className="text-sm font-semibold">{errorMsg}</p>
            </div>
          )}
        </div>
      )}

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Feed & Form */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section: Give Kudos Form */}
          <div id="send-kudos" className="bg-card-bg border border-border p-6 rounded-3xl shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                  <Award size={18} />
                </div>
                <h2 className="text-lg font-bold text-foreground">Gửi Lời Vinh Danh Đồng Nghiệp</h2>
              </div>
              <span className="text-xs text-muted font-medium">Hạn mức tặng: 10, 20, 50, 100 điểm</span>
            </div>

            <form onSubmit={handleSendKudos} className="space-y-5">
              {/* Member Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider">Người nhận vinh danh</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {MEMBERS.map((member) => (
                    <button
                      key={member.name}
                      type="button"
                      onClick={() => setSelectedReceiver(member.name)}
                      className={`flex flex-col items-center p-3 rounded-2xl border text-center transition-all duration-300 ${
                        selectedReceiver === member.name
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 ring-2 ring-emerald-400'
                          : 'border-border bg-muted-bg/10 hover:bg-muted-bg/30'
                      }`}
                    >
                      <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover border border-border" />
                      <span className="text-xs font-bold mt-2 text-foreground truncate w-full">{member.name}</span>
                      <span className="text-[9px] text-muted truncate w-full mt-0.5">{member.role}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Badge Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider">Chọn huy hiệu vinh danh</label>
                <div className="flex flex-wrap gap-2">
                  {BADGES.map((badge) => (
                    <button
                      key={badge.id}
                      type="button"
                      onClick={() => setSelectedBadge(badge.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-300 ${
                        selectedBadge === badge.id
                          ? `${badge.color} ring-2 ring-emerald-500 scale-102`
                          : 'bg-card-bg border border-border text-foreground hover:bg-muted-bg/20'
                      }`}
                    >
                      <span>{badge.icon}</span>
                      <span>{badge.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Point Amount Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider">Điểm tặng kèm</label>
                <div className="flex gap-3">
                  {[10, 20, 50, 100].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setPointsAmount(amt)}
                      className={`flex-1 py-2.5 rounded-xl border font-bold text-sm transition-all duration-300 ${
                        pointsAmount === amt
                          ? 'border-[#a21caf] bg-[#fae8ff]/50 text-[#a21caf] dark:bg-[#701a75]/25 dark:text-[#f472b6] dark:border-[#701a75] ring-2 ring-[#a21caf]'
                          : 'border-border bg-card-bg text-foreground hover:bg-muted-bg/20'
                      }`}
                    >
                      +{amt} Pts
                    </button>
                  ))}
                </div>
              </div>

              {/* Appreciation Message */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider">Lời cảm ơn / Vinh danh</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hãy chia sẻ câu chuyện tuyệt vời về đồng nghiệp của bạn tại đây... (Ví dụ: hỗ trợ khách hàng khó tính, hỗ trợ dự án ngoài giờ, có ý tưởng cải tiến sáng tạo...)"
                  className="w-full rounded-2xl border border-border bg-card-bg p-3 text-sm text-foreground focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder-muted transition-all"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-[#8f3f71] hover:from-emerald-600 hover:to-[#701a75] text-white font-bold text-sm rounded-2xl shadow-md transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Send size={15} /> Gửi Kudos Cảm Ơn
              </button>
            </form>
          </div>

          {/* Section: Kudos Wall (Live Feed) */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <h2 className="text-xl font-black text-foreground flex items-center gap-2">
                <TrendingUp size={20} className="text-emerald-500" /> Bảng Vinh Danh Realtime (Kudos Wall)
              </h2>
              
              {/* Search Wall */}
              <div className="relative max-w-xs w-full">
                <input
                  type="text"
                  placeholder="Tìm kiếm Kudos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-card-bg border border-border pl-9 pr-4 py-1.5 text-xs rounded-full focus:outline-none focus:border-[#a21caf]"
                />
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              </div>
            </div>

            {/* List Kudos Cards */}
            <div className="space-y-4">
              {filteredKudos.map((item) => (
                <div 
                  key={item.id}
                  className="bg-card-bg border border-border p-6 rounded-3xl shadow-xs space-y-4 hover:shadow-md transition-all duration-300 border-l-4 border-l-[#a21caf]"
                >
                  {/* Sender & Receiver info */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {/* Sender */}
                      <div className="flex items-center gap-2">
                        <img src={item.senderAvatar} alt={item.senderName} className="w-8 h-8 rounded-full object-cover border border-border" />
                        <span className="text-xs font-bold text-foreground">{item.senderName}</span>
                      </div>
                      
                      {/* Arrow / Direction */}
                      <span className="text-xs text-muted font-bold">👉 gửi tới</span>

                      {/* Receiver */}
                      <div className="flex items-center gap-2">
                        <img src={item.receiverAvatar} alt={item.receiverName} className="w-8 h-8 rounded-full object-cover border border-border" />
                        <span className="text-xs font-bold text-foreground">{item.receiverName}</span>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono text-muted">{formatDate(item.createdAt)}</span>
                  </div>

                  {/* Message content */}
                  <div className="bg-muted-bg/10 border border-border/40 p-4 rounded-2xl relative">
                    <p className="text-sm text-foreground/90 leading-relaxed font-medium">
                      "{item.message}"
                    </p>
                  </div>

                  {/* Bottom: Badge tag, point count, reaction */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${item.badge.color} ${item.badge.textColor}`}>
                        <span>{item.badge.icon}</span>
                        <span>{item.badge.label}</span>
                      </span>
                      <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-full text-[10px] font-black">
                        +{item.points} Pts
                      </span>
                    </div>

                    <button
                      onClick={() => handleLike(item.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                        item.hasLiked
                          ? 'bg-red-50 text-red-500 border border-red-200'
                          : 'bg-card-bg border border-border text-muted hover:text-red-500'
                      }`}
                    >
                      <Heart size={14} className={item.hasLiked ? 'fill-red-500 text-red-500' : ''} />
                      <span>{item.likes}</span>
                    </button>
                  </div>
                </div>
              ))}

              {filteredKudos.length === 0 && (
                <div className="p-12 text-center text-muted border border-border rounded-3xl bg-card-bg">
                  Không tìm thấy bài vinh danh nào phù hợp.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Leaderboard & Reward Store */}
        <div className="space-y-8">
          
          {/* Section: Leaderboard */}
          <div className="bg-card-bg border border-border p-6 rounded-3xl shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <Trophy className="text-[#a21caf]" size={20} />
              <h2 className="text-lg font-bold text-foreground">Bảng Vàng Danh Vọng (Tháng)</h2>
            </div>
            
            <div className="space-y-3">
              {leaderboard.slice(0, 3).map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between p-3 rounded-2xl bg-muted-bg/5 border border-border/50 hover:bg-muted-bg/10 transition-colors">
                  <div className="flex items-center gap-3">
                    {/* Rank Badge */}
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs ${
                      idx === 0 ? 'bg-amber-400 text-white' :
                      idx === 1 ? 'bg-slate-300 text-slate-800' :
                      'bg-amber-600 text-white'
                    }`}>
                      {idx + 1}
                    </span>
                    <img src={item.avatar} alt={item.name} className="w-9 h-9 rounded-full object-cover border border-border" />
                    <div>
                      <h4 className="text-xs font-bold text-foreground leading-snug">{item.name}</h4>
                      <p className="text-[10px] text-muted leading-tight">{item.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-emerald-600">{item.receivedPoints} Pts</span>
                    <p className="text-[9px] text-muted">Nhận</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Reward Store */}
          <div id="store" className="bg-card-bg border border-border p-6 rounded-3xl shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Gift className="text-emerald-500" size={20} />
                <h2 className="text-lg font-bold text-foreground">Kudos Gift Store</h2>
              </div>
              <span className="text-xs text-muted font-semibold">Tích lũy & Đổi quà</span>
            </div>

            <div className="space-y-4">
              {REWARDS.map((reward) => {
                const isRedeemed = redeemedRewards.includes(reward.id);
                return (
                  <div 
                    key={reward.id} 
                    className="border border-border rounded-2xl overflow-hidden bg-card-bg shadow-2xs hover:shadow-xs transition-shadow duration-300"
                  >
                    <div className="relative aspect-[16/8] bg-black">
                      <img src={reward.image} alt={reward.title} className="object-cover w-full h-full opacity-80" />
                      <span className="absolute top-3 left-3 bg-emerald-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                        {reward.category}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-xs font-bold text-foreground leading-snug">{reward.title}</h4>
                        <span className="text-xs font-black text-emerald-600 flex-shrink-0 bg-emerald-50 px-2 py-0.5 rounded">
                          {reward.pointsCost} Pts
                        </span>
                      </div>
                      <p className="text-[10px] text-muted leading-relaxed line-clamp-2">{reward.description}</p>
                      
                      <button
                        onClick={() => handleRedeem(reward)}
                        className={`w-full py-2 font-bold text-xs rounded-xl shadow-3xs transition-all duration-300 ${
                          isRedeemed 
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed flex items-center justify-center gap-1' 
                            : userPoints >= reward.pointsCost
                              ? 'bg-gradient-to-r from-emerald-500 to-[#8f3f71] hover:from-emerald-600 hover:to-[#701a75] text-white'
                              : 'bg-muted-bg/10 border border-border text-muted hover:bg-muted-bg/30'
                        }`}
                        disabled={isRedeemed}
                      >
                        {isRedeemed ? (
                          <>
                            <Check size={12} /> Đã Đổi Quà
                          </>
                        ) : (
                          `Đổi Quà (${reward.pointsCost} Pts)`
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
