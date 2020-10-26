const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
const status = require('./routes/api/status');

app.use('/', status);

const port = 80;

app.listen(port, () => console.log(`Server started on port ${port}`));
