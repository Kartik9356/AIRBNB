function wrapAsync(fn) {
    return (req, res, next) => {
        fn(req, res, next).catch(next); // Directly passing `next` instead of an explicit arrow function
    };
}

module.exports = wrapAsync;