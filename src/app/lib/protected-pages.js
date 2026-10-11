// Pages the AI/admin system must never modify, regenerate metadata for, or
// apply recommendations to — regardless of what any AI analysis suggests.
export const PROTECTED_PAGES = ["/web-development-ambikapur"];

export function isProtectedPage(pagePath) {
  if (!pagePath) return false;
  return PROTECTED_PAGES.some(
    (protectedPath) => pagePath === protectedPath || pagePath.startsWith(`${protectedPath}/`)
  );
}
