// anything goes down in codebase this error will be passed

const handleError = (err, req,res,next) => {
  console.error(err.stack);
  res.status(500).json({error: 'Internal Server Error'});
};

module.exports = {handleError};