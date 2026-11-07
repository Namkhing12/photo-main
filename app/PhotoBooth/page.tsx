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

    if (isFinished) {
        return (
            <PhotoEditor
                photos={photos}
                onRetake={resetAll}
                filterId={currentFilterId}
            />
        );
    }

    return (
        <div className="min-h-full">
            <PhotoBooth onFinish={handleFinish} />
        </div>
    );
}
