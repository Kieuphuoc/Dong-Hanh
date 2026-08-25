'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  CheckCircle, 
  Search, 
  Trophy, 
  Sparkles, 
  BookMarked, 
  MessageSquare, 
  Code, 
  ArrowRight, 
  X, 
  AlertTriangle, 
  Lightbulb, 
  FileText, 
  Check, 
  HelpCircle,
  ChevronRight,
  Send
} from 'lucide-react';

// ==========================================
// MOCK DATA: PROCESS MAP
// ==========================================
interface ProcessStep {
  id: number;
  title: string;
  shortDesc: string;
  deliverables: string[];
  techniques: string[];
  mistakes: string[];
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    id: 1,
    title: 'Requirement Elicitation',
    shortDesc: 'Khơi gợi và thu thập yêu cầu từ Stakeholders.',
    deliverables: [
      'Meeting Minutes (Biên bản họp)',
      'Elicitation Activity Plan (Kế hoạch khơi gợi)',
      'Stakeholder List & Persona'
    ],
    techniques: [
      'Brainstorming & Workshops',
      'Interviews (Phỏng vấn cá nhân)',
      'Surveys/Questionnaires (Khảo sát)',
      'Document Analysis (Phân tích tài liệu)'
    ],
    mistakes: [
      'Chỉ hỏi "Khách hàng muốn gì" thay vì "Vấn đề của khách hàng là gì".',
      'Không xác định rõ các Stakeholders ẩn (Ví dụ: Dev team hoặc UAT team).',
      'Bỏ qua việc ghi âm/ghi chép dẫn đến sai lệch thông tin sau cuộc họp.'
    ]
  },
  {
    id: 2,
    title: 'Analysis & Modeling',
    shortDesc: 'Phân tích, phân loại cấu trúc và trực quan hóa quy trình.',
    deliverables: [
      'As-Is & To-Be Flowcharts',
      'Usecase Diagram & Activity Diagram',
      'Data Flow Diagram (DFD)',
      'Product Backlog (Danh sách tính năng)'
    ],
    techniques: [
      'BPMN 2.0 (Business Process Model and Notation)',
      'UML Modeling',
      'Gap Analysis (Phân tích khoảng trống)',
      'Root Cause Analysis (Fishbone/5 Whys)'
    ],
    mistakes: [
      'Vẽ quy trình quá phức tạp hoặc quá sơ sài khiến Dev không thể code.',
      'Không phân biệt rõ luồng hoạt động chính (Happy Path) và luồng ngoại lệ (Edge Cases).',
      'Lập mô hình To-Be thiếu tính thực tế so với giới hạn hạ tầng công nghệ hiện tại.'
    ]
  },
  {
    id: 3,
    title: 'Documentation (BRD/SRS/User Story)',
    shortDesc: 'Tài liệu hóa yêu cầu thành đặc tả chi tiết dễ hiểu.',
    deliverables: [
      'Business Requirement Document (BRD)',
      'System Requirement Specification (SRS)',
      'User Stories & Acceptance Criteria (AC)'
    ],
    techniques: [
      'Gherkin Syntax (Given-When-Then)',
      'INVEST Criteria verification',
      'Wireframing / Prototyping (Figma, Balsamiq)'
    ],
    mistakes: [
      'Viết tài liệu quá hàn lâm, dùng nhiều từ ngữ đa nghĩa gây hiểu nhầm.',
      'Thiếu tiêu chí nghiệm thu (Acceptance Criteria) rõ ràng và đo lường được.',
      'Tài liệu không được quản lý phiên bản (Version Control), dẫn đến tranh chấp thông tin.'
    ]
  },
  {
    id: 4,
    title: 'Dev & Testing Support',
    shortDesc: 'Hỗ trợ đội ngũ Lập trình và Kiểm thử làm mịn yêu cầu.',
    deliverables: [
      'Product Backlog Refinement Minutes',
      'Jira Ticket Updates',
      'Clarification Log'
    ],
    techniques: [
      'Three Amigos (BA + Dev + QA)',
      'Estimation Workshops (Planning Poker)',
      'Walkthrough Sessions'
    ],
    mistakes: [
      'Xem nhẹ khâu Grooming/Refinement, phó mặc cho Dev tự hiểu tài liệu.',
      'Thay đổi yêu cầu đột ngột mà không thông báo hoặc cập nhật Jira tickets.',
      'Trả lời các câu hỏi của Dev chậm trễ, gây tắc nghẽn (Block) tiến độ dự án.'
    ]
  },
  {
    id: 5,
    title: 'UAT & Handover',
    shortDesc: 'Kiểm thử chấp nhận người dùng và bàn giao sản phẩm.',
    deliverables: [
      'UAT Test Cases & Scenarios',
      'UAT Sign-off document',
      'User Guide & Release Notes'
    ],
    techniques: [
      'User Acceptance Testing (UAT)',
      'End-User Training',
      'Feedback Collection & Retrospective'
    ],
    mistakes: [
      'Không định nghĩa trước tiêu chí nghiệm thu bàn giao (Definition of Done - DoD).',
      'Để khách hàng UAT trực tiếp mà không có sự hướng dẫn hoặc lọc lỗi trước.',
      'Bỏ qua khâu Retrospective (Họp rút kinh nghiệm) sau khi dự án kết thúc.'
    ]
  }
];

// ==========================================
// MOCK DATA: BA DICTIONARY
// ==========================================
interface DictionaryTerm {
  word: string;
  category: 'ba-jargon' | 'tech' | 'domain';
  def: string;
  devSpeak: string;
}

