const {fetchTopics, fetchArticle} = require('./models')

exports.getTopics = (req, res) => {
    
    fetchTopics().then((result) => {
        res.status(200).send(result)
    })
}

exports.getArticle = (req, res, next) => {
    const {article_id} = req.params
    fetchArticle(article_id).then((result) => {
        res.status(200).send(result)
    })
    .catch(next)
}