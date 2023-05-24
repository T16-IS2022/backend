const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const tokenChecker = async (req, res, next) => {
	// header or url parameters or post parameters
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	if (!token) 
		return res.status(400).json({ 
			success: false, 
			message: 'No token provided.' 
		});
	// decode token, verifies secret and checks expiration
	jwt.verify(token, process.env.SUPER_SECRET, function (err, decoded) {
		if (err) 
			return res.status(401).json({ 
				success: false, 
				message: 'Token not valid' 
			});
		else {
			// if everything is good, save in req object for use in other routes
			req.loggedUser = decoded.data;
			next();
		}
	});
};

module.exports = tokenChecker