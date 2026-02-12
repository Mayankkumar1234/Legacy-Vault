import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  let token = req.headers.authorization.split(" ")[1] || req.cookies.token;
  if (!token) {
    res.status(404).send({ msg: "Token not found" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .send({ msg: "You're not authenticated person", Error: err.message });
    }
    console.log(decoded);
    req.user = decoded;
    next();
  });
};
