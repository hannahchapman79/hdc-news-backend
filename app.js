const express = require('express')
const app = express()
const {getTopics, getEndpoints} = require("./controllers/topics.controllers");
const { getArticleById, getArticles, getArticleComments, postComment, updateVote } = require("./controllers/articles.controllers")
const { deleteComment } = require("./controllers/comments.controllers");
const { getUsers } = require("./controllers/users.controllers");

app.use(express.json())

app.get('/api', getEndpoints)
app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles/:article_id/comments', getArticleComments)
app.post('/api/articles/:article_id/comments', postComment)
app.patch('/api/articles/:article_id', updateVote)
app.delete('/api/comments/:comment_id', deleteComment)
app.get('/api/users', getUsers);

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