const {fetchTopics, fetchArticleById, updateArticle, fetchUsers, fetchArticles, fetchCommentsByArticleId, insertCommentById, removeCommentById} = require('./models')

exports.getTopics = (req, res, next) => {
    fetchTopics().then((result) => {
        res.status(200).send(result)
    })
    .catch(next)
}

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params
    fetchArticleById(article_id).then((result) => {
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
    fetchUsers().then((result) => {
        res.status(200).send(result)
    })
}

exports.getArticles = (req, res, next) => {
    const {sort_by, order, topic} = req.query
    fetchArticles(sort_by, order, topic).then((result) => {
        res.status(200).send(result)
    })
    .catch(next)
}

exports.getCommentsByArticleId = (req, res, next) => {

    const {article_id} = req.params;
    fetchCommentsByArticleId(article_id).then((result) => {
        res.status(200).send(result)
    })
    .catch((err) => {
        return next(err)
    })
}

exports.postCommentsById = (req, res, next) => {
    const {article_id} = req.params
    insertCommentById(article_id, req.body).then((result) => {
        res.status(200).send(result)
    })
    .catch((err) => {
        return next(err)
    })
}

exports.deleteCommentById = (req, res, next) => {
    const {comment_id} = req.params
    removeCommentById(comment_id).then((result) => {
        res.status(204).send(result)
    })
    .catch(next)
}