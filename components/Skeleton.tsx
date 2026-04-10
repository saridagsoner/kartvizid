import React from 'react';

export const BusinessCardSkeleton = () => (
    <div className="bg-transparent pl-4 pr-4 py-5 sm:py-4 relative animate-pulse">
        {/* Divider Line */}
        <div className="absolute bottom-0 right-4 sm:right-10 left-[66px] sm:left-[70px] border-b border-gray-100 dark:border-white/5" />

        <div className="flex items-start gap-4 sm:gap-5.5">
            {/* Photo Section */}
            <div className="w-[46px] h-[55px] sm:w-[54px] sm:h-[65px] rounded-lg sm:rounded-xl bg-gray-100 dark:bg-gray-800 shrink-0" />

            {/* Main Content Layout */}
            <div className="flex-1 min-w-0 flex flex-col justify-between py-0 min-h-[55px] sm:min-h-[65px]">
                <div className="flex flex-col gap-2 sm:gap-3">
                    {/* Name */}
                    <div className="h-4 sm:h-5 bg-gray-100 dark:bg-gray-800 rounded w-1/3" />
                    
                    {/* Profession */}
                    <div className="h-3 sm:h-3.5 bg-gray-100 dark:bg-gray-800/60 rounded w-1/2" />

                    {/* Details Row */}
                    <div className="flex gap-4 mt-1">
                        <div className="h-2.5 w-16 bg-gray-100 dark:bg-gray-800/40 rounded" />
                        <div className="h-2.5 w-24 bg-gray-100 dark:bg-gray-800/40 rounded" />
                    </div>
                </div>
            </div>

            {/* Arrow Placeholder */}
            <div className="shrink-0 self-center w-5 h-5 bg-gray-100 dark:bg-gray-800/30 rounded-full" />
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
