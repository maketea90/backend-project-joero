const express = require('express');
const {getTopics, getArticleById, patchArticle, getUsers, getArticles, getCommentsByArticleId, postCommentsById, deleteCommentById, getEndpoints} = require('./controllers.js')
const {psqlErrorHandling, customErrorHandling, serverErrorHandling} = require('./errors')

const app = express();

app.use(express.json());

app.get('/api/topics', getTopics)
app.get('/api/articles/:article_id', getArticleById)
app.patch('/api/articles/:article_id', patchArticle)
app.get('/api/users', getUsers)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id/comments', getCommentsByArticleId)
app.post('/api/articles/:article_id/comments', postCommentsById)
app.delete('/api/comments/:comment_id', deleteCommentById)
app.get('/api', getEndpoints)

app.use(psqlErrorHandling)
app.use(customErrorHandling)
app.use(serverErrorHandling)

app.all('/*', (req, res) => {
    res.status(404).send({msg: 'path not found'})
})

module.exports = app;