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


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri =process.env.URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run (){
    try{


        const serviesCollection = client.db('yummy-kitchen').collection('services');
        const reviewCollection = client.db('yummy-kitchen').collection('reviews');



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
        app.get('/allServices/:id', async(req, res)=> {
            const id = req.params.id;
            // console.log(id)
            const query = {_id: ObjectId(id)};
            const service = await serviesCollection.findOne(query);
            res.send(service)
        })


        //------- REVIVEW SERVER METHOD FUNCTION---------- //

        // All reviews find method 
        app.get('/allReviews', async(req, res)=> {
            let query = {};
            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            // console.log(query)
            const cursor = reviewCollection.find(query);
            const review = await cursor.toArray();
            console.log(review)
            res.send(review)
        })

        // review massage store  in post method 
        app.post('/allReviews', async(req, res)=> {
            const query = req.body;
            // console.log(query)
            const review = await reviewCollection.insertOne(query);
            res.send(review)
        })
        
        // deleted method
        app.delete('/allReviews/:id', async(req, res)=> {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const remove = await reviewCollection.deleteOne(query);
            res.send(remove)
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