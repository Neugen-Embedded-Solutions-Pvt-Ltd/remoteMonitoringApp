const handleError = (err, req,res,next) => {
  console.error('running');
  res.status(500).send('Internal Server Error');
};

module.exports = {handleError};