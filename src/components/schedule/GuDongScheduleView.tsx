import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Bell,
  Clock,
  Check,
  X,
  Search,
  AlertCircle,
  Phone,
  ExternalLink,
} from 'lucide-react';
import {
  Language,
  REGION_SCHEDULES,
  RegionSchedule,
  WASTE_CATEGORIES,
} from '../../data/koreanWasteData';
import { UI_TEXT } from '../../data/i18n';

interface GuDongScheduleViewProps {
  lang: Language;
  selectedRegion: RegionSchedule;
  onSelectRegion: (region: RegionSchedule) => void;
  reminderEnabled: boolean;
  onToggleReminder: () => void;
  reminderTime: string;
  onChangeReminderTime: (time: string) => void;
  onTriggerTestAlert: () => void;
}

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const GuDongScheduleView: React.FC<GuDongScheduleViewProps> = ({
  lang,
  selectedRegion,
  onSelectRegion,
  reminderEnabled,
  onToggleReminder,
  reminderTime,
  onChangeReminderTime,
  onTriggerTestAlert,
}) => {
  const t = UI_TEXT[lang];
  const [isLocating, setIsLocating] = useState(false);
  const [gpsStatusMsg, setGpsStatusMsg] = useState<string | null>(null);
  const [categorySearch, setCategorySearch] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');

  const handleDetectGps = () => {
    setIsLocating(true);
    setGpsStatusMsg(null);

    if (!('geolocation' in navigator)) {
      setIsLocating(false);
      setGpsStatusMsg(
        lang === 'vi'
          ? 'Thiết bị không hỗ trợ GPS. Đã chọn khu vực mặc định: 관악구 신림동 (Seoul).'
          : lang === 'ko'
          ? 'GPS를 지원하지 않는 환경입니다. 기본 지역(관악구 신림동)으로 설정되었습니다.'
          : 'Geolocation not supported. Defaulted to Gwanak-gu Sillim-dong.'
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        let closest = REGION_SCHEDULES[0];
        let minDistance = Infinity;

        for (const reg of REGION_SCHEDULES) {
          const dist = Math.hypot(reg.lat - latitude, reg.lng - longitude);
          if (dist < minDistance) {
            minDistance = dist;
            closest = reg;
          }
        }

        onSelectRegion(closest);
        setIsLocating(false);
        setGpsStatusMsg(
          lang === 'vi'
            ? `Đã định vị GPS và khớp với khu vực gần nhất: ${closest.gu.vi} · ${closest.dong.vi}`
            : lang === 'ko'
            ? `GPS 위치 확인 완료: ${closest.gu.ko} ${closest.dong.ko}`
            : `GPS matched to nearest district: ${closest.gu.en} · ${closest.dong.en}`
        );
      },
      () => {
        // Fallback when user is testing inside an iframe without GPS permission
        const nextIdx =
          (REGION_SCHEDULES.findIndex((r) => r.id === selectedRegion.id) + 1) %
          REGION_SCHEDULES.length;
        const fallbackRegion = REGION_SCHEDULES[nextIdx];
        onSelectRegion(fallbackRegion);
        setIsLocating(false);
        setGpsStatusMsg(
          lang === 'vi'
            ? `Đã chuyển vùng mô phỏng GPS sang: ${fallbackRegion.gu.vi} · ${fallbackRegion.dong.vi}`
            : lang === 'ko'
            ? `위치 시뮬레이션 전환: ${fallbackRegion.gu.ko} ${fallbackRegion.dong.ko}`
            : `Simulated GPS location switched to: ${fallbackRegion.gu.en} · ${fallbackRegion.dong.en}`
        );
      },
      { timeout: 6000 }
    );
  };

  const filteredCategories = WASTE_CATEGORIES.filter((cat) => {
    const matchesFilter =
      activeCategoryFilter === 'ALL' || cat.code === activeCategoryFilter;
    const q = categorySearch.trim().toLowerCase();
    if (!q) return matchesFilter;
    return (
      matchesFilter &&
      (cat.name.vi.toLowerCase().includes(q) ||
        cat.name.ko.toLowerCase().includes(q) ||
        cat.name.en.toLowerCase().includes(q) ||
        cat.commonMistakes[lang].toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-10">
      {/* Header & GPS Locator Action */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <p className="text-xs font-semibold text-emerald-700 tracking-wide">
            GPS GU / DONG SCHEDULE · 자치구별 배출 캘린더
          </p>
          <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900">
            {t.scheduleTitle}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
            {t.scheduleSubtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={handleDetectGps}
          disabled={isLocating}
          className="min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
        >
          <Navigation className={`w-4 h-4 text-emerald-400 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? t.detectingGps : t.detectGpsBtn}</span>
        </button>
      </div>

      {gpsStatusMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-950 flex items-center justify-between gap-2">
          <span>{gpsStatusMsg}</span>
          <button
            type="button"
            onClick={() => setGpsStatusMsg(null)}
            className="text-emerald-800 hover:underline font-semibold"
          >
            ✕
          </button>
        </div>
      )}

      {/* District (Gu/Dong) Selector Grid */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3">
          {t.selectGuDongLabel}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {REGION_SCHEDULES.map((reg) => {
            const isSelected = reg.id === selectedRegion.id;
            return (
              <button
                key={reg.id}
                type="button"
                onClick={() => onSelectRegion(reg)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-500">{reg.city[lang]}</span>
                  <span className="text-xs font-mono tabular-nums text-slate-600">
                    20L: ₩{reg.bagPrice20L}
                  </span>
                </div>
                <p className="mt-1 text-base font-bold text-slate-900">
                  {reg.gu[lang]}
                </p>
                <p className="text-xs font-medium text-emerald-700 mt-0.5">
                  {reg.dong[lang]}
                </p>
                <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>
                    {t.disposalWindowLabel}:{' '}
                    <strong className="font-mono tabular-nums text-slate-800">
                      {reg.disposalStartTime}–{reg.disposalEndTime}
                    </strong>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected District Details & Notification Reminder Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Weekly Schedule Matrix (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {t.weeklyMatrixTitle} — {selectedRegion.gu[lang]}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedRegion.dong[lang]} · {t.disposalWindowLabel}:{' '}
                <span className="font-mono tabular-nums font-semibold text-slate-900">
                  {selectedRegion.disposalStartTime} ~ {selectedRegion.disposalEndTime}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-600">
                  <th className="py-3 pr-4">
                    {lang === 'vi'
                      ? 'Phân loại rác'
                      : lang === 'ko'
                      ? '배출 품목 구분'
                      : 'Waste Stream'}
                  </th>
                  {WEEK_DAYS.map((day) => (
                    <th key={day} className="py-3 px-2 text-center">
                      {t.dayNames[day]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {/* Row 1: General Waste */}
                <tr className="hover:bg-slate-50/70">
                  <td className="py-3.5 pr-4 font-semibold text-slate-900">
                    <div>{t.wasteTypeGeneral}</div>
                    <div className="text-xs font-normal text-slate-500">
                      {selectedRegion.generalBagColor[lang]}
                    </div>
                  </td>
                  {WEEK_DAYS.map((day) => {
                    const allowed = selectedRegion.generalDays.includes(day);
                    return (
                      <td key={day} className="py-3.5 px-2 text-center">
                        {allowed ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-emerald-50 text-emerald-700">
                            <Check className="w-4 h-4" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-6 h-6 text-slate-300">
                            <X className="w-4 h-4" />
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Row 2: Food Waste */}
                <tr className="hover:bg-slate-50/70">
                  <td className="py-3.5 pr-4 font-semibold text-slate-900">
                    <div>{t.wasteTypeFood}</div>
                    <div className="text-xs font-normal text-slate-500">
                      {selectedRegion.foodBagColor[lang]}
                    </div>
                  </td>
                  {WEEK_DAYS.map((day) => {
                    const allowed = selectedRegion.foodDays.includes(day);
                    return (
                      <td key={day} className="py-3.5 px-2 text-center">
                        {allowed ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-amber-50 text-amber-700">
                            <Check className="w-4 h-4" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-6 h-6 text-slate-300">
                            <X className="w-4 h-4" />
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Row 3: General Recycling */}
                <tr className="hover:bg-slate-50/70">
                  <td className="py-3.5 pr-4 font-semibold text-slate-900">
                    <div>{t.wasteTypeRecycle}</div>
                    <div className="text-xs font-normal text-slate-500">
                      {lang === 'vi'
                        ? 'Túi trong suốt (Trừ PET trong & Nilon)'
                        : lang === 'ko'
                        ? '투명 봉투 배출 (투명페트·비닐 제외)'
                        : 'Clear Bag (Excludes Clear PET & Vinyl)'}
                    </div>
                  </td>
                  {WEEK_DAYS.map((day) => {
                    const allowed = selectedRegion.recycleDays.includes(day);
                    return (
                      <td key={day} className="py-3.5 px-2 text-center">
                        {allowed ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-blue-50 text-blue-700">
                            <Check className="w-4 h-4" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-6 h-6 text-slate-300">
                            <X className="w-4 h-4" />
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Row 4: Dedicated Clear PET & Vinyl Day */}
                <tr className="bg-sky-50/40 hover:bg-sky-50/70">
                  <td className="py-3.5 pr-4 font-bold text-sky-950">
                    <div>{t.wasteTypeClearPet}</div>
                    <div className="text-xs font-normal text-sky-700">
                      {lang === 'vi'
                        ? 'Bắt buộc tách riêng (의무 분리배출 요일제)'
                        : lang === 'ko'
                        ? '투명 페트병 · 비닐 전용 배출 요일제'
                        : 'Mandatory Dedicated Separation Day'}
                    </div>
                  </td>
                  {WEEK_DAYS.map((day) => {
                    const allowed = selectedRegion.clearPetVinylDays.includes(day);
                    return (
                      <td key={day} className="py-3.5 px-2 text-center">
                        {allowed ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-sky-600 text-white font-bold">
                            <Check className="w-4 h-4" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-6 h-6 text-slate-300">
                            <X className="w-4 h-4" />
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Special Local Regulation Warning Box */}
          <div className="mt-5 p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold tracking-wide">
                  {t.districtSpecialRuleTitle}
                </p>
                <p className="mt-1 text-sm leading-relaxed">
                  {selectedRegion.specialNotes[lang]}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Reminder Configuration & Gu-Office Info (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Evening Reminder Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  {t.reminderActiveLabel}
                </h3>
              </div>
              <button
                type="button"
                onClick={onToggleReminder}
                className={`min-h-[32px] px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  reminderEnabled
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {reminderEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <label className="block text-xs text-slate-500 mb-2">
                {lang === 'vi'
                  ? 'Chọn giờ nhận thông báo trước giờ gom rác:'
                  : lang === 'ko'
                  ? '배출 알림 시간 설정:'
                  : 'Select Evening Reminder Time:'}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['18:00', '19:00', '19:30', '20:00'].map((tm) => (
                  <button
                    key={tm}
                    type="button"
                    onClick={() => onChangeReminderTime(tm)}
                    className={`min-h-[40px] rounded-lg font-mono tabular-nums text-xs font-semibold border transition-colors ${
                      reminderTime === tm
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {tm}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={onTriggerTestAlert}
                className="mt-4 w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
              >
                <Clock className="w-4 h-4" />
                <span>{t.testNotificationBtn}</span>
              </button>
            </div>
          </div>

          {/* Gu-Office Sanitation Department Contact */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              {selectedRegion.guOfficeName[lang]}
            </h3>
            <div className="text-xs text-slate-600 space-y-2">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Hotline (청소행정과):</span>
                <span className="font-mono tabular-nums font-semibold text-slate-900 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  {selectedRegion.guOfficePhone}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">
                  {lang === 'vi'
                    ? 'Giá túi Jongnyangje 20L:'
                    : lang === 'ko'
                    ? '20L 종량제봉투 가격:'
                    : '20L Jongnyangje Bag Price:'}
                </span>
                <span className="font-mono tabular-nums font-bold text-slate-900">
                  ₩{selectedRegion.bagPrice20L} KRW
                </span>
              </div>
            </div>
            <a
              href={selectedRegion.guOfficeBulkyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[42px] px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>
                {lang === 'vi'
                  ? 'Cổng thông tin Quận (Gu-Office)'
                  : lang === 'ko'
                  ? '구청 대형폐기물 신청 페이지'
                  : 'Official Gu-Office Portal'}
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>
          </div>
        </div>
      </div>

      {/* 9 Core Korean Waste Categories Dictionary (분리수거 사전) */}
      <div className="pt-6 border-t border-slate-200 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {t.categoriesGuideTitle}
            </h3>
            <p className="text-sm text-slate-600 mt-0.5">
              {t.categoriesGuideSub}
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              placeholder={
                lang === 'vi'
                  ? 'Tìm xương gà, vỏ trứng, hộp sữa...'
                  : lang === 'ko'
                  ? '품목 검색 (예: 닭뼈, 우유팩, 페트병)...'
                  : 'Search bones, milk carton, PET...'
              }
              className="w-full min-h-[42px] pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Category Filter Segmented Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveCategoryFilter('ALL')}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeCategoryFilter === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {lang === 'vi' ? 'Tất cả (9 nhóm)' : lang === 'ko' ? '전체 (9대 품목)' : 'All (9 Categories)'}
          </button>
          {WASTE_CATEGORIES.map((cat) => (
            <button
              key={cat.code}
              type="button"
              onClick={() => setActiveCategoryFilter(cat.code)}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategoryFilter === cat.code
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.name[lang]}
            </button>
          ))}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-100">
                  <span className="font-mono">{cat.code}</span>
                  <span className="font-mono tabular-nums text-rose-600 font-semibold">
                    과태료 ₩{cat.fineKrw.toLocaleString()}
                  </span>
                </div>

                <h4
                  className="mt-3 text-base font-bold"
                  style={{ color: cat.accentColor }}
                >
                  {cat.name[lang]}
                </h4>
                <p className="mt-1 text-xs font-semibold text-slate-700">
                  {cat.bagType[lang]}
                </p>

                <ul className="mt-3 space-y-1.5 text-xs text-slate-600 leading-relaxed">
                  {cat.disposalSteps[lang].map((st, i) => (
                    <li key={i}>{st}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-amber-900 bg-amber-50/60 p-3 rounded-xl">
                {cat.commonMistakes[lang]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