const DICTIONARY_TERMS: DictionaryTerm[] = [
  {
    word: 'Scope Creep',
    category: 'ba-jargon',
    def: 'Hiện tượng phạm vi dự án bị phình to liên tục ngoài tầm kiểm soát ban đầu mà không có sự điều chỉnh tương ứng về thời gian hay chi phí.',
    devSpeak: '"Chào anh/chị, tính năng này nằm ngoài Scope đã thống nhất cho Sprint này. Em sẽ Log lại vào Backlog và chúng ta sẽ Review độ ưu tiên cùng Product Owner ở buổi Refinement tiếp theo nhé."'
  },
  {
    word: 'Acceptance Criteria (AC)',
    category: 'ba-jargon',
    def: 'Tiêu chí nghiệm thu - các điều kiện cụ thể mà một User Story hoặc tính năng phần mềm phải đáp ứng để được coi là hoàn thành.',
    devSpeak: '"Em đã viết sẵn các kịch bản Given-When-Then cho ticket này rồi. Mọi người xem qua xem có cover hết các trường hợp API trả về lỗi chưa nhé."'
  },
  {
    word: 'API (Application Programming Interface)',
    category: 'tech',
    def: 'Giao diện lập trình ứng dụng - phương thức trung gian cho phép hai hệ thống, ứng dụng khác nhau giao tiếp và trao đổi dữ liệu với nhau.',
    devSpeak: '"Tính năng này mình sẽ call qua API của bên thứ 3 hay là tự viết API nội bộ vậy anh? Nhờ anh cung cấp giúp em danh sách các Parameters đầu vào/đầu ra nhé."'
  },
  {
    word: 'Database Schema',
    category: 'tech',
    def: 'Cấu trúc thiết kế của cơ sở dữ liệu mô tả các bảng, mối quan hệ giữa các bảng (1-1, 1-n, n-n) và các trường thông tin.',
    devSpeak: '"Để hỗ trợ hiển thị lịch sử mua hàng, mình có cần chỉnh sửa gì Database Schema hiện tại hay tạo bảng mới không anh? Em muốn nắm cấu trúc để viết Data Mapping."'
  },
  {
    word: 'JSON (JavaScript Object Notation)',
    category: 'tech',
    def: 'Một định dạng dữ liệu dạng text gọn nhẹ, dễ đọc viết bởi con người và dễ phân tích bởi máy tính, thường được dùng để truyền dữ liệu qua API.',
    devSpeak: '"API trả về định dạng JSON đúng không anh? Nhờ anh gửi em file JSON mẫu của response để em phân tích cấu trúc dữ liệu hiển thị lên UI nhé."'
  },
  {
    word: 'Edge Case',
    category: 'tech',
    def: 'Trường hợp biên - tình huống bất thường hoặc hiếm gặp xảy ra ở giới hạn hoạt động cao nhất hoặc thấp nhất của hệ thống.',
    devSpeak: '"Em có ghi thêm một vài Edge Cases trong ticket, ví dụ như khi người dùng mất mạng đột ngột lúc đang nhấn Thanh toán. Mình xử lý Rollback giao dịch ở case này thế nào?"'
  },
  {
    word: 'UAT (User Acceptance Testing)',
    category: 'ba-jargon',
    def: 'Kiểm thử chấp nhận người dùng - giai đoạn cuối cùng trong quy trình phát triển phần mềm, nơi người dùng thật chạy thử để xác nhận phần mềm đúng nhu cầu.',
    devSpeak: '"Tuần tới khách hàng sẽ bắt đầu UAT. Em đã phân loại các kịch bản nghiệm thu chính. Team mình có thể hỗ trợ túc trực nếu có issue blocker phát sinh không ạ?"'
  },
  {
    word: 'SaaS (Software as a Service)',
    category: 'domain',
    def: 'Mô hình phân phối phần mềm dịch vụ, nơi ứng dụng được lưu trữ trên đám mây và người dùng trả phí thuê bao hàng tháng/năm để sử dụng.',
    devSpeak: '"Vì dự án của mình chạy theo mô hình SaaS Multi-tenant, chúng ta cần đảm bảo dữ liệu giữa các Tenant được cô lập hoàn toàn ở tầng cơ sở dữ liệu."'
  },
  {
    word: 'Payment Gateway',
    category: 'domain',
    def: 'Cổng thanh toán - dịch vụ trung gian kết nối tài khoản người mua với tài khoản người bán trực tuyến (ví dụ: VNPay, Momo, Stripe).',
    devSpeak: '"Hệ thống sẽ tích hợp Payment Gateway của VNPay. Em đã nhận được tài liệu tích hợp (SDK/API Docs) từ họ, em sẽ tạo ticket đính kèm tài liệu này cho team mình."'
  }
];

// ==========================================
// MOCK DATA: SCENARIO SIMULATOR
// ==========================================
interface Scenario {
  id: number;
  title: string;
  problem: string;
  perspective: {
    business: string;
    tech: string;
    user: string;
  };
  sampleAnswer: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: 'Xử lý Scope Creep cận kề ngày Release',
    problem: 'Khách hàng đột xuất yêu cầu thêm tính năng "Đăng nhập bằng vân tay/Khuôn mặt" vào app ngay trước ngày dự kiến Release 5 ngày. Dự án đang chạy nước rút và Dev Team đang rất căng thẳng.',
    perspective: {
      business: 'Muốn chiều khách hàng để giữ mối quan hệ lâu dài và tăng độ uy tín cạnh tranh.',
      tech: 'Tuyệt đối phản đối vì rủi ro vỡ trận Sprint, không đủ thời gian Test bảo mật và Code có nguy cơ lỗi hệ thống.',
      user: 'Tiện lợi hơn, nhưng họ cũng không muốn dùng một phiên bản app lỗi, không ổn định.'
    },
    sampleAnswer: 'Chào anh/chị, em ghi nhận tính năng Đăng nhập sinh trắc học rất hữu ích cho người dùng. Tuy nhiên, do chỉ còn 5 ngày là Release và Dev team đã chốt phạm vi kiểm thử, việc đưa thêm tính năng này ngay sẽ rủi ro lớn làm chậm ngày ra mắt hoặc gây lỗi bảo mật. Em đề xuất chúng ta sẽ đưa tính năng này vào đầu Backlog cho Version 1.1 (ngay sau đợt này 2 tuần). Em sẽ phân tích spec và chuyển cho Dev team đánh giá trước để sẵn sàng code ngay khi bản V1.0 On-air.'
  },
  {
    id: 2,
    title: 'Dev từ chối làm tính năng vì "Phức tạp & Không cần thiết"',
    problem: 'Bạn thiết kế một bộ lọc tìm kiếm nâng cao đa tiêu chí. Lead Developer thẳng thừng từ chối vì cho rằng cấu trúc database hiện tại không hỗ trợ truy vấn phức tạp như thế và tốn quá nhiều công sức làm frontend.',
    perspective: {
      business: 'Cần bộ lọc này để Sales tư vấn khách hàng VIP tìm kiếm thông tin nhanh hơn, tăng tỉ lệ chốt đơn.',
      tech: 'Hạ tầng hiện tại quá tải nếu chạy câu lệnh SQL phức tạp, tốn thời gian tối ưu hóa chỉ mục (indexes).',
      user: 'Thích bộ lọc nhanh, nhưng nếu có giải pháp thay thế đơn giản hơn (như lọc theo nhóm lớn) thì vẫn chấp nhận được.'
    },
    sampleAnswer: 'Mình sẽ thảo luận với Lead Dev để hiểu rõ khó khăn về database. Sau đó, đề xuất một giải pháp "Hybrid": Sprint này mình chỉ lọc theo 3 tiêu chí phổ biến nhất (chiếm 80% nhu cầu) thay vì 10 tiêu chí nâng cao, để giảm tải cho database và frontend. Đồng thời ghi nhận giải pháp tối ưu database dài hạn vào Technical Debt backlog.'
  },
  {
    id: 3,
    title: 'Client đổi Requirement sát nút do luật pháp thay đổi',
    problem: 'Nhà nước vừa ban hành quy định mới về thuế suất áp dụng cho sản phẩm của doanh nghiệp bạn, hiệu lực bắt đầu sau 1 tuần. Yêu cầu tính toán hóa đơn trong hệ thống của bạn phải thay đổi ngay lập tức, mặc dù code đã đóng gói.',
    perspective: {
      business: 'Bắt buộc phải đổi để tuân thủ pháp luật, nếu không doanh nghiệp sẽ bị phạt nặng hoặc đình chỉ hoạt động.',
      tech: 'Ức chế vì phải làm thêm giờ (OT), sửa đổi cấu trúc công thức tính toán lõi có thể gây ảnh hưởng dây chuyền đến báo cáo doanh thu.',
      user: 'Mong muốn hóa đơn hiển thị chính xác tiền thuế họ phải trả theo đúng quy định mới.'
    },
    sampleAnswer: 'Vì đây là yêu cầu tuân thủ pháp lý (Compliance), chúng ta bắt buộc phải thực hiện. Mình sẽ tổ chức ngay một cuộc họp khẩn với PM, Tech Lead và QA. Phân rã công việc tối giản nhất có thể để đáp ứng luật mới trước. Tạm hoãn các ticket không khẩn cấp khác trong Sprint hiện tại sang Sprint sau để giải phóng tài nguyên cho Dev tập trung sửa module thuế.'
  }
];

