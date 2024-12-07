// reportGenerator.js
import xl from "excel4node";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
async function generateReport(data) {
  try {
    const plainData = data.map((row) => ({
      record_date: row.record_date,
      min_temperature: Number(row.min_temperature),
      max_temperature: Number(row.max_temperature),
    }));

    const wb = new xl.Workbook();
    const ws = wb.addWorksheet("Temperature Report");

    const headerStyle = wb.createStyle({
      font: { bold: true, size: 12 },
      alignment: { horizontal: "center" },
    });

    const headers = ["Date", "Minimum Temperature", "Maximum Temperature"];
    headers.forEach((header, index) => {
      ws.cell(1, index + 1)
        .string(header)
        .style(headerStyle);
    });

    plainData.forEach((record, rowIndex) => {
      const formattedDate = new Date(record.record_date)
        .toISOString()
        .split("T")[0];
      ws.cell(rowIndex + 2, 1).string(formattedDate);
      ws.cell(rowIndex + 2, 2).number(record.min_temperature);
      ws.cell(rowIndex + 2, 3).number(record.max_temperature);
    });

    ws.column(1).setWidth(15);
    ws.column(2).setWidth(20);
    ws.column(3).setWidth(20);

    const downloadsDir = path.join(__dirname, "downloads");
    if (!fs.existsSync(downloadsDir)) fs.mkdirSync(downloadsDir);

    const fileName = `temperature_report_${Date.now()}.xlsx`;
    const filePath = path.join(downloadsDir, fileName);

    // Wrap write operation in a Promise
    await new Promise((resolve, reject) => {
      wb.write(filePath, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    return filePath;
  } catch (error) {
    console.error("Error generating report:", error);
    throw error;
  }
}

export default generateReport;
