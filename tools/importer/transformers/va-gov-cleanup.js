/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for VA.gov website cleanup
 * Purpose: Remove navigation, sidebars, banners, and non-content elements
 * Applies to: www.va.gov (all templates)
 * Generated: 2026-01-28
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration workflow
 * - Page structure analysis from VA.gov health page
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform'
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove VA.gov navigation and header elements
    // EXTRACTED: Found in captured DOM - VA government banner and navigation
    WebImporter.DOMUtils.remove(element, [
      '#va-nav-combined-cta',
      '#va-nav-breadcrumbs-container',
      '.header',
      '#headerWrapper',
      '#header-newWrapper',
      '.announcement-banner',
      '#crisis-line-banner'
    ]);

    // Remove left sidebar navigation
    // EXTRACTED: Found in captured DOM - "I AM A..." menu and VHA left nav
    WebImporter.DOMUtils.remove(element, [
      '#leftcontent',
      '.left-rail',
      '.sidebar-left',
      '#vha-left-nav'
    ]);

    // Remove right sidebar content
    // EXTRACTED: Found in captured DOM - social media, resources, phone numbers
    WebImporter.DOMUtils.remove(element, [
      '#rightcontent',
      '.right-rail',
      '.sidebar-right',
      '#social-widget'
    ]);

    // Remove footer elements
    // EXTRACTED: Found in captured DOM - VA footer sections
    WebImporter.DOMUtils.remove(element, [
      '#footerWrapper',
      '.footer',
      '#va-footer',
      '.pact-act-banner'
    ]);

    // Remove skip navigation links
    // EXTRACTED: Found in captured DOM - accessibility skip links
    WebImporter.DOMUtils.remove(element, [
      '.skip-nav',
      '[href="#content"]'
    ]);

    // Re-enable scrolling if disabled
    if (element.style.overflow === 'hidden') {
      element.setAttribute('style', 'overflow: scroll;');
    }
  }

  if (hookName === TransformHook.afterTransform) {
    // Clean up tracking attributes
    // EXTRACTED: Captured DOM showed data-* and onclick on multiple elements
    const allElements = element.querySelectorAll('*');
    allElements.forEach(el => {
      el.removeAttribute('data-analytics');
      el.removeAttribute('onclick');
      el.removeAttribute('data-tracking');
    });

    // Remove remaining unwanted elements
    // Standard HTML elements - safe to use
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'link',
      'noscript',
      'script'
    ]);
  }
}