export default function BAMasteryHub() {
  // Pure tab control: 'process' | 'dictionary' | 'simulator' | 'playground'
  const [activeTab, setActiveTab] = useState<string>('process');

  // STREAK & PROGRESS STATE
  const [streak, setStreak] = useState<number>(3);
  const [studiedWords, setStudiedWords] = useState<string[]>([]);
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);
  const [completedScenarios, setCompletedScenarios] = useState<number[]>([]);
  const [storyValidatedCount, setStoryValidatedCount] = useState<number>(0);

  // Dynamic progress calculation
  const totalItems = PROCESS_STEPS.length + DICTIONARY_TERMS.length + SCENARIOS.length + 1; // plus 1 for user story
  const currentCompleted = completedSteps.length + studiedWords.length + completedScenarios.length + (storyValidatedCount > 0 ? 1 : 0);
  const progressPercent = Math.min(100, Math.round((currentCompleted / totalItems) * 100));

  // MODULE 1: PROCESS MAP STATES
  const [selectedStep, setSelectedStep] = useState<ProcessStep | null>(null);

  // MODULE 2: DICTIONARY STATES
  const [dictTab, setDictTab] = useState<'all' | 'ba-jargon' | 'tech' | 'domain'>('all');
  const [dictSearch, setDictSearch] = useState<string>('');

  // MODULE 3: SCENARIO STATES
  const [selectedScenarioId, setSelectedScenarioId] = useState<number>(SCENARIOS[0].id);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [evaluationResult, setEvaluationResult] = useState<{
    score: number;
    starAnalysis: { s: string; t: string; a: string; r: string };
    feedback: string;
    points: string[];
  } | null>(null);
  const [evaluating, setEvaluating] = useState<boolean>(false);

  // MODULE 4: PLAYGROUND / INVEST STATES
  const [storyTitle, setStoryTitle] = useState('');
  const [storyAsA, setStoryAsA] = useState('');
  const [storyIWantTo, setStoryIWantTo] = useState('');
  const [storySoThat, setStorySoThat] = useState('');
  const [storyCriteria, setStoryCriteria] = useState('');
  const [investReport, setInvestReport] = useState<{
    independent: { ok: boolean; msg: string };
    negotiable: { ok: boolean; msg: string };
    valuable: { ok: boolean; msg: string };
    estimable: { ok: boolean; msg: string };
    small: { ok: boolean; msg: string };
    testable: { ok: boolean; msg: string };
    score: number;
  } | null>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedStreak = localStorage.getItem('ba_mastery_streak');
    if (savedStreak) setStreak(parseInt(savedStreak));

    const savedWords = localStorage.getItem('ba_mastery_words');
    if (savedWords) setStudiedWords(JSON.parse(savedWords));

    const savedSteps = localStorage.getItem('ba_mastery_steps');
    if (savedSteps) setCompletedSteps(JSON.parse(savedSteps));

    const savedScenarios = localStorage.getItem('ba_mastery_scenarios');
    if (savedScenarios) setCompletedScenarios(JSON.parse(savedScenarios));
  }, []);

  const handleStepClick = (step: ProcessStep) => {
    setSelectedStep(step);
    if (!completedSteps.includes(step.id)) {
      const updated = [...completedSteps, step.id];
      setCompletedSteps(updated);
      localStorage.setItem('ba_mastery_steps', JSON.stringify(updated));
    }
  };

  const handleToggleWord = (word: string) => {
    let updated: string[];
    if (studiedWords.includes(word)) {
      updated = studiedWords.filter(w => w !== word);
    } else {
      updated = [...studiedWords, word];
    }
    setStudiedWords(updated);
    localStorage.setItem('ba_mastery_words', JSON.stringify(updated));
  };

  const handleIncrementStreak = () => {
    const nextStreak = streak + 1;
    setStreak(nextStreak);
    localStorage.setItem('ba_mastery_streak', nextStreak.toString());
  };

  // Evaluate scenario answer (STAR evaluation algorithm)
  const handleEvaluateScenario = () => {
    if (!userAnswer.trim()) return;

    setEvaluating(true);
    setTimeout(() => {
      const scenario = SCENARIOS.find(s => s.id === selectedScenarioId);
      if (!scenario) return;

      const text = userAnswer.toLowerCase();
      
      let score = 50; // base score
      const points: string[] = [];

      // Check keywords for Situation
      const hasSituation = text.includes('release') || text.includes('ngày') || text.includes('deadline') || text.includes('phạm vi') || text.includes('yêu cầu') || text.includes('luật');
      if (hasSituation) {
        score += 12;
        points.push('Nhận diện rõ bối cảnh tình huống cấp bách.');
      } else {
        points.push('Nên làm rõ tính nghiêm trọng của tình huống (cận deadline, rủi ro phạt...).');
      }

      // Check Task
      const hasTask = text.includes('phân tích') || text.includes('tìm hiểu') || text.includes('làm rõ') || text.includes('họp') || text.includes('thảo luận') || text.includes('trao đổi');
      if (hasTask) {
        score += 13;
        points.push('Xác định chính xác vai trò cầu nối của BA để điều phối giải pháp.');
      } else {
        points.push('Cần bổ sung hành động khảo sát nguyên nhân cốt lõi trước khi đề xuất giải pháp.');
      }

      // Check Action
      const hasAction = text.includes('đề xuất') || text.includes('chia nhỏ') || text.includes('phase') || text.includes('sprint') || text.includes('backlog') || text.includes('thay thế') || text.includes('giải pháp');
      const hasDevCollaboration = text.includes('dev') || text.includes('tech lead') || text.includes('lập trình') || text.includes('kiểm thử') || text.includes('qa');
      
      if (hasAction) {
        score += 15;
        points.push('Đề xuất giải pháp mang tính khả thi, phân kỳ hoặc tối giản hóa yêu cầu.');
      } else {
        points.push('Thiếu định hướng chia nhỏ hạng mục hoặc lập lộ trình cuốn chiếu.');
      }

      if (hasDevCollaboration) {
        score += 10;
        points.push('Chủ động lắng nghe ý kiến kỹ thuật từ lập trình viên để dung hòa.');
      } else {
        points.push('Nên đề cập đến việc tham vấn trực tiếp với team Dev/Technical Lead.');
      }

      // Check Result
      const hasResult = text.includes('bảo đảm') || text.includes('tránh rủi ro') || text.includes('kế hoạch') || text.includes('release') || text.includes('hoàn thành');
      if (hasResult) {
        score += 10;
        points.push('Tập trung bảo vệ giá trị cốt lõi của sản phẩm và hạn chế rủi ro cho doanh nghiệp.');
      }

      score = Math.min(100, score);

      // Auto STAR breakdown
      const starAnalysis = {
        s: hasSituation ? 'Xác định xuất sắc: Bạn đã nêu rõ các điều kiện biên và rủi ro trực tiếp.' : 'Chưa rõ nét: Nên phác họa lại tính khẩn cấp của bài toán.',
        t: hasTask ? 'Đầy đủ: Định nghĩa tốt nhiệm vụ của một BA là làm rõ vấn đề và tối ưu hóa giải pháp.' : 'Thiếu sót: Nên định vị rõ bạn cần tìm hiểu điều gì từ các bên.',
        a: hasAction ? 'Khả thi: Đã đưa ra các bước xử lý cụ thể (phân kỳ dự án, đàm phán backlog).' : 'Còn mơ hồ: Cần ghi rõ kế hoạch triển khai (ví dụ họp 3 bên, dời việc không quan trọng).',
        r: hasResult ? 'Thực tế: Hướng đến mục tiêu bảo vệ tiến độ release và tối ưu hóa trải nghiệm người dùng.' : 'Hơi lỏng lẻo: Nên cam kết kết quả đầu ra rõ ràng để thuyết phục các bên.'
      };

      let feedback = '';
      if (score >= 85) {
        feedback = 'Tuyệt vời! Giải pháp của bạn thể hiện tư duy xử lý tình huống khéo léo, cân bằng tốt giữa lợi ích kinh doanh của Client và năng lực kỹ thuật của Dev Team. Bạn áp dụng đúng quy trình quản lý thay đổi (Change Management) và giao tiếp khéo léo.';
      } else if (score >= 70) {
        feedback = 'Khá tốt. Phương án giải quyết hợp lý nhưng cần chú trọng giao tiếp mềm mỏng hơn hoặc tham khảo kỹ ý kiến của đội ngũ Dev trước khi tự mình đưa ra cam kết với khách hàng.';
      } else {
        feedback = 'Cần cải thiện. Câu trả lời của bạn hơi thiên vị một chiều (hoặc chỉ chiều khách hàng, hoặc chỉ bênh vực Dev) mà thiếu giải pháp dung hòa hoặc chưa tối ưu hóa quy trình BA.';
      }

      setEvaluationResult({
        score,
        starAnalysis,
        feedback,
        points
      });

      if (!completedScenarios.includes(selectedScenarioId)) {
        const updated = [...completedScenarios, selectedScenarioId];
        setCompletedScenarios(updated);
        localStorage.setItem('ba_mastery_scenarios', JSON.stringify(updated));
      }

      setEvaluating(false);
    }, 1200);
  };

  // Run INVEST User Story Validation
  const handleValidateINVEST = () => {
    const indepCheck = !storyIWantTo.toLowerCase().includes('phụ thuộc vào') && 
                       !storyIWantTo.toLowerCase().includes('đợi') && 
                       !storyAsA.toLowerCase().includes('đợi');
                       
    const negoCheck = storyCriteria.length < 500 && 
                      !storyIWantTo.toLowerCase().includes('bắt buộc code bằng') && 
                      !storyCriteria.toLowerCase().includes('viết code');

    const valuableCheck = storySoThat.trim().length > 15 && 
                          !storySoThat.toLowerCase().includes('cho có') && 
                          !storySoThat.toLowerCase().includes('làm cái này');

    const estimableCheck = storyIWantTo.trim().length > 10 && 
                           !storyIWantTo.toLowerCase().includes('làm mọi thứ') && 
                           !storyIWantTo.toLowerCase().includes('vân vân');

    const smallCheck = (storyTitle + storyAsA + storyIWantTo + storySoThat).length < 350;

    const testableCheck = storyCriteria.toLowerCase().includes('given') || 
                          storyCriteria.toLowerCase().includes('when') || 
                          storyCriteria.toLowerCase().includes('then') || 
                          storyCriteria.toLowerCase().includes('kết quả') || 
                          storyCriteria.toLowerCase().includes('hiển thị') ||
                          storyCriteria.toLowerCase().includes('kiểm tra');

    let score = 0;
    if (indepCheck) score += 17;
    if (negoCheck) score += 17;
    if (valuableCheck) score += 17;
    if (estimableCheck) score += 17;
    if (smallCheck) score += 17;
    if (testableCheck) score += 17;

    setInvestReport({
      independent: {
        ok: indepCheck,
        msg: indepCheck 
          ? 'Đạt yêu cầu. User Story không chứa các từ khóa ràng buộc hoặc liên kết cứng với các Story khác.' 
          : 'Cần sửa: Phát hiện từ khóa phụ thuộc ("đợi", "phụ thuộc vào"). Một User Story lý tưởng nên có thể triển khai độc lập.'
      },
      negotiable: {
        ok: negoCheck,
        msg: negoCheck 
          ? 'Đạt yêu cầu. Mô tả tập trung vào hành vi người dùng, không can thiệp sâu vào giải pháp công nghệ/thiết kế UI chi tiết.' 
          : 'Cần sửa: Yêu cầu của bạn đang quá chi tiết về mặt kỹ thuật, hạn chế sự sáng tạo của Dev Team.'
      },
      valuable: {
        ok: valuableCheck,
        msg: valuableCheck 
          ? 'Đạt yêu cầu. Phần "So that..." làm rõ giá trị doanh nghiệp hoặc giá trị mang lại cho người dùng.' 
          : 'Cần sửa: Hãy viết cụ thể giá trị thực tế mang lại là gì thay vì mô tả hời hợt.'
      },
      estimable: {
        ok: estimableCheck,
        msg: estimableCheck 
          ? 'Đạt yêu cầu. Mô tả chức năng rõ ràng, đủ cơ sở để Dev Team tiến hành ước lượng (estimation).' 
          : 'Cần sửa: Mô tả quá mơ hồ hoặc quá rộng khiến Dev Team khó đánh giá độ phức tạp.'
      },
      small: {
        ok: smallCheck,
        msg: smallCheck 
          ? 'Đạt yêu cầu. Phạm vi của User Story đủ nhỏ gọn để hoàn thành trong một Sprint đơn lẻ.' 
          : 'Cần sửa: Story quá dài hoặc ôm đồm nhiều tính năng, hãy cân nhắc chia nhỏ nó ra.'
      },
      testable: {
        ok: testableCheck,
        msg: testableCheck 
          ? 'Đạt yêu cầu. Acceptance Criteria chứa các từ khóa định lượng hoặc kịch bản kiểm thử (Given-When-Then, kiểm tra...).' 
          : 'Cần sửa: Acceptance Criteria thiếu tính kiểm thử. Hãy dùng cấu trúc Given-When-Then để Tester dễ viết Test Case.'
      },
      score
    });

    setStoryValidatedCount(prev => prev + 1);
  };

  const handleResetScenario = () => {
    setUserAnswer('');
    setEvaluationResult(null);
  };

  // Filter dictionary terms based on search & category
  const filteredTerms = DICTIONARY_TERMS.filter(item => {
    const matchesTab = dictTab === 'all' || item.category === dictTab;
    const matchesSearch = item.word.toLowerCase().includes(dictSearch.toLowerCase()) || 
                          item.def.toLowerCase().includes(dictSearch.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div 
      className="w-full text-slate-800 font-sans space-y-8"
      style={{ fontFamily: 'var(--font-quicksand), sans-serif' }}
    >
      
      {/* ==========================================
          HEADER & DASHBOARD BANNER (Green & Orange)
         ========================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0fa968] to-[#f97316] p-8 text-white shadow-lg">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider">
                BA Mastery Hub
              </span>
              <span className="flex items-center gap-1 text-[#fdf4ff] text-[10px] font-extrabold bg-[#fae8ff]/20 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                <Sparkles size={11} className="fill-white text-white" /> Interactive Platform
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              BA Mastery Hub
            </h1>
            <p className="text-emerald-55 mt-2 text-sm max-w-xl font-medium leading-relaxed">
              Trang web học tập chuyên biệt dành cho Business Analyst mới bắt đầu. Rèn luyện quy trình chuẩn, từ vựng kỹ thuật, giao tiếp Dev và tư duy tình huống phỏng vấn khó.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl w-full xl:w-auto">
            {/* Progress Bar Container */}
            <div className="flex-grow sm:flex-grow-0 sm:w-48">
              <div className="flex justify-between items-center mb-1.5 text-xs text-white">
                <span className="font-bold">Tiến độ học tập</span>
                <span className="font-extrabold text-amber-250">{progressPercent}%</span>
              </div>
              <div className="w-full bg-white/30 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-400 h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="h-10 w-[1px] bg-white/20 hidden sm:block" />

            {/* Streak Counter */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center text-white">
                <Trophy size={18} className="fill-white/10" />
              </div>
              <div>
                <div className="text-[9px] text-emerald-100 uppercase tracking-widest font-extrabold font-mono">Streak ngày</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-white">{streak} ngày</span>
                  <button 
                    onClick={handleIncrementStreak}
                    className="text-[9px] bg-white text-emerald-700 hover:bg-amber-100 px-2 py-0.5 rounded font-black transition-all"
                  >
                    +1 Ngày
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          TAB NAVIGATION MENU (Green / Orange)
         ========================================== */}
      <div className="flex border border-[#dfebd6] p-1 bg-white rounded-2xl max-w-full overflow-x-auto scrollbar-none shadow-sm">
        {[
          { id: 'process', label: 'Quy trình BA', icon: CheckCircle },
          { id: 'dictionary', label: 'Từ điển Thuật ngữ', icon: BookMarked },
          { id: 'simulator', label: 'Phòng Luyện Phỏng Vấn', icon: MessageSquare },
          { id: 'playground', label: 'BA Playground', icon: Code },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setEvaluationResult(null);
              }}
              className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 flex-1 ${
                isActive
                  ? 'bg-[#0fa968] text-white shadow-md shadow-[#0fa968]/20 scale-[1.01]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-[#e5efe9]/55'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ==========================================
          TAB 1: PROCESS MAP (TAB CONTENT)
         ========================================== */}
      {activeTab === 'process' && (
        <div className="bg-white border border-[#dfebd6] rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle className="text-[#0fa968]" size={22} /> Sơ đồ Quy trình BA (Interactive Process Map)
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              Quy trình phát triển phần mềm chuẩn chỉnh gồm 5 giai đoạn chính của BA. Click vào từng bước để khám phá chi tiết.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 relative pt-4">
            {PROCESS_STEPS.map((step, idx) => {
              const isCompleted = completedSteps.includes(step.id);
              return (
                <div 
                  key={step.id} 
                  onClick={() => handleStepClick(step)}
                  className={`relative bg-[#f1f8f5]/40 border rounded-2xl p-5 cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 flex flex-col justify-between group ${
                    isCompleted 
                      ? 'border-[#0fa968]/50 bg-[#e5efe9]/30 hover:border-[#0fa968] shadow-xs' 
                      : 'border-slate-200 hover:border-slate-350 bg-white'
                  }`}
                >
                  {/* Step Connector Arrow */}
                  {idx < PROCESS_STEPS.length - 1 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-3.5 -translate-y-1/2 z-10 w-6 h-6 items-center justify-center bg-white border border-[#dfebd6] rounded-full text-slate-400 group-hover:text-[#0fa968] transition-colors shadow-2xs">
                      <ChevronRight size={12} />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-2xl font-black text-slate-300 group-hover:text-[#0fa968]/20 transition-colors">
                        0{step.id}
                      </span>
                      {isCompleted && (
                        <span className="text-[9px] bg-[#e5efe9] text-[#0fa968] border border-[#0fa968]/20 px-2 py-0.5 rounded font-extrabold uppercase">
                          Đã xem
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-bold text-xs text-slate-800 group-hover:text-[#0fa968] transition-colors mb-2 leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed">
                      {step.shortDesc}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-[#0fa968] group-hover:underline">
                    Xem đặc tả kỹ thuật
                    <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal: Process Step Specification Details */}
          {selectedStep && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
              <div className="bg-white border border-[#dfebd6] w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-scale-up max-h-[85vh] flex flex-col">
                
                {/* Modal Header */}
                <div className="p-6 border-b border-[#dfebd6] bg-[#f1f8f5]/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-[#0fa968]/10 text-[#0fa968] flex items-center justify-center font-mono font-extrabold border border-[#0fa968]/20">
                      {selectedStep.id}
                    </span>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">{selectedStep.title}</h3>
                      <p className="text-xs text-slate-500">Đặc tả chi tiết vai trò của BA tại Phase này</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedStep(null)}
                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm leading-relaxed text-slate-700">
                  
                  {/* Deliverables Section */}
                  <div className="bg-[#f1f8f5]/40 border border-[#dfebd6] rounded-2xl p-4">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
                      <FileText size={16} className="text-sky-600" />
                      Sản phẩm bàn giao (Deliverables)
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedStep.deliverables.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-600 text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Techniques Section */}
                  <div className="bg-[#f1f8f5]/40 border border-[#dfebd6] rounded-2xl p-4">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
                      <Lightbulb size={16} className="text-amber-600" />
                      Kỹ thuật áp dụng (Techniques)
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedStep.techniques.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-600 text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Mistakes Section */}
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                    <h4 className="font-bold text-red-700 flex items-center gap-2 mb-3">
                      <AlertTriangle size={16} className="text-red-500" />
                      Sai lầm cốt tử cần tránh
                    </h4>
                    <ul className="space-y-2">
                      {selectedStep.mistakes.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-slate-600 text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-4 bg-[#f1f8f5]/30 border-t border-[#dfebd6] flex justify-end">
                  <button 
                    onClick={() => setSelectedStep(null)}
                    className="px-5 py-2.5 rounded-xl bg-[#0fa968] hover:bg-[#0c8c56] text-white font-bold text-xs shadow-md transition-colors"
                  >
                    Đóng cửa sổ
                  </button>
                </div>

              </div>
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          TAB 2: BA DICTIONARY (TAB CONTENT)
         ========================================== */}
      {activeTab === 'dictionary' && (
        <div className="bg-white border border-[#dfebd6] rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="text-[#0fa968]" size={22} /> Từ điển Thuật ngữ BA & Kỹ thuật
              </h2>
              <p className="text-slate-500 text-xs mt-1">
                Lọc và tìm kiếm các khái niệm kỹ thuật cốt lõi giúp thu hẹp khoảng cách giao tiếp giữa Business Analyst và Developer.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {/* Search Box */}
              <div className="relative flex-grow sm:w-60">
                <input 
                  type="text" 
                  placeholder="Tìm từ khóa..."
                  value={dictSearch}
                  onChange={(e) => setDictSearch(e.target.value)}
                  className="w-full bg-white border border-[#dfebd6] text-slate-800 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-[#0fa968] transition-colors"
                />
                <Search className="absolute left-3 top-3 text-slate-400" size={14} />
              </div>

              {/* Sub categories tabs */}
              <div className="flex rounded-xl bg-[#f1f8f5] p-1 border border-[#dfebd6] text-[10px] font-extrabold uppercase">
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'ba-jargon', label: 'BA Jargon' },
                  { id: 'tech', label: 'Tech' },
                  { id: 'domain', label: 'Domain' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setDictTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      dictTab === tab.id 
                        ? 'bg-[#0fa968] text-white' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dictionary Term Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
            {filteredTerms.map((term) => {
              const isStudied = studiedWords.includes(term.word);
              return (
                <div 
                  key={term.word}
                  className={`bg-white border rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 ${
                    isStudied 
                      ? 'border-[#0fa968]/50 bg-[#e5efe9]/20 shadow-xs' 
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        term.category === 'ba-jargon' 
                          ? 'bg-purple-55 text-purple-700 border border-purple-200' 
                          : term.category === 'tech'
                          ? 'bg-blue-55 text-blue-700 border border-blue-200'
                          : 'bg-amber-55 text-amber-700 border border-amber-200'
                      }`}>
                        {term.category === 'ba-jargon' ? 'BA Jargon' : term.category === 'tech' ? 'Tech Concept' : 'Domain Term'}
                      </span>
                      
                      <button 
                        onClick={() => handleToggleWord(term.word)}
                        className={`text-[9px] flex items-center gap-1 font-bold transition-all px-2 py-0.5 rounded-md border ${
                          isStudied 
                            ? 'bg-[#0fa968]/15 text-[#0fa968] border-[#0fa968]/30' 
                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:text-slate-800'
                        }`}
                      >
                        <Check size={9} />
                        {isStudied ? 'Đã nhớ' : 'Nhớ từ'}
                      </button>
                    </div>

                    <h3 className="text-sm font-extrabold text-slate-800 mb-1.5">{term.word}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">{term.def}</p>
                  </div>

                  {/* Dev speak mock box */}
                  <div className="bg-[#f1f8f5]/80 border border-[#dfebd6] rounded-xl p-3">
                    <div className="flex items-center gap-1 text-[#f97316] text-[9px] font-extrabold uppercase tracking-wider mb-1">
                      <MessageSquare size={12} />
                      How to Speak with Dev:
                    </div>
                    <p className="text-slate-700 italic text-[11px] leading-relaxed">
                      {term.devSpeak}
                    </p>
                  </div>
                </div>
              );
            })}
            
            {filteredTerms.length === 0 && (
              <div className="col-span-full py-16 text-center text-slate-400 text-xs">
                Không tìm thấy thuật ngữ phù hợp với từ khóa "{dictSearch}".
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 3: SCENARIO SIMULATOR (TAB CONTENT)
         ========================================== */}
      {activeTab === 'simulator' && (
        <div className="bg-white border border-[#dfebd6] rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="text-[#0fa968]" size={22} /> Phòng Luyện Phỏng Vấn & Tư Duy Tình Huống
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              Thực hành trả lời các câu hỏi tình huống hóc búa nhất của BA khi làm việc với Client và Dev Team.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* List side-column */}
            <div className="lg:col-span-4 space-y-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                Lựa chọn tình huống
              </span>
              {SCENARIOS.map((sc) => {
                const isActive = selectedScenarioId === sc.id;
                const isDone = completedScenarios.includes(sc.id);
                return (
                  <div
                    key={sc.id}
                    onClick={() => {
                      setSelectedScenarioId(sc.id);
                      setUserAnswer('');
                      setEvaluationResult(null);
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      isActive 
                        ? 'bg-[#e5efe9] border-[#0fa968]/50 shadow-xs text-slate-800 font-bold' 
                        : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[9px] font-bold text-[#0fa968] uppercase">Tình huống 0{sc.id}</span>
                      {isDone && (
                        <span className="text-[8px] font-extrabold bg-[#0fa968]/15 text-[#0fa968] border border-[#0fa968]/20 px-1.5 py-0.2 rounded uppercase">
                          Đã làm
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs line-clamp-1">{sc.title}</h4>
                  </div>
                );
              })}
            </div>

            {/* Content side-panel */}
            <div className="lg:col-span-8 bg-white border border-[#dfebd6] rounded-2xl p-5 sm:p-6 space-y-6">
              {(() => {
                const activeSc = SCENARIOS.find(s => s.id === selectedScenarioId);
                if (!activeSc) return null;
                return (
                  <div className="space-y-6">
                    {/* Problem Statement Card */}
                    <div className="bg-[#f1f8f5]/40 border border-[#dfebd6] rounded-xl p-4">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Đề bài bài toán</span>
                      <h3 className="font-extrabold text-sm text-[#0fa968] mt-1 mb-2">{activeSc.title}</h3>
                      <p className="text-xs text-slate-650 leading-relaxed">{activeSc.problem}</p>
                    </div>

                    {/* Suggestions box */}
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-2.5">
                        Gợi ý phân tích đa góc nhìn
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] leading-relaxed">
                        <div className="bg-purple-50 border border-purple-200 rounded-xl p-3.5">
                          <div className="font-bold text-purple-700 mb-1">💼 Business View</div>
                          <p className="text-slate-600">{activeSc.perspective.business}</p>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5">
                          <div className="font-bold text-blue-700 mb-1">🛠️ Tech/Dev View</div>
                          <p className="text-slate-600">{activeSc.perspective.tech}</p>
                        </div>
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5">
                          <div className="font-bold text-amber-700 mb-1">👤 User View</div>
                          <p className="text-slate-600">{activeSc.perspective.user}</p>
                        </div>
                      </div>
                    </div>

                    {/* Form answers */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Đề xuất giải pháp của bạn
                        </label>
                        <button 
                          onClick={() => setUserAnswer(activeSc.sampleAnswer)}
                          className="text-[10px] text-[#f97316] hover:underline flex items-center gap-1 font-bold"
                        >
                          <HelpCircle size={12} />
                          Tham khảo câu trả lời mẫu
                        </button>
                      </div>
                      <textarea
                        rows={4}
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Hãy nhập cách bạn ứng xử, thương thảo với Dev hoặc Client để dung hòa lợi ích..."
                        className="w-full bg-white border border-[#dfebd6] text-xs rounded-xl p-4 text-slate-800 focus:outline-none focus:border-[#0fa968] transition-colors"
                      />
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleEvaluateScenario}
                        disabled={evaluating || !userAnswer.trim()}
                        className="flex items-center gap-2 bg-[#0fa968] hover:bg-[#0c8c56] disabled:bg-slate-100 text-white disabled:text-slate-400 px-6 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
                      >
                        {evaluating ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Đang xử lý phân tích...
                          </>
                        ) : (
                          <>
                            <Send size={12} />
                            Nhờ AI Đánh giá
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleResetScenario}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border border-slate-200"
                      >
                        Xóa nháp
                      </button>
                    </div>

                    {/* Scoring and feedback results */}
                    {evaluationResult && (
                      <div className="bg-[#f1f8f5]/40 border border-[#dfebd6] rounded-xl p-5 space-y-4 animate-scale-up">
                        <div className="flex items-center justify-between border-b border-[#dfebd6] pb-3">
                          <span className="font-extrabold text-xs uppercase text-slate-500">Kết quả đánh giá giải pháp</span>
                          <div className="flex items-center gap-2 bg-[#0fa968]/10 border border-[#0fa968]/30 px-3 py-1 rounded-full text-[#0fa968] text-xs font-bold">
                            STAR Score: {evaluationResult.score}/100
                          </div>
                        </div>

                        <p className="text-xs text-slate-800 leading-relaxed font-semibold bg-[#e5efe9] border border-[#0fa968]/15 p-3 rounded-lg">
                          {evaluationResult.feedback}
                        </p>

                        {/* STAR Framework breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2">
                          <div className="bg-white border border-[#dfebd6] p-3 rounded-lg">
                            <span className="font-bold text-slate-500 block mb-0.5">S (Situation - Bối cảnh)</span>
                            <span className="text-[11px] text-slate-600">{evaluationResult.starAnalysis.s}</span>
                          </div>
                          <div className="bg-white border border-[#dfebd6] p-3 rounded-lg">
                            <span className="font-bold text-slate-500 block mb-0.5">T (Task - Nhiệm vụ BA)</span>
                            <span className="text-[11px] text-slate-600">{evaluationResult.starAnalysis.t}</span>
                          </div>
                          <div className="bg-white border border-[#dfebd6] p-3 rounded-lg">
                            <span className="font-bold text-slate-500 block mb-0.5">A (Action - Giải pháp đề xuất)</span>
                            <span className="text-[11px] text-slate-600">{evaluationResult.starAnalysis.a}</span>
                          </div>
                          <div className="bg-white border border-[#dfebd6] p-3 rounded-lg">
                            <span className="font-bold text-slate-500 block mb-0.5">R (Result - Kết quả hướng tới)</span>
                            <span className="text-[11px] text-slate-600">{evaluationResult.starAnalysis.r}</span>
                          </div>
                        </div>

                        {/* Highlights list */}
                        <div className="bg-white border border-[#dfebd6] rounded-xl p-3.5">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Điểm tốt trong phương án:</span>
                          <ul className="space-y-1.5 text-xs text-slate-600">
                            {evaluationResult.points.map((pt, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-[#0fa968] font-bold mt-0.5">✓</span>
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 4: BA PLAYGROUND / INVEST (TAB CONTENT)
         ========================================== */}
      {activeTab === 'playground' && (
        <div className="bg-white border border-[#dfebd6] rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Code className="text-[#0fa968]" size={22} /> BA Playground (Thực hành viết User Story)
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              Thử sức soạn thảo một User Story đạt chuẩn Agile. Hệ thống sẽ áp dụng quy tắc thẩm định INVEST để chấm điểm.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Editor form panel */}
            <div className="lg:col-span-7 bg-white border border-[#dfebd6] rounded-2xl p-5 sm:p-6 space-y-4">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                Soạn thảo đặc tả User Story
              </span>

              {/* Title input */}
              <div className="space-y-1">
                <label className="text-xs text-slate-650 font-bold">Tiêu đề User Story (Title)</label>
                <input 
                  type="text"
                  placeholder="VD: Đăng nhập bằng mã OTP qua SMS"
                  value={storyTitle}
                  onChange={(e) => setStoryTitle(e.target.value)}
                  className="w-full bg-white border border-[#dfebd6] text-xs rounded-xl p-3 text-slate-800 focus:outline-none focus:border-[#0fa968] transition-colors"
                />
              </div>

              {/* As a ... */}
              <div className="space-y-1">
                <label className="text-xs text-slate-650 font-bold">As a... (Người dùng / Vai trò)</label>
                <input 
                  type="text"
                  placeholder="VD: Người dùng chưa thiết lập mật khẩu"
                  value={storyAsA}
                  onChange={(e) => setStoryAsA(e.target.value)}
                  className="w-full bg-white border border-[#dfebd6] text-xs rounded-xl p-3 text-slate-800 focus:outline-none focus:border-[#0fa968] transition-colors"
                />
              </div>

              {/* I want to... */}
              <div className="space-y-1">
                <label className="text-xs text-slate-650 font-bold">I want to... (Tính năng mong muốn)</label>
                <textarea 
                  rows={2}
                  placeholder="VD: Nhập số điện thoại của tôi để nhận mã xác thực OTP 6 số và đăng nhập vào ứng dụng"
                  value={storyIWantTo}
                  onChange={(e) => setStoryIWantTo(e.target.value)}
                  className="w-full bg-white border border-[#dfebd6] text-xs rounded-xl p-3 text-slate-800 focus:outline-none focus:border-[#0fa968] transition-colors"
                />
              </div>

              {/* So that... */}
              <div className="space-y-1">
                <label className="text-xs text-slate-650 font-bold">So that... (Giá trị mang lại)</label>
                <textarea 
                  rows={2}
                  placeholder="VD: Tôi có thể đăng nhập nhanh chóng mà không cần nhớ mật khẩu tĩnh, đồng thời tăng tính bảo mật."
                  value={storySoThat}
                  onChange={(e) => setStorySoThat(e.target.value)}
                  className="w-full bg-white border border-[#dfebd6] text-xs rounded-xl p-3 text-slate-800 focus:outline-none focus:border-[#0fa968] transition-colors"
                />
              </div>

              {/* Acceptance Criteria */}
              <div className="space-y-1">
                <label className="text-xs text-slate-655 font-bold">Acceptance Criteria (Tiêu chí nghiệm thu - AC)</label>
                <textarea 
                  rows={4}
                  placeholder="VD:
Given tôi đang ở trang Đăng nhập OTP
When tôi nhập số điện thoại hợp lệ và bấm 'Gửi mã'
Then hệ thống gửi tin nhắn chứa mã OTP và hiển thị ô nhập mã.

Given tôi nhận được OTP
When tôi nhập đúng OTP trước 2 phút
Then hệ thống đăng nhập thành công."
                  value={storyCriteria}
                  onChange={(e) => setStoryCriteria(e.target.value)}
                  className="w-full bg-white border border-[#dfebd6] text-xs rounded-xl p-3 text-slate-800 focus:outline-none focus:border-[#0fa968] transition-colors"
                />
              </div>

              {/* Action trigger button */}
              <button
                onClick={handleValidateINVEST}
                className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white py-3 rounded-xl text-xs font-bold shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle size={15} />
                Thẩm định quy chuẩn INVEST
              </button>
            </div>

            {/* Validation feedback side-panel */}
            <div className="lg:col-span-5 bg-[#f1f8f5]/40 border border-[#dfebd6] rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-4">
                  Báo cáo Thẩm định INVEST
                </span>

                {investReport ? (
                  <div className="space-y-3.5">
                    {/* Global quality score indicator */}
                    <div className="flex items-center justify-between p-3.5 bg-white border border-[#dfebd6] rounded-xl mb-3 shadow-2xs">
                      <span className="text-xs text-slate-500">Chỉ số chất lượng Story:</span>
                      <span className="text-base font-bold text-[#0fa968]">{investReport.score}/102</span>
                    </div>

                    {/* Detailed checklist */}
                    {[
                      { key: 'I', label: 'Independent (Độc lập)', state: investReport.independent },
                      { key: 'N', label: 'Negotiable (Thương lượng)', state: investReport.negotiable },
                      { key: 'V', label: 'Valuable (Giá trị)', state: investReport.valuable },
                      { key: 'E', label: 'Estimable (Ước lượng)', state: investReport.estimable },
                      { key: 'S', label: 'Small (Độ lớn phù hợp)', state: investReport.small },
                      { key: 'T', label: 'Testable (Kiểm thử được)', state: investReport.testable },
                    ].map((item) => (
                      <div key={item.key} className="bg-white border border-[#dfebd6] rounded-xl p-3 shadow-2xs">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold flex items-center gap-2">
                            <span className={`w-5 h-5 rounded-md flex items-center justify-center font-mono text-[10px] font-black ${
                              item.state.ok ? 'bg-emerald-100 text-emerald-800' : 'bg-red-50 text-red-800'
                            }`}>
                              {item.key}
                            </span>
                            {item.label}
                          </span>
                          
                          {item.state.ok ? (
                            <span className="text-[8px] font-bold bg-[#e5efe9] text-[#0fa968] border border-[#0fa968]/20 px-1.5 rounded">
                              Đạt
                            </span>
                          ) : (
                            <span className="text-[8px] font-bold bg-red-50 text-red-500 border border-red-200 px-1.5 rounded">
                              Chưa đạt
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 leading-relaxed pl-7">
                          {item.state.msg}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-24 text-slate-400 space-y-3">
                    <HelpCircle size={32} className="text-slate-300" />
                    <div>
                      <p className="text-xs font-bold text-slate-500">Đang chờ soạn thảo...</p>
                      <p className="text-[10px] text-slate-400 mt-1 max-w-xs leading-relaxed">Hãy nhập dữ liệu chi tiết các trường ở bảng biên tập bên cạnh và nhấn "Thẩm định quy chuẩn INVEST".</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom guide box */}
              <div className="bg-[#e5efe9] border border-[#0fa968]/15 rounded-xl p-4 mt-6">
                <span className="text-[9px] font-bold text-[#0fa968] uppercase tracking-widest block mb-1">Mẹo viết User Story</span>
                <p className="text-[10px] text-slate-600 leading-relaxed">
                  Đảm bảo luôn điền đầy đủ 3 phần: As a, I want to, So that. Acceptance Criteria nên được viết dưới định dạng BDD (Given-When-Then) để rõ ràng hành vi nghiệp vụ.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
