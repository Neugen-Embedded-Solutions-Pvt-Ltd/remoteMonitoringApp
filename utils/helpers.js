import jwt from "jsonwebtoken";

const Helpers = {
  // Token validation
  tokenValidate: async (token) => {
    try {
      const result = jwt.verify(token, process.env.JWT_SECRET);

      return result;
    } catch (error) {
      return false;
    }
  },

  //function for delete the keys from the array
  DeleteKeys: (myObj, array) => {
    
  }
};

export default Helpers;
