// prevent network traffic and bot attack
import rateLimit from "express-rate-limit";
// request limiter, in 15 mins 20 requests allowed
const limiter = rateLimit({
  window: 15 * 60 * 1000,
  max: 100,
});

export default limiter;