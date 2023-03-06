const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// Middleware start
app.use(cors());
app.use(express.json());

// Middleware end

// Database Connection start
//  pass: qs9P236CxADQ4FK1
//  user: mongodb_crud

const uri =
  "mongodb+srv://mongodb_crud:qs9P236CxADQ4FK1@simpledb.jrt478f.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});


//  Get Data Start 
app.get("/", (req, res) => {
     res.send("Node js Server runging ....");
   });
   
// Get Data End

async function run() {
  try {
    const userCollection = client.db("nodeMongoCrud").collection("users");
     //  Read Data for database
    app.get('/users', async(req, res) => {
     const query = {};
     const cursor = userCollection.find(query);
     const user = await cursor.toArray();
     res.send(user)
    })
    
     // Single Data fetch on id
    app.get('/users/:id', async(req, res) => {
          const id = req.params.id;
          const query = {_id: new ObjectId(id)};
          const user = await userCollection.findOne(query);
          res.send(user);
    })

     // Data Client to send Server and database
    app.post("/users", async(req, res) => {
      const users = req.body;
      console.log(users);
      const result = await userCollection.insertOne(users);
          res.send(result)
    });

     //  Data Update.
     app.put('/users/:id', async(req, res) => {
          const id = req.params.id;
          const filter = {_id: new ObjectId(id)};
          const user = req.body;
          const options = { upsert: true };
          const updatedUser = {
               $set: {
                    name: user.name,
                    address: user.address,
                    email: user.email
               }
          };
          const result = await userCollection.updateOne(filter, updatedUser, options);
          console.log(result);
     })

     // Data Delete for database
     app.delete('/users/:id', async(req, res)=>{
         const id = req.params.id;
     //     console.log('try to delete:', id);
          const query = {_id: new ObjectId(id)}
          const result = await userCollection.deleteOne(query);
          console.log(result);
          res.send(result);

     })
    


  } finally {
  }
}
run().catch(console.dir());
// Database Connection end



app.listen(port, () => {
  console.log(`Node js server running on port ${port}`);
});
