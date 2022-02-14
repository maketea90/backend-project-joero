const {fetchTopics, fetchArticle, updateArticle, fetchUsers} = require('./models')

exports.getTopics = (req, res, next) => {
    console.log('in getTopics')
    fetchTopics().then((result) => {
        res.status(200).send(result)
    })
    .catch(next)
}

exports.getArticle = (req, res, next) => {
    const {article_id} = req.params
    fetchArticle(article_id).then((result) => {
        res.status(200).send(result)
    })
    .catch(next)
}

exports.patchArticle = (req, res, next) => {
    const {inc_votes} = req.body;
    const {article_id} = req.params;
    updateArticle(inc_votes, article_id).then((result) => {
        res.status(200).send(result)
    })
    .catch(next)
}

exports.getUsers = (req, res, next) => {
    console.log('in getUsers')
    fetchUsers().then((result) => {
        res.status(200).send(result)
    })
}