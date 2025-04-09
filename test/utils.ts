import { CompareOptions, comparePdfToSnapshot } from 'pdf-visual-diff';

export const snapshotPDF = async (
  pdfContent,
  snapshotName,
  options: Omit<CompareOptions, 'failOnMissingSnapshot'> = {},
) => {
  if (
    !(await comparePdfToSnapshot(pdfContent, './test', snapshotName, {
      failOnMissingSnapshot: process.env.OC_ENV === 'CI',
      ...options,
    }))
  ) {
    throw new Error(`PDF snapshot ${snapshotName} does not match`);
  }
};
