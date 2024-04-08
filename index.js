const express = require('express');
const bodyParser = require('body-parser');

const {dbConn, dbSync} = require('./config/db_config');

// All Database MODELS and RELATIONSHIPS
require('./models/models')

const app = express();
// app.use(express.json());
app.use(bodyParser.json());

const port = 8000

// console.log(app.get('env'););

app.get('/', (req, res) => {
    res.status(200).send('Home Page');
})


// All API Routes
require('./routes/routes')(app)


app.listen(port, async () => {
    console.log(`Server is running on http://localhost:${port}`)
    await dbConn()
    // await dbSync()
});