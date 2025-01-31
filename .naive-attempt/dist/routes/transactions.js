import React from "react";
import express from "express";
import { StatusCodes } from "http-status-codes";
import EmptyPDF from "../components/EmptyPDF";
import { sendPDFResponse } from "../utils/pdf";
const router = express.Router();
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: "Transaction ID is required" });
        return;
    }
    await sendPDFResponse(res, React.createElement(EmptyPDF, null));
});
export default router;
