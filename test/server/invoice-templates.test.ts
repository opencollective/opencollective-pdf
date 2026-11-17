import { describe, expect, test, vi } from 'vitest';
import { sanitizeInvoiceTemplate } from '../../server/lib/invoice-templates.js';

describe('sanitizeInvoiceTemplate', () => {
  test('keeps valid string fields', () => {
    expect(sanitizeInvoiceTemplate({ title: 'Receipt', info: 'Info', embeddedImage: 'img', notes: 'x' })).toEqual({
      title: 'Receipt',
      info: 'Info',
      embeddedImage: 'img',
    });
  });

  test('returns undefined for missing templates', () => {
    expect(sanitizeInvoiceTemplate(undefined)).toBeUndefined();
    expect(sanitizeInvoiceTemplate(null)).toBeUndefined();
  });

  test('drops and reports non-string fields', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(sanitizeInvoiceTemplate({ title: { a: 'x' }, info: 'Info' }, 'test-host')).toEqual({ info: 'Info' });
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('object with keys {a}'));
    warn.mockRestore();
  });

  test('drops and reports non-object templates', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(sanitizeInvoiceTemplate('oops', 'test-host')).toBeUndefined();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
