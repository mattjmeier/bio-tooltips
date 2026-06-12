import { describe, it, expect, beforeEach } from 'vitest';
import { findGeneElements, getGeneInfoFromElement } from '../src/providers/mygene/parser';

describe('parser', () => {
  
  beforeEach(() => {
    // Reset the document body before each test
    document.body.innerHTML = '';
  });

  describe('findGeneElements', () => {
    it('should find a single gene element', () => {
      document.body.innerHTML = '<span class="gene-tooltip" data-species="human">TP53</span>';
      const elements = findGeneElements('.gene-tooltip');
      expect(elements.length).toBe(1);
      expect(elements[0].textContent).toBe('TP53');
    });

    it('should split a comma-separated list into individual span elements', () => {
      document.body.innerHTML = '<div class="gene-tooltip" data-species="human">TP53, BRCA1, RAD51</div>';
      const elements = findGeneElements('.gene-tooltip');
      
      expect(elements.length).toBe(3);
      expect(elements[0].tagName).toBe('SPAN');
      expect(elements[0].textContent).toBe('TP53');
      expect(elements[0].dataset.species).toBe('human');

      expect(elements[1].textContent).toBe('BRCA1');
      expect(elements[2].textContent).toBe('RAD51');

      // Check that the original div now contains the new spans
      const container = document.querySelector('div');
      expect(container?.textContent).toBe('TP53, BRCA1, RAD51');
    });

    it('should handle various delimiters and extra whitespace', () => {
      document.body.innerHTML = '<div class="gene-tooltip" data-species="mouse">Trp53;Gadd45a, Brca2 </div>';
      const elements = findGeneElements('.gene-tooltip');
      
      expect(elements.length).toBe(3);
      expect(elements[0].textContent).toBe('Trp53');
      expect(elements[1].textContent).toBe('Gadd45a');
      expect(elements[2].textContent).toBe('Brca2');
    });

    it('should not process a list container without a data-species attribute', () => {
      document.body.innerHTML = '<div class="gene-tooltip">TP53, BRCA1</div>';
      const elements = findGeneElements('.gene-tooltip');
      // It returns the original element, which has a length of 1, but doesn't split it.
      // The logic in findGeneElements could be adjusted, but based on the current code:
      expect(elements.length).toBe(0); // Because it skips containers without species
    });
  });

  describe('getGeneInfoFromElement', () => {
    it('should extract symbol and species from an element', () => {
      const el = document.createElement('span');
      el.textContent = ' TP53 ';
      el.dataset.species = 'human';
      
      const info = getGeneInfoFromElement(el);
      expect(info).not.toBeNull();
      expect(info?.symbol).toBe('TP53');
      expect(info?.taxid).toBe(9606);
    });


    it('should return null if symbol is missing', () => {
      const el = document.createElement('span');
      el.dataset.species = 'human';
      const info = getGeneInfoFromElement(el);
      expect(info).toBeNull();
    });

    it('should return null if species is missing', () => {
      const el = document.createElement('span');
      el.textContent = 'TP53';
      const info = getGeneInfoFromElement(el);
      expect(info).toBeNull();
    });
  });
});
