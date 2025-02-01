import jwt from "jsonwebtoken";
import { InvalidTokenOrExpired } from "./AppError.js";

const Helpers = {
  // Token validation
  validateAccessToken: async (token) => {
    try {
      const result = jwt.verify(token, process.env.JWT_SECRET);
      return {
        auth: true,
        token: "valid",
        result,
      };
    } catch (error) { 
      throw new InvalidTokenOrExpired(); 
    }
  },

  generateAccessToken: (user) => {
    return jwt.sign({ id: user }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
  },

 /**
 * Paginates a list of records based on the current page and page limit.
 *
 * @param {Array} filteredRecord - The list of records to paginate.
 * @param {number} [currentPage=1] - The current page number.
 * @param {number} [pageLimit=10] - The number of records per page.
 * @returns {Object} An object containing the current page, page limit, and the paginated records.
 */
  Pagination: (filteredRecord, currentPage = 1, pageLimit = 10) => {
    let startIndex = (currentPage - 1) * pageLimit;
    let endIndex = currentPage * pageLimit;

    let filteredRecords = filteredRecord.slice(startIndex, endIndex);
    return { currentPage, pageLimit, filteredRecords };
  },
};

export default Helpers;
