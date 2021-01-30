const path = require('path');
const express = require('express');
const { Quotes } = require('./api/quotes');

const port = 3000;

const dist = path.resolve(__dirname, '..', 'client', 'dist');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(dist));
app.use('/api/quotes', Quotes);

app.listen(port, () => {
  console.log(`Server is listening on http://127.0.0.1:${port}`)
})

