
import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../lib/cropImage';
import { useLanguage } from '../context/LanguageContext';

interface ImageCropperProps {
    imageSrc: string;
    onCropComplete: (croppedBlob: Blob) => void;
    onClose: () => void;
    aspect?: number;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ imageSrc, onCropComplete, onClose, aspect = 1 }) => {
    const { t } = useLanguage();
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    const [showWarning, setShowWarning] = useState<{ show: boolean, message: string }>({ show: false, message: '' });

    const onCropChange = (crop: { x: number; y: number }) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom: number) => {
        setZoom(zoom);
    };

    const onCropCompleteHandler = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const showCroppedImage = useCallback(async () => {
        try {
            const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
            if (croppedBlob) {
                onCropComplete(croppedBlob);
            }
        } catch (e) {
            console.error(e);
            setShowWarning({ show: true, message: t('cropper.error') });
        }
    }, [imageSrc, croppedAreaPixels, onCropComplete, t]);

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden flex flex-col h-[500px] animate-in zoom-in-95 duration-200 relative">

                {/* Warning / Error Overlay */}
                {showWarning.show && (
                    <div className="absolute inset-0 z-[300] flex items-center justify-center bg-white/90 backdrop-blur-sm p-6 animate-in fade-in duration-200">
                        <div className="bg-white border-2 border-gray-100 rounded-[2rem] p-8 w-full max-w-sm shadow-2xl scale-100 animate-in zoom-in-95 duration-200 text-center relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gray-50 rounded-full blur-2xl opacity-50 pointer-events-none"></div>
                            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-5 text-2xl shadow-xl relative z-10">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                            </div>
                            <h3 className="text-xl font-black text-black mb-2 leading-tight tracking-tight relative z-10">
                                {t('cropper.error_title')}
                            </h3>
                            <p className="text-sm font-bold text-gray-500 mb-8 leading-relaxed relative z-10">
                                {showWarning.message}
                            </p>
                            <button
                                onClick={() => setShowWarning({ show: false, message: '' })}
                                className="w-full bg-[#1f6d78] text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#155e68] transition-all shadow-lg active:scale-95 relative z-10"
                            >
                                {t('settings.ok')}
                            </button>
                        </div>
                    </div>
                )}

                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white z-10">
                    <h3 className="font-bold text-lg text-gray-900">{t('cropper.title')}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-900">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="relative flex-1 bg-gray-900 w-full">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect}
                        onCropChange={onCropChange}
                        onCropComplete={onCropCompleteHandler}
                        onZoomChange={onZoomChange}
                        showGrid={true}
                        cropShape="rect"
                        objectFit="contain"
                    />
                </div>

                <div className="p-6 bg-white border-t border-gray-100 flex flex-col gap-4 z-10">
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-gray-500">{t('cropper.zoom')}</span>
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1f6d78]"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl font-bold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            {t('cropper.cancel')}
                        </button>
                        <button
                            onClick={showCroppedImage}
                            className="flex-1 py-3 rounded-xl font-bold text-sm text-white bg-[#1f6d78] hover:bg-[#155e68] transition-colors shadow-lg shadow-[#1f6d78]/20"
                        >
                            {t('cropper.done')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageCropper;
