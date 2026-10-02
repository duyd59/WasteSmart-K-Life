export type Language = 'vi' | 'ko' | 'en';

export type WasteCategoryCode =
  | 'CLEAR_PET'
  | 'PLASTIC'
  | 'VINYL'
  | 'PAPER'
  | 'CAN_GLASS'
  | 'STYROFOAM'
  | 'FOOD_WASTE'
  | 'GENERAL_JONGNYANGJE'
  | 'BULKY_WASTE'
  | 'E_WASTE';

export interface LocalizedText {
  vi: string;
  ko: string;
  en: string;
}

export interface WasteCategory {
  id: number;
  code: WasteCategoryCode;
  name: LocalizedText;
  bagType: LocalizedText;
  accentColor: string;
  disposalSteps: {
    vi: string[];
    ko: string[];
    en: string[];
  };
  commonMistakes: LocalizedText;
  fineKrw: number;
}

export interface RegionSchedule {
  id: string;
  city: LocalizedText;
  gu: LocalizedText;
  dong: LocalizedText;
  lat: number;
  lng: number;
  generalBagColor: LocalizedText;
  foodBagColor: LocalizedText;
  generalDays: string[]; // ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sun']
  foodDays: string[];
  recycleDays: string[];
  clearPetVinylDays: string[]; // 전용 배출 요일 (e.g. Thu or Tue/Thu)
  disposalStartTime: string;
  disposalEndTime: string;
  guOfficeName: LocalizedText;
  guOfficeBulkyUrl: string;
  guOfficePhone: string;
  specialNotes: LocalizedText;
  bagPrice20L: number;
}

export interface BulkyWasteItem {
  id: string;
  category: LocalizedText;
  name: LocalizedText;
  spec: LocalizedText;
  feeKrw: number;
  isFreeEwaste?: boolean;
}

export interface ScanResultData {
  id: string;
  createdAt: string;
  guDistrict: string;
  itemName: LocalizedText;
  categoryCode: WasteCategoryCode;
  categoryLabel: LocalizedText;
  isContaminated: boolean;
  contaminationReason: LocalizedText;
  recommendedBag: LocalizedText;
  bagColorTag: string;
  disposalSteps: {
    vi: string[];
    ko: string[];
    en: string[];
  };
  fineWarning: LocalizedText;
  fineAmountKrw: number;
  confidenceScore: number;
  koreanSortingPrinciple: string; // 비우기 · 헹구기 · 분리하기 · 섞지않기
  imagePreview?: string;
}

