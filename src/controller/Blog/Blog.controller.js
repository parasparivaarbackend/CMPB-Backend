import { z } from "zod";
import { blogs } from "../../model/Blog/Blog.model.js";
import {
  DeleteBucketFile,
  UploadBucketHandler,
} from "../../utils/CloudBucketHandler.js";

const blogSchema = z.object({
  title: z.string().min(2),
  alt: z.string().min(1),
  slug: z.string().min(2),
  description: z.string().min(2),
});

const GetBlog = async (req, res) => {
  try {
    const data = await blogs.find();
    if (!data || data?.length < 1) {
      return res.status(200).json({ message: "Blog Empty" });
    }
    return res.status(200).json({ message: "Blog Fetch succesfull", data });
  } catch (error) {
    console.error(error);
  }
};

const CreateBlog = async (req, res) => {
  const createData = req.body;
  const img = req.file;
  if (!img) {
    return res.status(400).json({ message: "Image is required" });
  }
  const validateData = blogSchema.safeParse(createData);
  if (validateData.success === false) {
    return res.status(400).json({ ...validateData.error.issues });
  }
  const uploadImage = await UploadBucketHandler(img);
  const image = {
    URL: uploadImage?.URL,
    uploadID: uploadImage?.uploadID,
  };
  try {
    const data = await blogs.create({
      ...validateData.data,
      image,
    });
    return res.status(200).json({ message: "blog created succesfull", data });
  } catch (error) {
    console.error(error);
  }
};

const DeleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const check = await blogs.findById(id);
    if (!check) {
      return res.status(400).json({ message: "Blog Not Found" });
    }
    await DeleteBucketFile(check?.image?.uploadID);
    await blogs.findByIdAndDelete(id);
    return res.status(200).json({ message: "Blog Deleted Succesfull" });
  } catch (error) {
    console.error(error);
  }
};

export { CreateBlog, DeleteBlog, GetBlog };
