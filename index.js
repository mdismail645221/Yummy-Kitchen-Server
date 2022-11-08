const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config()


// middleware
app.use(express.json())
app.use(cors())



app.get('/', (req, res)=> {
    res.send('YUMMY SERVER IS RUNNING')
})


// PORT=5000
// URI=mongodb+srv://yummy-kitchen:DhpuCc6Xd1RDxF7z@cluster0.cn0mdvb.mongodb.net/?retryWrites=true&w=majority


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri =process.env.URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run (){
    try{


        const serviesCollection = client.db('yummy-kitchen').collection('services');



        app.get('/services', async(req, res)=> {
            const query = {};
            const cursor = serviesCollection.find(query);
            const service = await cursor.limit(3).toArray();
            res.send(service)
        })

        app.get('/allServices', async(req, res)=> {
            const query= {};
            const cursor = serviesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
        })




    }
    catch{(error)=>{
        console.log(error)
    }}
}

run().catch((error)=> {
    console.log(error)
})











app.listen(port, ()=> {
    console.log('Server is running', port);
})