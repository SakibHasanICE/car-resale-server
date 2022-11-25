const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
require("dotenv").config();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("simple node serve running");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fhm17oo.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    const ProductCatagories = client.db("Product").collection("Catagories");
    app.get("/catagories", async (req, res) => {
      const query = {};
      const cursor = ProductCatagories.find(query);
      const catagories = await cursor.toArray();
      res.send(catagories);
    });
    const CatagoryData = client.db("Product").collection("Catagory");
    app.get("/catagory/:CatagoryName", async (req, res) => {
      const CatagoryName = req.params.CatagoryName;
      const query = { CatagoryName: CatagoryName };
      const cursor = await CatagoryData.find(query);
      const catData = await cursor.toArray();
      res.send(catData);
    });
  }
  finally {
  }
  
}
run().catch((err) => console.error(err));

app.listen(port, () => {
  console.log(`simple node server running on port ${port}`);
});
// let query = {};
// if(req.query.CatagoryName){
//   query={
//     CatagoryName: req.query.CatagoryName
//   }
// }
// const cursor = CatagoryData.filter(query);