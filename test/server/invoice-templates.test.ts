import { afterEach, describe, expect, test, vi } from 'vitest';
import { getInvoiceTemplate, sanitizeInvoiceTemplate } from '../../server/lib/invoice-templates.js';
import { reportMessageToSentry } from '../../server/lib/sentry.js';

vi.mock('../../server/lib/sentry.js', () => ({ reportMessageToSentry: vi.fn() }));

const fieldReport = (hostSlug: string, field: string, received: string) => [
  'Invalid invoice template field',
  {
    severity: 'warning',
    tags: { feature: 'invoice-templates', field },
    extra: { hostSlug, expected: 'string', received },
  },
];

const templateReport = (hostSlug: string, received: string) => [
  'Invalid invoice template',
  {
    severity: 'warning',
    tags: { feature: 'invoice-templates' },
    extra: { hostSlug, expected: 'object', received },
  },
];

describe('invoice templates', () => {
  const report = vi.mocked(reportMessageToSentry);

  afterEach(() => {
    report.mockReset();
  });

  describe('sanitizeInvoiceTemplate', () => {
    test('keeps valid string fields', () => {
      expect(sanitizeInvoiceTemplate({ title: 'Receipt', info: 'Info', embeddedImage: 'img', notes: 'x' })).toEqual({
        title: 'Receipt',
        info: 'Info',
        embeddedImage: 'img',
      });
      expect(report).not.toHaveBeenCalled();
    });

    test('returns undefined for missing templates', () => {
      expect(sanitizeInvoiceTemplate(undefined)).toBeUndefined();
      expect(sanitizeInvoiceTemplate(null)).toBeUndefined();
      expect(report).not.toHaveBeenCalled();
    });

    test('returns undefined for templates without any usable field', () => {
      expect(sanitizeInvoiceTemplate({})).toBeUndefined();
      expect(sanitizeInvoiceTemplate({ title: '', info: null })).toBeUndefined();
    });

    test('converts finite numbers to strings for text fields', () => {
      expect(sanitizeInvoiceTemplate({ title: 2024, info: 0 })).toEqual({ title: '2024', info: '0' });
      expect(report).not.toHaveBeenCalled();
    });

    test('drops non-string embedded images', () => {
      expect(sanitizeInvoiceTemplate({ title: 'Receipt', embeddedImage: 42 }, 'test-host')).toEqual({
        title: 'Receipt',
      });
      expect(report).toHaveBeenCalledWith(...fieldReport('test-host', 'embeddedImage', 'number'));
    });

    test('drops and reports non-string fields without reporting their content', () => {
      const title = { 'secret\nkey': 'x', other: 'y' };
      expect(sanitizeInvoiceTemplate({ title, info: 'Info', embeddedImage: ['a'] }, 'test-host')).toEqual({
        info: 'Info',
      });
      expect(report).toHaveBeenCalledTimes(2);
      expect(report).toHaveBeenCalledWith(...fieldReport('test-host', 'title', 'object(2 keys)'));
      expect(report).toHaveBeenCalledWith(...fieldReport('test-host', 'embeddedImage', 'array(1)'));
      expect(JSON.stringify(report.mock.calls)).not.toContain('secret');
    });

    test('drops and reports non-object templates', () => {
      expect(sanitizeInvoiceTemplate('oops', 'test-host')).toBeUndefined();
      expect(sanitizeInvoiceTemplate(['oops'], 'test-host')).toBeUndefined();
      expect(report).toHaveBeenCalledWith(...templateReport('test-host', 'string'));
      expect(report).toHaveBeenCalledWith(...templateReport('test-host', 'array(1)'));
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
      expect(report).not.toHaveBeenCalled();
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
