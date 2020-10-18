require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const storage = require('./middlewares/storage');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(function (err, req, res, next) {
   res.setHeader('Content-Type', 'application/json');
   res.status(500);
   res.json(JSON.stringify(err));
})

app.post('/upload', storage.multer.single('avatar'), storage.sendUploadToGCS, async (req, res) => {
   res.json({
      "file": req.file.originalname,
      "size": req.file.size
   });
})
app.post('/save', storage.multer.single('avatar'), (req, res) => {
   
   storage.save(req);
   res.send("ok");
})

app.get("/", (req, res) => {
   res.send("It's working");
})

app.post('/local', (req, res) => {
   storage.sendLocalFile().then(e => res.send(e)).catch(e => res.send(e)); 
})

app.post('/stream', (req, res) => {
   storage.getStream().then(e => s.send(e)).catch(e => res.send(e)); 
})

app.post('/create', (req, res) => {
   storage.createTextFile().then(() => res.send("ok")).catch(e => res.send(e)); 
})


//Run the app
const port = process.env.PORT || 8080;
app.listen(port, () => {
   console.log(`Listening at http://localhost:${port}`)
})

