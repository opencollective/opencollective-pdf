import React from "react";
import { Page, Document, StyleSheet } from "@react-pdf/renderer";
const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        backgroundColor: "#ffffff",
        padding: 30,
    },
});
const EmptyPDF = () => (React.createElement(Document, null,
    React.createElement(Page, { size: "A4", style: styles.page })));
export default EmptyPDF;
