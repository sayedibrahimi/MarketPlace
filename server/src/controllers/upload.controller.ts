import { Request, Response, NextFunction } from "express";
import { ControllerError, BadRequestError } from "../errors";
import multer from "multer";
// import axios from "axios";
import fs from "fs";

export const upload: multer.Multer = multer();

export async function uploadImage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.file) {
      throw new BadRequestError("No file uploaded.");
    }

    console.log("Received Image:");
    console.log("Original Name:", req.file.originalname);
    console.log("MIME Type:", req.file.mimetype);
    console.log("Size:", req.file.size, "bytes");

    // Convert the image to Base64
    const imageBase64: string = req.file.buffer.toString("base64");

    // const apiResponse: string = await geminiResponse(imageBase64);

    // Optional: Save the file temporarily for debugging
    fs.writeFileSync("debug_image.jpg", req.file.buffer);

    // Respond with image details (including Base64 preview)
    // res.json({
    //   description: apiResponse,
    // });
    res.json({
      message: "Image received successfully",
      base64Preview: imageBase64.substring(0, 100) + "...", // Show first 100 chars of Base64
    });
  } catch (error: unknown) {
    ControllerError(error, next);
  }
}

// async function geminiResponse(input: string): Promise<string> {
//   try {
//     const apiKey = process.env.GEMINI_API_KEY;
//     const base64Image = input;
//     const prompt = "What is in this image?";

//     if (!apiKey || !base64Image) {
//       throw new BadRequestError("API Key or image not found");
//     }

//     const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${apiKey}`;

//     const payload = {
//       contents: [
//         {
//           parts: [
//             { text: prompt },
//             {
//               inline_data: {
//                 mime_type: "image/jpg",
//                 data: base64Image.split(",")[1] || base64Image, // Remove data URI prefix if present
//               },
//             },
//           ],
//         },
//       ],
//     };

//     interface GeminiResponse {
//       candidates: Array<{
//         content: {
//           parts: Array<{
//             text?: string;
//           }>;
//         };
//       }>;
//     }

//     console.log("Sending request to Gemini API...");

//     const response = await axios.post(geminiUrl, payload, {
//       headers: {
//         Authorization: `Bearer ${apiKey}`,
//         "Content-Type": "application/json",
//       },
//     });

//     // console log the data
//     console.log("here");

//     console.log(response.data);

//     // Extract the text response from Gemini
//     const data = response.data as GeminiResponse;
//     const description =
//       data.candidates[0]?.content?.parts[0]?.text || "No description generated";

//     return description;
//   } catch (error) {
//     return `error: ${error}`;
//   }
// }

// async function geminiResponse(input: string): Promise<string> {
//   const apiUrl: string = "https://vision.googleapis.com/v1/images:annotate";

//   interface VisionAPIRequest {
//     requests: Array<{
//       image: {
//         content: string;
//       };
//       features: Array<{
//         type: string;
//         maxResults: number;
//       }>;
//     }>;
//   }

//   const requestPayload: VisionAPIRequest = {
//     requests: [
//       {
//         image: {
//           content: input, // Your Base64-encoded image
//         },
//         features: [
//           {
//             type: "LABEL_DETECTION", // Analyzes image content and provides descriptions
//             maxResults: 1, // Return only the top label
//           },
//         ],
//       },
//     ],
//   };

//   interface VisionAPIResponse {
//     responses: Array<{
//       labelAnnotations: Array<{
//         description: string;
//         score: number;
//         topicality: number;
//       }>;
//     }>;
//   }

//   try {
//     const apiKey: string | undefined = process.env.GEMINI_API_KEY;
//     if (!apiKey) {
//       throw new BadRequestError("API Key not found");
//     }
//     // const requestUrl: string = `${apiUrl}?key=${apiKey}`;

//     // axios.AxiosResponse<VisionAPIResponse>
//     // eslint-disable-next-line @typescript-eslint/typedef
//     const response = await axios.post<VisionAPIResponse>(
//       apiUrl,
//       requestPayload,
//       {
//         headers: {
//           Authorization: `Bearer ${apiKey}`, // Replace with your Google API key
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     // Handle the response, which will contain labels/descriptions of the image
//     console.log("Google Vision API Response:", response.data);

//     const labels: Array<{
//       description: string;
//       score: number;
//       topicality: number;
//     }> = response.data.responses[0]?.labelAnnotations || [];
//     const descriptions: string[] = labels.map((label) => label.description); // Extract descriptions

//     // Return the first description (or an array of descriptions if needed)
//     return descriptions[0];
//   } catch (error: unknown) {
//     return `error: ${error}`;
//   }
// }
