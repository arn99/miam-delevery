const express = require('express');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const port = process.env.port || 4545;
const app = express();
const router = require('./route/route');
const frontend = 'http://localhost:4200'
app.use(express.json());
app.use(cors({origin: frontend}));
app.use(express.json());
app.use('/api', router);

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})