export const WASTE_CATEGORIES: WasteCategory[] = [
  {
    id: 1,
    code: 'CLEAR_PET',
    name: {
      vi: 'Chai nhựa PET trong suốt',
      ko: '투명 페트병 (무색)',
      en: 'Clear Colorless PET Bottle',
    },
    bagType: {
      vi: 'Túi trong suốt riêng hoặc thùng thu gom PET trong suốt',
      ko: '투명 페트병 전용 수거함 / 투명 봉투',
      en: 'Dedicated Clear PET Bin / Transparent Bag',
    },
    accentColor: '#0284C7',
    disposalSteps: {
      vi: [
        '1. Đổ hết nước bên trong và súc sạch bằng nước (비우기 · 헹구기)',
        '2. Bóc toàn bộ nhãn nilon bên ngoài bỏ vào rác Vinyl (라벨 제거)',
        '3. Bóp dẹp chai nhựa để giảm thể tích (압착하기)',
        '4. Đậy nắp lại (nắp nhựa khác màu vẫn đậy chung được, hệ thống tự tách theo trọng lượng riêng)',
      ],
      ko: [
        '1. 내용물을 깨끗이 비우고 물로 헹구기',
        '2. 겉면의 비닐 라벨을 완전히 제거하여 비닐류로 배출',
        '3. 페트병을 찌그러뜨려 부피 줄이기',
        '4. 뚜껑을 닫아 투명 페트병 전용 수거함에 배출',
      ],
      en: [
        '1. Empty all liquid and rinse thoroughly with water',
        '2. Peel off the outer plastic label completely (dispose label as Vinyl)',
        '3. Crush the bottle flat to reduce volume',
        '4. Screw the cap back on and place in the dedicated Clear PET bin',
      ],
    },
    commonMistakes: {
      vi: 'Chai nhựa có màu (bia, nước ngọt màu xanh/nâu) hoặc hộp nhựa đựng trái cây KHÔNG được bỏ vào thùng PET trong suốt.',
      ko: '유색 페트병이나 일회용 테이크아웃 컵(과일팩 등)은 일반 플라스틱류로 분리해야 합니다.',
      en: 'Colored PET bottles or disposable takeout plastic cups must go into regular Plastics, not Clear PET.',
    },
    fineKrw: 100000,
  },
  {
    id: 2,
    code: 'PLASTIC',
    name: {
      vi: 'Nhựa tái chế (PP, PE, PS, OTHER)',
      ko: '일반 플라스틱류 (용기 · 컵)',
      en: 'Recyclable Plastics (Containers)',
    },
    bagType: {
      vi: 'Túi bóng trong suốt (Tái chế) hoặc thùng Nhựa',
      ko: '재활용 플라스틱 수거함 / 투명 비닐봉투',
      en: 'Plastic Recycling Bin / Clear Plastic Bag',
    },
    accentColor: '#2563EB',
    disposalSteps: {
      vi: [
        '1. Gỡ bỏ hoàn toàn lớp màng nilon bọc miệng hộp đồ ăn 배달 (제거하기)',
        '2. Rửa sạch dầu mỡ, sốt đỏ (떡볶이/김치); nếu có thể hãy phơi nắng cho bay màu đỏ',
        '3. Tháo rời lò xo kim loại trong vòi bơm dầu gội/sữa tắm trước khi vứt',
        '4. Bỏ vào túi nilon trong suốt (nhà mặt đất/One-room) hoặc thùng nhựa chung cư',
      ],
      ko: [
        '1. 배달용기 테두리에 붙은 비닐 실링 완벽 제거',
        '2. 음식물 · 기름기 · 양념을 세제로 깨끗이 세척',
        '3. 샴푸통 등의 펌프(금속 스프링 포함)는 분리하여 종량제봉투에 배출',
        '4. 투명 봉투에 담아 지정 요일에 배출',
      ],
      en: [
        '1. Peel off all plastic sealing film from delivery containers',
        '2. Wash off oil, grease, and red sauce completely',
        '3. Remove metal spring pumps from shampoo/lotion bottles (put pump in general trash)',
        '4. Place in a transparent bag on designated recycling days',
      ],
    },
    commonMistakes: {
      vi: 'Hộp nhựa đồ ăn nhanh bị ố dầu mỡ đỏ không rửa sạch được bắt buộc phải bỏ vào túi rác thường (종량제봉투).',
      ko: '양념이나 기름기가 지워지지 않는 배달용기는 재활용 불가하므로 일반 종량제봉투에 버려야 합니다.',
      en: 'Delivery containers permanently stained with grease/sauce cannot be recycled; use General Jongnyangje bag.',
    },
    fineKrw: 100000,
  },
  {
    id: 3,
    code: 'FOOD_WASTE',
    name: {
      vi: 'Rác thực phẩm (음식물 쓰레기)',
      ko: '음식물류 폐기물',
      en: 'Food Waste (Animal Feed Compostable)',
    },
    bagType: {
      vi: 'Túi rác thực phẩm chuyên dụng (음식물 종량제봉투) hoặc thùng thẻ từ RFID',
      ko: '음식물 전용 종량제봉투 또는 RFID 종량기',
      en: 'Food Waste Jongnyangje Bag or RFID Bin',
    },
    accentColor: '#D97706',
    disposalSteps: {
      vi: [
        '1. Nguyên tắc vàng tại Hàn Quốc: "Động vật ăn được mới là rác thực phẩm"',
        '2. Ép kiệt nước và muối (김치, canh thừa) tối đa trước khi cho vào túi để giảm mùi và trọng lượng',
        '3. Cắt nhỏ các loại vỏ dưa hấu, bắp cải to trước khi bỏ vào túi 음식물봉투',
        '4. Loại bỏ tăm tre, túi trà lọc, vỏ nilon lẫn trong thức ăn',
      ],
      ko: [
        '1. 판단 기준: 동물이 사료로 먹을 수 있는 부드러운 음식물만 해당',
        '2. 물기를 최대한 짜서 배출 (수분 제거)',
        '3. 수박껍질, 무 등 부피가 큰 채소는 잘게 썰어 배출',
        '4. 이쑤시개, 비닐, 티백 등 이물질 완벽 제거',
      ],
      en: [
        '1. Golden rule in Korea: Only items safe to process into animal feed count as Food Waste',
        '2. Squeeze out all moisture and broth thoroughly',
        '3. Chop large rinds (watermelon, radish) into small pieces',
        '4. Remove toothpicks, tea bags, and wrappers completely',
      ],
    },
    commonMistakes: {
      vi: 'CẢNH BÁO PHẠT: Xương gà/heo/cá, vỏ trứng, vỏ hành tỏi khô, rễ hành, hạt trái cây cứng (đào, bơ), vỏ hải sản là RÁC THÔNG THƯỜNG (일반쓰레기)!',
      ko: '주의: 닭뼈·돼지뼈·생선뼈, 계란껍데기, 양파·마늘 껍질, 파뿌리, 과일 씨(복숭아/아보카도), 조개껍데기는 일반 쓰레기입니다!',
      en: 'WARNING: Chicken/pork/fish bones, eggshells, dry onion/garlic skins, green onion roots, hard fruit pits, and shells are GENERAL WASTE!',
    },
    fineKrw: 100000,
  },
  {
    id: 4,
    code: 'GENERAL_JONGNYANGJE',
    name: {
      vi: 'Rác sinh hoạt thông thường (일반쓰레기)',
      ko: '일반 생활폐기물 (종량제)',
      en: 'General Household Waste (Jongnyangje)',
    },
    bagType: {
      vi: 'Túi rác Jongnyangje (종량제봉투) đúng tên Quận (Gu) đang sinh sống',
      ko: '거주지 구(Gu) 전용 규격 종량제봉투',
      en: 'Official District (Gu) Jongnyangje Volume-Rate Bag',
    },
    accentColor: '#475569',
    disposalSteps: {
      vi: [
        '1. Mua túi 종량제봉투 tại cửa hàng tiện lợi (CU, GS25, 7-Eleven) nằm trong đúng Quận (Gu) bạn ở',
        '2. Bỏ các loại rác không tái chế được: hộp giấy/xốp dính dầu mỡ mì cay, khăn giấy bẩn, tã, xương, vỏ trứng',
        '3. Không nhồi quá vạch giới hạn (묶는 선) trên thân túi; buộc chặt miệng túi',
        '4. Mang ra điểm tập kết đúng khung giờ quy định (thường sau 18:00 - 20:00 tối)',
      ],
      ko: [
        '1. 거주하는 자치구(구/시) 마크가 인쇄된 종량제봉투 사용',
        '2. 기름에 오염된 컵라면 용기, 휴지, 뼈다귀, 계란껍데기 등 배출',
        '3. 봉투 상단 묶는 선 이하로 담아 단단히 묶기',
        '4. 지정된 배출 시간(보통 일몰 후 18시~20시 이후) 준수',
      ],
      en: [
        '1. Purchase official Jongnyangje bags printed with your exact Gu/District name at local convenience stores',
        '2. Dispose of non-recyclables: grease-stained ramen cups, tissues, bones, eggshells, foil',
        '3. Fill only up to the tie line and knot tightly',
        '4. Place outside only during designated evening collection hours',
      ],
    },
    commonMistakes: {
      vi: 'Dùng túi nilon đen/trắng thường hoặc túi Jongnyangje của Quận khác sẽ bị từ chối thu gom và phạt tới 200,000 KRW (camera AI & kiểm tra hóa đơn trong rác).',
      ko: '일반 검은 비닐봉투나 타 자치구 종량제봉투 사용 시 무단투기로 간주되어 최대 20만 원 과태료가 부과됩니다.',
      en: 'Using regular plastic bags or another district’s Jongnyangje bag carries an illegal dumping fine up to 200,000 KRW.',
    },
    fineKrw: 200000,
  },
  {
    id: 5,
    code: 'STYROFOAM',
    name: {
      vi: 'Xốp trắng (스티로폼)',
      ko: '발포합성수지 (스티로폼)',
      en: 'White Expanded Polystyrene (Styrofoam)',
    },
    bagType: {
      vi: 'Buộc gọn hoặc bỏ túi trong suốt (Chỉ xốp trắng sạch)',
      ko: '재활용 스티로폼 배출 (흰색 깨끗한 것만)',
      en: 'Styrofoam Recycling (Clean White Only)',
    },
    accentColor: '#0D9488',
    disposalSteps: {
      vi: [
        '1. Gỡ sạch toàn bộ băng dính, tem vận đơn giao hàng (송장 스티커) trên thùng xốp',
        '2. Rửa sạch nước máu cá/thịt nếu là thùng xốp thực phẩm đông lạnh',
        '3. LƯU Ý: Tô mì tôm xốp (컵라면 용기) bị ố đỏ dầu ớt phải xé nhỏ bỏ vào túi rác thường 종량제봉투!',
      ],
      ko: [
        '1. 택배 운송장 스티커 및 테이프를 완전히 제거',
        '2. 이물질이 묻은 경우 깨끗이 씻어 말린 후 배출',
        '3. 주의: 붉은 기름기가 밴 컵라면 용기는 재활용 불가 (종량제봉투 배출)',
      ],
      en: [
        '1. Remove all shipping labels and packing tape completely',
        '2. Rinse and dry if stained with food moisture',
        '3. NOTE: Red chili oil stained cup ramen bowls cannot be recycled; put in General Jongnyangje bag',
      ],
    },
    commonMistakes: {
      vi: 'Quên bóc tem địa chỉ giao hàng trên thùng xốp hoặc bỏ tô mì tôm xốp bẩn vào thùng tái chế là lỗi bị phạt phổ biến nhất của du học sinh.',
      ko: '운송장 스티커에 적힌 주소·이름으로 과태료 고지서가 발송되므로 반드시 송장을 제거하세요.',
      en: 'Inspectors trace unpeeled shipping labels directly to your address for fines—always peel labels off.',
    },
    fineKrw: 100000,
  },
  {
    id: 6,
    code: 'PAPER',
    name: {
      vi: 'Giấy & Thùng Carton (종이 · 종이팩)',
      ko: '종이류 및 종이팩 (우유팩)',
      en: 'Paper, Cardboard & Milk Cartons',
    },
    bagType: {
      vi: 'Xếp phẳng buộc dây (Tách riêng Hộp sữa 종이팩)',
      ko: '납작하게 펼쳐 묶어 배출 (종이팩 별도 분리)',
      en: 'Flatten & Tie Together (Separate Milk Cartons)',
    },
    accentColor: '#65A30D',
    disposalSteps: {
      vi: [
        '1. Gỡ sạch toàn bộ băng keo nhựa và phiếu giao hàng (운송장) trên thùng 택배',
        '2. Trải phẳng thùng carton và buộc gọn lại',
        '3. Hộp sữa giấy (우유팩/두유팩) có tráng nilon bên trong: Rửa sạch, cắt mở phẳng, phơi khô và nộp riêng (có thể đổi giấy vệ sinh tại 주민센터!)',
      ],
      ko: [
        '1. 택배 상자의 테이프와 운송장 스티커 완벽 제거',
        '2. 상자를 납작하게 접어 끈으로 묶어 배출',
        '3. 우유팩·주스팩은 물로 헹군 뒤 펼쳐 말려 일반 종이와 구분해 배출 (주민센터 화장지 교환 가능)',
      ],
      en: [
        '1. Strip off all plastic tape and delivery waybills from cardboard boxes',
        '2. Flatten boxes and bundle securely',
        '3. Milk/juice cartons have inner plastic coating: rinse, cut open flat, dry, and recycle separately (exchangeable for toilet paper at Dong offices!)',
      ],
    },
    commonMistakes: {
      vi: 'Hóa đơn nhiệt siêu thị (영수증), giấy truyền đơn bóng (전단지), giấy lót nồi chiên không dầu (종이호일) là RÁC THƯỜNG, không phải giấy tái chế.',
      ko: '감열지 영수증, 코팅된 전단지, 기름 묻은 치킨 속지, 종이호일은 일반 종량제봉투에 버려야 합니다.',
      en: 'Thermal receipts, glossy flyers, greasy chicken box liners, and parchment paper go in General Trash.',
    },
    fineKrw: 100000,
  },
  {
    id: 7,
    code: 'VINYL',
    name: {
      vi: 'Túi Nilon & Vỏ bánh kẹo (비닐류)',
      ko: '비닐류 (필름류 포장재)',
      en: 'Vinyl & Plastic Film Packaging',
    },
    bagType: {
      vi: 'Đựng trong túi bóng trong suốt hoặc bán trong suốt',
      ko: '투명 또는 반투명 비닐봉투에 담아 배출',
      en: 'Clear or Semi-Transparent Plastic Bag',
    },
    accentColor: '#7C3AED',
    disposalSteps: {
      vi: [
        '1. Bao gồm: Vỏ gói mì, vỏ snack, túi nilon mua hàng, màng xốp nổ (뽁뽁이), nhãn chai PET',
        '2. Giũ sạch vụn bánh kẹo/gia vị; nếu dính dầu mỡ phải rửa qua nước',
        '3. Không gấp từng túi thành hình tam giác nhỏ (gây khó phân loại tại nhà máy), hãy để phẳng trong 1 túi trong suốt lớn',
      ],
      ko: [
        '1. 라면봉지, 과자봉지, 에어캡(뽁뽁이), 페트병 라벨 등 포함',
        '2. 내용물을 비우고 이물질이 묻은 경우 물로 헹궈 배출',
        '3. 딱지 모양으로 접지 말고 부피만 줄여 투명 봉투에 담아 배출',
      ],
      en: [
        '1. Includes ramen wrappers, snack bags, bubble wrap, and peeled PET labels',
        '2. Shake out crumbs; rinse off any food residue',
        '3. Do not fold bags into tight triangles; place loosely in a clear outer bag',
      ],
    },
    commonMistakes: {
      vi: 'Màng bọc thực phẩm (랩 - Cling wrap) tại gia đình thường là PVC hoặc dính thức ăn nên phải bỏ vào túi rác thường 종량제봉투.',
      ko: '가정용 식품 포장 랩(크린랩 등)이나 이물질이 지워지지 않는 비닐은 종량제봉투에 배출합니다.',
      en: 'Household cling wrap and heavily soiled plastic film must go into General Jongnyangje bags.',
    },
    fineKrw: 100000,
  },
  {
    id: 8,
    code: 'CAN_GLASS',
    name: {
      vi: 'Lon kim loại & Chai thủy tinh (캔 · 병류)',
      ko: '캔 · 고철 및 유리병류',
      en: 'Metal Cans & Glass Bottles',
    },
    bagType: {
      vi: 'Túi trong suốt hoặc thùng thu gom Lon / Thủy tinh',
      ko: '캔/유리병 전용 수거함 또는 투명 봉투',
      en: 'Cans / Glass Recycling Bin or Clear Bag',
    },
    accentColor: '#059669',
    disposalSteps: {
      vi: [
        '1. Lon bia/nước ngọt: Súc sạch nước, dẫm dẹp theo chiều dọc',
        '2. Bình ga mini / bình xịt (부탄가스, 살충제): Ra chỗ thoáng khí đục lỗ xả hết khí gas còn sót trước khi vứt',
        '3. Chai bia / rượu Soju thủy tinh: Có thể mang ra GS25/CU/Siêu thị đổi lấy tiền đặt cọc (빈용기 보증금 100~130₩/chai)!',
      ],
      ko: [
        '1. 음료·맥주캔은 내용물을 비우고 물로 헹군 뒤 압착',
        '2. 부탄가스·살충제 용기는 통풍 잘되는 곳에서 구멍을 뚫어 잔여 가스 완전 제거',
        '3. 소주병·맥주병은 편의점/마트 반납 시 빈용기 보증금(100~130원) 환불 가능',
      ],
      en: [
        '1. Rinse beverage cans and crush vertically',
        '2. Butane gas & aerosol cans: Puncture outdoors to release all residual gas safely',
        '3. Soju & beer glass bottles: Return to convenience stores/marts for 100–130 KRW cash deposit refund!',
      ],
    },
    commonMistakes: {
      vi: 'Thủy tinh vỡ, bát đĩa sứ vỡ, cốc chịu nhiệt KHÔNG tái chế được: phải bọc kỹ giấy báo và mua "Bao tải rác không cháy (불연성 마대)" tại 주민센터/cửa hàng tiện lợi.',
      ko: '깨진 유리, 도자기, 내열유리 식기는 재활용이 불가하므로 신문지에 싸서 불연성 폐기물 전용 마대에 버려야 합니다.',
      en: 'Broken glass, ceramics, and heat-resistant cookware are non-recyclable: wrap in newspaper and use a Non-flammable Waste Sack (불연성 마대).',
    },
    fineKrw: 100000,
  },
  {
    id: 9,
    code: 'BULKY_WASTE',
    name: {
      vi: 'Rác cồng kềnh (대형폐기물)',
      ko: '대형 생활폐기물 (가구 · 침구 · 가방)',
      en: 'Bulky Household Waste (Furniture, Bedding)',
    },
    bagType: {
      vi: 'Dán tem 대형폐기물 스티커 hoặc ghi Mã số đăng ký online (신고필증 번호)',
      ko: '구청 대형폐기물 스티커 부착 또는 인터넷 신고번호 기재',
      en: 'District Bulky Waste Sticker or Online Permit Number',
    },
    accentColor: '#DC2626',
    disposalSteps: {
      vi: [
        '1. Đồ đạc không nhét vừa túi Jongnyangje lớn nhất (chăn bông dày, gối, vali, ghế xoay, bàn, nệm, kệ sách)',
        '2. Đăng ký online trên website Quận (Gu-office) hoặc ứng dụng 빼기 (Bbaegi) / mua tem tại 주민센터',
        '3. Thanh toán phí (2,000₩ ~ 15,000₩), in tem hoặc viết mã số 신고번호 bằng bút dạ lên giấy dán chặt vào món đồ',
        '4. Đặt trước cửa tòa nhà đúng ngày đã hẹn trên hệ thống',
      ],
      ko: [
        '1. 종량제봉투에 들어가지 않는 가구, 이불, 베개, 캐리어, 의자, 매트리스 등',
        '2. 거주지 구청 홈페이지, 모바일 앱(빼기/여기가) 또는 동주민센터에서 배출 신고',
        '3. 수수료 결제 후 신고필증 출력 또는 백지에 신고번호·품목·배출일자를 적어 부착',
        '4. 신고한 배출 일시에 집 앞 지정 장소에 배출',
      ],
      en: [
        '1. Applies to items too large for Jongnyangje bags: duvets, pillows, suitcases, chairs, desks, mattresses',
        '2. Apply online via your Gu-office website, Bbaegi app, or local Dong Community Center',
        '3. Pay the fee (2,000–15,000 KRW) and attach the printed sticker or handwritten permit code clearly',
        '4. Place at the designated pickup spot on the scheduled date',
      ],
    },
    commonMistakes: {
      vi: 'Bỏ chăn mùa đông, vali cũ hoặc ghế hỏng ra đường mà không dán tem/mã số sẽ bị camera CCTV truy vết và phạt tới 300,000 KRW.',
      ko: '스티커나 신고번호 없이 가구·이불·캐리어를 버리면 CCTV 단속을 통해 최대 30만 원 과태료가 부과됩니다.',
      en: 'Leaving furniture, bedding, or suitcases outside without a permit sticker triggers CCTV enforcement and fines up to 300,000 KRW.',
    },
    fineKrw: 300000,
  },
];

