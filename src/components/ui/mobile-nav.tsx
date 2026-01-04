'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Menu, X, Shield, Github, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface NavItem {
    label: string;
    href: string;
    external?: boolean;
}

const navItems: NavItem[] = [
    { label: 'Guides', href: '/vulnerabilities' },
    { label: 'Blog', href: '/blog' },
];

export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);

    // Close menu on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Prevent body scroll when menu is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Close menu on route change
    const handleLinkClick = useCallback(() => {
        setIsOpen(false);
    }, []);

    return (
        <>
            {/* Hamburger Button - visible on mobile only */}
            <Button
                variant="ghost"
                size="sm"
                className="md:hidden p-2"
                onClick={() => setIsOpen(true)}
                aria-label="Open menu"
                aria-expanded={isOpen}
            >
                <Menu className="w-5 h-5" />
            </Button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Slide-out Menu */}
            <div
                className={`
                    fixed top-0 right-0 h-full w-72 bg-zinc-950 border-l border-zinc-800 z-50
                    transform transition-transform duration-300 ease-in-out md:hidden
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                `}
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                    <Link href="/" className="flex items-center gap-2" onClick={handleLinkClick}>
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <Shield className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="font-bold text-lg text-white">ProdReady</span>
                    </Link>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-2"
                        onClick={() => setIsOpen(false)}
                        aria-label="Close menu"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Nav Links */}
                <nav className="p-4">
                    <ul className="space-y-2">
                        {navItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    onClick={handleLinkClick}
                                    className="block px-4 py-3 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* GitHub Star */}
                    <div className="mt-6 pt-6 border-t border-zinc-800">
                        <a
                            href="https://github.com/prodready/prodready"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
                            onClick={handleLinkClick}
                        >
                            <Github className="w-5 h-5" />
                            <span className="flex-1">Star on GitHub</span>
                            <Star className="w-4 h-4 text-amber-400" />
                        </a>
                    </div>

                    {/* CTA */}
                    <div className="mt-6">
                        <Link href="/#scan" onClick={handleLinkClick}>
                            <Button className="w-full bg-primary hover:bg-primary/90 py-6">
                                Scan Your Repo
                            </Button>
                        </Link>
                    </div>
                </nav>
            </div>
        </>
    );
}
