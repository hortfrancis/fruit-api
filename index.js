const express = require('express');
const app = express();

require('dotenv').config();
const PORT = process.env['PORT'] || 3000;

const logger = require('./logger');

const fruits = require('./fruits.json');

console.log("process.env['PORT']:", process.env['PORT']);
console.log('PORT:', PORT);


app.use(express.json());
app.use(logger);

app.get(
    '/',

    (req, res) => {
        res.send("Welcome to the Fruit API");
    }
)

app.get(
    '/fruits',
    // Get ALL fruits 
    (req, res) => {
        res.send(fruits);
    }
)

app.get(
    '/fruits/:name',
    (req, res) => {
        const name = req.params['name'].toLowerCase();
        const filtered = fruits.filter(fruit => fruit.name.toLowerCase() === name);

        if (filtered.length === 0) res.status(404).send("Fruit requested was not found.");
        else {
            console.log(filtered[0]);
            res.send(filtered[0]);
        }
    }
);

app.post(
    '/fruits',
    (req, res) => {

        if (!req.body || !req.body.name) res.status(400).send("Fruit name is required!");

        console.log("POST request recieved.");

        console.log(req.body);

        try {

            const fruit = fruits.find(fruit => fruit.name.toLowerCase() === req.body.name.toLowerCase())
            if (fruit !== undefined) {
                return res.status(409).send("That fruit already exists!");
            }

            const ids = fruits.map(fruit => fruit.id);
            let maxId = Math.max(...ids);

            req.body.id = maxId++;

            fruits.push(req.body);
            res.status(201).send("New fruit added.");

            // if (!fruits.includes(req.body.name)) console.log("Not found!")
        } catch (error) {
            console.error(error);
            res.status(500).send("An error has happened!");
        }


        res.status(200).send("POST request received.")

        // console.log(JSON.parse(req.body));


        // fruits.find(fruit => fruit.name.toLowerCase() == req.body.name.toLowerCase());

        // console.log(req.body);

        // res.status(201).send("Fruit added.")
    }
)

app.delete(
    '/fruits/:name',
    (req, res) => {
        const name = req.params.name.toLowerCase();
        const fruitIndex = fruits.findIndex(
            fruit => fruit.name.toLowerCase() === name
        );
        if (fruitIndex === -1) res.status(404).send("No fruit with that name found.");
        else {
            fruits.splice(fruitIndex, 1);
            res.sendStatus(204);
        }
    }
)

app.patch(
    '/fruits/:name',
    (req, res) => {
        const fruit = fruits.find(
            fruit => fruit.name.toLowerCase() === req.params.name.toLowerCase()
        )
        const newFruitName = req.body.name;

        if (fruit === undefined) {
            res.status(404).send("No fruit by that name!");
        } else {
            fruit.name = newFruitName;
            res.status(200).send(fruit);
        }
    }
)

app.listen(
    PORT,
    () => console.log(`Server listening on PORT:${PORT}`)
)