export const REGION_SCHEDULES: RegionSchedule[] = [
  {
    id: 'seoul-gwanak-sillim',
    city: { vi: 'Seoul (서울특별시)', ko: '서울특별시', en: 'Seoul' },
    gu: { vi: 'Quận Gwanak (관악구)', ko: '관악구', en: 'Gwanak-gu' },
    dong: { vi: 'Phường Sillim (신림동 · 대학동)', ko: '신림동 · 대학동', en: 'Sillim-dong (SNU Area)' },
    lat: 37.4842,
    lng: 126.9297,
    generalBagColor: {
      vi: 'Túi trắng bán trong suốt (관악구 일반용)',
      ko: '흰색 반투명 봉투 (관악구)',
      en: 'Semi-transparent White Bag (Gwanak-gu)',
    },
    foodBagColor: {
      vi: 'Túi vàng cam (관악구 음식물용)',
      ko: '노란색 음식물 전용봉투',
      en: 'Yellow Food Waste Bag',
    },
    generalDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    foodDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    recycleDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Fri'],
    clearPetVinylDays: ['Thu'],
    disposalStartTime: '18:00',
    disposalEndTime: '24:00',
    guOfficeName: {
      vi: 'Văn phòng Quận Gwanak (관악구청 청소행정과)',
      ko: '관악구청 청소행정과',
      en: 'Gwanak-gu Office Sanitation Dept.',
    },
    guOfficeBulkyUrl: 'https://www.gwanak.go.kr',
    guOfficePhone: '02-879-6200',
    specialNotes: {
      vi: 'QUY ĐỊNH QUAN TRỌNG TẠI GWANAK-GU: Thứ Năm hàng tuần (목요일) CHỈ thu gom Chai PET trong suốt & Túi nilon (투명 페트병 · 비닐 전용 배출일). Các loại tái chế khác (giấy, lon, nhựa màu) tuyệt đối không vứt vào Thứ Năm! Thứ Bảy (토요일) cấm đổ mọi loại rác.',
      ko: '관악구 핵심 규정: 매주 목요일은 [투명 페트병 · 비닐]만 배출 가능하며 다른 재활용품은 배출 금지입니다. 토요일은 모든 쓰레기 배출이 금지됩니다.',
      en: 'GWANAK-GU RULE: Thursdays are strictly for [Clear PET & Vinyl ONLY]. All other recyclables are prohibited on Thursdays. No trash disposal on Saturdays.',
    },
    bagPrice20L: 490,
  },
  {
    id: 'seoul-mapo-seogyo',
    city: { vi: 'Seoul (서울특별시)', ko: '서울특별시', en: 'Seoul' },
    gu: { vi: 'Quận Mapo (마포구)', ko: '마포구', en: 'Mapo-gu' },
    dong: { vi: 'Phường Seogyo / Yeonnam (서교동 · 홍대)', ko: '서교동 · 연남동 (홍대/신촌)', en: 'Seogyo-dong (Hongdae/Sinchon)' },
    lat: 37.5559,
    lng: 126.9219,
    generalBagColor: {
      vi: 'Túi trắng / xanh nhạt (마포구 일반용)',
      ko: '흰색 생활폐기물 규격봉투 (마포구)',
      en: 'White Standard Bag (Mapo-gu)',
    },
    foodBagColor: {
      vi: 'Túi vàng hoặc Thẻ RFID (마포구 음식물)',
      ko: '노란색 봉투 또는 RFID 카드',
      en: 'Yellow Bag or RFID Card',
    },
    generalDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    foodDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    recycleDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Fri'],
    clearPetVinylDays: ['Thu'],
    disposalStartTime: '19:30',
    disposalEndTime: '24:00',
    guOfficeName: {
      vi: 'Văn phòng Quận Mapo (마포구청 클린도시과)',
      ko: '마포구청 클린도시과',
      en: 'Mapo-gu Office Clean City Dept.',
    },
    guOfficeBulkyUrl: 'https://www.mapo.go.kr',
    guOfficePhone: '02-3153-9200',
    specialNotes: {
      vi: 'Khu vực Hongdae/Seogyo kiểm tra rất gắt gao khung giờ 19:30 ~ 24:00. Thứ Năm hàng tuần là ngày thu gom riêng Chai PET trong suốt & Túi nilon.',
      ko: '마포구 서교·연남동 일대는 저녁 19:30 이후 배출 시간을 엄격히 단속합니다. 목요일은 투명 페트병·비닐 전용 배출일입니다.',
      en: 'Hongdae/Seogyo strictly enforces disposal after 19:30. Thursdays are dedicated exclusively to Clear PET bottles and Vinyl.',
    },
    bagPrice20L: 490,
  },
  {
    id: 'seoul-dongdaemun-hoegi',
    city: { vi: 'Seoul (서울특별시)', ko: '서울특별시', en: 'Seoul' },
    gu: { vi: 'Quận Dongdaemun (동대문구)', ko: '동대문구', en: 'Dongdaemun-gu' },
    dong: { vi: 'Phường Hoegi / Imun (회기동 · 이문동)', ko: '회기동 · 이문동 (경희대/외대)', en: 'Hoegi-dong (KHU / HUFS Area)' },
    lat: 37.5916,
    lng: 127.0522,
    generalBagColor: {
      vi: 'Túi trắng / hồng nhạt (동대문구 일반용)',
      ko: '흰색/분홍색 규격봉투 (동대문구)',
      en: 'White/Pink Standard Bag (Dongdaemun-gu)',
    },
    foodBagColor: {
      vi: 'Túi xanh lá / vàng (동대문구 음식물용)',
      ko: '음식물 전용봉투 (동대문구)',
      en: 'Food Waste Bag (Dongdaemun-gu)',
    },
    generalDays: ['Sun', 'Tue', 'Thu'],
    foodDays: ['Sun', 'Tue', 'Thu'],
    recycleDays: ['Sun', 'Tue'],
    clearPetVinylDays: ['Thu'],
    disposalStartTime: '18:00',
    disposalEndTime: '23:00',
    guOfficeName: {
      vi: 'Văn phòng Quận Dongdaemun (동대문구청 청소행정과)',
      ko: '동대문구청 청소행정과',
      en: 'Dongdaemun-gu Sanitation Dept.',
    },
    guOfficeBulkyUrl: 'https://www.ddm.go.kr',
    guOfficePhone: '02-2127-4620',
    specialNotes: {
      vi: 'Tại khu vực đại học Kyung Hee / HUFS (Hoegi-dong, Imun-dong), rác thu gom theo ngày chẵn/lẻ (Chủ Nhật, Thứ Ba, Thứ Năm). Thứ Năm chỉ vứt chai PET trong suốt & Vinyl.',
      ko: '회기·이문동 주택가는 일·화·목요일 저녁 18시~23시에 배출하며, 목요일에는 재활용품 중 투명 페트병과 비닐만 배출합니다.',
      en: 'In Hoegi/Imun residential areas, collection runs Sun/Tue/Thu between 18:00–23:00. Thursday recycling is restricted to Clear PET & Vinyl.',
    },
    bagPrice20L: 490,
  },
  {
    id: 'seoul-gwangjin-hwayang',
    city: { vi: 'Seoul (서울특별시)', ko: '서울특별시', en: 'Seoul' },
    gu: { vi: 'Quận Gwangjin (광진구)', ko: '광진구', en: 'Gwangjin-gu' },
    dong: { vi: 'Phường Hwayang / Gunja (화양동 · 건대)', ko: '화양동 · 군자동 (건국대/세종대)', en: 'Hwayang-dong (Konkuk / Sejong Univ)' },
    lat: 37.5428,
    lng: 127.0714,
    generalBagColor: {
      vi: 'Túi trắng bán trong suốt (광진구 일반용)',
      ko: '흰색 반투명 봉투 (광진구)',
      en: 'Semi-transparent White Bag (Gwangjin-gu)',
    },
    foodBagColor: {
      vi: 'Túi vàng (광진구 음식물용)',
      ko: '노란색 음식물 전용봉투',
      en: 'Yellow Food Waste Bag',
    },
    generalDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    foodDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    recycleDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Fri'],
    clearPetVinylDays: ['Thu'],
    disposalStartTime: '19:00',
    disposalEndTime: '23:00',
    guOfficeName: {
      vi: 'Văn phòng Quận Gwangjin (광진구청 청소과)',
      ko: '광진구청 청소과',
      en: 'Gwangjin-gu Sanitation Dept.',
    },
    guOfficeBulkyUrl: 'https://www.gwangjin.go.kr',
    guOfficePhone: '02-450-7630',
    specialNotes: {
      vi: 'Khu One-room đại học Konkuk (Hwayang-dong) lắp đặt hệ thống camera AI chống vứt rác lén (무단투기 단속 CCTV). Hỗ trợ đăng ký rác cồng kềnh qua ứng dụng 빼기 (Bbaegi).',
      ko: '화양동 원룸촌은 무단투기 단속 CCTV가 집중 설치되어 있습니다. 대형폐기물은 모바일 앱 [빼기]로도 간편 신고 가능합니다.',
      en: 'Hwayang-dong one-room streets have dense AI CCTV monitoring. Bulky waste permits can be booked via the Bbaegi mobile app.',
    },
    bagPrice20L: 490,
  },
  {
    id: 'gyeonggi-suwon-ingye',
    city: { vi: 'Gyeonggi-do (경기도)', ko: '경기도', en: 'Gyeonggi-do' },
    gu: { vi: 'TP. Suwon - Quận Paldal (수원시 팔달구)', ko: '수원시 팔달구 · 영통구', en: 'Suwon-si Paldal / Yeongtong-gu' },
    dong: { vi: 'Phường Ingye / Woncheon (인계동 · 아주대)', ko: '인계동 · 원천동 (아주대/경희대)', en: 'Ingye-dong / Woncheon-dong (Ajou Univ)' },
    lat: 37.2665,
    lng: 127.0314,
    generalBagColor: {
      vi: 'Túi trắng / xanh lá (수원시 소각용)',
      ko: '수원시 소각용 규격봉투',
      en: 'Suwon Incineration Standard Bag',
    },
    foodBagColor: {
      vi: 'Túi vàng / Thẻ RFID (수원시 음식물용)',
      ko: '수원시 음식물 전용봉투 / RFID',
      en: 'Suwon Food Waste Bag / RFID',
    },
    generalDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    foodDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    recycleDays: ['Mon', 'Wed', 'Fri'],
    clearPetVinylDays: ['Tue', 'Thu'],
    disposalStartTime: '20:00',
    disposalEndTime: '05:00',
    guOfficeName: {
      vi: 'Tòa thị chính Suwon (수원시청 청소자원과)',
      ko: '수원시청 청소자원과',
      en: 'Suwon City Resource Management Dept.',
    },
    guOfficeBulkyUrl: 'https://www.suwon.go.kr',
    guOfficePhone: '031-228-2114',
    specialNotes: {
      vi: 'Suwon kiểm tra rất kỹ "소각용 종량제봉투" (Túi rác đốt). Tổ quản lý cư dân (주민감시단) mở túi rác kiểm tra nếu phát hiện lẫn đồ nhựa hoặc vỏ trứng.',
      ko: '수원시는 소각장 반입 기준이 엄격하여 종량제봉투 내 재활용품·음식물 혼합 시 수거 거부(무단투기 스티커 부착) 조치가 시행됩니다.',
      en: 'Suwon strictly enforces separation in incineration bags; mixed recyclables or food waste result in collection refusal tags and fines.',
    },
    bagPrice20L: 660,
  },
  {
    id: 'busan-suyeong-gwangan',
    city: { vi: 'Busan (부산광역시)', ko: '부산광역시', en: 'Busan' },
    gu: { vi: 'Quận Suyeong / Nam-gu (수영구 · 남구)', ko: '수영구 · 남구', en: 'Suyeong-gu / Nam-gu' },
    dong: { vi: 'Phường Gwangan / Daeyeon (광안동 · 대연동)', ko: '광안동 · 대연동 (부경대/경성대)', en: 'Gwangan-dong / Daeyeon-dong (PKNU)' },
    lat: 35.1531,
    lng: 129.1186,
    generalBagColor: {
      vi: 'Túi hồng / trắng (부산 수영구 일반용)',
      ko: '부산 수영구 일반 종량제봉투',
      en: 'Busan Suyeong-gu Standard Bag',
    },
    foodBagColor: {
      vi: 'Thùng nhựa gắn chip hoặc túi chuyên dụng',
      ko: '음식물 납부필증 용기 또는 전용봉투',
      en: 'Chip Container or Food Waste Bag',
    },
    generalDays: ['Sun', 'Tue', 'Thu'],
    foodDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    recycleDays: ['Mon', 'Wed'],
    clearPetVinylDays: ['Thu'],
    disposalStartTime: '19:00',
    disposalEndTime: '22:00',
    guOfficeName: {
      vi: 'Văn phòng Quận Suyeong (수영구청 자원순환과)',
      ko: '수영구청 자원순환과',
      en: 'Suyeong-gu Resource Circulation Dept.',
    },
    guOfficeBulkyUrl: 'https://www.suyeong.go.kr',
    guOfficePhone: '051-610-4430',
    specialNotes: {
      vi: 'Khu vực biển Gwangalli & đại học Pukyong yêu cầu đổ rác đúng khung giờ 19:00 ~ 22:00 để tránh gió biển thổi bay túi nilon.',
      ko: '광안·대연동 일대는 바닷바람으로 인한 비산 방지를 위해 19시~22시 배출 시간을 철저히 지켜주셔야 합니다.',
      en: 'Coastal wind in Gwangan/Daeyeon requires strict adherence to the 19:00–22:00 evening window and secure tying of bags.',
    },
    bagPrice20L: 810,
  },
];

