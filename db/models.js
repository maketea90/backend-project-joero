const db = require('./connection')

exports.fetchTopics = () => {
    console.log('in fetchtopics')
    return db.query(`SELECT * FROM topics;`).then(({rows}) => {
        console.log(rows)
        if(rows.length === 0){
            console.log(rows)
            return Promise.reject({status: 404, msg:'path not found'})
        }
        return rows;
    })
}

exports.fetchArticleById = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [id]).then((result) =>{
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
    console.log('in fetchUsers')
    return db.query(`SELECT username FROM users;`).then(({rows}) => {
        console.log(rows)
        return rows
    })
}

exports.fetchArticles = () => {
    return db.query(`SELECT * FROM articles ORDER BY created_at DESC;`).then(({rows}) => {
            return rows;
    })
}