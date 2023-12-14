require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl.js');
const app = express();
const cors = require('cors');

// Serve static files from the 'views' directory
app.use(express.static('views'));
app.use(cors());

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true, useUnifiedTopology: true
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render('index', { shortUrls: shortUrls });
});

app.post('/shortUrls', async (req, res) => {
  try {
    await ShortUrl.create({ full: req.body.full });
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while creating the short URL');
  }
});


app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);

  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.full);
});

app.post('/your-endpoint', async (req, res) => {
  try {
    const url = new ShortUrl({
      full: req.body.fullUrl
    });
    await url.save();
    res.status(201).json(url);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(process.env.PORT || 5001);

const server = app.listen(5001, '127.0.0.1', () => {
  console.log('Server is running on http://127.0.0.1:5001');
});