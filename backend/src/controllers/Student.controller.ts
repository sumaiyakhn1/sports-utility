
import { Request, Response } from "express";

import ApiResponse from "../utils/ApiResponse";
import catchAsync from "../utils/catchAsync";

import * as studentService from "../services/Student.service";
import ApiError from "../utils/ApiError";

export const createStudent = catchAsync(

    async (req: Request, res: Response) => {

        const result = await studentService.createStudent(req.body);

        res.status(result.isNew ? 201 : 200).json(

            new ApiResponse(
                result.isNew ? 201 : 200,
                result.isNew
                    ? "Student created successfully"
                    : "Student updated successfully",
                result.student
            )

        );

    }

);

export const getAllStudents = catchAsync(async (req, res) => {
  const page = Number(req.query.page) || 1;

  const limit = Number(req.query.limit) || 10;

  const search = (req.query.search as string) || "";

  const studentClass = (req.query.class as string) || "";

  const sortBy = (req.query.sortBy as string) || "createdAt";

  const order = (req.query.order as string) || "desc";

  const students = await studentService.getAllStudents(
    page,
    limit,
    search,
    studentClass,
    sortBy,
    order
  );

  res.status(200).json(
    new ApiResponse(
      200,
      "Students fetched successfully",
      students
    )
  );
});

export const getStudentById = catchAsync(

    async (req: Request, res: Response) => {

        const student = await studentService.getStudentById(
            String(req.params.id)
        );

        return res.status(200).json(

            new ApiResponse(
                200,
                "Student fetched successfully",
                student
            )

        );

    }

);

export const updateStudent = catchAsync(

    async (req: Request, res: Response) => {

        const student = await studentService.updateStudent(
           String(req.params.id),
            req.body
        );

        return res.status(200).json(

            new ApiResponse(
                200,
                "Student updated successfully",
                student
            )

        );

    }

);

export const deleteStudent = catchAsync(

    async (req: Request, res: Response) => {

        await studentService.deleteStudent(String(req.params.id));

        return res.status(200).json(

            new ApiResponse(
                200,
                "Student deleted successfully"
            )

        );

    }

);

export const uploadPhoto = catchAsync(
    async (req: Request, res: Response) => {

        if (!req.file) {
            throw new ApiError(400, "Photo is required");
        }

        const student =
            await studentService.uploadStudentPhoto(
               String(req.params.id),
                req.file.path
            );

        res.status(200).json(
            new ApiResponse(
                200,
                "Photo uploaded successfully",
                student
            )
        );
    }
);