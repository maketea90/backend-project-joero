exports.psqlErrorHandling = (err, req, res, next) => {
    if(err.code === '22P02' || err.code === '23502'){
        res.status(400).send({msg:'bad request'})
    }
    next(err)
}