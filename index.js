const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.g42knj4.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const categoryCollection = client.db('funio').collection('category');
        const usersCollection = client.db('funio').collection('users');
        const productsCollection = client.db('funio').collection('products');
        const ordersCollection = client.db('funio').collection('orders');

        app.get('/categories', async (req, res) => {
            const query = {};
            const result = await categoryCollection.find(query).toArray();
            res.send(result);
        })

        app.post('/users', async (req, res) => {
            const user = req.body
            const userQuery = { email: req.body.email }
            const storedUser = await usersCollection.findOne(userQuery);
            if (storedUser) {
                return
            }
            console.log(user);
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })

        app.get('/category/:id', async (req, res) => {
            const id = req.params.id
            const query = { category_id: id }

            const result = await productsCollection.find(query).toArray();
            res.send(result);
        })

        app.post('/orders', async (req, res) => {
            const order = req.body
            const query = {
                productName: order.productName,
                email: order.email
            }
            const storedOrder = await ordersCollection.findOne(query);
            if (storedOrder) {
                return
            }
            const result = await ordersCollection.insertOne(order);
            res.send(result);
        })
    }
    finally {

    }
}
run().catch(console.log)




app.get('/', async (req, res) => {
    res.send("Funio Server is running");
})

app.listen(port, () => console.log(`Funio server is running on port: ${port}`))