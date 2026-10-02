import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Minus,
  ExternalLink,
  CheckCircle2,
  Printer,
  Copy,
  Check,
} from 'lucide-react';
import {
  BULKY_WASTE_ITEMS,
  Language,
  RegionSchedule,
} from '../../data/koreanWasteData';
import { UI_TEXT } from '../../data/i18n';

interface BulkyStickerGuideViewProps {
  lang: Language;
  selectedRegion: RegionSchedule;
}

export const BulkyStickerGuideView: React.FC<BulkyStickerGuideViewProps> = ({
  lang,
  selectedRegion,
}) => {
  const t = UI_TEXT[lang];
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'chair-office': 1,
    'duvet-winter': 1,
  });
  const [disposalDate, setDisposalDate] = useState<string>(() => {
    const tomorrow = new Date(Date.now() + 86400000);
    return tomorrow.toISOString().split('T')[0];
  });
  const [customPermitNumber, setCustomPermitNumber] = useState<string>(
    '2026-1002-0482'
  );
  const [copiedSlip, setCopiedSlip] = useState(false);

  const updateQty = (id: string, delta: number) => {
    setQuantities((prev) => {
      const next = Math.max(0, (prev[id] || 0) + delta);
      return { ...prev, [id]: next };
    });
  };

  const selectedItems = BULKY_WASTE_ITEMS.filter(
    (item) => (quantities[item.id] || 0) > 0
  );

  const totalFeeKrw = selectedItems.reduce(
    (acc, item) => acc + item.feeKrw * (quantities[item.id] || 0),
    0
  );

  const handleCopyPermitText = () => {
    const lines = [
      `[대형폐기물 배출 신고필증]`,
      `• 관할 구청: ${selectedRegion.gu.ko} (${selectedRegion.dong.ko})`,
      `• 신고번호: 제 ${customPermitNumber} 호`,
      `• 배출예정일: ${disposalDate}`,
      `• 배출품목:`,
      ...selectedItems.map(
        (item) =>
          `  - ${item.name.ko} (${quantities[item.id]}개) : ₩${(
            item.feeKrw * (quantities[item.id] || 0)
          ).toLocaleString()}원`
      ),
      `• 납부수수료 합계: ₩${totalFeeKrw.toLocaleString()}원`,
    ].join('\n');

    navigator.clipboard.writeText(lines);
    setCopiedSlip(true);
    setTimeout(() => setCopiedSlip(false), 2000);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <p className="text-xs font-semibold text-emerald-700 tracking-wide">
            BULKY WASTE & E-WASTE · 대형폐기물 스티커 가이드
          </p>
          <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900">
            {t.bulkyTitle}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
            {t.bulkySubtitle}
          </p>
        </div>

        <a
          href={selectedRegion.guOfficeBulkyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
        >
          <span>{selectedRegion.guOfficeName[lang]}</span>
          <ExternalLink className="w-4 h-4 text-emerald-400" />
        </a>
      </div>

      {/* 4-Step Editorial Workflow Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-base font-bold text-slate-900">
            {t.bulkyStep1Title}
          </h3>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            {t.bulkyStep1Desc}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-base font-bold text-slate-900">
            {t.bulkyStep2Title}
          </h3>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            {t.bulkyStep2Desc}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-base font-bold text-slate-900">
            {t.bulkyStep3Title}
          </h3>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            {t.bulkyStep3Desc}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-base font-bold text-slate-900">
            {t.bulkyStep4Title}
          </h3>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            {t.bulkyStep4Desc}
          </p>
        </div>
      </div>

      {/* Two-Column Calculator + Handwritten Permit Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Official Bulky Waste Fee Table (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">
              {t.bulkyCalculatorTitle}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.bulkyCalculatorSub}
            </p>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {BULKY_WASTE_ITEMS.map((item) => {
              const qty = quantities[item.id] || 0;
              return (
                <div
                  key={item.id}
                  className="py-3.5 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{item.category[lang]}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.spec[lang]}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">
                      {item.name[lang]}
                    </p>
                    <p className="text-xs text-slate-500 font-mono tabular-nums mt-0.5">
                      {item.isFreeEwaste ? (
                        <span className="text-emerald-700 font-semibold">
                          무상수거 (MIỄN PHÍ ₩0 — 1599-0903)
                        </span>
                      ) : (
                        <span>
                          수수료: <strong>₩{item.feeKrw.toLocaleString()} KRW</strong>
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, -1)}
                      disabled={qty === 0}
                      className="min-h-[40px] min-w-[40px] rounded-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-7 text-center font-mono tabular-nums text-sm font-bold text-slate-900">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, 1)}
                      className="min-h-[40px] min-w-[40px] rounded-lg border border-slate-200 bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Handwritten Permit Slip Preview (대형폐기물 수기 신고필증) (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl border-2 border-slate-900 bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900">
              <div>
                <p className="text-[11px] font-mono text-slate-500">
                  NO-PRINTER HANDWRITTEN TEMPLATE
                </p>
                <h3 className="text-lg font-bold text-slate-900">
                  대형폐기물 배출 신고필증
                </h3>
              </div>
              <Printer className="w-5 h-5 text-slate-700" />
            </div>

            <p className="mt-3 text-xs text-slate-600 leading-relaxed">
              {t.permitNotice}
            </p>

            {/* Editable Permit Code & Date */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  {lang === 'vi'
                    ? 'Mã số 신고번호 (Từ Web Quận)'
                    : lang === 'ko'
                    ? '신고번호 (구청 발급번호)'
                    : 'Permit # (From Gu Website)'}
                </label>
                <input
                  type="text"
                  value={customPermitNumber}
                  onChange={(e) => setCustomPermitNumber(e.target.value)}
                  className="w-full min-h-[40px] px-3 py-1.5 rounded-lg border border-slate-300 font-mono tabular-nums text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  {lang === 'vi'
                    ? 'Ngày mang ra (배출예정일)'
                    : lang === 'ko'
                    ? '배출 예정일'
                    : 'Scheduled Disposal Date'}
                </label>
                <input
                  type="date"
                  value={disposalDate}
                  onChange={(e) => setDisposalDate(e.target.value)}
                  className="w-full min-h-[40px] px-3 py-1.5 rounded-lg border border-slate-300 font-mono tabular-nums text-xs font-bold text-slate-900"
                />
              </div>
            </div>

            {/* Paper Slip Box to Copy onto A4 */}
            <div className="mt-5 rounded-xl border-2 border-dashed border-slate-400 bg-slate-50 p-4 space-y-2.5 font-sans">
              <div className="text-center pb-2 border-b border-slate-300">
                <p className="text-base font-bold text-slate-900">
                  대형폐기물 신고필증 ({selectedRegion.gu.ko})
                </p>
                <p className="text-xs font-mono tabular-nums font-bold text-rose-600 mt-0.5">
                  신고번호: 제 {customPermitNumber} 호
                </p>
              </div>

              <div className="text-xs space-y-1.5 text-slate-800">
                <div className="flex justify-between">
                  <span className="font-semibold">배출장소 (Địa chỉ):</span>
                  <span>
                    {selectedRegion.gu.ko} {selectedRegion.dong.ko}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">배출일자 (Ngày vứt):</span>
                  <span className="font-mono tabular-nums font-bold">
                    {disposalDate}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-300">
                <p className="text-xs font-bold text-slate-900 mb-1.5">
                  배출 품목 내역 (Danh sách đồ):
                </p>
                {selectedItems.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">
                    {lang === 'vi'
                      ? 'Hãy chọn ít nhất 1 món đồ bên trái'
                      : '왼쪽 표에서 배출할 품목을 선택하세요'}
                  </p>
                ) : (
                  <ul className="space-y-1 text-xs text-slate-900">
                    {selectedItems.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between font-medium"
                      >
                        <span>
                          • {item.name.ko} × {quantities[item.id]}개
                        </span>
                        <span className="font-mono tabular-nums font-bold">
                          ₩
                          {(
                            item.feeKrw * (quantities[item.id] || 0)
                          ).toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-2.5 border-t border-slate-300 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  수수료 합계 ({t.totalFeeLabel}):
                </span>
                <span className="text-lg font-mono tabular-nums font-bold text-emerald-700">
                  ₩{totalFeeKrw.toLocaleString()} KRW
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyPermitText}
              className="mt-4 w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            >
              {copiedSlip ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{t.copiedText}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-emerald-400" />
                  <span>
                    {lang === 'vi'
                      ? 'Sao chép nội dung tiếng Hàn để viết/in'
                      : lang === 'ko'
                      ? '신고필증 텍스트 복사하기'
                      : 'Copy Korean Permit Text'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
