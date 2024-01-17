const logger = (req, res, next) => {
    const method = req.method;
    const url = req.url;
    const timeStamp = new Date().toISOString()

    console.log(`${timeStamp} | ${method} | ${url}`);

    next();
}

module.exports = logger;