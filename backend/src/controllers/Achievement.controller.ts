
import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import ApiResponse from "../utils/ApiResponse";
import * as achievementService from "../services/Achievement.service";
import ApiError from "../utils/ApiError";

export const createAchievement = catchAsync(async (req: Request, res: Response) => {
    const data = await achievementService.createAchievement(req.body);

    res.status(201).json(
        new ApiResponse(201, "Achievement created successfully", data)
    );
});

export const getAllAchievements = catchAsync(async (req, res) => {

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const search = (req.query.search as string) || "";

    const game = (req.query.game as string) || "";

    const competition = (req.query.competition as string) || "";

    const result = (req.query.result as string) || "";

    const data = await achievementService.getAllAchievements(
        page,
        limit,
        search,
        game,
        competition,
        result
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Achievements fetched successfully",
            data
        )
    );

});

export const getAchievementById = catchAsync(async (req: Request, res: Response) => {
    const data = await achievementService.getAchievementById(String(req.params.id));

    res.status(200).json(
        new ApiResponse(200, "Achievement fetched successfully", data)
    );
});

export const updateAchievement = catchAsync(async (req: Request, res: Response) => {
    const data = await achievementService.updateAchievement(
        String(req.params.id),
        req.body
    );

    res.status(200).json(
        new ApiResponse(200, "Achievement updated successfully", data)
    );
});

export const deleteAchievement = catchAsync(async (req: Request, res: Response) => {
    await achievementService.deleteAchievement(String(req.params.id));

    res.status(200).json(
        new ApiResponse(200, "Achievement deleted successfully")
    );
});

export const uploadCertificate = catchAsync(

    async (req: Request, res: Response) => {

        if (!req.file) {

            throw new ApiError(400, "Certificate file is required");

        }

        const achievement =
            await achievementService.uploadCertificate(

                String(req.params.id),

                req.file.path

            );

        res.status(200).json(

            new ApiResponse(

                200,

                "Certificate uploaded successfully",

                achievement

            )

        );

    }

);

