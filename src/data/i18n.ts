import { Language } from './koreanWasteData';

export const UI_TEXT: Record<
  Language,
  {
    navDashboard: string;
    navScanner: string;
    navSchedule: string;
    navBulky: string;
    navBlueprint: string;
    heroKicker: string;
    heroTitle: string;
    heroSubtitle: string;
    ctaScanNow: string;
    ctaViewSchedule: string;
    currentRegionLabel: string;
    detectGpsBtn: string;
    detectingGps: string;
    todayCollectionTitle: string;
    allowedToday: string;
    prohibitedToday: string;
    disposalWindowLabel: string;
    bagSpecLabel: string;
    foodBagSpecLabel: string;
    reminderActiveLabel: string;
    testNotificationBtn: string;
    scannerTitle: string;
    scannerSubtitle: string;
    openCameraBtn: string;
    stopCameraBtn: string;
    capturePhotoBtn: string;
    uploadPhotoBtn: string;
    analyzingTitle: string;
    analyzingSub: string;
    samplePhotosTitle: string;
    samplePhotosSub: string;
    scanResultHeader: string;
    contaminatedBadge: string;
    cleanBadge: string;
    bagRequiredLabel: string;
    fourStepsLabel: string;
    fineRiskLabel: string;
    confidenceLabel: string;
    scanHistoryTitle: string;
    clearHistoryBtn: string;
    emptyHistoryText: string;
    scheduleTitle: string;
    scheduleSubtitle: string;
    selectGuDongLabel: string;
    weeklyMatrixTitle: string;
    dayNames: Record<string, string>;
    wasteTypeGeneral: string;
    wasteTypeFood: string;
    wasteTypeRecycle: string;
    wasteTypeClearPet: string;
    districtSpecialRuleTitle: string;
    categoriesGuideTitle: string;
    categoriesGuideSub: string;
    bulkyTitle: string;
    bulkySubtitle: string;
    bulkyStep1Title: string;
    bulkyStep1Desc: string;
    bulkyStep2Title: string;
    bulkyStep2Desc: string;
    bulkyStep3Title: string;
    bulkyStep3Desc: string;
    bulkyStep4Title: string;
    bulkyStep4Desc: string;
    bulkyCalculatorTitle: string;
    bulkyCalculatorSub: string;
    generatePermitBtn: string;
    permitModalTitle: string;
    permitNotice: string;
    totalFeeLabel: string;
    blueprintTitle: string;
    blueprintSubtitle: string;
    copyCodeBtn: string;
    copiedText: string;
    installAppLabel: string;
    installIosLabel: string;
  }
