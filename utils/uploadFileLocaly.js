exports.uploadFile = function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');

  let sampleFile = req.files.sampleFile;
  let fileName = req.body.title;
  console.log(sampleFile);

  sampleFile.mv(`./uploads/${fileName}.png`, function(err) {
    if (err)
      return res.status(500).send(err);

    res.status(200).send({msg: `${fileName} uploaded!`});
  });
};