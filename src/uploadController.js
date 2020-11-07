
const storage = require('./middlewares/storage')
const path = require('path');

/**
 * Upload a list of files to gcs
 * @param req 
 * @param res 
 */
const uploadFile = (req, res) => {

    const allowedExtensions = (process.env.ALLOWED_EXTENSIONS || '.csv').split(';');
    //get all files
    let files = req.files;
    //store all processed files
    let done = [], errors = [];


    //@TODO move this to a middleware
    for (const file of files) {
        if (allowedExtensions.findIndex(ext => path.extname(file.originalname) == ext.trim()) == -1) {
            res.status(403).json({ success: false, errors: ["only allow .csv files"] });
            return;
        }
    }

    for (const file of files) {
        const result = storage.sendUploadToGCS(file);
        if (result instanceof Error) errors.push(`${file.originalname}:${result.message}`);
        else done.push(file.originalname);
    }

    res.status(200).json({
        success: true,
        errors: errors,
        data: done
    })
}

/**
 * Return a stream with the content of the file request
 * @param req ss
 * @param res 
 */
const downloadFile = async (req, res) => {
    const name = req.params.file;
    
    try {
        const result = await storage.downloadFile(name);
        res.header('Content-type', result.contentType);
        res.send(result.content);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            errors: [error.message]
        });
    }
}

module.exports = {
    downloadFile,
    uploadFile
}