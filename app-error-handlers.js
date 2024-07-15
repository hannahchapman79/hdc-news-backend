exports.customErrorHandler = ((err, req, res, next) => {
    if(err.status && err.message) {
        res.status(err.status).send({msg: err.message})
    } else{
        next(err)
    }
})



exports.psqlErrorHandler = (err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({message: 'invalid id type'})
    }else{
        next(err)
    }
}

exports.serverErrorHandler = (err, req, res, next) => {
    res.status(500).send({message: 'internal server error'})
}