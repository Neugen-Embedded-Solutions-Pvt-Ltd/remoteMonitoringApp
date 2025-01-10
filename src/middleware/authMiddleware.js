// TOken based Authorization

import Helpers from "../../utils/helpers.js";

// security for API authorization
async function verifyToken(req, res, next) {
  try {
    let token = req.headers.authorization; // get token from header
    if (!token)
      return res.status(403).send({
        auth: false,
        message: "token not provided",
      }); // validate token provided
    token = token.split(" ")[2]; // seprate the Authorization from token
    const result = await Helpers.tokenValidate(token);
    console.log(result);
    if (!result) {
      return res.status(403).send({
        status: 403,
        message: "Invalid token",
      });
    }
    req.user = result;
    next();
  } catch (err) {
    console.error(err);
    res.status(400).send({
      message: "Invalid Token",
    });
  }
}

export default verifyToken;
