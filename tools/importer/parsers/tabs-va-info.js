/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs-va-info block
 *
 * Source: https://www.va.gov/health/
 * Base Block: tabs
 *
 * Block Structure:
 * - Each tab = 1 row with [Tab Name | Content]
 *
 * Source HTML Pattern (from VA.gov):
 * <div id="tabContent">
 *   <div class="tab-accord">
 *     <h3 class="tab">Tab Name</h3>
 *     <div class="tabPanel">...content...</div>
 *   </div>
 * </div>
 *
 * Generated: 2026-01-28
 */
export default function parse(element, { document }) {
  // Find tab headers and panels
  // VALIDATED: Source HTML uses h3.tab for tab names
  const tabHeaders = element.querySelectorAll('h3.tab');

  const cells = [];

  tabHeaders.forEach((tabHeader, index) => {
    // Extract tab name
    const tabName = tabHeader.textContent.trim();

    // Find associated content panel
    // VALIDATED: Content follows each h3.tab element
    let contentPanel = tabHeader.nextElementSibling;

    // If no direct sibling, look for .tabPanel or .healthTabContent
    if (!contentPanel || contentPanel.classList.contains('tab')) {
      // Try to find by ID pattern
      const panelId = tabHeader.id ? tabHeader.id.replace('tab', 'panel') : null;
      if (panelId) {
        contentPanel = element.querySelector(`#${panelId}`);
      }
    }

    // Clone content panel to preserve structure
    const contentCell = [];
    if (contentPanel) {
      // Get all content from the panel
      const panelContent = contentPanel.cloneNode(true);

      // Extract meaningful content (headings, paragraphs, images, links)
      const headings = panelContent.querySelectorAll('h2, h3, h4');
      const paragraphs = panelContent.querySelectorAll('p');
      const images = panelContent.querySelectorAll('img');
      const links = panelContent.querySelectorAll('a');

      headings.forEach(h => contentCell.push(h.cloneNode(true)));
      paragraphs.forEach(p => contentCell.push(p.cloneNode(true)));
      images.forEach(img => contentCell.push(img.cloneNode(true)));

      // Add links that aren't already in paragraphs
      links.forEach(link => {
        if (!link.closest('p')) {
          contentCell.push(link.cloneNode(true));
        }
      });
    }

    // Build row: [Tab Name | Content]
    if (tabName) {
      cells.push([[tabName], contentCell]);
    }
  });

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Tabs-Va-Info',
    cells
  });

  // Replace original element with structured block table
  element.replaceWith(block);
}
