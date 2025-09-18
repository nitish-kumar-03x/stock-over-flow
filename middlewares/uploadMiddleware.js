const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// Only allow image files
const imageFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const ext = file.originalname.split('.').pop().toLowerCase();
  const mime = file.mimetype;
  if (allowedTypes.test(ext) && allowedTypes.test(mime)) {
    cb(null, true);
  } else {
    cb(
      new Error('Only image files (jpg, jpeg, png, webp, gif) are allowed!'),
      false
    );
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFileFilter,
});

const uploadProductMiddleware = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: 'File upload error',
        error: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          'Image file is required and must be jpg, jpeg, png, webp, or gif.',
      });
    }

    // upload file buffer to cloudinary
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'products' },
      (error, result) => {
        if (error) {
          return res.status(500).json({
            success: false,
            message: 'Cloudinary upload failed',
            error: error.message,
          });
        }

        // attach image url to body so controller can save it
        req.body.image = result.secure_url;
        next();
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(stream);
  });
};

module.exports = { uploadProductMiddleware };
