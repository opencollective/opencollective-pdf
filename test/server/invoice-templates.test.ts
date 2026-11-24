import { afterEach, beforeEach, describe, expect, test, vi, type MockInstance } from 'vitest';
import { getInvoiceTemplate, sanitizeInvoiceTemplate } from '../../server/lib/invoice-templates.js';

describe('invoice templates', () => {
  let warn: MockInstance<typeof console.warn>;

  beforeEach(() => {
    warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warn.mockRestore();
  });

  describe('sanitizeInvoiceTemplate', () => {
    test('keeps valid string fields', () => {
      expect(sanitizeInvoiceTemplate({ title: 'Receipt', info: 'Info', embeddedImage: 'img', notes: 'x' })).toEqual({
        title: 'Receipt',
        info: 'Info',
        embeddedImage: 'img',
      });
      expect(warn).not.toHaveBeenCalled();
    });

    test('returns undefined for missing templates', () => {
      expect(sanitizeInvoiceTemplate(undefined)).toBeUndefined();
      expect(sanitizeInvoiceTemplate(null)).toBeUndefined();
      expect(warn).not.toHaveBeenCalled();
    });

    test('returns undefined for templates without any usable field', () => {
      expect(sanitizeInvoiceTemplate({})).toBeUndefined();
      expect(sanitizeInvoiceTemplate({ title: '', info: null })).toBeUndefined();
    });

    test('converts finite numbers to strings for text fields', () => {
      expect(sanitizeInvoiceTemplate({ title: 2024, info: 0 })).toEqual({ title: '2024', info: '0' });
      expect(warn).not.toHaveBeenCalled();
    });

    test('drops non-string embedded images', () => {
      expect(sanitizeInvoiceTemplate({ title: 'Receipt', embeddedImage: 42 }, 'test-host')).toEqual({
        title: 'Receipt',
      });
      expect(warn).toHaveBeenCalledWith(
        'Invalid invoice template field "embeddedImage" for host "test-host": expected a string, got number',
      );
    });

    test('drops and reports non-string fields without logging their content', () => {
      const title = { 'secret\nkey': 'x', other: 'y' };
      expect(sanitizeInvoiceTemplate({ title, info: 'Info', embeddedImage: ['a'] }, 'test-host')).toEqual({
        info: 'Info',
      });
      expect(warn).toHaveBeenCalledTimes(2);
      expect(warn).toHaveBeenCalledWith(
        'Invalid invoice template field "title" for host "test-host": expected a string, got object(2 keys)',
      );
      expect(warn).toHaveBeenCalledWith(
        'Invalid invoice template field "embeddedImage" for host "test-host": expected a string, got array(1)',
      );
      expect(JSON.stringify(warn.mock.calls)).not.toContain('secret');
    });

    test('drops and reports non-object templates', () => {
      expect(sanitizeInvoiceTemplate('oops', 'test-host')).toBeUndefined();
      expect(sanitizeInvoiceTemplate(['oops'], 'test-host')).toBeUndefined();
      expect(warn).toHaveBeenCalledWith(
        'Invalid invoice template for host "test-host": expected an object, got string',
      );
      expect(warn).toHaveBeenCalledWith(
        'Invalid invoice template for host "test-host": expected an object, got array(1)',
      );
    });
  });

  describe('getInvoiceTemplate', () => {
    const settingsWithTemplates = (templates: unknown) => ({ invoice: { templates } });

    test('uses the named template when valid', () => {
      const settings = settingsWithTemplates({ default: { title: 'Default' }, alternative: { title: 'Alternative' } });
      expect(getInvoiceTemplate(settings, 'alternative')).toEqual({ title: 'Alternative' });
    });

    test('uses the default template when no name is given or the name does not exist', () => {
      const settings = settingsWithTemplates({ default: { title: 'Default' } });
      expect(getInvoiceTemplate(settings, '')).toEqual({ title: 'Default' });
      expect(getInvoiceTemplate(settings, undefined)).toEqual({ title: 'Default' });
      expect(getInvoiceTemplate(settings, 'missing')).toEqual({ title: 'Default' });
    });

    test('falls back to the default template when the named one is invalid or empty', () => {
      const defaultTemplate = { title: 'Default', info: 'Default info' };
      for (const alternative of [{ title: { a: 'x' } }, 'oops', {}, { title: '' }]) {
        const settings = settingsWithTemplates({ default: defaultTemplate, alternative });
        expect(getInvoiceTemplate(settings, 'alternative', 'test-host')).toEqual(defaultTemplate);
      }
    });

    test('does not merge the default template into a valid named one', () => {
      const settings = settingsWithTemplates({ default: { title: 'Default', info: 'Info' }, alt: { title: 'Alt' } });
      expect(getInvoiceTemplate(settings, 'alt')).toEqual({ title: 'Alt' });
    });

    test('ignores prototype properties used as template names', () => {
      const settings = settingsWithTemplates({ default: { title: 'Default' } });
      expect(getInvoiceTemplate(settings, 'constructor')).toEqual({ title: 'Default' });
      expect(getInvoiceTemplate(settings, '__proto__')).toEqual({ title: 'Default' });
      expect(warn).not.toHaveBeenCalled();
    });

    test('returns undefined when the settings have no valid templates', () => {
      expect(getInvoiceTemplate(undefined, 'default')).toBeUndefined();
      expect(getInvoiceTemplate({}, 'default')).toBeUndefined();
      expect(getInvoiceTemplate({ invoice: 'oops' }, 'default')).toBeUndefined();
      expect(getInvoiceTemplate(settingsWithTemplates('oops'), 'length')).toBeUndefined();
      expect(getInvoiceTemplate(settingsWithTemplates({ default: { title: { a: 1 } } }), 'default')).toBeUndefined();
    });
  });
});
