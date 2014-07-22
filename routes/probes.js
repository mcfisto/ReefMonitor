/*
 * Probes pages.
 */

exports.list = function(req, res){
  res.render('probes', { title: 'Reef Monitor' });
};