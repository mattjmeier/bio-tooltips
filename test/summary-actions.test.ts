import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { copyTextToClipboard, enableSummaryExpand } from '../src/ui/summaryExpand';

const releases: Array<() => void> = [];
function enable() {
  const release = enableSummaryExpand();
  releases.push(release);
  return release;
}
function markup() {
  document.body.innerHTML = `
    <div class="gene-tooltip-section-container"><div class="gt-summary-section">
      <p class="gene-tooltip-summary"> Full summary text </p>
      <button id="summary-copy-test"><svg><path d="original" fill-rule="evenodd"/></svg></button>
      <span id="summary-more-test" role="button" tabindex="0">Show more</span>
      <span id="summary-less-test" role="button" tabindex="0">Show less</span>
      <span class="gt-copy-status" role="status"></span>
    </div></div>`;
  return {
    copy: document.querySelector<HTMLButtonElement>('#summary-copy-test')!,
    summary: document.querySelector<HTMLElement>('.gene-tooltip-summary')!,
    status: document.querySelector<HTMLElement>('.gt-copy-status')!,
  };
}

beforeEach(() => {
  vi.useFakeTimers();
  document.body.replaceChildren();
});
afterEach(() => {
  releases.splice(0).forEach(release => release());
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.body.replaceChildren();
});

describe('clipboard fallback and status', () => {
  it('uses a temporary readonly textarea and restores keyboard focus when the Clipboard API is absent', async () => {
    vi.stubGlobal('navigator', { clipboard: undefined });
    document.body.innerHTML = '<button>Copy</button><span role="status"></span>';
    const button = document.querySelector('button')!;
    const status = document.querySelector<HTMLElement>('[role="status"]')!;
    button.focus();
    let temporaryTextarea: HTMLTextAreaElement | null = null;
    const execCommand = vi.fn(() => {
      temporaryTextarea = document.querySelector('textarea');
      return true;
    });
    Object.defineProperty(document, 'execCommand', { configurable: true, value: execCommand });
    try {
      expect(await copyTextToClipboard('Full text', status)).toBe(true);
      expect(execCommand).toHaveBeenCalledWith('copy');
      expect(temporaryTextarea).toMatchObject({ value: 'Full text', readOnly: true, selectionStart: 0, selectionEnd: 9 });
      expect(document.querySelector('textarea')).toBeNull();
      expect(document.activeElement).toBe(button);
      expect(status.textContent).toBe('Copied');
    } finally {
      delete (document as unknown as Record<string, unknown>).execCommand;
    }
  });

  it.each(['false', 'throw'])('cleans up failed legacy copies when execCommand returns %s', async mode => {
    vi.stubGlobal('navigator', { clipboard: undefined });
    const status = document.createElement('span');
    const execCommand = vi.fn(() => { if (mode === 'throw') throw new Error('Denied'); return false; });
    Object.defineProperty(document, 'execCommand', { configurable: true, value: execCommand });
    try {
      expect(await copyTextToClipboard('text', status)).toBe(false);
      expect(status.textContent).toBe('Unable to copy');
      expect(document.querySelector('textarea')).toBeNull();
    } finally {
      delete (document as unknown as Record<string, unknown>).execCommand;
    }
  });

  it('announces rejected Clipboard API writes without showing a success icon', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('Permission denied'));
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    const { copy, status } = markup();
    enable();
    copy.click();
    await vi.advanceTimersByTimeAsync(0);
    expect(writeText).toHaveBeenCalledWith('Full summary text');
    expect(status.textContent).toBe('Unable to copy summary');
    expect(copy.querySelector('path')?.getAttribute('d')).toBe('original');
    expect(copy.classList.contains('gt-summary-copy-btn--success')).toBe(false);
  });

  it('copies chemical identifiers from nested controls and updates only their row status', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    document.body.innerHTML = `
      <div class="gt-chem-id-row"><button data-copy="CHEBI:15365"><span>Copy</span></button><span class="gt-copy-status"></span></div>
      <div class="gt-chem-id-row"><span class="gt-copy-status">Unchanged</span></div>`;
    enable();
    document.querySelector<HTMLElement>('button span')!.click();
    await vi.advanceTimersByTimeAsync(0);
    expect(writeText).toHaveBeenCalledExactlyOnceWith('CHEBI:15365');
    expect([...document.querySelectorAll('.gt-copy-status')].map(el => el.textContent)).toEqual(['Copied', 'Unchanged']);
  });
});

describe('summary action state and listener lifetime', () => {
  it('extends success feedback on rapid copies and restores the original SVG attributes exactly', async () => {
    vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
    const { copy, status } = markup();
    const path = copy.querySelector('path')!;
    enable();
    copy.click();
    await vi.advanceTimersByTimeAsync(1500);
    expect(status.textContent).toBe('Summary copied');
    expect(path.hasAttribute('fill-rule')).toBe(false);
    const checkmark = path.getAttribute('d');
    expect(checkmark).not.toBe('original');
    copy.click();
    await vi.advanceTimersByTimeAsync(500);
    expect(path.getAttribute('d')).toBe(checkmark);
    await vi.advanceTimersByTimeAsync(1500);
    expect(path.getAttribute('d')).toBe('original');
    expect(path.getAttribute('fill-rule')).toBe('evenodd');
    expect(copy.classList.contains('gt-summary-copy-btn--success')).toBe(false);
  });

  it('keeps shared listeners until the final user releases them, with idempotent cleanup', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    const { copy } = markup();
    const releaseFirst = enable();
    const releaseSecond = enable();
    releaseFirst();
    releaseFirst();
    copy.click();
    await vi.advanceTimersByTimeAsync(0);
    expect(writeText).toHaveBeenCalledTimes(1);
    releaseSecond();
    copy.click();
    expect(writeText).toHaveBeenCalledTimes(1);
    enable();
    copy.click();
    await vi.advanceTimersByTimeAsync(0);
    expect(writeText).toHaveBeenCalledTimes(2);
  });

  it('supports legacy keyboard controls without double-activating native buttons', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    const { summary, copy } = markup();
    const resize = vi.fn();
    summary.addEventListener('gt:content-resize', resize);
    enable();
    const more = document.querySelector<HTMLElement>('#summary-more-test')!;
    const less = document.querySelector<HTMLElement>('#summary-less-test')!;
    const enter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    more.dispatchEvent(enter);
    expect(enter.defaultPrevented).toBe(true);
    expect(summary.classList.contains('expanded')).toBe(true);
    less.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }));
    expect(summary.classList.contains('expanded')).toBe(false);
    expect(resize).toHaveBeenCalledTimes(2);
    copy.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(writeText).not.toHaveBeenCalled();

    const legacyCopy = document.createElement('span');
    legacyCopy.id = 'summary-copy-legacy';
    copy.replaceWith(legacyCopy);
    legacyCopy.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }));
    await vi.advanceTimersByTimeAsync(0);
    expect(writeText).toHaveBeenCalledExactlyOnceWith('Full summary text');
  });

  it('ignores empty or removed summaries instead of copying unrelated content', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    const { copy, summary } = markup();
    enable();
    summary.textContent = '  ';
    copy.click();
    summary.remove();
    copy.click();
    await vi.advanceTimersByTimeAsync(0);
    expect(writeText).not.toHaveBeenCalled();
  });
});
