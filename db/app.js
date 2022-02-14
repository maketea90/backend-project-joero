const express = require('express');
const {getTopics, getArticle, patchArticle, getUsers} = require('./controllers.js')
const {psqlErrorHandling, customErrorHandling, serverErrorHandling} = require('./errors')

const app = express();

app.use(express.json());

app.get('/api/topics', getTopics)
app.get('/api/articles/:article_id', getArticle)
app.patch('/api/articles/:article_id', patchArticle)
app.get('/api/users', getUsers)

app.use(psqlErrorHandling)
app.use(customErrorHandling)
app.use(serverErrorHandling)

module.exports = app;