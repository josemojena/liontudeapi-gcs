const GOOGLE_CLOUD_PROJECT = process.env['GOOGLE_CLOUD_PROJECT'];
const CLOUD_BUCKET = process.env['GOOGLE_BUCKET_NAME'];
const { Storage } = require('@google-cloud/storage');
const { Duplex } = require('stream');
const storage = new Storage({ keyFilename: GOOGLE_CLOUD_PROJECT, projectId: 'lioscrapstorage' });
const bucket = storage.bucket(CLOUD_BUCKET);

function getPublicUrl(filename) {
  return `https://storage.googleapis.com/${CLOUD_BUCKET}/${filename}`;
}

const fs = require('fs');
const path = require('path');


function getStream() {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream("file.csv");
    const duplex = new Duplex();
    duplex.push(Buffer.from(req.file.buffer));
    duplex.push(null);
    duplex.pipe(file);
    duplex.on('error', (e) => reject(e));
    duplex.on('end', () => resolve(file));
  })

}

function createTextFile() {

  return bucket.upload(path.resolve('package.json'));
  /* const file = bucket.file('my-file.txt', { generation: 0 });
   const contents = 'This is the contents of the file.';
   return new Promise((resolve, reject) => {
 
     file.save(contents, function (err) {
       if (err) {
         file.deleteResumableCache();
         reject(err);
       }
       else resolve("ok");
     });
   })*/
}


function sendLocalFile() {

  const file = bucket.file("package.json");
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.resolve('package.json'))
      .pipe(file.createWriteStream())
      .on('error', function (err) { console.log(err); reject(err) })
      .on('finish', function () {
        // The file upload is complete.
        console.log('finished');
        resolve("all is fine");
      });
  })
}

function save(req) {
  const gcsname = req.file.originalname;
  const file = bucket.file(gcsname);
  const stream = file.createWriteStream({
    metadata: { contentType: req.file.mimetype },
    resumable: false,
  });
  const duplex = new Duplex();
  duplex.push(Buffer.from(req.file.buffer));
  duplex.push(null);
  duplex.pipe(stream);
  duplex.on('error', (e) => console.log(e));
  duplex.on('end', () => console.log('everything ok'));
}

function sendUploadToGCS(req, res, next) {

  if (!req.file) {
    return next();
  }
  const gcsname = req.file.originalname;
  const file = bucket.file(gcsname);
  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
    },
    resumable: false,
  });

  stream.on('error', (err) => {
    req.file.cloudStorageError = err;
    console.log(err);
    next(err);
  });

  stream.on('finish', async () => {
    next();
  });

  stream.end(req.file.buffer);



}
// [END process]

// Multer handles parsing multipart/form-data requests.
// This instance is configured to store images in memory.
// This makes it straightforward to upload to Cloud Storage.
// [START multer]
const Multer = require('multer');
const multer = Multer({
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb
  },
});
// [END multer]


module.exports = {
  multer,
  sendUploadToGCS,
  save,
  sendLocalFile,
  createTextFile,
  getStream
}