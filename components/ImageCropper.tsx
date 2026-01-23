
import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../lib/cropImage';

interface ImageCropperProps {
    imageSrc: string;
    onCropComplete: (croppedBlob: Blob) => void;
    onClose: () => void;
    aspect?: number;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ imageSrc, onCropComplete, onClose, aspect = 1 }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

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
            alert('Fotoğraf kırpılırken bir hata oluştu.');
        }
    }, [imageSrc, croppedAreaPixels, onCropComplete]);

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden flex flex-col h-[500px] animate-in zoom-in-95 duration-200">

                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white z-10">
                    <h3 className="font-bold text-lg text-gray-900">Fotoğrafı Ayarla</h3>
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
                        <span className="text-xs font-bold text-gray-500">Yakınlaştır</span>
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
                            Vazgeç
                        </button>
                        <button
                            onClick={showCroppedImage}
                            className="flex-1 py-3 rounded-xl font-bold text-sm text-white bg-[#1f6d78] hover:bg-[#155e68] transition-colors shadow-lg shadow-[#1f6d78]/20"
                        >
                            Tamamla
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageCropper;
