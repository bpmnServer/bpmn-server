const { MongoClient, ServerApiVersion } = require('mongodb');

const dotenv = require('dotenv');
const res = dotenv.config();
console.log(res);
const uri = process.env.MONGO_DB_URL; //"mongodb+srv://analytics:analytics-password@cluster0.vom71.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  console.log(collection);
  client.close();
});