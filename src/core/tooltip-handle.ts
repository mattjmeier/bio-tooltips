/** Options for opening a tooltip attached to a single element. */
export interface TooltipOpenOptions {
  /** Move focus into the tooltip dialog after it opens. Defaults to `false`. */
  focus?: boolean;
}

/** Public controls for one tooltip attached to a DOM element. */
export interface TooltipHandle {
  /** Open immediately, using the anchor's current text and data attributes. */
  open(options?: TooltipOpenOptions): void;
  /** Close the tooltip, allowing its configured hide transition to finish. */
  close(): void;
  /** Close and remove the tooltip, restoring the anchor's original attributes. */
  destroy(): void;
}
