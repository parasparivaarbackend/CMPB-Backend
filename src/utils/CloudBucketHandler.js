import { Storage } from "@google-cloud/storage";
import fs from "fs";
const storage = new Storage({
  keyFilename: "keys.json",
});

export async function UploadBucketHandler(file, dest) {
  try {
    const bucket = storage.bucket(process.env.BUCKET_NAME);

    const destination = `CMPB/${dest}/${file.filename}`;

    const data = await bucket.upload(file.path, {
      destination: destination,
      resumable: true,
      metadata: {
        contentType: file.mimetype,
      },
    });

    fs.unlinkSync(file.path);
    const URL = `https://storage.googleapis.com/${data[1].bucket}/${data[1].name}`;
    return { URL, uploadID: data[1].name };
  } catch (error) {
    fs.unlinkSync(file.path);
    console.error(error);
  }
}
export async function DeleteBucketFile(id) {
  try {
    const file = storage.bucket(process.env.BUCKET_NAME).file(id);
    const [exists] = await file.exists();

    if (!exists) {
      console.log("File does not exist");
      return `File does not exist`;
    }

    await file.delete();
    return `Deleted Successfully`;
  } catch (error) {
    console.error("Failed to Delete File from Bucket ", error);
    throw new Error(`Failed to Delete File from Bucket `);
  }
}

export async function ListFilesHandler() {
  try {
    const bucket = storage.bucket(process.env.BUCKET_NAME);
    const [files] = await bucket.getFiles({
      prefix: `CMPB/`,
    });

    const fileList = files.map((file) => ({
      name: file.name,
      url: `https://storage.googleapis.com/${file.bucket.name}/${file.name}`,
    }));

    return fileList;
  } catch (error) {
    console.error(error);
  }
}
