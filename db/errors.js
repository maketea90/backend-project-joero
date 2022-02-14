exports.psqlErrorHandling = (err, req, res, next) => {
    if(err.code === '22P02' || err.code === '23502'){
        res.status(400).send({msg:'bad request'})
    }
    next(err)
}

exports.customErrorHandling = (err, req, res, next) => {
    res.status(err.status).send({msg: err.msg})

    next(err)
}

exports.serverErrorHandling = (err, req, res, next) => {
    res.status(500).send({msg: 'server error'})
}