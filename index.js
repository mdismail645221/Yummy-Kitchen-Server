const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config()
const jwt = require('jsonwebtoken');
// console.log(jwt)

// middleware
app.use(express.json())
app.use(cors())



app.get('/', (req, res)=> {
    res.send('YUMMY SERVER IS RUNNING')
})



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri =process.env.URI;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// JWT VERIFY TOKEN      
function verifyJWT(req, res, next){
    console.log(req.headers.authorization)
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.send('unauthorization access token')
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_TOKEN, function(err, decoded){
        if(err){
           return res.send('Forbiden access token')
        }
        req.decoded= decoded;
        next()
    })
}

async function run (){
    try{
        const serviesCollection = client.db('yummy-kitchen').collection('services');
        const reviewCollection = client.db('yummy-kitchen').collection('reviews');


    // JWT TOKEN 
        app.post('/jwt', (req, res)=>{
            const user = req.body;
            const token = jwt.sign(user, process.env.JWT_TOKEN, {expiresIn: '1h'})
            res.send({token})
        })

    // ALL SERVICESS CURD SERVER MATHOD

        app.get('/services', async(req, res)=> {
            const query = {};
            const cursor = serviesCollection.find(query);
            const service = await cursor.limit(3).toArray();
            res.send(service)
        })

        app.get('/allServices', async(req, res)=> {
            const query= {};
            const cursor = serviesCollection.find(query).sort({name: 1});
            const services = await cursor.toArray();
            res.send(services)
        })
        app.get('/allServices/:id', async(req, res)=> {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviesCollection.findOne(query);
            res.send(service)
        })
        app.post('/allServices', async(req, res)=>{
            const query = req.body;
            const service = await serviesCollection.insertOne(query);
            res.send(service);
        })



        //------- REVIVEW SERVER METHOD FUNCTION---------- //

        // All reviews find method 
        app.get('/allReviews', async(req, res)=> {
            // console.log(req.decoded)
            // if(req.decoded.email !== req.query.email){
            //     res.status(401).send('unauthorization access token')
            // }
            let query = {};
            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const review = await cursor.toArray();
            res.send(review)
        })


        app.get('/allReviews/:id', async(req, res)=> {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const review = await reviewCollection.findOne(query);
            res.send(review)
        })


        // review massage store  in post method 
        app.post('/allReviews', async(req, res)=> {
            const query = req.body;
            const review = await reviewCollection.insertOne(query);
            res.send(review)
        })


        // UPDATE USER API MEHTOD
        app.put('/allReviews/:id', async(req, res)=> {
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const user =  req.body;
            console.log(user)
            const option = {upsert: true};
            const upUser = {
                $set: {
                    serviceInfo: user.serviceInfo,
                }
            }
            const result = await reviewCollection.updateOne(filter, upUser, option);
            res.send(result)
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


module.exports = app;