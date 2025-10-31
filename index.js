const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const cors = require("cors");
const app = express();
const port = process.env.port || 3000;

// middleware
app.use(cors());
app.use(express.json());

// smartDBuser
// u1kFcv5ybML9oIan

// mongodb uri
const uri =
  "mongodb+srv://smartDBuser:u1kFcv5ybML9oIan@portfolio-cluster1.ea8n2bl.mongodb.net/?appName=portfolio-cluster1";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
   
    const db = client.db('smart_db')
    const productsCollection = db.collection("products")


    //      GET
    app.get('/products',async (req, res)=>{
      const cursor = productsCollection.find();
      const result = await cursor.toArray()
      res.send(result);
    })

    //   single data find
    app.get('/products/:id',async (req, res )=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await productsCollection.findOne(query);
      res.send(result)
    })

  //           POST
  app.post('/products', async (req, res)=>{
    const newProduct = req.body;
    const result = await productsCollection.insertOne(newProduct)
    res.send(result)
  })

  //         PATCH
    
  app.patch('/products/:id',async (req, res)=>{
    const id = req.params.id;
    const updatedProduct = req.body;
    const query = {_id : new ObjectId(id)}
     const update = {
      $set: {
         name: updatedProduct.name,
         price: updatedProduct.price,
      }
     }
     const options = {};
     const result = await productsCollection.updateOne(query, update, options)
     res.send(result)
  })

          //  DELETE

  app.delete('/products/:id',async (req, res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await productsCollection.deleteOne(query)
    res.send(result)
  })
       



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

// normal get
app.get("/", (req, res) => {
  res.send("Smart server is running");
});

// listen
app.listen(port, () => {
  console.log(`Smart server is running on port: ${port}`);
});

// second way to connect mongodb  

// client.connect()
// .then(()=>{
//   app.listen(port, ()=>{
//     console.log(`Smart server is running now on port: ${port}`)
//   })
// })
// .catch(console.dir)