const express = require('express');
const { MongoClient } = require('mongodb');

const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');

require('dotenv').config()
const app = express();

// two middleware
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hf2pl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {

        await client.connect();
        
        const database = client.db('Carmechanic');

        const serviceCollection = database.collection('servicescollection');


        // Get Api 

        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // Get Single Services 

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const serv = await serviceCollection.findOne(query);
            res.json(serv);
        });

        // Get Delete Service 

        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;

            const deleteser = { _id: ObjectId(id) };

            const result = await serviceCollection.deleteOne(deleteser);
            res.json(result);
        });


        //Post Api 

        app.post('/services', async (req, res) => {
          
            const service = req.body;

            console.log('Hit services post' , service);

            const result = await serviceCollection.insertOne(service);
         
            res.json(result);

        })

        
    }
    finally {
        // await client.close();
    }
};
run().catch(console.dir);


app.get('/', (req, res) => {
    console.log('finish run');
    res.send('it is genius car');
});

app.get('/hello', (req, res) => {
    
    res.send('Hello update here');
});

app.listen(port, () => {
    console.log('Genius Server Start');
});