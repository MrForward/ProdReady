// Input sanitization utilities for security

/**
 * Sanitize and validate a GitHub repository URL
 */
export function sanitizeRepoUrl(input: string): { isValid: boolean; url: string; error?: string } {
    // Trim whitespace
    const trimmed = input.trim();

    if (!trimmed) {
        return { isValid: false, url: '', error: 'Please enter a GitHub repository URL' };
    }

    // Check for potentially malicious input
    const dangerousPatterns = [
        /<script/i,
        /javascript:/i,
        /data:/i,
        /vbscript:/i,
        /on\w+=/i,
        /%3Cscript/i,
        /&#/,
    ];

    for (const pattern of dangerousPatterns) {
        if (pattern.test(trimmed)) {
            return { isValid: false, url: '', error: 'Invalid characters in URL' };
        }
    }

    // Validate URL format
    let url: URL;
    try {
        // Add https:// if missing
        const urlString = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
        url = new URL(urlString);
    } catch {
        return { isValid: false, url: '', error: 'Please enter a valid URL' };
    }

    // Must be a GitHub URL
    if (!['github.com', 'www.github.com'].includes(url.hostname.toLowerCase())) {
        return { isValid: false, url: '', error: 'Only GitHub repositories are supported' };
    }

    // Validate path structure (owner/repo)
    const pathParts = url.pathname.split('/').filter(Boolean);
    if (pathParts.length < 2) {
        return { isValid: false, url: '', error: 'Please enter a valid repository URL (e.g., github.com/owner/repo)' };
    }

    // Validate owner and repo names
    const validNamePattern = /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?$/;
    const [owner, repo] = pathParts;

    if (!validNamePattern.test(owner)) {
        return { isValid: false, url: '', error: 'Invalid repository owner name' };
    }

    // Remove .git suffix if present
    const cleanRepo = repo.replace(/\.git$/, '');
    if (!validNamePattern.test(cleanRepo)) {
        return { isValid: false, url: '', error: 'Invalid repository name' };
    }

    // Construct clean URL
    const cleanUrl = `https://github.com/${owner}/${cleanRepo}`;

    return { isValid: true, url: cleanUrl };
}

/**
 * Sanitize email input
 */
export function sanitizeEmail(input: string): { isValid: boolean; email: string; error?: string } {
    const trimmed = input.trim().toLowerCase();

    if (!trimmed) {
        return { isValid: false, email: '', error: 'Please enter your email address' };
    }

    // Basic email pattern
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(trimmed)) {
        return { isValid: false, email: '', error: 'Please enter a valid email address' };
    }

    // Check for common disposable email domains (basic list)
    const disposableDomains = [
        'mailinator.com',
        'guerrillamail.com',
        'tempmail.com',
        '10minutemail.com',
        'throwaway.email',
    ];

    const domain = trimmed.split('@')[1];
    if (disposableDomains.includes(domain)) {
        return { isValid: false, email: '', error: 'Please use a non-disposable email address' };
    }

    // Max length check
    if (trimmed.length > 254) {
        return { isValid: false, email: '', error: 'Email address is too long' };
    }

    return { isValid: true, email: trimmed };
}

/**
 * Escape HTML to prevent XSS when displaying user input
 */
export function escapeHtml(input: string): string {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return input.replace(/[&<>"']/g, (char) => map[char] || char);
}
