import React from "react";
import express from "express";
import { StatusCodes } from "http-status-codes";
import EmptyPDF from "../components/EmptyPDF";
import { sendPDFResponse } from "../utils/pdf";
const router = express.Router();
router.get("/transactions/:fromSlug/:toSlug/:fromDate/:toDate", async (req, res) => {
    const { fromSlug, toSlug, fromDate, toDate } = req.params;
    if (!fromSlug || !toSlug || !fromDate || !toDate) {
        res.status(StatusCodes.BAD_REQUEST).json({
            message: "All parameters are required: fromSlug, toSlug, fromDate, toDate",
        });
        return;
    }
    // Validate dates
    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);
    if (isNaN(fromDateObj.getTime()) || isNaN(toDateObj.getTime())) {
        res.status(StatusCodes.BAD_REQUEST).json({
            message: "Invalid date format",
        });
        return;
    }
    await sendPDFResponse(res, React.createElement(EmptyPDF, null));
});
export default router;
