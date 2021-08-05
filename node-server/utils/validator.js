const payloadChecker = require('payload-validator');

function isValid(payload, expectedPayload, requiredElements) {
    if(payload) {
        var result = payloadChecker.validator(payload,expectedPayload, requiredElements);
        if(result.success) {
            return true
        } else {
            throw Error(result.response.errorMessage);
        }
    } 
}

function validate(valObject, requiredElements) {
    return (req, res, next) => {
        try {
            isValid(req.body, valObject, requiredElements);
            next();
        }
        catch (e) {
            res.status(400).json({"message": e.message});
        }
    }
}

module.exports = {
    isValid,
    validate
}