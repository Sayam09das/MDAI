import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateReceiptPdf = async (enrollment) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    const fileName = `receipt-${enrollment.receipt.receiptNumber}.pdf`;
    const filePath = path.join("uploads", fileName);

    doc.pipe(fs.createWriteStream(filePath));

    /* ================= HEADER ================= */
    doc
        .fontSize(20)
        .text("PAYMENT RECEIPT", { align: "center" })
        .moveDown(1);

    doc
        .fontSize(10)
        .text("Symphorien Institute of Technology", { align: "center" })
        .text("Email: Symphorienpyana065@gmail.com", { align: "center" })
        .text("UPI: +243 812 336 721", { align: "center" })
        .moveDown(2);

    /* ================= RECEIPT INFO ================= */
    doc.fontSize(12);
    doc.text(`Receipt No: ${enrollment.receipt.receiptNumber}`);
    doc.text(`Date: ${new Date(enrollment.verifiedAt).toDateString()}`);
    doc.moveDown();

    /* ================= STUDENT INFO ================= */
    doc.font("Helvetica-Bold").text("Student Details");
    doc.font("Helvetica");
    doc.text(`Name: ${enrollment.student.fullName}`);
    doc.moveDown();

    /* ================= COURSE INFO ================= */
    doc.font("Helvetica-Bold").text("Course Details");
    doc.font("Helvetica");
    doc.text(`Course Name: ${enrollment.course?.title || "N/A"}`);
    doc.moveDown();

    /* ================= PAYMENT INFO ================= */
    doc.font("Helvetica-Bold").text("Payment Details");
    doc.font("Helvetica");
    doc.text(`Amount Paid: ₹${enrollment.amount || "0"}`);
    doc.text("Payment Status: PAID");
    doc.moveDown(2);

    /* ================= FOOTER ================= */
    doc
        .fontSize(10)
        .text(
            "This is a system-generated receipt. No signature required.",
            { align: "center" }
        );

    doc.end();

    return filePath;
};
