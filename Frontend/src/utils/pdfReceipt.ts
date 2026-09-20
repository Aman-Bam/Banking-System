import jsPDF from 'jspdf';

export interface ReceiptData {
    transactionId: string;
    fromAccountName: string;
    fromAccountId: string;
    toAccountName: string;
    toAccountId: string;
    amount: number;
    status: string;
    date: string;
    idempotencyKey?: string;
}

export const generateTransactionPDFReceipt = (data: ReceiptData) => {
    const doc = new jsPDF();

    // Brand Header Background
    doc.setFillColor(15, 23, 42); // Slate-900
    doc.rect(0, 0, 210, 40, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Backend-Ledger', 14, 22);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Official Transaction Receipt', 14, 30);

    // Status Badge
    doc.setFillColor(22, 163, 74); // Green-600
    doc.roundedRect(150, 14, 46, 12, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(data.status || 'COMPLETED', 158, 22);

    // Section 1: Transaction Summary
    let y = 55;
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Transaction Details', 14, y);

    doc.setDrawColor(226, 232, 240);
    doc.line(14, y + 4, 196, y + 4);

    y += 16;

    const addRow = (label: string, value: string) => {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 116, 139);
        doc.text(label, 14, y);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        doc.text(value.length > 45 ? value.substring(0, 45) + '...' : value, 65, y);

        y += 10;
    };

    addRow('Transaction ID:', data.transactionId || 'N/A');
    addRow('Date & Time:', new Date(data.date || Date.now()).toLocaleString());
    addRow('Amount Transferred:', `$${Number(data.amount || 0).toFixed(2)} USD`);
    addRow('Sender:', `${data.fromAccountName || 'Sender'} (${data.fromAccountId || 'Account'})`);
    addRow('Recipient:', `${data.toAccountName || 'Recipient'} (${data.toAccountId || 'Account'})`);
    if (data.idempotencyKey) {
        addRow('Idempotency Ref:', data.idempotencyKey);
    }

    // Security Notice Box
    y += 10;
    doc.setFillColor(248, 250, 252);
    doc.rect(14, y, 182, 35, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.rect(14, y, 182, 35, 'S');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('Security Notice & System Invariants:', 20, y + 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text('• Double-entry debit/credit ledger records verified atomically.', 20, y + 18);
    doc.text('• Guaranteed idempotency protection prevents duplicate payment processing.', 20, y + 25);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('© 2026 Backend-Ledger Banking System. All rights reserved.', 14, 280);

    // Download PDF file
    doc.save(`receipt_${data.transactionId || Date.now()}.pdf`);
};
