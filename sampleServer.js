const express = require("express");
const { MongoClient } = require('mongodb');
const path = require('path');
// Replace the uri string with your MongoDB deployment's connection string.
const uri = "mongodb://localhost?writeConcern=majority";

var temp;
async function insertADocument() {
    const client = new MongoClient(uri);

    try {
        await client.connect();

        const database = client.db("TemperatureDb");
        const temperature = database.collection("temperature");
        // create a document to insert
        const doc = {
            'sensor': 'ID1',
            'timestamp': 12345678,
            'temperature': temp
        }
        const result = await temperature.insertOne(doc);

        console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } finally {
        await client.close();
    }
}

async function findADocument() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const database = client.db("TemperatureDb");
        const temperature = database.collection("temperature");
        // Query for a movie that has the title 'The Room'
        const query = { sensor: "ID1" };
        const options = {
            // sort matched documents in descending order by rating
            sort: { "timestamp": -1 },
            // Include only the `title` and `imdb` fields in the returned document
            //projection: { _id: 0, title: 1, imdb: 1 },
        };
        const result = await temperature.findOne(query, options);
        // since this method returns the matched document, not a cursor, print it directly
        console.log(result);
        return result;
    } finally {
        await client.close();
    }
}

var app = express();
app.listen(3000, () => {
    console.log("Server running on port 3000");
});

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

app.post("/temperature", (req, res, next) => {
    temp = req.body.temperature;
    console.log('Data received');
    insertADocument().catch(console.dir);
    res.sendStatus(200);
});

app.get('/', async (req, res) => {
    var data = await findADocument().catch(console.dir)
    res.sendFile(path.join(__dirname + '/index.html'));
})