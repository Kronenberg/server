exports.checkAuthMain = (req, res) => {
  if (req.user && req.user.email === 'kronenberg1991@gmail.com') {
    res.send({message: `${req.user.email} what i can do for you master`});
  } else {
    res.boom.unauthorized('Forbidden! Good luck!');
  }
}