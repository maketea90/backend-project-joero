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

exports.fetchArticles = (sort_by='created_at', order='desc', topic) => {
    if (!['title', 'topic', 'author', 'created_at', 'votes', 'article_id'].includes(sort_by)) {
        return Promise.reject({ status: 400, msg: 'Invalid sort query' });
    }
    if(!['asc','desc'].includes(order)){
        return Promise.reject({status: 400, msg: 'Invalid sort query'})
    }
    const queryValues = []
    let queryStr = `SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id`
    if(topic){
        queryValues.push(topic)
        queryStr += ` WHERE topic = $1`
        
    }
    
    order = order.toUpperCase()
    queryStr += ` GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order};`
    console.log(sort_by)
    return db.query(queryStr, queryValues).then(({rows}) => {
            return rows;
    })
}

exports.fetchCommentsByArticleId = async (id) => {
    await checkArticleIdExists(id)
    const result = await db.query(`SELECT * FROM comments WHERE article_id = $1;`, [id])
    return result.rows
}

exports.insertCommentById = (id, input) => {
    const {body, username} = input
    return db.query(`INSERT INTO comments (article_id, body, author)
    VALUES ($1, $2, $3) RETURNING *;`, [id, body, username]).then(({rows}) => {
        return rows
    })
}