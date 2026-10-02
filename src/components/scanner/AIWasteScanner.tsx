import React, { useRef, useState } from 'react';
import {
  Camera,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Trash2,
  CheckSquare,
  Square,
  RefreshCw,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import {
  Language,
  RegionSchedule,
  SAMPLE_WASTE_PHOTOS,
  ScanResultData,
  SampleWastePhoto,
} from '../../data/koreanWasteData';
import { UI_TEXT } from '../../data/i18n';

interface AIWasteScannerProps {
  lang: Language;
  selectedRegion: RegionSchedule;
  scanHistory: ScanResultData[];
  onNewScanResult: (result: ScanResultData) => void;
  onClearHistory: () => void;
}

export const AIWasteScanner: React.FC<AIWasteScannerProps> = ({
  lang,
  selectedRegion,
  scanHistory,
  onNewScanResult,
  onClearHistory,
}) => {
  const t = UI_TEXT[lang];
  const [activeResult, setActiveResult] = useState<ScanResultData | null>(
    scanHistory[0] || null
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
  const [cameraActive, setCameraActive] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(
    scanHistory[0]?.imagePreview || SAMPLE_WASTE_PHOTOS[0].imageUrl
  );
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const startCamera = async () => {
    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      streamRef.current = stream;
      setCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }, 100);
    } catch {
      setErrorMsg(
        lang === 'vi'
          ? 'Không thể truy cập Camera trực tiếp trên trình duyệt này. Vui lòng dùng nút "Tải ảnh từ thiết bị" hoặc chọn 4 mẫu thử bên dưới.'
          : lang === 'ko'
          ? '카메라 권한에 접근할 수 없습니다. 사진 업로드 버튼이나 아래 샘플 이미지를 이용해 주세요.'
          : 'Camera access unavailable in this browser frame. Please use "Upload Photo" or click a sample scenario below.'
      );
    }
  };

  const captureFromCamera = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    stopCamera();
    setPreviewImage(dataUrl);
    await analyzeWaste({ imageBase64: dataUrl, mimeType: 'image/jpeg' });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    stopCamera();
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setPreviewImage(dataUrl);
      await analyzeWaste({
        imageBase64: dataUrl,
        mimeType: file.type || 'image/jpeg',
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = async (sample: SampleWastePhoto) => {
    stopCamera();
    setPreviewImage(sample.imageUrl);
    try {
      const res = await fetch(sample.imageUrl);
      const blob = await res.blob();
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
      await analyzeWaste({
        imageBase64: base64,
        mimeType: blob.type || 'image/jpeg',
        sampleId: sample.id,
      });
    } catch {
      await analyzeWaste({ sampleId: sample.id });
    }
  };

  const analyzeWaste = async (payload: {
    imageBase64?: string;
    mimeType?: string;
    sampleId?: string;
  }) => {
    setIsAnalyzing(true);
    setErrorMsg(null);
    setCheckedSteps({});
    try {
      const response = await fetch('/api/scan-waste', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          guDistrict: `${selectedRegion.gu.en} (${selectedRegion.gu.ko})`,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.result) {
        throw new Error(data.error || 'Failed to analyze image');
      }
      setActiveResult(data.result);
      onNewScanResult(data.result);
    } catch (err: any) {
      // Fallback if offline and sampleId was clicked
      if (payload.sampleId) {
        const sample = SAMPLE_WASTE_PHOTOS.find((s) => s.id === payload.sampleId);
        if (sample) {
          const fallback: ScanResultData = {
            id: `local-${Date.now()}`,
            createdAt: new Date().toISOString(),
            guDistrict: `${selectedRegion.gu.en} (${selectedRegion.gu.ko})`,
            ...sample.presetResult,
          };
          setActiveResult(fallback);
          onNewScanResult(fallback);
          setIsAnalyzing(false);
          return;
        }
      }
      setErrorMsg(err?.message || 'Error analyzing waste image');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleStep = (idx: number) => {
    setCheckedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <p className="text-xs font-semibold text-emerald-700 tracking-wide">
            GEMINI VISION AI · 분리배출 4대 원칙 판독
          </p>
          <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900">
            {t.scannerTitle}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
            {t.scannerSubtitle}
          </p>
        </div>
        <div className="text-xs text-slate-500 shrink-0">
          <span>{t.currentRegionLabel}:</span>{' '}
          <strong className="text-slate-900 font-semibold">
            {selectedRegion.gu[lang]} · {selectedRegion.dong[lang]}
          </strong>
        </div>
      </div>

      {/* Main Two-Column Scanner + Result Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Camera / Upload / Sample Selector (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Viewfinder / Image Preview Box */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-slate-900 flex items-center justify-center">
              {cameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full object-cover"
                />
              ) : previewImage && !imgErrors[previewImage] ? (
                <img
                  src={previewImage}
                  alt="Scanned waste item preview"
                  referrerPolicy="no-referrer"
                  onError={() =>
                    setImgErrors((prev) => ({ ...prev, [previewImage]: true }))
                  }
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center text-slate-300">
                  <Camera className="w-10 h-10 text-emerald-400 mb-2" />
                  <p className="text-sm font-medium">
                    {lang === 'vi'
                      ? 'Chụp hoặc tải ảnh món rác cần kiểm tra'
                      : lang === 'ko'
                      ? '판독할 쓰레기 사진을 촬영하거나 업로드하세요'
                      : 'Capture or upload a waste photo to inspect'}
                  </p>
                </div>
              )}

              {/* Loading Overlay */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white">
                  <RefreshCw className="w-9 h-9 text-emerald-400 animate-spin mb-3" />
                  <p className="text-sm font-semibold">{t.analyzingTitle}</p>
                  <p className="mt-1 text-xs text-slate-300">{t.analyzingSub}</p>
                </div>
              )}
            </div>

            {/* Camera & Upload Controls */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {!cameraActive ? (
                <button
                  type="button"
                  onClick={startCamera}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Camera className="w-4 h-4 text-emerald-400" />
                  <span>{t.openCameraBtn}</span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={captureFromCamera}
                    className="flex-1 min-h-[44px] px-3 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{t.capturePhotoBtn}</span>
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="min-h-[44px] px-3 py-2.5 rounded-xl bg-slate-200 text-slate-800 text-xs font-semibold hover:bg-slate-300 transition-colors whitespace-nowrap"
                  >
                    {t.stopCameraBtn}
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Upload className="w-4 h-4 text-slate-600" />
                <span>{t.uploadPhotoBtn}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {errorMsg && (
              <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                {errorMsg}
              </div>
            )}
          </div>

          {/* 4 Sample Korean Waste Traps */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <h3 className="text-sm font-bold text-slate-900">
              {t.samplePhotosTitle}
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">{t.samplePhotosSub}</p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {SAMPLE_WASTE_PHOTOS.map((sample) => {
                const isSelected = previewImage === sample.imageUrl;
                return (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    disabled={isAnalyzing}
                    className={`group text-left rounded-xl border p-2.5 transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/40'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="aspect-4/3 w-full overflow-hidden rounded-lg bg-slate-100 mb-2">
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
                        <div className="h-full w-full flex items-center justify-center bg-slate-200 text-xs font-semibold text-slate-600 p-2 text-center">
                          {sample.title.ko}
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-bold text-slate-900 line-clamp-1">
                      {sample.title[lang]}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-500 line-clamp-2">
                      {sample.subtitle[lang]}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Detailed AI Inspection Result + History (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {activeResult && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
              {/* Top Kicker & Confidence */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">
                    {t.scanResultHeader}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{activeResult.koreanSortingPrinciple}</span>
                </div>
                <span className="font-mono tabular-nums font-semibold text-emerald-700">
                  {t.confidenceLabel}: {activeResult.confidenceScore}%
                </span>
              </div>

              {/* Identified Item Title */}
              <div className="mt-4">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {activeResult.itemName[lang]}
                </h3>
                <p
                  className="mt-1 text-sm font-semibold"
                  style={{ color: activeResult.bagColorTag || '#0F172A' }}
                >
                  {activeResult.categoryLabel[lang]}
                </p>
              </div>

              {/* Contamination Inspection Alert Box */}
              <div
                className={`mt-5 rounded-xl p-4 border ${
                  activeResult.isContaminated
                    ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                    : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                }`}
              >
                <div className="flex items-start gap-3">
                  {activeResult.isContaminated ? (
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-xs font-bold tracking-wide">
                      {activeResult.isContaminated
                        ? t.contaminatedBadge
                        : t.cleanBadge}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed">
                      {activeResult.contaminationReason[lang]}
                    </p>
                  </div>
                </div>
              </div>

              {/* Required Bag / Bin Specification tailored to Current Gu */}
              <div className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">{t.bagRequiredLabel}</p>
                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {activeResult.recommendedBag[lang]}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    {selectedRegion.gu[lang]}:{' '}
                    {activeResult.categoryCode === 'FOOD_WASTE'
                      ? selectedRegion.foodBagColor[lang]
                      : selectedRegion.generalBagColor[lang]}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">{t.fineRiskLabel}</p>
                  <p className="mt-1 text-base font-mono tabular-nums font-bold text-rose-600">
                    ₩{activeResult.fineAmountKrw.toLocaleString()} KRW
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    {activeResult.fineWarning[lang]}
                  </p>
                </div>
              </div>

              {/* Interactive Step-by-Step Preparation Checklist */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-slate-900">
                    {t.fourStepsLabel}
                  </h4>
                  <span className="text-xs text-slate-500 font-mono tabular-nums">
                    {Object.values(checkedSteps).filter(Boolean).length}/
                    {activeResult.disposalSteps[lang].length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {activeResult.disposalSteps[lang].map((step, index) => {
                    const isChecked = !!checkedSteps[index];
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => toggleStep(index)}
                        className={`w-full text-left min-h-[44px] p-3 rounded-xl border transition-colors flex items-start gap-3 ${
                          isChecked
                            ? 'bg-emerald-50/50 border-emerald-200 text-slate-500 line-through'
                            : 'bg-slate-50/70 border-slate-200/80 text-slate-800 hover:bg-slate-100/70'
                        }`}
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        )}
                        <span className="text-sm leading-relaxed">{step}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Recent Scan History */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {t.scanHistoryTitle} ({scanHistory.length})
              </h3>
              {scanHistory.length > 0 && (
                <button
                  type="button"
                  onClick={onClearHistory}
                  className="min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t.clearHistoryBtn}</span>
                </button>
              )}
            </div>

            {scanHistory.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-slate-500">{t.emptyHistoryText}</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {scanHistory.slice(0, 6).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveResult(item);
                      if (item.imagePreview) setPreviewImage(item.imagePreview);
                      setCheckedSteps({});
                    }}
                    className="w-full py-3.5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors px-2 rounded-lg"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {item.itemName[lang]}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                        <span>{item.recommendedBag[lang]}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums text-rose-600">
                           과태료 ₩{item.fineAmountKrw.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
