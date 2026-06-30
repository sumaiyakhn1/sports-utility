import Student from "../../models/Student";
import Achievement from "../../models/Achievement";
import { StudentExcelRow } from "./excelTypes";

export interface ImportReport {
    totalRows: number;
    studentsCreated: number;
    studentsUpdated: number;
    achievementsCreated: number;
    duplicateAchievements: number;
    failedRows: {
        row: number;
        reason: string;
    }[];
}

// -------------------------
// Helpers
// -------------------------

const clean = (value: any): string => {
    if (value === undefined || value === null) return "";
    return String(value).trim();
};

const cleanPhone = (value: any): string => {
    if (!value) return "";
    return String(value).replace(/\D/g, "");
};

// -------------------------
// Main Import
// -------------------------

export const importRows = async (
    rows: StudentExcelRow[]
): Promise<ImportReport> => {

    const report: ImportReport = {
        totalRows: rows.length,
        studentsCreated: 0,
        studentsUpdated: 0,
        achievementsCreated: 0,
        duplicateAchievements: 0,
        failedRows: [],
    };

    for (let i = 0; i < rows.length; i++) {

        const row = rows[i];

        try {

            // =========================
            // Student Upsert
            // =========================

            const existingStudent = await Student.findOne({
                admissionNo: clean(row.admissionNo),
                isDeleted: false,
            });

            const student = await Student.findOneAndUpdate(

                {
                    admissionNo: clean(row.admissionNo),
                    isDeleted: false,
                },

                {
                    $set: {
                        name: clean(row.name),
                        class: clean(row.class),
                        dob: row.dob,
                        phone: cleanPhone(row.phone),
                        photo: clean(row.photo),
                    },

                    $setOnInsert: {
                        admissionNo: clean(row.admissionNo),
                    },
                },

                {
                    upsert: true,
                    returnDocument: "after",
                }

            );

            if (!student) {
                throw new Error("Unable to create/update student");
            }

            // created or updated

            if (
                student.createdAt!.getTime() ===
                student.updatedAt!.getTime()
            ) {
                report.studentsCreated++;
            } else {
                report.studentsUpdated++;
            }

            // =========================
            // Skip if no achievement
            // =========================

            if (!row.game || !row.competition) {
                continue;
            }

            // =========================
            // Duplicate Check
            // =========================

            const existing = await Achievement.findOne({

                student: student._id,

                game: clean(row.game),

                competition: clean(row.competition),

                date: row.date,

                isDeleted: false,

            });

            if (existing) {

                report.duplicateAchievements++;

                continue;

            }

            // =========================
            // Create Achievement
            // =========================

            await Achievement.create({

                student: student._id,

                game: clean(row.game),

                competition: clean(row.competition),

                venue: clean(row.venue),

                date: row.date,

                results: clean(row.results),

                certificate: clean(row.certificate),

            });

            report.achievementsCreated++;

        }

        catch (error: any) {

            report.failedRows.push({

                row: i + 1,

                reason: error.message,

            });

        }

    }

    return report;

};