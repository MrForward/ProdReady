export function ScanSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Header skeleton */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-8 w-64 bg-zinc-800 rounded-lg" />
                    <div className="h-4 w-96 bg-zinc-800/50 rounded" />
                </div>
                <div className="flex gap-3">
                    <div className="h-10 w-24 bg-zinc-800 rounded-lg" />
                    <div className="h-10 w-28 bg-zinc-800 rounded-lg" />
                </div>
            </div>

            {/* Tech stack badges skeleton */}
            <div className="flex gap-2">
                <div className="h-6 w-20 bg-zinc-800 rounded-full" />
                <div className="h-6 w-24 bg-zinc-800 rounded-full" />
                <div className="h-6 w-16 bg-zinc-800 rounded-full" />
            </div>

            {/* Score card skeleton */}
            <div className="glass rounded-2xl p-8">
                <div className="flex items-center justify-between">
                    <div className="space-y-3">
                        <div className="h-6 w-32 bg-zinc-800 rounded" />
                        <div className="h-12 w-24 bg-zinc-800 rounded-lg" />
                    </div>
                    <div className="w-32 h-32 bg-zinc-800 rounded-full" />
                </div>
            </div>

            {/* Issues skeleton */}
            <div className="space-y-4">
                <div className="h-6 w-48 bg-zinc-800 rounded" />
                <div className="glass rounded-xl p-4 space-y-3">
                    <div className="flex justify-between">
                        <div className="h-5 w-64 bg-zinc-800 rounded" />
                        <div className="h-5 w-20 bg-zinc-800 rounded-full" />
                    </div>
                    <div className="h-4 w-full bg-zinc-800/50 rounded" />
                    <div className="h-4 w-3/4 bg-zinc-800/50 rounded" />
                </div>
                <div className="glass rounded-xl p-4 space-y-3">
                    <div className="flex justify-between">
                        <div className="h-5 w-56 bg-zinc-800 rounded" />
                        <div className="h-5 w-16 bg-zinc-800 rounded-full" />
                    </div>
                    <div className="h-4 w-full bg-zinc-800/50 rounded" />
                </div>
                <div className="glass rounded-xl p-4 space-y-3 opacity-60">
                    <div className="flex justify-between">
                        <div className="h-5 w-48 bg-zinc-800 rounded" />
                        <div className="h-5 w-24 bg-zinc-800 rounded-full" />
                    </div>
                    <div className="h-4 w-2/3 bg-zinc-800/50 rounded" />
                </div>
            </div>
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div className="glass rounded-xl p-4 animate-pulse">
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-zinc-800 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                    <div className="h-5 w-3/4 bg-zinc-800 rounded" />
                    <div className="h-4 w-full bg-zinc-800/50 rounded" />
                    <div className="h-4 w-1/2 bg-zinc-800/50 rounded" />
                </div>
            </div>
        </div>
    );
}

export function BlogCardSkeleton() {
    return (
        <div className="glass rounded-2xl p-6 animate-pulse">
            <div className="flex items-center gap-2 mb-4">
                <div className="h-5 w-16 bg-zinc-800 rounded" />
                <div className="h-4 w-12 bg-zinc-800/50 rounded" />
            </div>
            <div className="h-6 w-full bg-zinc-800 rounded mb-2" />
            <div className="h-4 w-full bg-zinc-800/50 rounded mb-1" />
            <div className="h-4 w-2/3 bg-zinc-800/50 rounded mb-4" />
            <div className="h-4 w-24 bg-zinc-800/50 rounded" />
        </div>
    );
}

export function VulnerabilityCardSkeleton() {
    return (
        <div className="glass rounded-xl p-5 animate-pulse">
            <div className="flex items-start justify-between gap-4 mb-3">
                <div className="h-5 w-48 bg-zinc-800 rounded" />
                <div className="h-5 w-16 bg-zinc-800 rounded-full" />
            </div>
            <div className="h-4 w-full bg-zinc-800/50 rounded mb-1" />
            <div className="h-4 w-3/4 bg-zinc-800/50 rounded" />
        </div>
    );
}
