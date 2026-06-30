import mongoose, { Schema, Document } from "mongoose";

export interface IStudent extends Document {
    admissionNo: string;
    name: string;
    class: string;
    dob?: Date;
    phone?: string;
    photo?: string;
    isDeleted: boolean;

    createdAt?: Date;
    updatedAt?: Date;
}

const studentSchema = new Schema<IStudent>(
    {
        admissionNo: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        class: {
            type: String,
            required: true,
            trim: true,
        },

        // Optional because some Excel files may not contain DOB
        dob: {
            type: Date,
            default: null,
        },

        // Optional because some Excel files may not contain phone
        phone: {
            type: String,
            default: "",
            trim: true,
        },

        photo: {
            type: String,
            default: "",
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IStudent>("Student", studentSchema);