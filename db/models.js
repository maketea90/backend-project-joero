const db = require('./connection')

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics`).then(({rows}) => {
        return rows;
    })
}

exports.fetchArticle = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id]).then((result) =>{
        if(result.rows.length === 0){
            return Promise.reject('path not found')
        }
        return result.rows[0];
    })
}