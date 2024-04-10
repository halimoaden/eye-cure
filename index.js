const express = require('express');
const bodyParser = require('body-parser');

const {dbConn, dbSync} = require('./config/db_config');

// All Database MODELS and RELATIONSHIPS
require('./models/models');

const app = express();
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.status(200).send('Home Page');
});


// All API Routes
require('./routes/routes')(app);

const port = 8080;

app.listen(port, async () => {
    console.log(`Server is running on http://localhost:${port}`);
    await dbConn();
    // await dbSync()
});