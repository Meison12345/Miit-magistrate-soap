var express = require('express');
var router = express.Router();
/* Маршрут начальной страницы */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Фотографии'});
});

module.exports = router;
