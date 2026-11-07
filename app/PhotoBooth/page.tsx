'use client';

import React, { useState } from 'react';
import PhotoBooth, { type Shot } from '@/app/screen/PhotoBoothScreen';
import PhotoEditor from '@/app/screen/PhotoEditor';

export default function PhotoBoothPage() {
    const [isFinished, setIsFinished] = useState(false);
    const [shots, setShots] = useState<Shot[]>([]);

    const handleFinish = (captured: Shot[]) => {
        setShots(captured);
        setIsFinished(true);
    };

    const resetAll = () => {
        setShots([]);
        setIsFinished(false);
    };

    if (isFinished) {
        return (
            <PhotoEditor
                photos={shots.map(s => s.src)}
                photoFilters={shots.map(s => s.filterId)}
                onRetake={resetAll}
            />
        );
    }

    return (
        <div className="min-h-full">
            <PhotoBooth onFinish={handleFinish} />
        </div>
    );
}