export const BULKY_WASTE_ITEMS: BulkyWasteItem[] = [
  {
    id: 'chair-office',
    category: { vi: 'Nội thất (가구류)', ko: '가구류', en: 'Furniture' },
    name: { vi: 'Ghế xoay văn phòng / Ghế học (바퀴의자)', ko: '회전의자 / 학생용 바퀴의자', en: 'Swivel Office / Study Chair' },
    spec: { vi: 'Cỡ tiêu chuẩn 1 người', ko: '일반형 (1인용)', en: 'Standard 1-person' },
    feeKrw: 3000,
  },
  {
    id: 'chair-gaming',
    category: { vi: 'Nội thất (가구류)', ko: '가구류', en: 'Furniture' },
    name: { vi: 'Ghế Gaming / Ghế ngả lưng lớn (대형 의자)', ko: '게이밍 의자 / 대형 리클라이너 의자', en: 'Gaming / Large Recliner Chair' },
    spec: { vi: 'Có tựa đầu cao', ko: '대형', en: 'Large w/ headrest' },
    feeKrw: 5000,
  },
  {
    id: 'desk-study',
    category: { vi: 'Nội thất (가구류)', ko: '가구류', en: 'Furniture' },
    name: { vi: 'Bàn học / Bàn máy tính (책상)', ko: '컴퓨터 책상 / 일반 책상', en: 'Study / Computer Desk' },
    spec: { vi: 'Rộng dưới 120cm', ko: '편수책상 (120cm 미만)', en: 'Width under 120cm' },
    feeKrw: 4000,
  },
  {
    id: 'mattress-single',
    category: { vi: 'Chăn nệm (침구류)', ko: '침구류 · 매트리스', en: 'Bedding & Mattress' },
    name: { vi: 'Nệm lò xo / Nệm đơn (싱글 매트리스)', ko: '침대 매트리스 (싱글/슈퍼싱글)', en: 'Single / Super-Single Mattress' },
    spec: { vi: '1 người nằm (Chỉ tính riêng nệm)', ko: '1인용 (프레임 별도)', en: 'Single (Frame separate)' },
    feeKrw: 8000,
  },
  {
    id: 'mattress-queen',
    category: { vi: 'Chăn nệm (침구류)', ko: '침구류 · 매트리스', en: 'Bedding & Mattress' },
    name: { vi: 'Nệm đôi Queen/King (2인용 매트리스)', ko: '침대 매트리스 (더블/퀸/킹)', en: 'Double / Queen / King Mattress' },
    spec: { vi: '2 người nằm', ko: '2인용 이상', en: '2-person size' },
    feeKrw: 12000,
  },
  {
    id: 'duvet-winter',
    category: { vi: 'Chăn nệm (침구류)', ko: '침구류', en: 'Bedding' },
    name: { vi: 'Chăn bông mùa đông / Chăn lông (겨울 이불 · 차렵이불)', ko: '겨울 솜이불 / 극세사 이불', en: 'Thick Winter Duvet / Comforter' },
    spec: { vi: '1 chiếc (Không được bỏ vào thùng quần áo cũ!)', ko: '1채당 (헌옷수거함 배출 금지!)', en: 'Per piece (Banned in clothing bins!)' },
    feeKrw: 2000,
  },
  {
    id: 'suitcase-carrier',
    category: { vi: 'Đồ gia dụng (생활용품)', ko: '생활용품', en: 'Household Goods' },
    name: { vi: 'Vali kéo du lịch (여행용 캐리어)', ko: '여행용 가방 (캐리어)', en: 'Travel Suitcase (Carrier)' },
    spec: { vi: 'Size 20 inch ~ 28 inch', ko: '중·대형 (50cm 이상)', en: '20–28 inch luggage' },
    feeKrw: 3000,
  },
  {
    id: 'drying-rack',
    category: { vi: 'Đồ gia dụng (생활용품)', ko: '생활용품', en: 'Household Goods' },
    name: { vi: 'Giàn phơi quần áo gấp gọn (빨래건조대)', ko: '실내용 접이식 빨래건조대', en: 'Foldable Laundry Drying Rack' },
    spec: { vi: 'Mọi kích cỡ', ko: '모든 규격', en: 'All sizes' },
    feeKrw: 2000,
  },
  {
    id: 'mirror-standing',
    category: { vi: 'Nội thất (가구류)', ko: '가구류 · 거울', en: 'Furniture & Mirrors' },
    name: { vi: 'Gương soi toàn thân (전신거울)', ko: '전신거울 (나무/금속 테두리)', en: 'Full-Length Standing Mirror' },
    spec: { vi: 'Cao trên 1m', ko: '1m 이상', en: 'Over 1m height' },
    feeKrw: 3000,
  },
  {
    id: 'appliance-free',
    category: { vi: 'Đồ điện tử (폐가전 무상수거)', ko: '폐가전제품 (무상방문수거)', en: 'E-Waste (Free Home Pickup)' },
    name: { vi: 'Tủ lạnh, Máy giặt, TV, Lò vi sóng hoặc >= 5 đồ điện nhỏ', ko: '대형가전 또는 소형가전 5개 이상 묶음', en: 'Large Appliances or 5+ Small Electronics' },
    spec: { vi: 'Đặt lịch thu gom tận nhà MIỄN PHÍ qua tổng đài 1599-0903', ko: '폐가전 무상방문수거 (1599-0903 / 15990903.or.kr)', en: '100% Free Pickup via 1599-0903 (15990903.or.kr)' },
    feeKrw: 0,
    isFreeEwaste: true,
  },
];

