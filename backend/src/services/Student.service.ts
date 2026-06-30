
import Student, { IStudent }  from "../models/Student";

import Achievement from "../models/Achievement";

import ApiError from "../utils/ApiError";

export const createStudent = async (data: Partial<IStudent>) => {
    const admissionNo = data.admissionNo?.trim();

    // Check if student already exists
    const existingStudent = await Student.findOne({
        admissionNo,
        isDeleted: false,
    });

    let student;

    if (existingStudent) {
        student = await Student.findByIdAndUpdate(
            existingStudent._id,
            {
                $set: {
                    ...data,
                    admissionNo,
                },
            },
            {
                new: true,
                runValidators: true,
            }
        );

        return {
            student,
            isNew: false,
        };
    }

    student = await Student.create({
        ...data,
        admissionNo,
    });

    return {
        student,
        isNew: true,
    };
};

export const getAllStudents = async (
  page = 1,
  limit = 10,
  search = "",
  studentClass = "",
  sortBy = "createdAt",
  order = "desc"
) => {
  const skip = (page - 1) * limit;

  const query: any = {
    isDeleted: false,
  };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { admissionNo: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  if (studentClass) {
    query.class = studentClass;
  }

  const students = await Student.find(query)
    .sort({
      [sortBy]: order === "asc" ? 1 : -1,
    })
    .skip(skip)
    .limit(limit);

  const totalStudents = await Student.countDocuments(query);

  return {
    students,
    totalStudents,
    currentPage: page,
    totalPages: Math.ceil(totalStudents / limit),
  };
};

export const getStudentById = async (id: string) => {
    const student = await Student.findOne({
        _id: id,
        isDeleted: false,
    });

    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    const achievements = await Achievement.find({
        student: id,
        isDeleted: false,
    }).sort({
        achievementDate: -1,
    });

    return {
        student,
        achievements,
    };
};

export const updateStudent = async (
    id: string,
    data: Partial<IStudent>
) => {

    const student = await Student.findOneAndUpdate(
        {
            _id: id,
            isDeleted: false,
        },
        data,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    return student;
};

export const deleteStudent = async (id: string) => {

    const student = await Student.findOneAndUpdate(
        {
            _id: id,
            isDeleted: false,
        },
        {
            isDeleted: true,
        },
        {
            new: true,
        }
    );

    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    return student;
};

export const uploadStudentPhoto = async (
    id: string,
    photoUrl: string
) => {

    const student = await Student.findOneAndUpdate(
        {
            _id: id,
            isDeleted: false,
        },
        {
            photo: photoUrl,
        },
        {
            new: true,
        }
    );

    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    return student;
};