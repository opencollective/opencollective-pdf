import { renderToStream } from "@react-pdf/renderer";
export const sendPDFResponse = async (res, element) => {
    try {
        const stream = await renderToStream(element);
        res.setHeader("Content-Type", "application/pdf");
        stream.pipe(res);
    }
    catch (error) {
        console.error("Error generating PDF:", error);
        throw error;
    }
};
