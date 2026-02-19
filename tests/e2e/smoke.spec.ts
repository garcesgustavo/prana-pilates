import { test, expect } from '@playwright/test';

test.describe('Sentinel Smoke Test', () => {
    test('Zero-G should connect to Core', async ({ page }) => {
        // 1. Visit Frontend
        await page.goto('/');

        // 2. Check for Title
        await expect(page).toHaveTitle(/Antigravity/);

        // 3. Verify Health Check Component
        // The component displays "Core Online" or "Antigravity Core: Online"
        // Let's target the text specifically
        const successText = page.getByText('Antigravity Core: Online');
        await expect(successText).toBeVisible({ timeout: 10000 });
    });

    test('Security Headers should be present', async ({ request }) => {
        const response = await request.get('/');
        const headers = response.headers();

        // Check for CSP exists (content might vary slightly)
        expect(headers['content-security-policy']).toBeDefined();

        // Check specific security headers
        expect(headers['x-frame-options']).toBe('SAMEORIGIN');
        expect(headers['strict-transport-security']).toContain('max-age=63072000');
    });
});
