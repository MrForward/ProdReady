'use client';

export function TrustBar() {
    const technologies = [
        { name: 'React', icon: '⚛️' },
        { name: 'Next.js', icon: '▲' },
        { name: 'Vue', icon: '💚' },
        { name: 'Node.js', icon: '🟢' },
        { name: 'TypeScript', icon: '🔷' },
        { name: 'JavaScript', icon: '🟨' },
        { name: 'Python', icon: '🐍' },
    ];

    return (
        <section className="py-12 px-4 border-b border-zinc-800/50">
            <div className="max-w-6xl mx-auto">
                <p className="text-center text-sm text-zinc-500 uppercase tracking-widest mb-8">
                    Works with your favorite technologies
                </p>
                <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                    {technologies.map((tech) => (
                        <div
                            key={tech.name}
                            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                        >
                            <span className="text-2xl">{tech.icon}</span>
                            <span className="font-medium">{tech.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
