import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from './usePWAInstall';
import { Language } from '../../data/koreanWasteData';
import { UI_TEXT } from '../../data/i18n';

interface PWAInstallButtonProps {
  lang: Language;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ lang }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const t = UI_TEXT[lang];

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="min-h-[40px] px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
      >
        <Download className="w-3.5 h-3.5" />
        <span>{t.installAppLabel}</span>
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowGuide(true)}
        className="min-h-[40px] px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
        title="Install PWA"
      >
        <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
        <span className="hidden sm:inline">{isIOS ? t.installIosLabel : t.installAppLabel}</span>
      </button>

      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {lang === 'vi'
                  ? 'Cài đặt WasteSmart K-Life (PWA)'
                  : lang === 'ko'
                  ? 'WasteSmart K-Life 앱 홈 화면 설치'
                  : 'Install WasteSmart K-Life (PWA)'}
              </h3>
              <button
                onClick={() => setShowGuide(false)}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-600 leading-relaxed">
              {lang === 'vi' ? (
                <>
                  <p>
                    Ứng dụng hỗ trợ chuẩn <strong>Progressive Web App (PWA)</strong> giúp bạn tra cứu quy định 분리수거 ngay cả khi mất mạng dưới tầng hầm phân loại rác:
                  </p>
                  <p>
                    1. <strong>Trên iPhone (Safari)</strong>: Nhấn nút <strong>Chia sẻ (Share)</strong> ở thanh dưới cùng → chọn <strong>Thêm vào MH chính (Add to Home Screen)</strong>.
                  </p>
                  <p>
                    2. <strong>Trên Android / Chrome Desktop</strong>: Nhấn biểu tượng <strong>Cài đặt (Install)</strong> trên thanh địa chỉ trình duyệt.
                  </p>
                </>
              ) : lang === 'ko' ? (
                <>
                  <p>
                    홈 화면에 추가하면 오프라인 상태에서도 우리 동네 분리배출 규정과 요일을 즉시 확인할 수 있습니다:
                  </p>
                  <p>
                    1. <strong>iOS (Safari)</strong>: 하단 <strong>공유</strong> 버튼 탭 → <strong>홈 화면에 추가</strong> 선택.
                  </p>
                  <p>
                    2. <strong>Android / Chrome</strong>: 주소창 우측의 <strong>앱 설치</strong> 아이콘 클릭.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Add WasteSmart K-Life to your home screen for instant offline access at your building’s recycling station:
                  </p>
                  <p>
                    1. <strong>iOS Safari</strong>: Tap <strong>Share</strong> in the bottom bar → select <strong>Add to Home Screen</strong>.
                  </p>
                  <p>
                    2. <strong>Android / Chrome</strong>: Click the <strong>Install App</strong> icon in the browser address bar.
                  </p>
                </>
              )}
            </div>
            <button
              onClick={() => setShowGuide(false)}
              className="mt-5 w-full min-h-[44px] rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              {lang === 'vi' ? 'Đã hiểu' : lang === 'ko' ? '확인' : 'Got it'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
