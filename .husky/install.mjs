/**
 * Installs git hooks for local development only.
 *
 * Runs from the `prepare` script, which npm also executes when this package is
 * installed as a git dependency (inside a consumer's node_modules, where there
 * is no .git) and on CI — both cases must be silent no-ops.
 */
if (process.env.CI === 'true' || process.env.NODE_ENV === 'production') {
  process.exit(0);
}

try {
  const { default: husky } = await import('husky');
  const message = husky();
  if (message) console.log(message);
} catch {
  // husky is a devDependency; when it isn't installed there is nothing to do.
}
