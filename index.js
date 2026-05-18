const express = require('express')
const app = express()

const dotenv = require("dotenv");
const cors = require("cors");

app.use(cors());
dotenv.config();
app.use(express.json());



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_URI
const port = process.env.PORT
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const db = client.db("idea")
    const ideacollection = db.collection("all_idea")
    
    app.get('/idea',async (req, res) => {
        const result = await ideacollection.find().toArray()
  res.send(result)
})

    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
