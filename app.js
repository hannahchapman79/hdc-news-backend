const express = require('express')
const app = express()
const {getTopics} = require("./controllers/topics.controllers");
const { psqlErrorHandler, customErrorHandler, serverErrorHandler } = require('./app-error-handlers')

app.use(express.json())
app.get('/api/topics', getTopics)

app.all('*', (req, res, next) => {
    res.status(404).send({message: 'path not found'})
 })
 
 app.use(psqlErrorHandler)
 
 app.use(customErrorHandler)
 
 app.use(serverErrorHandler)



module.exports = app;