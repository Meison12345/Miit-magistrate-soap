/* Маршруты photo */
const express = require('express');
const router = express.Router();
// Модуль для обработки данных формы. Используется для выгрузки файлов клиента
const multer = require('multer');
//Файл загружается в буфер storage
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
//Создаем константу phototable со значением класса Photo
//Класс Photo имеет статические методы для работы с таблицей photo
const phototable = require('../lib/db').Photo;
//Создаем константу photodb со значением объекта db для работы с базой данных
const photodb = require('../lib/db').db;
/* Маршрут GET photos. Поиск информации по всем фотографиям*/
router.get('/photos', function(req, res, next) {
  console.log('Показать информацию обо всех фотографиях');
  phototable.all(function(err, photos){
    if (err) return next(err);
    res.json(JSON.stringify(photos));
  });
});
/* Маршрут GET photos по id. Поиск информации по одной фотографии*/
router.get('/photos/:id', function(req, res, next) {
  const id = req.params.id;
  console.log('Получить информацию о фото по id = ' + id);
  phototable.find(id, function(err, photo){
    if (err) return next(err);
    if (photo) {
      if (photo.image) {
        photo.image = 'data:image;base64,' + photo.image.toString('base64');
      } else {
        photo.image = 'data:image;base64, ';
      }
      res.json(JSON.stringify(photo));
    } else {
      res.json(JSON.stringify({message: 'Нет фотографии с id = '}));
    }
  });
});
/* Маршрут POST. Добавление информации о новой фотографии */
router.post('/photos', upload.single('imagefile'), function(req, res, next) {
  console.log('Добавление фотографии');
  const newphoto = {
     name: req.body.name,
     file: req.body.file,
     descr: req.body.descr,
     cat: req.body.cat
   }
   if (req.file) {
     //Получен файл с новой фотографией
     newphoto.image = req.file.buffer;
   } else {
     newphoto.image = '';
   }
   console.log(newphoto.name + " " +newphoto.file + " " + newphoto.descr);
   phototable.insert(newphoto, function(err, id){
     if (err) return next(err);
     console.log("id = " + id);
     var obj = {id: id};
     //Отправка объекта obj с id фотографии в формате json  клиенту
     res.json(JSON.stringify(obj));
   });
});

/* Маршрут PUT. Обновление информации о фотографии*/
router.put('/photos/:id', upload.single('imagefile'), function(req, res, next) {
  console.log(req.body);
  const id = req.params.id;
  console.log('Обновление фотографии. id = ' + id);
  var updatedphoto = {
	   id: id,
     name: req.body.name,
     file: req.body.file,
     descr: req.body.descr
   }
   if (req.file) {
     //Получен файл с новой фотографией
     updatedphoto.image = req.file.buffer;
   } else {
     updatedphoto.image = '';
   }
   console.log(updatedphoto.id + " " +updatedphoto.name + " " +updatedphoto.file
      + " " + updatedphoto.descr);
   phototable.update(updatedphoto, function(err){
     if (err) return next(err);
     //Отправка сообщения клиенту
     res.json(JSON.stringify({ message: 'Данные успешно обновлены' }));
   });
});

/* Маршрут DELETE photos по id. Удаление информации об одной фотографии*/
router.delete('/photos/:id', function(req, res, next) {
  const id = req.params.id;
  //console.log('Удалить информацию о фото по id = ' + id);
  phototable.delete(id, function(err, msg){
    if (err) return next(err);
    if (msg == 'Нет фотографии') {
      res.json(JSON.stringify({ message: 'Нет фотографии с id = ' + id}));
    } else {
      res.json(JSON.stringify({ message: 'Удалено' }));
    }
  });
});



//При закрытии терминального окна
process.on('SIGINT', () => {
  // Закрытие соединения с базой данных
  photodb.close();
});
module.exports = router;
