import { comparePdfToSnapshot } from 'pdf-visual-diff';

export const snapshotPDF = async (pdfContent, snapshotName) => {
  if (
    !(await comparePdfToSnapshot(pdfContent, './test', snapshotName, {
      failOnMissingSnapshot: false,
    }))
  ) {
    throw new Error(`PDF snapshot ${snapshotName} does not match`);
  }
};
