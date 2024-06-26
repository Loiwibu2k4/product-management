const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

// cloud
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});
// end cloud

module.exports.uploadCloud =  (req, res, next) => {
    if(req.file) {
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };
        
        async function upload(req) {
            let result = await streamUpload(req);
            req.body[req.file.fieldname] = result.url;
            next();
        }
        upload(req);

    } else next();
}


module.exports.uploadImageCloud = (req, res, next) => {
    if(req.file) {
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };
        
        async function upload(req) {
            let result = await streamUpload(req);
            res.json({ location: result.secure_url });
        }
        upload(req);

    } else {
        res.status(400).send('No file uploaded');
        return;
    }
}