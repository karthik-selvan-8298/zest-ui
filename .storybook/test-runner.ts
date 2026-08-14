import type { TestRunnerConfig } from '@storybook/test-runner';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

/**
 * Visual regression: every story gets a Chromium screenshot compared against
 * the committed baseline in .storybook/__image_snapshots__.
 *
 * Update baselines intentionally with: npm run test:visual:update
 */
const config: TestRunnerConfig = {
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },
  async postVisit(page, context) {
    // Let fonts/transitions settle before capturing.
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(250);
    const image = await page.screenshot({ animations: 'disabled', fullPage: true });
    expect(image).toMatchImageSnapshot({
      customSnapshotsDir: `${process.cwd()}/.storybook/__image_snapshots__`,
      customSnapshotIdentifier: context.id,
      // Small tolerance for font antialiasing differences across machines.
      failureThreshold: 0.02,
      failureThresholdType: 'percent',
    });
  },
};

export default config;