export interface SampleWastePhoto {
  id: string;
  imageUrl: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  presetResult: Omit<ScanResultData, 'id' | 'createdAt' | 'guDistrict'>;
}

export const SAMPLE_WASTE_PHOTOS: SampleWastePhoto[] = [
  {
    id: 'sample-ramen-cup',
    imageUrl: '/samples/sample_ramen_cup.jpg',
    title: {
      vi: 'Tô mì cay xốp bẩn & Đũa gỗ',
      ko: '오염된 컵라면 용기 & 나무젓가락',
      en: 'Greasy Cup Ramen Bowl & Chopsticks',
    },
    subtitle: {
      vi: 'Dính dầu ớt đỏ · Bẫy tái chế phổ biến nhất',
      ko: '붉은 기름기 오염 · 유학생 최다 과태료 사례',
      en: 'Stained with red chili oil · Common fine trap',
    },
    presetResult: {
      itemName: {
        vi: 'Tô mì ăn liền bằng xốp (Dính dầu ớt đỏ) & Đũa gỗ dùng 1 lần',
        ko: '붉은 기름에 오염된 스티로폼 컵라면 용기 및 나무젓가락',
        en: 'Chili-Oil Stained Styrofoam Cup Ramen Bowl & Wooden Chopsticks',
      },
      categoryCode: 'GENERAL_JONGNYANGJE',
      categoryLabel: {
        vi: 'Rác thông thường (일반쓰레기) — Không tái chế được do nhiễm bẩn',
        ko: '일반 쓰레기 (종량제봉투) — 기름기 오염으로 재활용 불가',
        en: 'General Waste (Jongnyangje) — Non-recyclable due to grease stain',
      },
      isContaminated: true,
      contaminationReason: {
        vi: 'Thành tô xốp bị thấm dầu ớt đỏ (고추기름) không thể rửa sạch hoàn toàn; nắp giấy tráng nhôm và đũa gỗ là rác đốt thông thường.',
        ko: '스티로폼 내부에 붉은 라면 국물과 기름기가 배어 있어 스티로폼 재활용이 불가능합니다.',
        en: 'Styrofoam walls are permeated with red chili oil and cannot be recycled as clean white EPS.',
      },
      recommendedBag: {
        vi: 'Túi rác thông thường Jongnyangje (일반 종량제봉투)',
        ko: '거주지 일반 생활폐기물 종량제봉투',
        en: 'District General Jongnyangje Trash Bag',
      },
      bagColorTag: '#475569',
      disposalSteps: {
        vi: [
          '1. Đổ hết phần nước súp thừa qua lưới lọc bồn rửa; phần sợi mì/cặn thức ăn bỏ vào túi Rác thực phẩm (음식물봉투)',
          '2. Tráng sơ tô xốp bằng nước để không bốc mùi hôi trong phòng',
          '3. Bẻ nhỏ hoặc dẫm dẹp tô xốp, bẻ đôi đũa gỗ (để không đâm thủng túi rác) rồi bỏ vào túi 종량제봉투',
          '4. Mẹo: Nếu đem tô xốp rửa xà phòng và phơi nắng (햇빛 건조) đến khi trắng tinh thì mới được vứt vào thùng Xốp tái chế!',
        ],
        ko: [
          '1. 남은 국물은 버리고 면발·건더기는 물기를 빼서 음식물 종량제봉투에 배출',
          '2. 컵라면 용기는 물로 가볍게 헹군 뒤 부피를 줄여 일반 종량제봉투에 배출',
          '3. 나무젓가락은 봉투가 찢어지지 않도록 반으로 부러뜨려 종량제봉투에 배출',
          '4. 팁: 물로 헹군 뒤 햇빛에 하루 말려 붉은 기름 자국이 완전히 사라지면 스티로폼 재활용 가능!',
        ],
        en: [
          '1. Drain leftover broth; put solid noodles into your Food Waste bag after squeezing moisture',
          '2. Rinse the ramen cup briefly to prevent odor, crush it, and put it in your General Jongnyangje bag',
          '3. Snap wooden chopsticks in half or wrap in tissue so they do not puncture the trash bag',
          '4. Pro Tip: Only if bleached completely white in direct sunlight after washing can it go into Styrofoam recycling',
        ],
      },
      fineWarning: {
        vi: 'Bỏ tô mì xốp còn vết đỏ vào túi tái chế trong suốt sẽ bị từ chối thu gom và phạt 100,000 KRW.',
        ko: '붉은 자국이 남은 컵라면 용기를 재활용으로 배출 시 과태료 100,000원 부과 대상입니다.',
        en: 'Placing red-stained ramen cups in recycling bins carries a 100,000 KRW fine.',
      },
      fineAmountKrw: 100000,
      confidenceScore: 99,
      koreanSortingPrinciple: '비우기 (Đổ rỗng) · 분리하기 (Tách thức ăn & vỏ) · 종량제 배출 (Bỏ túi Jongnyangje)',
      imagePreview: '/samples/sample_ramen_cup.jpg',
    },
  },
  {
    id: 'sample-clear-pet',
    imageUrl: '/samples/sample_clear_pet.jpg',
    title: {
      vi: 'Chai nước suối PET trong suốt',
      ko: '무색 투명 생수 페트병',
      en: 'Clear Mineral Water PET Bottle',
    },
    subtitle: {
      vi: 'Bắt buộc tách riêng 4 bước (투명 페트병 의무 분리)',
      ko: '비우기 · 라벨제거 · 압착 · 뚜껑닫기 4단계 필수',
      en: 'Mandatory 4-step Clear PET separation law',
    },
    presetResult: {
      itemName: {
        vi: 'Chai nước khoáng nhựa PET trong suốt không màu (무색 투명 페트병)',
        ko: '무색 투명 먹는샘물(생수) 페트병 및 비닐 라벨',
        en: 'Colorless Transparent Mineral Water PET Bottle & Label',
      },
      categoryCode: 'CLEAR_PET',
      categoryLabel: {
        vi: 'Chai PET trong suốt (투명 페트병 전용) — Thu gom riêng biệt',
        ko: '투명 페트병 전용 분리배출 대상',
        en: 'Dedicated Clear PET Recycling Category',
      },
      isContaminated: false,
      contaminationReason: {
        vi: 'Chai sạch không dính dầu mỡ, nhưng vẫn còn tem nhãn nilon màu xanh cần bóc rời hoàn toàn.',
        ko: '내부는 깨끗하나 겉면의 파란색 비닐 라벨이 일부 남아있어 완전 제거가 필요합니다.',
        en: 'Bottle interior is clean, but the blue plastic wrap label must be peeled off completely.',
      },
      recommendedBag: {
        vi: 'Thùng/Túi dành riêng cho Chai PET trong suốt (투명 페트병 전용 수거함)',
        ko: '투명 페트병 전용 수거함 (주택가는 목요일 투명봉투 배출)',
        en: 'Dedicated Clear PET Bin (or Thursday Clear Bag in residential zones)',
      },
      bagColorTag: '#0284C7',
      disposalSteps: {
        vi: [
          '1. Đổ hết nước còn sót lại trong chai (비우기)',
          '2. Bóc rời hoàn toàn dải nhãn nilon màu xanh và bỏ nhãn đó vào túi rác Nilon/Vinyl (라벨 제거 → 비닐류)',
          '3. Dẫm hoặc bóp dẹp thân chai nhựa để giảm tối đa thể tích (압착하기)',
          '4. Vặn nắp nhựa xanh lại trên miệng chai và bỏ vào thùng "투명 페트병" (không bỏ chung với nhựa màu khác!)',
        ],
        ko: [
          '1. 페트병 안의 남은 물기를 완전히 비우기',
          '2. 겉면의 파란색 비닐 라벨을 뜯어내어 [비닐류]로 분리 배출',
          '3. 페트병을 발로 밟거나 손으로 찌그러뜨려 부피 줄이기',
          '4. 뚜껑을 닫은 상태로 [투명 페트병 전용 수거함]에 배출 (유색 플라스틱과 혼합 금지)',
        ],
        en: [
          '1. Empty all remaining water from the bottle',
          '2. Tear off the blue plastic wrap label along the perforation and put the label in Vinyl recycling',
          '3. Crush the clear bottle flat to minimize volume',
          '4. Close the cap and place into the dedicated Clear PET container',
        ],
      },
      fineWarning: {
        vi: 'Luật Hàn Quốc bắt buộc tách riêng Chai PET trong suốt khỏi nhựa thường; để nguyên nhãn hoặc bỏ lẫn phạt tới 100,000 ~ 300,000 KRW.',
        ko: '투명 페트병 별도 분리배출 의무화 위반 시 최대 30만 원 이하의 과태료가 부과될 수 있습니다.',
        en: 'Violating Korea’s mandatory Clear PET separation rule can result in fines up to 300,000 KRW.',
      },
      fineAmountKrw: 100000,
      confidenceScore: 99,
      koreanSortingPrinciple: '비우기 · 라벨제거 · 찌그러뜨리기 · 뚜껑닫기',
      imagePreview: '/samples/sample_clear_pet.jpg',
    },
  },
  {
    id: 'sample-delivery-containers',
    imageUrl: '/samples/sample_delivery_containers.jpg',
    title: {
      vi: 'Hộp nhựa đồ ăn 배달 (Tteokbokki)',
      ko: '배달 플라스틱 용기 (떡볶이 양념 오염)',
      en: 'Baedal Delivery Plastic Bowls (Sauce Stained)',
    },
    subtitle: {
      vi: 'Màng seal nilon viền hộp & Sốt ớt đỏ',
      ko: '테두리 비닐 실링 & 붉은 고추장 양념 세척 판단',
      en: 'Sealing film rim & red gochujang sauce check',
    },
    presetResult: {
      itemName: {
        vi: 'Hộp nhựa PP đựng Tteokbokki giao hàng (dính sốt đỏ & màng seal) + Nắp nhựa trong',
        ko: '떡볶이 배달 플라스틱 용기 (실링 비닐 부착 및 양념 오염) + 투명 뚜껑',
        en: 'Tteokbokki Delivery PP Bowl (with Sealing Film & Red Sauce) + Clear Lid',
      },
      categoryCode: 'PLASTIC',
      categoryLabel: {
        vi: 'Nhựa tái chế (플라스틱류) — BẮT BUỘC rửa sạch & lột màng seal trước khi vứt',
        ko: '플라스틱류 (세척 및 비닐 실링 제거 필수)',
        en: 'Recyclable Plastic — MUST wash sauce & strip sealing film first',
      },
      isContaminated: true,
      contaminationReason: {
        vi: 'Đang còn dính sốt 떡볶이 đỏ và lớp màng nilon ép nhiệt trên miệng hộp. Nếu vứt ngay lúc này sẽ bị tính là vi phạm!',
        ko: '용기 내부에 고추장 양념이 남아있고 테두리에 비닐 실링이 붙어 있어 즉시 배출 시 과태료 대상입니다.',
        en: 'Contains red gochujang sauce residue and attached plastic sealing film along the rim.',
      },
      recommendedBag: {
        vi: 'Sau khi rửa sạch: Túi tái chế Nhựa (플라스틱) · Nếu ố đỏ không sạch: Túi 종량제봉투',
        ko: '세척 후 플라스틱 수거함 배출 (양념 자국 안 지워지면 일반 종량제봉투)',
        en: 'Plastic Recycling after washing (or General Jongnyangje bag if permanently stained)',
      },
      bagColorTag: '#2563EB',
      disposalSteps: {
        vi: [
          '1. Dùng dao cắt hộp (칼) hoặc lột sạch hoàn toàn viền nilon ép nhiệt trên miệng hộp → Bỏ phần nilon vào túi Vinyl (비닐류)',
          '2. Rửa sạch hộp nhựa và nắp trong bằng nước rửa bát cho hết dầu mỡ',
          '3. Đặt hộp nhựa trắng ra nắng 2~3 tiếng để tia UV làm bay hết vết ố đỏ của ớt (고추기름 자국 제거)',
          '4. Nếu vết dầu ớt ăn sâu vào nhựa không thể làm sạch → Bắt buộc đập nhỏ bỏ vào túi rác thường 종량제봉투',
        ],
        ko: [
          '1. 용기 테두리에 열접착된 비닐 실링을 끝까지 떼어내어 [비닐류]로 분리',
          '2. 주방세제로 떡볶이 양념과 기름기를 깨끗이 설거지',
          '3. 붉은 물이 든 경우 햇빛에 말려 색을 빼준 뒤 [플라스틱류]로 배출',
          '4. 세척 후에도 붉은 기름기가 남는다면 재활용 불가하므로 [일반 종량제봉투]에 배출',
        ],
        en: [
          '1. Peel off every bit of the heat-sealed plastic film around the rim (put film in Vinyl)',
          '2. Wash both the white bowl and clear lid with dish soap to remove grease',
          '3. Sun-dry for 2–3 hours so UV light bleaches out red pepper stains, then recycle as Plastic',
          '4. If red grease stains remain permanently embedded, dispose of the bowl in a General Jongnyangje bag',
        ],
      },
      fineWarning: {
        vi: 'Vứt hộp 배달 còn nguyên thức ăn/sốt đỏ vào khu tái chế bị phạt hành chính 100,000 KRW.',
        ko: '세척하지 않은 배달용기를 재활용함에 배출 시 과태료 100,000원이 부과됩니다.',
        en: 'Dumping unwashed delivery containers into recycling bins incurs a 100,000 KRW fine.',
      },
      fineAmountKrw: 100000,
      confidenceScore: 98,
      koreanSortingPrinciple: '헹구기 (Rửa sạch sốt) · 분리하기 (Lột màng seal nilon)',
      imagePreview: '/samples/sample_delivery_containers.jpg',
    },
  },
  {
    id: 'sample-chicken-bones',
    imageUrl: '/samples/sample_chicken_bones_eggs.jpg',
    title: {
      vi: 'Xương gà rán, Vỏ trứng & Vỏ hành',
      ko: '치킨 닭뼈, 계란껍데기 & 양파껍질',
      en: 'Fried Chicken Bones, Eggshells & Onion Skins',
    },
    subtitle: {
      vi: '90% người mới sang Hàn nhầm là Rác thực phẩm!',
      ko: '외국인·자취생이 음식물 쓰레기로 가장 많이 착각하는 품목',
      en: '#1 Foreigner Mistake: Looks like food, actually General Trash!',
    },
    presetResult: {
      itemName: {
        vi: 'Xương gà (닭뼈), Vỏ trứng (계란껍데기) và Vỏ hành tây khô (양파껍질)',
        ko: '치킨 닭뼈, 계란껍데기, 마른 양파껍질',
        en: 'Chicken Bones, Cracked Eggshells, and Dry Onion Peels',
      },
      categoryCode: 'GENERAL_JONGNYANGJE',
      categoryLabel: {
        vi: 'RÁC THÔNG THƯỜNG (일반쓰레기) — TUYỆT ĐỐI KHÔNG bỏ vào túi Rác thực phẩm!',
        ko: '일반 쓰레기 (종량제봉투) — 음식물 쓰레기 절대 아님!',
        en: 'GENERAL WASTE (Jongnyangje) — NEVER put in Food Waste!',
      },
      isContaminated: false,
      contaminationReason: {
        vi: 'Tại Hàn Quốc, rác thực phẩm được nghiền làm thức ăn chăn nuôi (사료) hoặc phân ủ. Xương cứng làm gãy dao máy nghiền, vỏ trứng có vôi và vỏ hành có chất xơ dai không tiêu hóa được.',
        ko: '딱딱한 뼈는 사료 분쇄기 고장의 원인이 되며, 계란껍데기(석회질)와 양파껍질(섬유질)은 가축 소화 방해 물질로 분류됩니다.',
        en: 'In Korea, food waste is processed into animal feed. Hard bones break grinder blades, eggshells contain lime, and dry onion skins hinder livestock digestion.',
      },
      recommendedBag: {
        vi: 'Túi rác thông thường Jongnyangje (일반 생활폐기물 종량제봉투)',
        ko: '거주지 구(Gu) 일반 생활폐기물 종량제봉투',
        en: 'District General Household Waste Jongnyangje Bag',
      },
      bagColorTag: '#475569',
      disposalSteps: {
        vi: [
          '1. Nếu trên xương gà còn bám nhiều miếng thịt gà mềm: rứt phần thịt mềm bỏ vào túi Rác thực phẩm (음식물봉투)',
          '2. Phần xương gà cứng, sụn, vỏ trứng gà/vịt, vỏ hành tỏi khô, rễ hành lá → Bỏ toàn bộ vào túi Rác thông thường (일반 종량제봉투)',
          '3. Bọc xương gà trong giấy báo hoặc túi nilon nhỏ trước khi cho vào túi 종량제봉투 để mèo hoang không cào rách túi ban đêm',
        ],
        ko: [
          '1. 닭뼈에 붙은 부드러운 살코기만 떼어내어 음식물 쓰레기로 분리',
          '2. 단단한 닭뼈, 계란껍데기, 양파·마늘의 마른 겉껍질, 파뿌리는 모두 [일반 종량제봉투]에 배출',
          '3. 길고양이가 봉투를 뜯지 못하도록 뼈다귀는 종이에 감싸서 종량제봉투 안쪽에 넣어 배출',
        ],
        en: [
          '1. Strip off any large pieces of soft meat from the bones (soft meat goes into Food Waste)',
          '2. Put all hard chicken bones, eggshells, dry onion/garlic skins, and green onion roots into your General Jongnyangje bag',
          '3. Wrap bones in paper inside the Jongnyangje bag so stray cats do not tear the bag open overnight',
        ],
      },
      fineWarning: {
        vi: 'Bỏ xương gà, vỏ trứng, vỏ hành vào túi Rác thực phẩm (음식물봉투) bị phạt hành chính từ 100,000 ~ 200,000 KRW theo Luật Quản lý Chất thải Hàn Quốc.',
        ko: '음식물 종량제봉투에 닭뼈·계란껍데기·양파껍질을 혼합 배출할 경우 폐기물관리법에 따라 10만~20만 원의 과태료가 부과됩니다.',
        en: 'Mixing bones, eggshells, or onion skins into a Food Waste bag incurs a 100,000–200,000 KRW fine under the Waste Control Act.',
      },
      fineAmountKrw: 100000,
      confidenceScore: 100,
      koreanSortingPrinciple: '동물 사료 기준 (Tiêu chuẩn thức ăn chăn nuôi) → 일반 종량제 배출',
      imagePreview: '/samples/sample_chicken_bones_eggs.jpg',
    },
  },
];

