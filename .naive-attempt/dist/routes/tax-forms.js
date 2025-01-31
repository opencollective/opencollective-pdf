import React from "react";
import express from "express";
import { StatusCodes } from "http-status-codes";
import EmptyPDF from "../components/EmptyPDF";
import { sendPDFResponse } from "../utils/pdf";
const router = express.Router();
router.get("/:filename.pdf", async (req, res) => {
    const { filename } = req.params;
    if (!filename) {
        res.status(StatusCodes.BAD_REQUEST).json({
            message: "Filename is required",
        });
        return;
    }
    await sendPDFResponse(res, React.createElement(EmptyPDF, null));
});
export default router;
