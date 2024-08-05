const express = require('express')
const app = express()
const articlesRouter = require('./routes/articles.router');
const commentsRouter = require('./routes/comments.router');
const topicsRouter = require('./routes/topics.router');
const usersRouter = require('./routes/users.router');
const {getEndpoints} = require('./controllers/topics.controllers')
const cors = require('cors');
app.use(cors());


app.use(express.json())

app.use('/api/topics', topicsRouter); 
app.use('/api/articles', articlesRouter); 
app.use('/api/comments', commentsRouter);
app.use('/api/users', usersRouter);
app.get("/api", getEndpoints)

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