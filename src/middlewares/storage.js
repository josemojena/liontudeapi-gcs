
const GOOGLE_CLOUD_PROJECT = process.env['GOOGLE_CLOUD_PROJECT'];
const CLOUD_BUCKET = process.env['GOOGLE_BUCKET_NAME'];
const GOOGLE_PROJECT_ID = process.env['GOOGLE_PROJECT_ID'];

const { Storage } = require('@google-cloud/storage');

const storage = new Storage({ keyFilename: GOOGLE_CLOUD_PROJECT, projectId: GOOGLE_PROJECT_ID });
const bucket = storage.bucket(CLOUD_BUCKET);

function getPublicUrl(filename) {
  return `https://storage.googleapis.com/${CLOUD_BUCKET}/${filename}`;
}

function sendUploadToGCS(tempfile) {
  //https://github.com/GoogleCloudPlatform/nodejs-getting-started/
  const gcsname = tempfile.originalname;
  const file = bucket.file(gcsname);

  const stream = file.createWriteStream({
    metadata: {
      contentType: tempfile.mimetype,
    },
    resumable: false,
  });

  stream.on('error', err => {
    return new Error(err);
  });

  stream.on('finish', async () => {
    return getPublicUrl(gcsname);
  });

  stream.end(tempfile.buffer);
}


/**
 * Download a file using gcs api
 * @param fileName name of the file
 */
async function downloadFile(fileName) {
  const file = bucket.file(fileName);

  const fileInfo = await file.get();
  const contents = await file.download();
  return {
    content: contents[0],
    contentType: fileInfo[0].metadata.contentType
  }
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
  downloadFile
}