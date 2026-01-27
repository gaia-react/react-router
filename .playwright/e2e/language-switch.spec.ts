import {expect, test} from '@playwright/test';
import languages from '~/languages';
import {hydration} from '../utils';

test.describe('English to Japanese', () => {
  test.use({locale: 'en'});

  test('index page detect english, switch to japanese', async ({page}) => {
    await page.context().clearCookies();
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en',
    });

    await page.goto('/');
    await hydration(page);

    await expect(page).toHaveTitle(languages.en.pages.index.meta.title);

    const localeSelect = page.locator('select', {hasText: 'English'});
    await expect(localeSelect).toBeVisible();

    await localeSelect.selectOption('ja');
    await expect(page.locator('select', {hasText: '日本語'})).toBeVisible();
    await expect(page).toHaveTitle(languages.ja.pages.index.meta.title);
  });
});

test.describe('Japanese to English', () => {
  test.use({locale: 'ja'});

  test('index page detect japanese, switch to english', async ({page}) => {
    await page.context().clearCookies();
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'ja',
    });

    await page.goto('/');
    await hydration(page);

    await expect(page).toHaveTitle(languages.ja.pages.index.meta.title);

    const localeSelect = page.locator('select', {hasText: '日本語'});
    await expect(localeSelect).toBeVisible();

    await localeSelect.selectOption('en');
    await expect(page.locator('select', {hasText: 'English'})).toBeVisible();
    await expect(page).toHaveTitle(languages.en.pages.index.meta.title);
  });
});
