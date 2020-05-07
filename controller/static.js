exports.index = function(req, res) {
  if(req.session.data){
    res.render('index',{data:req.session.data});
  }
  else {
    res.render('index');
  }

};
exports.about =  function(req, res) {

  if(req.session.data){
    res.render('about',{data:req.session.data});
  }
  else {
    res.render('about');
  }

};
exports.contact =  function(req, res) {

  if(req.session.data){
    res.render('contact',{data:req.session.data});
  }
  else {
    res.render('contact');
  }

};
exports.signOut = function(req, res) {
  req.session.destroy();
  res.render('index');
};
