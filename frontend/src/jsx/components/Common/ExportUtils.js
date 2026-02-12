import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ================= CSV ================= */
export const exportCSV = (data, fileName) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, `${fileName}.csv`);
};

/* ================= EXCEL ================= */
export const exportExcel = (data, fileName) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

/* ================= PDF ================= */
export const exportPDF = (data, columns, fileName) => {
  const doc = new jsPDF("landscape");

  doc.setFontSize(14);
  doc.text(fileName, 14, 15);

  const tableColumn = columns.map(col => col.label);
  const tableRows = data.map(row =>
    columns.map(col => row[col.key] ?? "")
  );

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 25,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [40, 167, 69] }
  });

  doc.save(`${fileName}.pdf`);
};

/* ================= PRINT ================= */
export const printTable = () => {
  window.print();
};