> = {
  vi: {
    navDashboard: 'Tổng quan',
    navScanner: 'AI Quét Rác',
    navSchedule: 'Lịch Gom Rác',
    navBulky: 'Tem Cồng Kềnh',
    navBlueprint: 'Kiến Trúc & Code',
    heroKicker: 'HỆ THỐNG PHÂN LOẠI RÁC HÀN QUỐC · 분리수거 AI',
    heroTitle: 'Phân loại rác chuẩn quy định Hàn Quốc chỉ với 1 bức ảnh',
    heroSubtitle:
      'Tránh phạt hành chính đến 300,000 KRW. Nhận diện tự động độ bẩn của hộp đồ ăn 배달, phân biệt rác thực phẩm vs rác thường, và nhắc lịch đổ rác theo đúng Quận/Phường (Gu/Dong) bạn đang ở.',
    ctaScanNow: 'Quét ảnh rác bằng AI',
    ctaViewSchedule: 'Xem lịch đổ rác Gu/Dong',
    currentRegionLabel: 'Khu vực cư trú hiện tại (Gu / Dong)',
    detectGpsBtn: 'Định vị GPS',
    detectingGps: 'Đang định vị...',
    todayCollectionTitle: 'Lịch đổ rác tối nay tại khu vực của bạn',
    allowedToday: 'ĐƯỢC PHÉP ĐỔ TỐI NAY',
    prohibitedToday: 'CẤM ĐỔ HÔM NAY',
    disposalWindowLabel: 'Khung giờ đổ rác quy định',
    bagSpecLabel: 'Túi rác thường (일반 종량제)',
    foodBagSpecLabel: 'Túi rác thực phẩm (음식물)',
    reminderActiveLabel: 'Nhắc nhở tự động trước giờ gom',
    testNotificationBtn: 'Gửi thử thông báo nhắc đổ rác',
    scannerTitle: 'AI Waste Vision Scanner (분리수거 AI 판독기)',
    scannerSubtitle:
      'Chụp trực tiếp qua Camera, tải ảnh món đồ lên hoặc bấm chọn 4 mẫu rác thực tế bên dưới để AI phân tích chất liệu, độ bẩn dầu mỡ và loại túi Jongnyangje cần dùng.',
    openCameraBtn: 'Mở Camera trực tiếp',
    stopCameraBtn: 'Tắt Camera',
    capturePhotoBtn: 'Chụp & Phân tích ngay',
    uploadPhotoBtn: 'Tải ảnh từ thiết bị',
    analyzingTitle: 'Gemini Vision AI đang kiểm tra chất liệu & độ nhiễm bẩn...',
    analyzingSub: 'Đang đối chiếu quy định 분리수거 4대 원칙 của Bộ Môi trường Hàn Quốc',
    samplePhotosTitle: 'Hoặc thử nghiệm nhanh với 4 tình huống dễ bị phạt nhất tại Hàn Quốc:',
    samplePhotosSub: 'Bấm vào bất kỳ ảnh nào để chạy phân tích AI ngay lập tức',
    scanResultHeader: 'Kết quả giám định phân loại rác (AI 판독 결과)',
    contaminatedBadge: 'PHÁT HIỆN DÍNH DẦU MỠ / CHƯA TÁCH NHÃN',
    cleanBadge: 'ĐỦ ĐIỀU KIỆN XỬ LÝ THEO QUY ĐỊNH',
    bagRequiredLabel: 'Loại túi / Thùng chứa bắt buộc',
    fourStepsLabel: 'Quy trình xử lý chuẩn trước khi mang ra điểm tập kết',
    fineRiskLabel: 'Cảnh báo mức phạt hành chính (폐기물관리법 과태료)',
    confidenceLabel: 'Độ tin cậy AI Vision',
    scanHistoryTitle: 'Lịch sử quét rác gần đây',
    clearHistoryBtn: 'Xóa lịch sử',
    emptyHistoryText: 'Chưa có lượt quét nào. Hãy chọn một mẫu rác hoặc tải ảnh lên để bắt đầu.',
    scheduleTitle: 'Lịch thu gom rác theo Quận / Phường (구·동별 배출 일정)',
    scheduleSubtitle:
      'Tại Hàn Quốc, mỗi Quận (Gu) có màu túi 종량제봉투 riêng và quy định "Ngày chuyên biệt cho Chai PET trong suốt & Túi nilon (목요일 요일제)".',
    selectGuDongLabel: 'Chọn Quận / Phường (Gu / Dong) nơi bạn sinh sống',
    weeklyMatrixTitle: 'Bảng lịch thu gom trong tuần (주간 배출 캘린더)',
    dayNames: {
      Mon: 'Thứ 2 (월)',
      Tue: 'Thứ 3 (화)',
      Wed: 'Thứ 4 (수)',
      Thu: 'Thứ 5 (목)',
      Fri: 'Thứ 6 (금)',
      Sat: 'Thứ 7 (토)',
      Sun: 'CN (일)',
    },
    wasteTypeGeneral: 'Rác thông thường (일반 종량제)',
    wasteTypeFood: 'Rác thực phẩm (음식물 쓰레기)',
    wasteTypeRecycle: 'Tái chế chung (종이·캔·병·플라스틱)',
    wasteTypeClearPet: 'Chai PET trong suốt & Nilon (투명페트·비닐)',
    districtSpecialRuleTitle: 'Quy định đặc thù & Cảnh báo Camera 단속 tại địa phương',
    categoriesGuideTitle: 'Cẩm nang 9 nhóm phân loại rác Hàn Quốc (분리수거 사전)',
    categoriesGuideSub: 'Tra cứu nhanh cách xử lý và những lỗi sai khiến du học sinh dễ bị phạt nhất',
    bulkyTitle: 'Hướng dẫn Tem Rác Cồng Kềnh (대형폐기물 스티커 가이드)',
    bulkySubtitle:
      'Khi chuyển nhà (이사) hoặc vứt ghế xoay, nệm, chăn bông mùa đông, vali cũ: Tuyệt đối không bỏ ra đường nếu chưa dán tem hoặc ghi mã số 신고필증 của Gu-office.',
    bulkyStep1Title: '01. Kiểm tra đồ điện tử miễn phí',
    bulkyStep1Desc:
      'Tủ lạnh, máy giặt, lò vi sóng hoặc >= 5 đồ điện nhỏ: Gọi 1599-0903 (15990903.or.kr) để nhân viên tới tận phòng thu gom MIỄN PHÍ 100%.',
    bulkyStep2Title: '02. Đăng ký trên Web Quận hoặc App 빼기',
    bulkyStep2Desc:
      'Vào trang web Gu-office (mục 대형폐기물 배출신고) hoặc tải app 빼기 (Bbaegi), chọn đúng món đồ, kích thước và ngày mang ra trước nhà.',
    bulkyStep3Title: '03. Thanh toán & Ghi mã số lên giấy (Không cần máy in!)',
    bulkyStep3Desc:
      'Thanh toán bằng thẻ/chuyển khoản (2,000₩ ~ 15,000₩). Nếu không có máy in, bạn chỉ cần lấy giấy trắng viết to: [Mã số 신고번호 + Tên món đồ + Ngày vứt] rồi dán băng keo chặt lên đồ.',
    bulkyStep4Title: '04. Đặt đúng vị trí đã khai báo',
    bulkyStep4Desc:
      'Mang đồ ra đặt trước tòa nhà (1층 배출장소) đúng chiều tối ngày đã hẹn. Đội xe tải của Quận sẽ đối chiếu mã số và thu gom.',
    bulkyCalculatorTitle: 'Trình tính phí & Tạo mẫu giấy dán 신고필증 tự động',
    bulkyCalculatorSub:
      'Tick chọn các món đồ bạn cần vứt để ước tính tổng chi phí và tạo ngay mẫu phiếu viết tay chuẩn tiếng Hàn để dán lên đồ đạc.',
    generatePermitBtn: 'Tạo mẫu giấy dán tiếng Hàn (신고필증)',
    permitModalTitle: 'Mẫu Phiếu Dán Rác Cồng Kềnh (대형폐기물 배출 신고필증)',
    permitNotice:
      'Lưu ý: Sau khi thanh toán thật trên trang web Gu-office của bạn, hãy chép nguyên mẫu tiếng Hàn dưới đây ra tờ giấy A4 và dán băng dính thật chắc lên món đồ.',
    totalFeeLabel: 'Tổng phí tem dự kiến',
    blueprintTitle: 'Full-Stack Architecture & Developer Blueprint',
    blueprintSubtitle:
      'Tài liệu thiết kế kỹ thuật đầy đủ: Supabase PostgreSQL Schema, Next.js API Route (Gemini Vision), và System Instruction JSON chuẩn 100%.',
    copyCodeBtn: 'Sao chép mã nguồn',
    copiedText: 'Đã sao chép!',
    installAppLabel: 'Cài đặt App',
    installIosLabel: 'Cài lên iPhone',
  },
  ko: {
    navDashboard: '대시보드',
    navScanner: 'AI 분리수거 스캐너',
    navSchedule: '구·동별 배출일정',
    navBulky: '대형폐기물 스티커',
    navBlueprint: '시스템 아키텍처',
    heroKicker: '대한민국 맞춤형 AI 스마트 분리배출 도우미',
    heroTitle: '사진 한 장으로 끝내는 완벽한 분리수거 & 배출 요일 안내',
    heroSubtitle:
      '최대 30만 원 과태료 예방! AI 비전이 배달용기 오염도, 투명 페트병, 음식물 vs 일반쓰레기(뼈·계란껍데기)를 즉시 판독하고 거주지 구·동별 종량제봉투 및 배출 시간을 알려드립니다.',
    ctaScanNow: 'AI 쓰레기 스캔하기',
    ctaViewSchedule: '우리 동네 배출일정 보기',
    currentRegionLabel: '현재 설정된 거주 지역 (시·구·동)',
    detectGpsBtn: 'GPS 위치 찾기',
    detectingGps: '위치 확인 중...',
    todayCollectionTitle: '오늘 저녁 우리 동네 배출 가능 품목',
    allowedToday: '오늘 배출 가능',
    prohibitedToday: '오늘 배출 금지',
    disposalWindowLabel: '지정 배출 시간대',
    bagSpecLabel: '일반쓰레기 규격봉투',
    foodBagSpecLabel: '음식물쓰레기 배출 방식',
    reminderActiveLabel: '배출 시간 사전 알림 활성화됨',
    testNotificationBtn: '배출 알림 테스트 발송',
    scannerTitle: 'AI 비전 분리수거 판독기 (Gemini Vision)',
    scannerSubtitle:
      '카메라로 직접 촬영하거나 사진을 업로드하세요. 아래 4가지 최다 과태료 샘플 이미지를 클릭하여 AI 판독 결과를 즉시 체험할 수도 있습니다.',
    openCameraBtn: '실시간 카메라 열기',
    stopCameraBtn: '카메라 끄기',
    capturePhotoBtn: '촬영 및 AI 분석',
    uploadPhotoBtn: '기기에서 사진 업로드',
    analyzingTitle: 'Gemini Vision AI가 재질 및 이물질 오염도를 분석 중입니다...',
    analyzingSub: '환경부 분리배출 4대 원칙(비우기·헹구기·분리하기·섞지않기) 대조 중',
    samplePhotosTitle: '가장 헷갈리는 4대 쓰레기 샘플로 즉시 AI 테스트:',
    samplePhotosSub: '샘플 사진을 클릭하면 실시간 판독 결과가 표시됩니다',
    scanResultHeader: 'AI 분리배출 정밀 판독 결과',
    contaminatedBadge: '이물질 오염 / 라벨 미제거 감지됨',
    cleanBadge: '정상 분리배출 가능 상태',
    bagRequiredLabel: '권장 배출 봉투 / 수거함',
    fourStepsLabel: '배출 전 필수 처리 단계 (분리배출 가이드)',
    fineRiskLabel: '폐기물관리법 위반 시 과태료 주의사항',
    confidenceLabel: 'AI 판독 신뢰도',
    scanHistoryTitle: '최근 스캔 기록',
    clearHistoryBtn: '기록 초기화',
    emptyHistoryText: '아직 스캔 기록이 없습니다. 샘플을 선택하거나 사진을 업로드해 보세요.',
    scheduleTitle: '자치구·행정동별 쓰레기 배출 캘린더',
    scheduleSubtitle:
      '지자체마다 종량제봉투 색상과 [투명 페트병·비닐 전용 배출 요일(목요일 등)]이 다릅니다. 거주 지역을 선택해 정확한 일정을 확인하세요.',
    selectGuDongLabel: '거주 중인 시·구·동 선택',
    weeklyMatrixTitle: '요일별 상세 배출 가능 품목표',
    dayNames: {
      Mon: '월요일',
      Tue: '화요일',
      Wed: '수요일',
      Thu: '목요일',
      Fri: '금요일',
      Sat: '토요일',
      Sun: '일요일',
    },
    wasteTypeGeneral: '일반 생활폐기물 (종량제)',
    wasteTypeFood: '음식물류 폐기물',
    wasteTypeRecycle: '일반 재활용 (종이·캔·병·플라스틱)',
    wasteTypeClearPet: '투명 페트병 · 비닐류 전용',
    districtSpecialRuleTitle: '해당 자치구 핵심 단속 사항 및 특이규정',
    categoriesGuideTitle: '대한민국 9대 분리수거 핵심 사전',
    categoriesGuideSub: '품목별 올바른 배출 방법과 자주 실수하는 과태료 사례',
    bulkyTitle: '대형폐기물 인터넷 신고 & 스티커 가이드',
    bulkySubtitle:
      '종량제봉투에 들어가지 않는 의자, 매트리스, 겨울 이불, 캐리어는 반드시 구청 홈페이지나 [빼기] 앱에서 신고 후 배출해야 합니다.',
    bulkyStep1Title: '01. 폐가전 무상방문수거 확인',
    bulkyStep1Desc:
      '냉장고, 세탁기, 모니터 등 대형가전 또는 소형가전 5개 이상은 [1599-0903] 예약 시 기사님이 직접 방문하여 100% 무료 수거합니다.',
    bulkyStep2Title: '02. 구청 홈페이지 / 빼기 앱 신고',
    bulkyStep2Desc:
      '거주지 구청 홈페이지(대형폐기물 신청) 또는 모바일 앱 [빼기]에서 배출할 품목과 규격, 배출 일자를 선택합니다.',
    bulkyStep3Title: '03. 수수료 결제 및 신고번호 부착 (프린터 불필요!)',
    bulkyStep3Desc:
      '수수료 결제 후 프린터가 없다면 빈 종이에 [신고번호 · 품목명 · 수수료 · 배출일]을 매직으로 크게 적어 테이프로 단단히 부착하세요.',
    bulkyStep4Title: '04. 지정 장소에 배출',
    bulkyStep4Desc:
      '신고한 배출일 저녁에 건물 1층 지정 장소에 내놓으면 수거 업체에서 확인 후 수거해 갑니다.',
    bulkyCalculatorTitle: '대형폐기물 수수료 계산기 & 수기 신고필증 생성기',
    bulkyCalculatorSub:
      '버릴 품목을 선택하면 예상 수수료 합계를 계산하고, 프린터 없이 종이에 그대로 베껴 쓸 수 있는 한글 신고필증 양식을 만들어 드립니다.',
    generatePermitBtn: '수기 부착용 신고필증 양식 보기',
    permitModalTitle: '대형폐기물 수기 기재용 신고필증 양식',
    permitNotice:
      '안내: 구청 홈페이지에서 실제 결제 후 발급받은 신고번호를 아래 양식처럼 종이에 적어 폐기물 잘 보이는 곳에 부착하세요.',
    totalFeeLabel: '예상 수수료 합계',
    blueprintTitle: '풀스택 아키텍처 & 개발자 블루프린트',
    blueprintSubtitle:
      'Supabase PostgreSQL 스키마, Next.js Gemini Vision API 라우트, JSON 강제 시스템 프롬프트 설계도',
    copyCodeBtn: '코드 복사',
    copiedText: '복사 완료!',
    installAppLabel: '앱 설치',
    installIosLabel: 'iOS 홈 화면 추가',
  },
  en: {
    navDashboard: 'Dashboard',
    navScanner: 'AI Waste Scanner',
    navSchedule: 'Gu/Dong Schedule',
    navBulky: 'Bulky Sticker',
    navBlueprint: 'Architecture & Code',
    heroKicker: 'SOUTH KOREA AI WASTE SORTING & SCHEDULE SYSTEM',
    heroTitle: 'Master Korean Waste Sorting (Bunrisugeo) with One Photo',
    heroSubtitle:
      'Avoid fines up to 300,000 KRW. Our Gemini Vision AI inspects delivery container stains, distinguishes Food Waste from General Trash (bones, eggshells), and tracks your exact Gu/Dong collection schedule.',
    ctaScanNow: 'Scan Trash with AI',
    ctaViewSchedule: 'Check Gu/Dong Schedule',
    currentRegionLabel: 'Active Residential District (Gu / Dong)',
    detectGpsBtn: 'Locate via GPS',
    detectingGps: 'Locating...',
    todayCollectionTitle: 'Tonight’s Waste Collection in Your Neighborhood',
    allowedToday: 'ALLOWED TONIGHT',
    prohibitedToday: 'DO NOT DISPOSE TODAY',
    disposalWindowLabel: 'Official Disposal Window',
    bagSpecLabel: 'General Jongnyangje Bag',
    foodBagSpecLabel: 'Food Waste Method',
    reminderActiveLabel: 'Evening Collection Reminder Active',
    testNotificationBtn: 'Send Test Reminder Alert',
    scannerTitle: 'AI Waste Vision Scanner (분리수거 AI)',
    scannerSubtitle:
      'Capture directly via Camera, upload an image, or click one of the 4 real Korean waste scenarios below to inspect material type, grease contamination, and required Jongnyangje bag.',
    openCameraBtn: 'Open Live Camera',
    stopCameraBtn: 'Close Camera',
    capturePhotoBtn: 'Capture & Analyze',
    uploadPhotoBtn: 'Upload Photo',
    analyzingTitle: 'Gemini Vision AI is inspecting material & contamination...',
    analyzingSub: 'Cross-referencing Korean Ministry of Environment 4 Core Principles',
    samplePhotosTitle: 'Or instant-test with Korea’s 4 most common fine traps:',
    samplePhotosSub: 'Click any photo below to run AI Vision analysis immediately',
    scanResultHeader: 'AI Waste Inspection Result',
    contaminatedBadge: 'CONTAMINATION / ATTACHED LABEL DETECTED',
    cleanBadge: 'READY FOR COMPLIANT DISPOSAL',
    bagRequiredLabel: 'Required Bag / Bin Type',
    fourStepsLabel: 'Mandatory Preparation Steps Before Disposal',
    fineRiskLabel: 'Administrative Fine Risk (Waste Control Act)',
    confidenceLabel: 'AI Vision Confidence',
    scanHistoryTitle: 'Recent Scan History',
    clearHistoryBtn: 'Clear History',
    emptyHistoryText: 'No scans yet. Select a sample photo above or upload an image to begin.',
    scheduleTitle: 'District (Gu / Dong) Collection Schedule',
    scheduleSubtitle:
      'Every Korean district prints its own Jongnyangje bags and enforces dedicated days (e.g. Thursdays) exclusively for Clear PET bottles and Vinyl.',
    selectGuDongLabel: 'Select Your District & Neighborhood (Gu / Dong)',
    weeklyMatrixTitle: 'Weekly Collection Matrix',
    dayNames: {
      Mon: 'Mon (월)',
      Tue: 'Tue (화)',
      Wed: 'Wed (수)',
      Thu: 'Thu (목)',
      Fri: 'Fri (금)',
      Sat: 'Sat (토)',
      Sun: 'Sun (일)',
    },
    wasteTypeGeneral: 'General Waste (일반 종량제)',
    wasteTypeFood: 'Food Waste (음식물 쓰레기)',
    wasteTypeRecycle: 'General Recycling (Paper/Can/Plastic)',
    wasteTypeClearPet: 'Clear PET & Vinyl Only (투명페트·비닐)',
    districtSpecialRuleTitle: 'Local District Enforcement & CCTV Rules',
    categoriesGuideTitle: 'Korea’s 9 Core Waste Sorting Categories',
    categoriesGuideSub: 'Quick reference for preparation rules and common expat/student mistakes',
    bulkyTitle: 'Bulky Waste Sticker Guide (대형폐기물 스티커)',
    bulkySubtitle:
      'Moving out or disposing of a swivel chair, mattress, winter duvet, or suitcase? Never leave bulky items outside without a Gu-office sticker or handwritten permit number.',
    bulkyStep1Title: '01. Free Pickup for Electronics (1599-0903)',
    bulkyStep1Desc:
      'Fridges, washing machines, monitors, or 5+ small electronics qualify for 100% FREE home pickup via 15990903.or.kr.',
    bulkyStep2Title: '02. Register via Gu-Office Web or Bbaegi App',
    bulkyStep2Desc:
      'Visit your Gu-office website (대형폐기물 신청) or use the Bbaegi (빼기) mobile app to select your items and pickup date.',
    bulkyStep3Title: '03. Pay Fee & Write Permit Code (No Printer Needed!)',
    bulkyStep3Desc:
      'Pay online (2,000–15,000 KRW). No printer? Simply write [Permit # 신고번호 · Item · Fee · Date] on a blank paper in Korean and tape it securely.',
    bulkyStep4Title: '04. Place at Ground-Floor Pickup Spot',
    bulkyStep4Desc:
      'Bring the item out on the scheduled evening. District collectors verify the permit code and haul it away.',
    bulkyCalculatorTitle: 'Bulky Fee Calculator & Handwritten Permit Generator',
    bulkyCalculatorSub:
      'Select the items you need to discard to calculate total KRW fees and generate a ready-to-copy Korean handwritten permit slip (신고필증).',
    generatePermitBtn: 'Generate Korean Permit Slip (신고필증)',
    permitModalTitle: 'Handwritten Bulky Waste Permit Template (대형폐기물 신고필증)',
    permitNotice:
      'Note: After paying on your official Gu-office portal, copy this exact Korean text onto a sheet of paper and tape it firmly to your item.',
    totalFeeLabel: 'Estimated Total Fee',
    blueprintTitle: 'Full-Stack Architecture & Developer Blueprint',
    blueprintSubtitle:
      'Complete Supabase PostgreSQL SQL Schema, Next.js Gemini Vision API Route, and 100% Strict JSON System Instruction.',
    copyCodeBtn: 'Copy Code',
    copiedText: 'Copied!',
    installAppLabel: 'Install App',
    installIosLabel: 'Install on iOS',
  },
};
