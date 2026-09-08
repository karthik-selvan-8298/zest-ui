import type { TestRunnerConfig } from '@storybook/test-runner';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import { checkA11y, injectAxe } from 'axe-playwright';

/**
 * Per-story browser tests:
 *
 * 1. Visual regression — a Chromium screenshot is compared against the
 *    committed baseline in .storybook/__image_snapshots__. Runs first so a
 *    baseline is always captured even when the a11y step below reports.
 * 2. Accessibility — axe-core runs against the rendered story and reports
 *    `critical` / `serious` violations (moderate/minor show in the Storybook
 *    a11y addon panel instead, to keep the runner signal high).
 *
 *    Report-mode by default; set ZEST_A11Y_STRICT=1 to make violations fail the run (the goal
 *    state — flip the default once the remaining findings are cleared).
 *
 * Update baselines intentionally with: npm run test:visual:update
 */
const strictA11y = process.env.ZEST_A11Y_STRICT === '1';

const config: TestRunnerConfig = {
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },
  async preVisit(page) {
    await injectAxe(page);
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

    await checkA11y(
      page,
      '#storybook-root',
      {
        detailedReport: true,
        detailedReportOptions: { html: true },
        includedImpacts: ['critical', 'serious'],
      },
      /* skipFailures */ !strictA11y
    );
  },
};

export default config;
