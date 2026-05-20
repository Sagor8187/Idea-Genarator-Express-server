const express = require("express");
const app = express();

const dotenv = require("dotenv");
const cors = require("cors");

app.use(cors());
dotenv.config();
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { createRemoteJWKSet, jwtVerify } = require("jose-cjs");
const uri = process.env.MONGO_URI;
const port = process.env.PORT;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const JWKS =createRemoteJWKSet(
  new URL(`${process.env.CLIENT_URL}/api/auth/jwks`)
)
const verifytoken =async (req,res,next)=>{
  const authheader = req?.headers?.authorization
  
  const token = authheader?.split(" ")[1]
  if(!authheader){
    return res.status(401).send({massage:"unauthorize"})
  }
  if(!token){
    return res.status(401).send({massage:"unauthorize"})
  }
  
  try {
      const {payload} =await jwtVerify(token,JWKS)
       next()
  } catch (error) {
     return res.status(403).send({massage:"Forbidden"})
  }

 
}

async function run() {
  try {
    // await client.connect();
    const db = client.db("idea");
    const ideacollection = db.collection("all_idea");
    const comentcollection = db.collection("comment");

    // all idea show api
    // app.get("/idea", async (req, res) => {
    //   const result = await ideacollection.find().toArray();
    //   res.send(result);
    // });

    app.get("/home-idea", async (req, res) => {
  try {
    const result = await ideacollection
      .find()
      .sort({ createdAt: -1 })
      .limit(6)
      .toArray();

    res.send(result);
  } catch (error) {
    res.status(500).send({
      error: "something went wrong",
    });
  }
});

 app.get("/idea", async (req, res) => {
  try {
    const { search, category } = req.query;

    let query = {};

    //  SEARCH
    if (search) {
      query.ideaTitle = {
        $regex: search,
        $options: "i",
      };
    }

    //  CATEGORY
    if (category) {
      query.category = category;
    }

    const result = await ideacollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "something went wrong" });
  }
});

    // idea details api
    app.get("/idea/:id",verifytoken, async (req, res) => {
      try {
        const { id } = req.params;
        const query = {
          _id: new ObjectId(id),
        };
        const result = await ideacollection.findOne(query);

        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "something went wrong" });
      }
    });

    //  idea post api
    app.post("/idea",verifytoken, async (req, res) => {
      try {
        const data = req.body;

        const result = await ideacollection.insertOne(data);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "something went wrong" });
      }
    });

    // update post idea

    app.patch("/idea/:id",verifytoken, async (req, res) => {
  try {
    const { id } = req.params;

    const updatedData = req.body;

    const result = await ideacollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: updatedData,
      }
    );

    res.send(result);

  } catch (error) {
    res.status(500).send({
      error: "something went wrong",
    });
  }
});

// delete idea post 

app.delete("/idea/:id",verifytoken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await ideacollection.deleteOne({
      _id: new ObjectId(id),
    });

    res.send({
      success: true,
      deletedCount: result.deletedCount,
    });

  } catch (error) {
    res.status(500).send({
      error: "something went wrong",
    });
  }
});

    // user specefic idea show api
    app.get("/my-idea/:id",verifytoken, async (req, res) => {
      try {
        const { id } = req.params;

        const result = await ideacollection.find({ userId: id }).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "something went wrong" });
      }
    });

    // comment post api

    app.post("/comment",verifytoken, async (req, res) => {
      try {
        const data = req.body;
        const result = await comentcollection.insertOne(data);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "something went wrong" });
      }
    });

    // all commnet show api
    app.get("/comment/:id", async (req, res) => {
      try {
        const {id}=req.params
        const result = await comentcollection.find({postId:id}).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "something went wrong" });
      }
    });

    // delete comment 
    app.delete("/comment/:id",verifytoken, async (req, res) => {
      try {
        const {id}=req.params
        const result = await comentcollection.deleteOne({_id:new ObjectId(id)})
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "something went wrong" });
      }
    });

    // comment update

    app.patch("/comment/:id",verifytoken, async (req, res) => {
  try {
    const { id } = req.params;
    const { post } = req.body;

    const filter = {
      _id: new ObjectId(id),
    };

    const updatedDoc = {
      $set: {
        post: post,
        createdAt: new Date().toISOString(),
      },
    };

    const result = await comentcollection.updateOne(
      filter,
      updatedDoc
    );

    res.send(result);

  } catch (error) {
    res.status(500).send({
      error: "something went wrong",
    });
  }
});



    app.get("/my-comment/:id",verifytoken, async (req, res) => {
      try {
        const { id } = req.params;
        const result = await comentcollection.find({ userId: id }).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "something went wrong" });
      }
    });

    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
