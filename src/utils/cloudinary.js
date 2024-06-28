import { v2 as cloudinary } from "cloudinary";
import  fs  from "fs";
cloudinary.config({
  cloud_name: "dhtjmfdba",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadCloudinaryFile = async (localfile) => {
  try {
    if (!localfile) return null;
    // upload file on cloudinary
    const uploadResponse = await cloudinary.v2.uploader.upload(localfile, {
      resource_type: "auto",
    });
    // file has been uploaded
    console.log("file successful uploaded", uploadResponse.url);
    return uploadResponse;
  } catch (error) {
    fs.unlinkSync(localfile);
    // remove the locally saved temporary  file as the upload got failed
    return null;
  }
};

export { uploadCloudinaryFile };
