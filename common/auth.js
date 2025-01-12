const utility = require('./utis');
const Model = require('../Model/index');

function extractTokenFromHeader(req) {
    const authorization = req.headers['authorization'] || req.headers['Authorization'];
    if (!authorization) {
        return null;
    }

    if (authorization.startsWith('Bearer ')) {
        return authorization.substring(7);  // Remove 'Bearer ' prefix
    }
    return null;
}

async function userAuth(req, res, next) {
    const token = extractTokenFromHeader(req);
    if (!token) {
        return res.status(400).json({ error: "Token not found" });
    }
    try {
        // Verify the token and decode the data using JwtUtil
        const decodedToken = await utility.jwtVerify(token);
        console.log('decodedToken: ', decodedToken);
        if (!decodedToken) {
            return res.status(400).json({ error: "Invalid token or session expired" });
        }

        // Fetch student data based on the decoded token
        const student = await Model.Student.findOne({
            where: {
                id: decodedToken.id,
                // jti: decodedToken.jti,
            },
        });

        if (!student) {
            return res.status(400).json({ error: "Student not found or session expired" });
        }

        // Attach student data to the request object for further use
        req.user = student;
        req.user.userType = "STUDENT"; // Example

        next();
    } catch (error) {
        console.error("Error during authentication:", error);
        return res.status(500).json({ error: error.message });
    }
}

module.exports = {
    userAuth,
};
