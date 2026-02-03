import type {Page} from '@playwright/test';
import {expect} from '@playwright/test';

export const metatag = (page: Page, name: string) =>
  page.locator(`head > meta[name="${name}"]`);

export const hydration = async (page: Page) =>
  expect(metatag(page, 'hydrated')).toHaveAttribute('content', 'true');
