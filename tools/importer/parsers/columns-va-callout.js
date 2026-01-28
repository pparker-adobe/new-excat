/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-va-callout block
 *
 * Source: https://www.va.gov/health/
 * Base Block: columns
 *
 * Block Structure:
 * - 1 row with [image | heading + paragraph + link]
 *
 * Source HTML Pattern (from VA.gov):
 * <div class="basicContainer">
 *   <a href="..."><img src="..." alt="..."></a>
 *   <h3 class="subsection">Heading</h3>
 *   <p>Description text <a href="...">Link</a></p>
 * </div>
 *
 * Also used for Stories section:
 * <div id="vamcStories">
 *   <img src="...">
 *   <ul><li>Story links...</li></ul>
 * </div>
 *
 * Generated: 2026-01-28
 */
export default function parse(element, { document }) {
  // Extract image
  // VALIDATED: Source HTML has img inside anchor or directly
  const imageLink = element.querySelector('a:has(img)');
  const image = element.querySelector('img');

  // Extract heading
  // VALIDATED: h3.subsection or h3 for headings
  const heading = element.querySelector('h3.subsection, h3, h2');

  // Extract paragraph/description
  // VALIDATED: Paragraph content follows heading
  const paragraph = element.querySelector('p');

  // Extract list items (for stories section)
  // VALIDATED: Stories section uses ul > li structure
  const listItems = element.querySelectorAll('ul li');

  // Extract standalone links
  // VALIDATED: CTA links may be in paragraph or standalone
  const links = Array.from(element.querySelectorAll('a')).filter(
    a => !a.querySelector('img') && a.textContent.trim()
  );

  const cells = [];

  // Build image cell
  const imageCell = [];
  if (image) {
    imageCell.push(image.cloneNode(true));
  }

  // Build content cell
  const contentCell = [];
  if (heading) {
    contentCell.push(heading.cloneNode(true));
  }
  if (paragraph) {
    contentCell.push(paragraph.cloneNode(true));
  }

  // If we have list items (stories section), add them
  if (listItems.length > 0) {
    const ul = document.createElement('ul');
    listItems.forEach(li => {
      ul.appendChild(li.cloneNode(true));
    });
    contentCell.push(ul);
  }

  // Add any standalone links not already in paragraph
  links.forEach(link => {
    if (!paragraph || !paragraph.contains(link)) {
      contentCell.push(link.cloneNode(true));
    }
  });

  // Build row: [image | content]
  if (imageCell.length > 0 || contentCell.length > 0) {
    cells.push([imageCell, contentCell]);
  }

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Columns-Va-Callout',
    cells
  });

  // Replace original element with structured block table
  element.replaceWith(block);
}
