import React from 'react';

export const BusinessCardSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-[2.5rem] p-3 sm:p-6 border border-gray-200 dark:border-gray-700 animate-pulse shadow-sm">
        <div className="flex flex-row items-start gap-2.5 sm:gap-8">
            {/* Photo */}
            <div className="w-12 h-12 sm:w-24 sm:h-28 rounded-lg sm:rounded-[1.75rem] bg-gray-200 dark:bg-gray-700 shrink-0" />

            {/* Content */}
            <div className="flex-1 space-y-3 py-1">
                <div className="h-4 sm:h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                <div className="flex gap-2 pt-2">
                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full hidden sm:block" />
                </div>
            </div>
        </div>
    </div>
);

export const JobFinderSkeleton = () => (
    <div className="flex items-center gap-3 animate-pulse p-2">
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
        <div className="flex-1 space-y-1.5">
            <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </div>
    </div>
);

export const StatsSkeleton = () => (
    <div className="space-y-3 animate-pulse">
        {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-10 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
        ))}
    </div>
);

export const FilterSkeleton = () => (
    <div className="animate-pulse space-y-4">
        <div className="h-10 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700" />
        <div className="flex gap-2 overflow-hidden">
            <div className="h-8 w-24 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 shrink-0" />
            <div className="h-8 w-24 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 shrink-0" />
            <div className="h-8 w-24 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 shrink-0" />
        </div>
    </div>
);
