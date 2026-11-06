const validate = (schema, source) => {
    return (req, res, next) => {
        const result = schema.safeParse(req[source])

        if(!result.success) {
            res.status(400).json({"error": "Validation failed","details": result.error.issues})
        } else {
            req.validated = {...req.validated, [source]: result.data}
            next()
        }
    }
}

export {validate}