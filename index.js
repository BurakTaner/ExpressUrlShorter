require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require("dns");
const bodyParser = require('body-parser');
const urls = [];
const urlm = require("url");
let incrementNum = 1;
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.get("/api/shorturl/:id", (req,res,next) => {
  const { id } = req.params;
  let url = urls.find(a => a.short_url === Number(id));
  if(url) {
    const regx = /(http|https):\/\/*/;
    if(!(regx.test(url.original_url))) {
      url.original_url =  `https://${url.original_url}`;
    }
    res.redirect(url.original_url);
  }  
});

app.post("/api/shorturl", (req,res) => {
  const { url } = req.body;
  let filteredUrl = urlm.parse(url);
  if(!filteredUrl.hostname) {
    res.json({
      error: "invalid url"
    });
  }
  dns.lookup(filteredUrl.hostname, (err,address, family) => {
    if(!err) {
      const urlObj = {
        original_url: url,
        short_url: incrementNum
       }
      urls.push(urlObj);
       incrementNum++;
       res.json(urlObj);
      }
    else {
      res.json({
        error: 'invalid url' 
      })
    }
    });
});




app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});