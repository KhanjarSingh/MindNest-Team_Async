const jwt = require('jsonwebtoken');


const generateJWT = async (details) => {
    const payload = {
        id: details.id,
        email: details.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
    return token
}

const verifyJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid or expired token" });
        req.user = decoded;
        next();
    });
};



module.exports = { generateJWT,verifyJWT }