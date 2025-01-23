import jwt from "jsonwebtoken";

const Helpers = {
  // Token validation
  validateAccessToken: async (token) => {
    try {
      const result = jwt.verify(token, process.env.JWT_SECRET);
      return result;
    } catch (error) {
      return false;
    }
  },

  generateAccessToken: (user) => {
    return  jwt.sign({ id: user }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
  },

  generateRefreshToken: (user) => {
    return  jwt.sign(
      { id: user },
      process.env.REFRESH_SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );
  },

  verifyRefreshToken: (refreshToken) => {
    try {
      const result = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
      return result;
    } catch (error) {
      return false;
    }
  },
};

export default Helpers;
