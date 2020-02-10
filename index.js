const express = require('express');
const database = require('./data/db');

const server = express();

server.use(express.json());

server.get('/', (req, res) =>
{
    res.json({message: 'Its working!!'});
})

server.get('/api/users', (req, res) =>
{
    database.find()
    .then(users =>
    {
        res.status(200).json(users);
    })
    .catch(error =>
    {
        res.status(500).json({errorMessage: 'The users information could not be retrieved.'})
    })
})

server.get('/api/users/:id', (req, res) =>
{
    database.findById(req.params.id)
    .then(user =>
    {
        if(!user)
        {
            res.status(404).json({message: 'The user with that specified ID does not exist'});
        }
        else
        {
            res.status(200).json(user);
        }
    })
    .catch(error =>
    {
        res.status(500).json({errorMessage: 'The users information could not be retrieved.'})
    })
})

server.post('/api/users', (req, res) =>
{
    const newUser = req.body;

    if(!newUser.name || !newUser.bio)
    {
        res.status(400).json({errorMessage: 'Please provide name and bio for the user'});
    }
    else
    {
        database.insert(newUser)
        .then(user =>
        {
            res.status(201).json(newUser);
        })
        .catch(error =>
        {
            res.status(500).json({errorMessage: 'There was an error while saving the user to the database'});
        })
    }
})

const PORT = 5000;

server.listen(PORT, () => console.log(`Server is working on localhost:${PORT}`));