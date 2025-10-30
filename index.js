const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

const uri =
  "mongodb+srv://myUser:QLV1SEIsymPSu03L@cluster0.swskhdv.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("This is from crud server");
});

async function run() {
  try {
    await client.connect();
    // create database and collection;
    const database = client.db("crudDB");
    const userCollection = database.collection("users");

    // get all users
    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const users = await cursor.toArray();
      res.send(users);
    });
    // get user by specific id;
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    //  add new users
    app.post("/users", async (req, res) => {
      const user = req.body;
      // data insert to mongodb;
      const result = await userCollection.insertOne(user);
      console.log("data inserted successfully", result);
      res.send(result);
    });

    // delete user by id;

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      console.log("delete user", result);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    //     await client.close();
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
