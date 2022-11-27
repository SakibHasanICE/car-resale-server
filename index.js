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
    const bookingsCollection = client.db("Product").collection("bookings");

    app.get("/bookings", async (req, res) => {
      const email = req.query.email;
      const query = { userEmail: email };
      const bookings = await bookingsCollection.find(query).toArray();
      res.send(bookings);
    });

    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const query = {
        name: booking.userName,
        email: booking.userEmail,
        item: booking.itemName,
        resaleprice: booking.price,
        number: booking.number,
        destinaton: booking.location,
      };

      const result = await bookingsCollection.insertOne(booking);
      res.send(result);
    });
    const usersCollection = client.db('Product').collection('users');
    app.get("/users", async (req, res) => {
      const query = {};
      const users = await usersCollection.find(query).toArray();
      res.send(users);
    });
    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => console.error(err));

app.listen(port, () => {
  console.log(`simple node server running on port ${port}`);
});
