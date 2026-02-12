'use client';

import React, { useState } from 'react';
import PhotoBooth from '@/app/screen/PhotoBoothScreen';
import PhotoEditor from '@/app/screen/PhotoEditor';

export default function PhotoBoothPage() {
    const [isFinished, setIsFinished] = useState(false);
    const [photos, setPhotos] = useState<string[]>([]);
    const [currentFilterId, setCurrentFilterId] = useState<string>('normal');

    const handleFinish = (capturedPhotos: string[], filterId: string) => {
        setPhotos(capturedPhotos);
        setCurrentFilterId(filterId);
        setIsFinished(true);
    };

    const resetAll = () => {
        setPhotos([]);
        setCurrentFilterId('normal');
        setIsFinished(false);
    };

    const handleRemovePhoto = (index: number) => {
        setPhotos(prev => prev.filter((_, i) => i !== index));
    };

    if (isFinished) {
        return (
            <PhotoEditor
                photos={photos}
                onRetake={resetAll}
                onRemovePhoto={handleRemovePhoto}
                filterId={currentFilterId}
            />
        );
    }

    return (
        <main className="min-h-screen bg-pink-50 flex items-center justify-center p-4 font-sans text-gray-800">
            <PhotoBooth onFinish={handleFinish} />
        </main>
    );
}
