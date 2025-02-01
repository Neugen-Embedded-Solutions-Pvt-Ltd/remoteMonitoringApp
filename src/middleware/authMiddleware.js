// TOken based Authorization

import Helpers from "../../utils/helpers.js";

// security for API authorization
async function verifyToken(req, res, next) {
  try { 
    let accessToken = req.headers["authorization"]; // get token from header  
    if (!accessToken) {
      return res
        .status(401) 
        .send({ auth: false, message: "Access Denied. No token provided." });
    }
    accessToken = accessToken.split(" ")[1]; // separate the Authorization from token
    const result = await Helpers.validateAccessToken(accessToken); 
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
