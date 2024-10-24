import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const fileType = /jpeg|jpg|png|webp/;
  const extName = fileType.test(file.originalname.toLowercase());
  const mimetype = fileType.test(file.mimetype);
  if (extName && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error(`Error in uploading file`));
  }
};

export const uploadImage = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    files: 3,
    fieldSize: 500 * 1024,
  },
});
