require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const storage = require('./middlewares/storage');
const cors = require('cors');
const uploadController =  require('./uploadController');
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(function (err, req, res, next) {
   res.setHeader('Content-Type', 'application/json');
   res.status(500);
   res.json(JSON.stringify(err));
})

app.post('/upload', storage.multer.any(), uploadController.uploadFile)
app.get('/download/:file', uploadController.downloadFile)
//Run the app
const port = process.env.PORT || 8080;
app.listen(port, () => {
   console.log(`Listening at http://localhost:${port}`)
})

