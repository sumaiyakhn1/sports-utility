import ExcelJS from "exceljs";

export interface ExtractedImage {
  row: number;
  col: number;
  buffer: Buffer;
  extension: string;
}

export const extractImages = async (
  fileBuffer: Buffer
): Promise<Map<string, ExtractedImage>> => {
  const workbook = new ExcelJS.Workbook();

  await workbook.xlsx.load(fileBuffer as any);

  const imageMap = new Map<string, ExtractedImage>();

  workbook.eachSheet((worksheet) => {
    const images = worksheet.getImages();

    for (const image of images) {
      const img = workbook.getImage(Number(image.imageId));

      if (!img) continue;

      // Skip if this image doesn't have a buffer
      if (!("buffer" in img) || !img.buffer) continue;

      const row = image.range.tl.nativeRow + 1;
      const col = image.range.tl.nativeCol + 1;

      imageMap.set(`${row}-${col}`, {
        row,
        col,
        buffer: img.buffer as unknown as Buffer,
        extension: img.extension,
      });
    }
  });

  return imageMap;
};