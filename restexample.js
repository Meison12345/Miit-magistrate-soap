// Основной файл проекта
// Для модулей, установленных с помощью npm, путь не указывается
// Node ищет эти модули в папке node_modules
// Для модулей, которые создаются в программе, указывается путь
// Подключение модуля path
const path = require('path');
// Подключение модуля express
const express = require('express');
// Подключение модуля показа значка сайта (favicon)
// Этот модуль должен быть инсталирован так: npm install serve-favicon
const favicon = require('serve-favicon');
// Подключение модуля index
const indexRouter = require('./routes/index');
// Подключение модуля api
const apiRouter= require('./routes/api');
// Создание объекта для модуля express
const app = express();
// Директория шаблонов
app.set('views', path.join(__dirname, 'views'));
// Шаблонизатор
app.set('view engine', 'ejs');
//Добавление уровней промежуточного программного обеспечения (app.use)
//Выдача отладочной информации о содержимом запроса
app.use(function(req, res, next){
  console.log(req.method); //метод запроса
  console.log(req.url); //url-адрес
  console.log(req.headers); //заголовки
  next();
});
//Обработка запроса на передачу браузеру значка сайта (favicon)
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// Определение директории для статических ресурсов сайта (скрипты, стили)
app.use(express.static(path.join(__dirname, 'public')));
// Задание маршрута для главной страницы
app.use('/', indexRouter);
// Задание маршрутов для страниц api
app.use('/api', apiRouter);

// Пользовательская страница 404 вызывается,
// если в адресе указан неправильный маршрут
app.use(function(req, res){
        res.type('text/plain');
        res.status(404);
        res.send('404 — Не найдено');
});
// Пользовательская страница 500 вызывается,
// если на сервере возникает ошибка (выдается команда next(err))
app.use(function(err, req, res, next){
        console.log(err);
        res.type('text/plain');
        res.status(500);
        res.send('500 — Ошибка сервера');
});
// Определение порта, который будет прослушивать запросы к приложению
app.listen(3000, function(){
  console.log('Сервер запущен на http://localhost:3000');
});
