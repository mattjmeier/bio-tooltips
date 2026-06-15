# Markup Patterns

Bio Tooltips attaches behavior to ordinary HTML elements. Each tooltip module reads the matched element and any module-specific data attributes.

## Gene Entities

```html
<span class="gene-tooltip" data-species="human">TP53</span>
```

Use `data-species` for organism context. It accepts common aliases such as `human`, `mouse`, and `zebrafish`, or numeric NCBI taxonomy IDs.

## Chemical Entities

```html
<span class="chemical-tooltip" data-query="2244" data-scope="pubchem">aspirin</span>
```

Use `data-query` for stable lookup values and `data-scope` for the identifier type. The visible text remains the readable page label.

## Mixed Entities

```html
<p>
  <span class="gene-tooltip" data-species="human">TP53</span>
  responds to compounds such as
  <span class="chemical-tooltip" data-query="2244" data-scope="pubchem">aspirin</span>.
</p>
```
