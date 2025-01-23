// TOken based Authorization

import Helpers from "../../utils/helpers.js";
import UserToken from "../models/TokenModel.js";
await UserToken.sync({ alter: true });

// security for API authorization
async function verifyToken(req, res, next) {
  try { 
    let accessToken = req.headers["authorization"]; // get token from header
    let refreshToken = req.headers["refreshToken"];

    
    if (!accessToken && !refreshToken) {
      return res
        .status(401) 
        .send({ auth: false, message: "Access Denied. No token provided." });
    }

    accessToken = accessToken.split(" ")[2]; // separate the Authorization from token
    const result = await Helpers.validateAccessToken(accessToken);
    if (!result) {
      return res.status(403).send({
        status: 403,
        message: "Invalid token",
      });
    }

    // Validating refresh Tokens
    const UserResult = await UserToken.findOne({
      where: { refresh_token: refreshToken },
    });

    if (!UserResult) {
      return res.status(403).send({
        status: 403,
        message: "Invalid token",
      });
    }

    const validatedRefreshToken = Helpers.verifyRefreshToken(refreshToken);
    if (!validatedRefreshToken) {
      return res
        .status(401)
        .send({ auth: false, message: "Access Denied. No token provided." });
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
