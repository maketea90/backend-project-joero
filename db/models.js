const db = require('./connection')
const {checkArticleIdExists} = require('./helpers/utils')

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics;`).then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg:'path not found'})
        }
        return rows;
    })
}

exports.fetchArticleById = (id) => {
    return db.query(`SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`, [id])
    .then((result) =>{
        if(result.rows.length === 0){
            return Promise.reject({status: 404, msg: 'article not found'})
        }
        return result.rows[0];
    })
}

exports.updateArticle = (votes, id) => {
    return db.query(`UPDATE articles 
    SET votes = votes + $1
    WHERE article_id = $2 RETURNING *;`, [votes, id])
    .then(({rows}) => {
        return rows[0];
    })
}

exports.fetchUsers = () => {
    return db.query(`SELECT username FROM users;`).then(({rows}) => {
        return rows
    })
}

exports.fetchArticles = () => {
    return db.query(`SELECT * FROM articles ORDER BY created_at DESC;`).then(({rows}) => {
            return rows;
    })
}

exports.fetchCommentsByArticleId = async (id) => {
    await checkArticleIdExists(id)
    const result = await db.query(`SELECT * FROM comments WHERE article_id = $1;`, [id])
    return result.rows
}