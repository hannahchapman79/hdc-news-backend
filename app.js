const express = require('express')
const app = express()
const {getTopics, getEndpoints} = require("./controllers/topics.controllers");

app.get('/api', getEndpoints)
app.get('/api/topics', getTopics)

app.all('*', (req, res, next) => {
    res.status(404).send({message: 'path not found'})
 })
 


module.exports = app;