/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  Camera,
  Calendar,
  FileText,
  Home,
  MapPin,
  Bell,
  CheckCircle2,
  XCircle,
  ArrowRight,
  PhoneCall,
} from 'lucide-react';
import {
  Language,
  REGION_SCHEDULES,
  RegionSchedule,
  SAMPLE_WASTE_PHOTOS,
  ScanResultData,
} from './data/koreanWasteData';
import { UI_TEXT } from './data/i18n';
import { AIWasteScanner } from './components/scanner/AIWasteScanner';
import { GuDongScheduleView } from './components/schedule/GuDongScheduleView';
import { BulkyStickerGuideView } from './components/bulky/BulkyStickerGuideView';
import { PWAInstallButton } from './components/pwa/PWAInstallButton';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';

type NavTab = 'dashboard' | 'scanner' | 'schedule' | 'bulky';

const DAY_CODES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const STORAGE_HISTORY_KEY = 'wastesmart_klife_scan_history_v1';

const DEFAULT_SCAN_HISTORY: ScanResultData[] = [
  {
    id: 'init-1',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    guDistrict: 'Gwanak-gu (관악구)',
    ...SAMPLE_WASTE_PHOTOS[0].presetResult,
  },
  {
    id: 'init-2',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    guDistrict: 'Gwanak-gu (관악구)',
    ...SAMPLE_WASTE_PHOTOS[3].presetResult,
  },
];

