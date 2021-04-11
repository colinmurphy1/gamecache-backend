// Standardized JSON Response
function api_response(res, status, message, data) {
    res.setHeader('Content-Type', 'application/json');
    res.status(status);
    res.send(JSON.stringify({
        status: status,
        timestamp: Date.now(),
        message: message,
        data: data
    }));
}

module.exports = api_response;
