const express = require('express');
const {getTopics, getArticle, patchArticle} = require('./controllers.js')
const {psqlErrorHandling} = require('./errors')

const app = express();

app.use(express.json());

app.get('/api/topics', getTopics)
app.get('/api/articles/:article_id', getArticle)
app.patch('/api/articles/:article_id', patchArticle)

app.use(psqlErrorHandling)

app.use((err, req, res, next) => {
    res.status(404).send({msg: 'path not found'})
})

app.all('/*', (req, res) => {
    res.status(404).send({msg: 'path not found'})
})

module.exports = app;