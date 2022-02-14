const {fetchTopics} = require('./models')

exports.getTopics = (req, res) => {
    
    fetchTopics().then((result) => {
        res.status(200).send(result)
    })
}