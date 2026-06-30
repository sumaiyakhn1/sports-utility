import cloudinary from "../../config/cloudinary";
import streamifier from "streamifier";

interface SaveImageOptions {
    folder: "photos" | "certificates";
    fileName: string;
    extension: string;
    buffer: Buffer;
}

export const saveImage = async ({
    folder,
    fileName,
    extension,
    buffer,
}: SaveImageOptions): Promise<string> => {

    const folderName =
        folder === "photos"
            ? "sports-utility/photos"
            : "sports-utility/certificates";

    return new Promise((resolve, reject) => {

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folderName,
                public_id: fileName,
                resource_type: "image",
            },
            (error, result) => {

                if (error) {
                    return reject(error);
                }

                if (!result) {
                    return reject(new Error("Cloudinary upload failed"));
                }

                resolve(result.secure_url);
            }
        );

        streamifier.createReadStream(buffer).pipe(uploadStream);

    });

};