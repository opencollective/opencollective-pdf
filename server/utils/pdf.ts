import { ReactElement } from "react";
import { renderToStream } from "@react-pdf/renderer";
import { Response } from "express";

export const sendPDFResponse = async (
  res: Response,
  element: ReactElement<any>
) => {
  try {
    const stream = await renderToStream(element);
    res.setHeader("Content-Type", "application/pdf");
    stream.pipe(res);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};
