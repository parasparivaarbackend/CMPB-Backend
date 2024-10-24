import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, "CMPB-" + Date.now() + "-" + file.originalname);
  },
});

const ImagefileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|webp/;
  const extname = fileTypes.test(file.originalname.toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error(`only images are allowed ${fileTypes}`));
  }
};

export const uploadImage = multer({
  storage: storage,
  fileFilter: ImagefileFilter,
  limits: {
    files: 3,
    fileSize: 512 * 1024,
  },
});

const VideofileFilter = (req, file, cb) => {
  const fileTypes = /mp4|mov|avi|mkv|flv|wmv/;
  const extname = fileTypes.test(file.originalname.toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error(`only Videos are allowed ${fileTypes}`));
  }
};

export const uploadVideo = multer({
  storage: storage,
  fileFilter: VideofileFilter,
  limits: {
    files: 1,
    fileSize: 50 * 1024 * 1024,
  },
});
