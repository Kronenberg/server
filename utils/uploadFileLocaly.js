const fs = require('fs-extra');
const cloudinary = require('cloudinary');
var waterfall = require('async-waterfall');

  exports.uploadToCloudinary = (req, res, next) => {

    let sampleFile = req.files.sampleFile;
    let fileName = req.body.title;

    const uploadFileLocally = () => {
      if (!req.files)
        return res.status(400).send('No files were uploaded.');

      console.log(sampleFile);

      sampleFile.mv(`public/img/${fileName}.png`, function (err) {
        if (err)
          return res.status(500).send(err);

        uploadToCloudService();
      })
    }

      const uploadToCloudService = () => {
        cloudinary.uploader.upload(`public/img/${fileName}.png`, (result) => {
            res.status(200).json({ status: 1, url: result.secure_url })
        });
      }

      waterfall([
        uploadFileLocally,
        uploadToCloudService
      ]);
}

