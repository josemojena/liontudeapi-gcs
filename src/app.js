require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const storage = require('./middlewares/storage');
const header = require('./middlewares/header');
const uploadController = require('./uploadController');

const app = express();
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use('/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//@TODO find a way of use a common prefix for all routes
app.get('/v1/download/:file', header.applySecurity, header.applyErrorHandler, uploadController.downloadFile);
app.post('/v1/upload', header.applySecurity, header.applyErrorHandler, storage.multer.any(), uploadController.uploadFile);

//Run the app
const port = process.env.PORT || 8080;
app.listen(port, () => {
   console.log(`Listening at http://localhost:${port}`)
})

