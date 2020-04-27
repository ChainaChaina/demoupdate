const Product = require('../models/user.js');

//Simple version, without validation or sanitation
exports.user_create = function (req, res) {
    let user = new user(
        {
            user: req.body.user,
            password: req.body.password
        }
    );

    user.save(function (err) {
        if (err) {
            return next(err);
        }
        res.send('user Created successfully')
    })
};