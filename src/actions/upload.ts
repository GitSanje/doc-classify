

"use server"




import { prisma } from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";
import fs from "fs/promises"

function extractJSON(text: string) {
    const regex = /{[\s\S]*}/;
    const match = text.match(regex);
    return match ? JSON.parse(match[0]) : null;
}

export const fileExists = async (pathToFileOrDir: string): Promise<boolean> => {
  try {
    pathToFileOrDir = path.join(process.cwd(), pathToFileOrDir);
    await fs.stat(pathToFileOrDir);
    return true; // File or directory exists
  } catch (error) {
    return false; // File or directory does not exist
  }
};



const { GEMINI_API_KEY, CLOUDINARY_CLOUD_NAME } = process.env;
if (!GEMINI_API_KEY || !CLOUDINARY_CLOUD_NAME) {
  throw new Error("Environment variables GEMINI_API_KEY and CLOUDINARY_CLOUD_NAME must be defined.");
}


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({ model: 'models/gemini-2.0-flash-001' });

 const uploadToAI = async(imgbase64: Base64URLString) => {


    const result = await model.generateContent([
        {
            inlineData: {
                data: imgbase64,
                mimeType: "image/jpeg",
            },
        },
        `Classify the given image and extract its contents in JSON format. Include classify document_type  in the JSON.
         Additionally,Include name, phone number, and location if available from the document,
         Remind you document_type, name, phone_number and location must have same key as mentioned`,
    ]);

   
    console.log(extractJSON(result.response.text()));

   return result

}


export const saveContentDB = async (formData: FormData) => {
    try {
      const extractedData = JSON.parse(formData.get("extractedData") as string);
      const filename = formData.get("filename") as string;
      const docUrl = formData.get("docUrl") as string;

      
        // Find existing customer
        const existingCustomer = await prisma.customer.findFirst({
          where: { name: extractedData.name ?? "none" },
        });
  
        if (existingCustomer) {
          // Check if document already exists for the customer
          const existingDocument = await prisma.document.findFirst({
            where: { filename, custId: existingCustomer.id },
          });
  
          if (!existingDocument) {
            // Create the document if it doesn't exist
            await prisma.document.create({
              data: {
                filename,
                metadata: extractedData,
                type: extractedData.document_type,
                docUrl: docUrl ,
                custId: existingCustomer.id,
              },
            });
          }
        } else {
          // Create a new customer and associated document atomically
          await prisma.$transaction([
            prisma.customer.create({
              data: {
                name: extractedData.name ?? 'none',
                phone: extractedData.phone_number ?? 'none',
                location: extractedData.location ?? 'none',
                Document: {
                  create: [
                    {
                      filename:filename,
                      metadata: extractedData,
                      type: extractedData.document_type,
                      docUrl: docUrl,
                    },
                  ],
                },
              },
            }),
          ]);
        }
  
        return { success: true, status: 200 };
      
    } catch (error) {
      console.error("Error saving content:", error);
      return { success: false, status: 500 };
    }
  };
  
  

export const extractInfoImg = async (formData: FormData) => {
  
  console.log(process.env.GEMINI_API_KEY);
  
    try {
      
        const img = formData.get("file") as File;
        const bytes = await img?.arrayBuffer(); 
        const imgbase64= Buffer.from(bytes).toString("base64")

        if (!img) {
          return { success: false, message: "no image found" };
        }

      //  const imgPath =  path.join(process.cwd(),`/public/${img.name}`)

      //  const buffer = Buffer.from(bytes);
      //  if (await fileExists(imgPath)) {
        
      //   return { success: true, message: "already extracted!" };
      // } else {
      
        // fs.writeFile(imgPath, buffer);
      // }
    
        // const uploadResponse = await fetch(
        //   `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
        //   {
        //     method: "POST",
        //     body: formData,
        //   }
        // );
        // const uploadedImageData = await uploadResponse.json();
       
        
        const airesult= await uploadToAI(imgbase64)
        
        const jsonData = {
            imginfo:{ 
               filename: img.name
            },
            airesult:extractJSON(airesult.response.text() )
        }


        
        return {
          message: "Success",
          status: 200,
          data:jsonData
        };
      } catch (error) {
        console.log(error);
        
        return { message: "Error", status: 500 };
      }

}
