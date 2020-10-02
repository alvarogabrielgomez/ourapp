class RestResponse {
    constructor(message, success, value) {
        this.message = message,
            this.success = success,
            this.value = value
    }
    ok(valueok) {
        return new RestResponse("", true, valueok);
    }
    okMessage(messageok, valueok) {
        return new RestResponse(messageok, true, valueok);
    }
    badRequest(messagebadrequest) {
        return new RestResponse(messagebadrequest, false);
    }
    serverError(messageServerError) {
        return new RestResponse(messageServerError, false);
    }
}

module.exports = RestResponse;