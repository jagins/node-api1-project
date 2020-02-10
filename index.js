//import express package
const express = require('express');

//import the database
const database = require('./data/db');

//create an express server
const server = express();

//body parser for json
server.use(express.json());


//route handler for the home page
server.get('/', (req, res) =>
{
    res.json({message: 'Its working!!'});
})

//route handler to get the list of users
server.get('/api/users', (req, res) =>
{
    //list all users in the database
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

//route handler to get user by id
server.get('/api/users/:id', (req, res) =>
{
    //finds user by id in the database
    database.findById(req.params.id)
    .then(user =>
    {
        //check to see if user is not in the database
        if(!user)
        {
            res.status(404).json({message: 'The user with that specified ID does not exist'});
        }
        else
        {
            //send the response if user is in the database
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
    //make a copy of the request body
    const newUser = req.body;

    //check to see if they have the proper fields
    if(!newUser.name || !newUser.bio)
    {
        res.status(400).json({errorMessage: 'Please provide name and bio for the user'});
    }
    else
    {
        //if they have the proper fields add them to the database and return what the client sent
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

//route handler for delete a user
server.delete('/api/users/:id', (req, res) =>
{
    database.findById(req.params.id)
    .then(user =>
    {
        if(!user)
        {
            res.status(404).json({message: 'The user with specified ID does not exist'});
        }
        else
        {
            //if user is in the database remove them and return a message saying username has been deleted
            database.remove(user.id)
            .then(deletedUser =>
            {
                res.status(200).json({message: `${user.name} has been deleted from the database`});
            })
            .catch(error =>
            {
                res.status(500).json({message: 'The user could not be removed'});
            })
        }
    })
    .catch(error =>
    {
        res.status(500).json({errorMessage: 'The users information could not be retrieved.'});
    })
})

//route handler for updating a user
server.put('/api/users/:id', (req, res) =>
{
    database.findById(req.params.id)
    .then(user =>
    {
        if(!user)
        {
            res.status(404).json({message: 'The user with the specified ID does not exist'});
        }
        else
        {
            const updateUser = req.body;
            if(!updateUser.name || !updateUser.bio)
            {
                res.status(400).json({errorMessage: 'Please provide a name and bio for the user'});
            }
            else
            {
                database.update(user.id, updateUser)
                .then(updatedUser =>
                {
                    res.status(200).json(updateUser);
                })
                .catch(error =>
                {
                    res.status(500).json({errorMessage: 'the user information could not be modified'});
                })
            }
        }
    })
    .catch(error =>
    {
        res.status(500).json({errorMessage: 'The users information could not be retrieved'});
    })
})

const PORT = 5000;

server.listen(PORT, () => console.log(`Server is working on localhost:${PORT}`));