export default function App() {
  const [lang, setLang] = useState<Language>('vi');
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedRegion, setSelectedRegion] = useState<RegionSchedule>(
    REGION_SCHEDULES[0]
  );
  const [scanHistory, setScanHistory] = useState<ScanResultData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_HISTORY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore localStorage error
    }
    return DEFAULT_SCAN_HISTORY;
  });
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState('19:30');
  const [toastNotification, setToastNotification] = useState<string | null>(
    null
  );
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const t = UI_TEXT[lang];

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_HISTORY_KEY,
        JSON.stringify(scanHistory.slice(0, 15))
      );
    } catch {
      // ignore quota error
    }
  }, [scanHistory]);

  const todayCode = DAY_CODES[new Date().getDay()];
  const isGeneralAllowedTonight =
    selectedRegion.generalDays.includes(todayCode);
  const isFoodAllowedTonight = selectedRegion.foodDays.includes(todayCode);
  const isRecycleAllowedTonight =
    selectedRegion.recycleDays.includes(todayCode);
  const isClearPetAllowedTonight =
    selectedRegion.clearPetVinylDays.includes(todayCode);

  const handleNewScanResult = (result: ScanResultData) => {
    setScanHistory((prev) => [
      result,
      ...prev.filter((r) => r.id !== result.id),
    ]);
  };

  const handleClearHistory = async () => {
    setScanHistory([]);
    try {
      localStorage.removeItem(STORAGE_HISTORY_KEY);
      await fetch('/api/history', { method: 'DELETE' });
    } catch {
      // ignore offline error
    }
  };

  const triggerEveningReminder = () => {
    const msg =
      lang === 'vi'
        ? `[Nhắc lịch ${reminderTime} · ${selectedRegion.gu.vi}] Tối nay (${t.dayNames[todayCode]}) khung giờ đổ rác là ${selectedRegion.disposalStartTime}~${selectedRegion.disposalEndTime}. Hãy dùng đúng ${selectedRegion.generalBagColor.vi}!`
        : lang === 'ko'
        ? `[${reminderTime} 배출 알림 · ${selectedRegion.gu.ko}] 오늘(${t.dayNames[todayCode]}) 배출 시간은 ${selectedRegion.disposalStartTime}~${selectedRegion.disposalEndTime}입니다. ${selectedRegion.generalBagColor.ko}를 사용해 주세요!`
        : `[${reminderTime} Reminder · ${selectedRegion.gu.en}] Tonight's (${t.dayNames[todayCode]}) disposal window is ${selectedRegion.disposalStartTime}–${selectedRegion.disposalEndTime}. Use ${selectedRegion.generalBagColor.en}!`;

    setToastNotification(msg);
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('WasteSmart K-Life', { body: msg });
    } else if (
      'Notification' in window &&
      Notification.permission !== 'denied'
    ) {
      Notification.requestPermission().then((perm) => {
        if (perm === 'granted') {
          new Notification('WasteSmart K-Life', { body: msg });
        }
      });
    }
    setTimeout(() => setToastNotification(null), 6500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 pb-20 md:pb-12">
      <OfflineIndicator />

      {/* Top Navigation Bar — Strict 3-Zone Contract */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 h-14 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element Brand Wordmark */}
        <a
          href="#dashboard"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('dashboard');
          }}
          className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
        >
          WasteSmart K-Life
        </a>

        {/* Zone 2: 4 Clean Typography Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`py-1 whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'dashboard'
                ? 'border-emerald-600 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            {t.navDashboard}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('scanner')}
            className={`py-1 whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'scanner'
                ? 'border-emerald-600 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            {t.navScanner}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`py-1 whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'schedule'
                ? 'border-emerald-600 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            {t.navSchedule}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bulky')}
            className={`py-1 whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'bulky'
                ? 'border-emerald-600 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            {t.navBulky}
          </button>
        </nav>

        {/* Zone 3: Language Switcher + PWA Install Action */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200/80"
            role="group"
            aria-label="Language switcher"
          >
            {(['vi', 'ko', 'en'] as Language[]).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                className={`min-h-[32px] px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  lang === code
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {code === 'vi' ? 'VI' : code === 'ko' ? '한국어' : 'EN'}
              </button>
            ))}
          </div>

          <PWAInstallButton lang={lang} />
        </div>
      </header>

      {/* Evening Reminder Notification Banner (when triggered) */}
      {toastNotification && (
        <div className="bg-slate-900 text-white px-4 sm:px-8 py-3 border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toastNotification}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastNotification(null)}
              className="text-slate-400 hover:text-white font-semibold shrink-0"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Content Container (1440px Desktop Presence) */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
        {activeTab === 'dashboard' && (
          <div className="space-y-12">
            {/* Hero + Active Gu/Dong Live Status Section */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Hero Column (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                  <span>{t.heroKicker}</span>
                  <span aria-hidden="true">·</span>
                  <span>서울 · 경기 · 부산</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-slate-900 leading-[1.18] tracking-tight">
                  {t.heroTitle}
                </h1>

                <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
                  {t.heroSubtitle}
                </p>

                {/* Primary CTA + Secondary Action */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('scanner')}
                    className="min-h-[48px] px-6 py-3 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-xs whitespace-nowrap"
                  >
                    <Camera className="w-4 h-4" />
                    <span>{t.ctaScanNow}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('schedule')}
                    className="min-h-[48px] px-5 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    <Calendar className="w-4 h-4 text-slate-600" />
                    <span>{t.ctaViewSchedule}</span>
                  </button>
                </div>

                {/* District Quick Switcher Bar */}
                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      {t.currentRegionLabel}:
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('schedule')}
                      className="text-xs font-semibold text-emerald-700 hover:underline"
                    >
                      {lang === 'vi'
                        ? 'Đổi Quận/Phường →'
                        : lang === 'ko'
                        ? '지역 변경 →'
                        : 'Change District →'}
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {REGION_SCHEDULES.map((reg) => (
                      <button
                        key={reg.id}
                        type="button"
                        onClick={() => setSelectedRegion(reg)}
                        className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                          selectedRegion.id === reg.id
                            ? 'bg-slate-900 text-white'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {reg.gu[lang]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Tonight's Collection Live Card (5 cols) */}
              <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                  <div>
                    <p className="text-xs text-slate-500">
                      {selectedRegion.city[lang]} · {selectedRegion.dong[lang]}
                    </p>
                    <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                      {t.todayCollectionTitle}
                    </h2>
                  </div>
                  <span className="font-mono tabular-nums text-xs font-bold text-emerald-700">
                    {t.dayNames[todayCode]}
                  </span>
                </div>

                {/* 4 Waste Streams Status Tonight */}
                <div className="mt-4 divide-y divide-slate-100 text-sm">
                  <div className="py-2.5 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {t.wasteTypeGeneral}
                      </p>
                      <p className="text-xs text-slate-500">
                        {selectedRegion.generalBagColor[lang]}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-bold flex items-center gap-1 shrink-0 ${
                        isGeneralAllowedTonight
                          ? 'text-emerald-700'
                          : 'text-rose-600'
                      }`}
                    >
                      {isGeneralAllowedTonight ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          {t.allowedToday}
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          {t.prohibitedToday}
                        </>
                      )}
                    </span>
                  </div>

                  <div className="py-2.5 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {t.wasteTypeFood}
                      </p>
                      <p className="text-xs text-slate-500">
                        {selectedRegion.foodBagColor[lang]}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-bold flex items-center gap-1 shrink-0 ${
                        isFoodAllowedTonight
                          ? 'text-emerald-700'
                          : 'text-rose-600'
                      }`}
                    >
                      {isFoodAllowedTonight ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          {t.allowedToday}
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          {t.prohibitedToday}
                        </>
                      )}
                    </span>
                  </div>

                  <div className="py-2.5 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {t.wasteTypeRecycle}
                      </p>
                      <p className="text-xs text-slate-500">
                        {lang === 'vi'
                          ? 'Túi trong suốt'
                          : lang === 'ko'
                          ? '투명 봉투 배출'
                          : 'Transparent Bag'}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-bold flex items-center gap-1 shrink-0 ${
                        isRecycleAllowedTonight
                          ? 'text-emerald-700'
                          : 'text-rose-600'
                      }`}
                    >
                      {isRecycleAllowedTonight ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          {t.allowedToday}
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          {t.prohibitedToday}
                        </>
                      )}
                    </span>
                  </div>

                  <div className="py-2.5 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-sky-900">
                        {t.wasteTypeClearPet}
                      </p>
                      <p className="text-xs text-sky-700">
                        {lang === 'vi'
                          ? 'Thứ 5 chuyên biệt (목요일 요일제)'
                          : lang === 'ko'
                          ? '목요일 전용 배출 요일제'
                          : 'Dedicated Thursday Rule'}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-bold flex items-center gap-1 shrink-0 ${
                        isClearPetAllowedTonight
                          ? 'text-emerald-700'
                          : 'text-slate-500'
                      }`}
                    >
                      {isClearPetAllowedTonight ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          {t.allowedToday}
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          {t.prohibitedToday}
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Disposal Window + Test Reminder Action */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-600">
                    <span>{t.disposalWindowLabel}:</span>{' '}
                    <strong className="font-mono tabular-nums text-slate-900">
                      {selectedRegion.disposalStartTime} ~{' '}
                      {selectedRegion.disposalEndTime}
                    </strong>
                  </div>

                  <button
                    type="button"
                    onClick={triggerEveningReminder}
                    className="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <Bell className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.testNotificationBtn}</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Section 2: Quick AI Vision Fine-Trap Inspector Showcase */}
            <section className="pt-8 border-t border-slate-200 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {t.samplePhotosTitle}
                  </h2>
                  <p className="text-sm text-slate-600 mt-0.5">
                    {t.samplePhotosSub}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('scanner')}
                  className="text-sm font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                >
                  <span>{t.navScanner}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {SAMPLE_WASTE_PHOTOS.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => {
                      const newRec: ScanResultData = {
                        id: `dash-${Date.now()}`,
                        createdAt: new Date().toISOString(),
                        guDistrict: `${selectedRegion.gu.en} (${selectedRegion.gu.ko})`,
                        ...sample.presetResult,
                      };
                      handleNewScanResult(newRec);
                      setActiveTab('scanner');
                    }}
                    className="group text-left rounded-2xl border border-slate-200 bg-white p-4 hover:border-emerald-600 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-4/3 w-full overflow-hidden rounded-xl bg-slate-100 mb-3">
                        {!imgErrors[sample.imageUrl] ? (
                          <img
                            src={sample.imageUrl}
                            alt={sample.title[lang]}
                            referrerPolicy="no-referrer"
                            onError={() =>
                              setImgErrors((prev) => ({
                                ...prev,
                                [sample.imageUrl]: true,
                              }))
                            }
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-slate-200 text-xs font-bold text-slate-600 p-3 text-center">
                            {sample.title.ko}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <span className="font-mono">
                          {sample.presetResult.categoryCode}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums text-rose-600 font-semibold">
                          ₩{sample.presetResult.fineAmountKrw.toLocaleString()}
                        </span>
                      </div>

                      <h3 className="mt-1 text-base font-bold text-slate-900">
                        {sample.title[lang]}
                      </h3>
                      <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                        {sample.subtitle[lang]}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
                      <span>
                        {lang === 'vi'
                          ? 'Xem kết quả giám định AI'
                          : lang === 'ko'
                          ? 'AI 판독 결과 보기'
                          : 'Inspect with AI Vision'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Section 3: Bulky Waste Sticker & Free Appliance Pickup Callout */}
            <section className="pt-8 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bulky Waste Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>대형폐기물 스티커</span>
                    <span aria-hidden="true">·</span>
                    <span>{selectedRegion.guOfficeName[lang]}</span>
                  </div>
                  <h3 className="mt-2 text-xl font-bold text-slate-900">
                    {t.bulkyTitle}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {t.bulkySubtitle}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-mono tabular-nums text-slate-500">
                    ₩2,000 ~ ₩15,000 KRW
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('bulky')}
                    className="min-h-[40px] px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                  >
                    <span>{t.generatePermitBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Free E-Waste Home Pickup (1599-0903) Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>폐가전 무상방문수거</span>
                    <span aria-hidden="true">·</span>
                    <span>1599-0903</span>
                  </div>
                  <h3 className="mt-2 text-xl font-bold text-slate-900">
                    {lang === 'vi'
                      ? 'Thu gom đồ điện tử tận nhà MIỄN PHÍ 100% (1599-0903)'
                      : lang === 'ko'
                      ? '폐가전제품 100% 무상방문수거 서비스 (1599-0903)'
                      : '100% Free Home Pickup for E-Waste Appliances (1599-0903)'}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {t.bulkyStep1Desc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-mono tabular-nums text-emerald-700 font-semibold">
                    수수료 ₩0 KRW (무료)
                  </span>
                  <a
                    href="https://15990903.or.kr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[40px] px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                    <span>15990903.or.kr</span>
                  </a>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'scanner' && (
          <AIWasteScanner
            lang={lang}
            selectedRegion={selectedRegion}
            scanHistory={scanHistory}
            onNewScanResult={handleNewScanResult}
            onClearHistory={handleClearHistory}
          />
        )}

        {activeTab === 'schedule' && (
          <GuDongScheduleView
            lang={lang}
            selectedRegion={selectedRegion}
            onSelectRegion={setSelectedRegion}
            reminderEnabled={reminderEnabled}
            onToggleReminder={() => setReminderEnabled((prev) => !prev)}
            reminderTime={reminderTime}
            onChangeReminderTime={setReminderTime}
            onTriggerTestAlert={triggerEveningReminder}
          />
        )}

        {activeTab === 'bulky' && (
          <BulkyStickerGuideView lang={lang} selectedRegion={selectedRegion} />
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-4 sm:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span>WasteSmart K-Life</span>
            <span aria-hidden="true"> · </span>
            <span>대한민국 기후에너지환경부 분리배출 가이드라인 준수</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('scanner')}
              className="hover:text-slate-900"
            >
              {t.navScanner}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('schedule')}
              className="hover:text-slate-900"
            >
              {t.navSchedule}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('bulky')}
              className="hover:text-slate-900"
            >
              {t.navBulky}
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Fixed Bottom Tab Bar (4 Tabs, Thumb-Zone Navigation, <= 15% Viewport Height) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 grid grid-cols-4 items-center h-16 px-2"
      >
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className={`min-h-[44px] flex flex-col items-center justify-center ${
            activeTab === 'dashboard' ? 'text-emerald-600' : 'text-slate-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1 truncate max-w-[76px]">
            {t.navDashboard}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('scanner')}
          className={`min-h-[44px] flex flex-col items-center justify-center ${
            activeTab === 'scanner' ? 'text-emerald-600' : 'text-slate-500'
          }`}
        >
          <Camera className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1 truncate max-w-[76px]">
            {t.navScanner}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('schedule')}
          className={`min-h-[44px] flex flex-col items-center justify-center ${
            activeTab === 'schedule' ? 'text-emerald-600' : 'text-slate-500'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1 truncate max-w-[76px]">
            {t.navSchedule}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bulky')}
          className={`min-h-[44px] flex flex-col items-center justify-center ${
            activeTab === 'bulky' ? 'text-emerald-600' : 'text-slate-500'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1 truncate max-w-[76px]">
            {t.navBulky}
          </span>
        </button>
      </nav>
    </div>
  );
}
