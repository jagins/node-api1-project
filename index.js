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

const PORT = 5000;

server.listen(PORT, () => console.log(`Server is working on localhost:${PORT}`));