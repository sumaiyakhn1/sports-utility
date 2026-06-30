import XLSX from "xlsx";

import { findHeaderRow } from "../utils/excel/headerDetector";
import { COLUMN_MAPPING } from "../utils/excel/columnMapper";
import { validateRow } from "../utils/excel/validator";
import { StudentExcelRow } from "../utils/excel/excelTypes";
import { importRows } from "../utils/excel/importEngine";

import { extractImages } from "../utils/excel/imageExtractor";
import { saveImage } from "../utils/excel/imageSaver";

// ----------------------
// Get Value
// ----------------------
const getValue = (
    row: any,
    field: keyof typeof COLUMN_MAPPING
) => {

    const config = COLUMN_MAPPING[field];

    for (const key of Object.keys(row)) {

        const normalizedKey = key
            .replace(/\r/g, "")
            .replace(/\n/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .toLowerCase();

        for (const alias of config.aliases) {

            const normalizedAlias = alias
                .replace(/\r/g, "")
                .replace(/\n/g, " ")
                .replace(/\s+/g, " ")
                .trim()
                .toLowerCase();

            if (normalizedKey === normalizedAlias) {
                return row[key];
            }
        }
    }

    return "";
};

// ----------------------
// Phone Cleaner
// ----------------------
const cleanPhone = (value: any): string => {

    if (!value) return "";

    return String(value).replace(/\D/g, "");

};

// ----------------------
// Date Parser
// ----------------------
const parseExcelDate = (value: any): Date | undefined => {

    if (!value) return undefined;

    // Excel serial number
    if (typeof value === "number") {

        const parsed = XLSX.SSF.parse_date_code(value);

        if (!parsed) return undefined;

        return new Date(parsed.y, parsed.m - 1, parsed.d);
    }

    let str = String(value).trim();

    if (!str) return undefined;

    // Remove dots like 18-28/10/.2023
    str = str.replace(/\./g, "");

    // Handle date ranges
    // Example: 18-28/10/2023 -> 28/10/2023
    if (str.includes("-")) {

        const parts = str.split("-");

        if (parts.length > 1) {
            str = parts[parts.length - 1].trim();
        }
    }

    const dateParts = str.split("/");

    if (dateParts.length === 3) {

        const day = Number(dateParts[0]);
        const month = Number(dateParts[1]);
        const year = Number(dateParts[2]);

        const date = new Date(year, month - 1, day);

        if (!isNaN(date.getTime())) {
            return date;
        }
    }

    const fallback = new Date(str);

    if (!isNaN(fallback.getTime())) {
        return fallback;
    }

    return undefined;
};

// ----------------------
// Upload
// ----------------------
export const uploadExcel = async (fileBuffer: Buffer) => {

    const workbook = XLSX.read(fileBuffer, {
    type: "buffer",
});
    const imageMap =
    await extractImages(fileBuffer);

    const allRows: StudentExcelRow[] = [];
    const validationErrors: any[] = [];

    for (const sheetName of workbook.SheetNames) {

        const sheet = workbook.Sheets[sheetName];

        if (!sheet) continue;

        let headerRow: number;

        try {

            headerRow = findHeaderRow(sheet);

        } catch {

            continue;

        }

        const excelRows: any[] = XLSX.utils.sheet_to_json(sheet, {
            range: headerRow,
            defval: "",
        });

        for (let i = 0; i < excelRows.length; i++) {

            const excelRow = excelRows[i];

            const row: StudentExcelRow = {

                admissionNo: String(getValue(excelRow, "admissionNo")).trim(),

                name: String(getValue(excelRow, "name")).trim(),

                class: String(getValue(excelRow, "class")).trim(),

                dob: parseExcelDate(
                    getValue(excelRow, "dob")
                ),

                phone: cleanPhone(
                    getValue(excelRow, "phone")
                ),

                photo: String(
                    getValue(excelRow, "photo")
                ).trim(),

                game: String(
                    getValue(excelRow, "game")
                ).trim(),

                competition: String(
                    getValue(excelRow, "competition")
                ).trim(),

                venue: String(
                    getValue(excelRow, "venue")
                ).trim(),

                date: parseExcelDate(
                    getValue(excelRow, "date")
                ),

                results: String(
                    getValue(excelRow, "results")
                ).trim(),

                certificate: String(
                    getValue(excelRow, "certificate")
                ).trim()

            };

            const excelRowNumber = headerRow + i + 2;

const photoImage = imageMap.get(`${excelRowNumber}-2`);

if (photoImage && row.admissionNo) {

    row.photo = await saveImage({
    folder: "photos",
    fileName: row.admissionNo,
    extension: photoImage.extension,
    buffer: photoImage.buffer,
});

}

const certificateImage = imageMap.get(`${excelRowNumber}-13`);

if (certificateImage && row.admissionNo) {

    row.certificate = await saveImage({
    folder: "certificates",
    fileName: `${row.admissionNo}-${Date.now()}`,
    extension: certificateImage.extension,
    buffer: certificateImage.buffer,
});

}

            const validation = validateRow(row, i + 1);

            if (validation) {

                validationErrors.push({

                    sheet: sheetName,

                    ...validation,

                });

                continue;

            }

            allRows.push(row);

        }

    }

    const report = await importRows(allRows);

report.failedRows.push(...validationErrors);

report.totalRows =
    allRows.length + validationErrors.length;

// Delete uploaded Excel after processing

return {

    totalSheets: workbook.SheetNames.length,

    processedSheets: workbook.SheetNames.length,

    ...report,

};

};