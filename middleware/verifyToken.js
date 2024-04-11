import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    try {
        const token = req.headers['x-auth-token'];
        if (!token) {
            return res.status(401).json({
                status: false,
                message: "Token not provided"
            });
        }

        jwt.verify(token, "jwtkey", (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    status: false,
                    message: "Failed to authenticate token"
                });
            }
            req.userId = decoded.id;
            next();
        });
    } catch(error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

export default verifyToken;
