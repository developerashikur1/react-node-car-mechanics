const express = require('express');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;


// middleWere
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qrfwk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
try{
    await client.connect();

    const database = client.db('carMechanic');
    const serviceCollection = database.collection('services')

    // GET
    app.get('/services', async(req, res)=>{
        const cursor = serviceCollection.find({});
        const service = await cursor.toArray();
        res.send(service)
    })

    // POST APIs
    app.post('/services', async(req, res)=>{
        const service = req.body;
        console.log('hitted the post', service)
          const result = await serviceCollection.insertOne(service);
          console.log(result);
        res.json(result);
    })


    // DELETE API
    app.delete('/services/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)};
        const result = await serviceCollection.deleteOne(query);
        res.json(result);
    })



    // SINGLE POST API
    app.get('/services/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)}
        const service = await serviceCollection.findOne(query);
        console.log(' peyeci', id);
        res.json(service);
    })

}

finally{
    // await client.close();
}

};
run().catch(console.dir);




app.get('/', (req, res)=>{
    console.log('user is gotted');
    res.send('server sended')
});


app.listen(port, ()=>{
    console.log('listened');
})