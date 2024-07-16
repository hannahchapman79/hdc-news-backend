const express = require('express')
const app = express()
const {getTopics, getEndpoints} = require("./controllers/topics.controllers");
const { getArticleById, getArticles, getArticleComments } = require("./controllers/articles.controllers")

app.get('/api', getEndpoints)
app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles/:article_id/comments', getArticleComments)

app.all('*', (req, res, next) => {
    res.status(404).send({message: 'path not found'})
 })
 
 app.use((err, req, res, next) => {
    if (err.status && err.message) {
        res.status(err.status).send({ message: err.message });
    } else {
        next(err);
    }
})

app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({message: 'invalid id type'})
    }else{
        next(err)
    }
})




module.exports = app;