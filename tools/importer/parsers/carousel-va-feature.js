/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-va-feature block
 *
 * Source: https://www.va.gov/health/
 * Base Block: carousel
 *
 * Block Structure:
 * - Each slide = 1 row with [image | heading, paragraph, link]
 *
 * Source HTML Pattern (from VA.gov):
 * <div id="healthslider" class="slider2 slider">
 *   <div class="slider-info">
 *     <a href="..."><img src="..." alt="..."></a>
 *     <h2>Title</h2>
 *     <p>Description</p>
 *     <a href="...">CTA Link</a>
 *   </div>
 *   ...
 * </div>
 *
 * Generated: 2026-01-28
 */
export default function parse(element, { document }) {
  // Find all slider slides
  // VALIDATED: Source HTML has .slider-info divs for each slide
  const slides = element.querySelectorAll('.slider-info');

  const cells = [];

  slides.forEach((slide) => {
    // Extract slide image
    // VALIDATED: Each .slider-info has an <a> with <img> inside
    const imageLink = slide.querySelector('a:has(img)');
    const image = slide.querySelector('img');

    // Extract heading
    // VALIDATED: Each slide has h2 or h3 heading
    const heading = slide.querySelector('h2, h3, .slider-title');

    // Extract description paragraph
    // VALIDATED: Description follows heading
    const description = slide.querySelector('p:not(:has(a))');

    // Extract CTA link (the text link, not the image link)
    // VALIDATED: CTA is typically the last <a> that's not wrapping the image
    const links = Array.from(slide.querySelectorAll('a'));
    const ctaLink = links.find(a => !a.querySelector('img') && a.textContent.trim());

    // Build row: [image | content]
    const imageCell = image ? [image] : [];
    const contentCell = [];

    if (heading) contentCell.push(heading.cloneNode(true));
    if (description) contentCell.push(description.cloneNode(true));
    if (ctaLink) contentCell.push(ctaLink.cloneNode(true));

    if (imageCell.length > 0 || contentCell.length > 0) {
      cells.push([imageCell, contentCell]);
    }
  });

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Carousel-Va-Feature',
    cells
  });

  // Replace original element with structured block table
  element.replaceWith(block);
}