export const KOREAN_WASTE_SYSTEM_INSTRUCTION = `You are "WasteSmart K-Life AI Inspector", South Korea's official-standard AI Vision specialist in Ministry of Environment (기후에너지환경부) and local Gu-office waste sorting regulations (분리수거 / 분리배출 4대 원칙: 비우기, 헹구기, 분리하기, 섞지않기).

Analyze the user's uploaded waste image carefully and return a 100% accurate JSON object adhering strictly to South Korean municipal waste laws:

CRITICAL KOREAN WASTE RULES YOU MUST ENFORCE:
1. CLEAR PET vs PLASTIC:
   - Colorless transparent beverage/water PET bottles MUST be classified as "CLEAR_PET" (투명 페트병), requiring: empty liquid, peel off vinyl label (label goes to Vinyl), crush flat, close cap, and dispose in Dedicated Clear PET bin/bag.
   - Colored PET bottles, takeout coffee cups, and plastic food containers are "PLASTIC" (일반 플라스틱류).
2. CONTAMINATION CHECK (오염도 판별):
   - Visually inspect if the item has food residue, red chili oil (고추기름), tteokbokki/kimchi sauce, or attached sealing film.
   - If a styrofoam cup ramen bowl (컵라면 용기) or paper cup is stained with red oil/grease, it CANNOT be recycled as Styrofoam/Paper — classify as "GENERAL_JONGNYANGJE" (일반 종량제봉투) and set isContaminated = true.
   - If a plastic delivery container (배달용기) has sauce, set isContaminated = true and instruct the user to peel off the rim sealing film (비닐 실링) and wash/sun-dry it, or put in General Jongnyangje if unwashable.
3. FOOD WASTE vs GENERAL WASTE TRAP (음식물 vs 일반쓰레기):
   - In South Korea, only soft food safe for livestock feed (동물 사료화 가능 여부) is "FOOD_WASTE" (음식물 쓰레기).
   - Hard animal/poultry/fish bones (닭뼈, 돼지뼈, 생선뼈), eggshells (계란껍데기), dry onion/garlic/corn husks (양파·마늘·옥수수 껍질), green onion roots (파뿌리), hard fruit pits (복숭아·아보카도 씨), shells (조개·게 껍데기), and tea bags/coffee grounds MUST be classified as "GENERAL_JONGNYANGJE" (일반 종량제봉투)!
4. BULKY WASTE & E-WASTE:
   - Furniture, chairs, mattresses, winter duvets/pillows (이불·베개), suitcases (캐리어) -> "BULKY_WASTE" (대형폐기물 스티커 부착).
   - Electronics/appliances -> "E_WASTE" (폐가전 무상방문수거 1599-0903 or 동주민센터 소형가전 수거함).

Provide all text fields in three languages: Vietnamese (vi), Korean (ko), and English (en).`;
