//Использование модуля базы данных SQlite
const sqlite3 = require('sqlite3').verbose();
// Имя файла базы данных. Файл создается в корневой папке
const dbName = 'sqlitedb.db';
//Подключение к базе данных
const db = new sqlite3.Database(dbName, function (err) {
  if (err) {
    return console.error(err.message);
  }
  console.log('Подключение к базе данных SQlite');
});
db.serialize(function () {
  //Создание таблицы Photo, если ее не существует
  console.log('Создание таблицы photo, если ее не существует');
  const sql = ' CREATE TABLE IF NOT EXISTS photo ( \
    id integer primary key autoincrement, \
    name text, \
    file text, \
    cat text, \
    descr text, \
    image blob \
  )';
  db.run(sql);
});
class Photo {
  //выбор описания всех фотографий
  static all(cb) {
    db.all('SELECT id, name, file, cat, descr FROM photo', cb);
  }
  //выбор фотографии по ее идентификатору
  static find(id, cb) {
    db.get('SELECT id, name, file, cat, descr, image \
                               FROM photo WHERE id = ?', id, cb);
  }
  //добавление описания фотографии в таблицу photo
  static insert(data, cb) {
    const sql = 'INSERT INTO photo(name, file, cat, descr, image) VALUES (?, ?, ?, ?, ?)';
    console.log(data)
    db.run(sql, data.name, data.file, data.cat, data.descr, data.image,
      function (err) {
        if (err) {
          //Ошибка добавления
          console.log(err);
          return cb(err);
        } else {
          // Данные успешно добавлены
          console.log("new id = " + this.lastID);
          return cb(err, this.lastID);
        }
      }
    );
  }
  //обновление описания фотографии в таблице photo
  static update(data, cb) {
    if (data.image == '') {
      const sql = 'UPDATE photo set name = ?,file = ?, cat = ?, descr = ? WHERE id = ?';
      db.run(sql, data.name, data.file, data.cat, data.descr, data.id,
        function (err) {
          if (err) {
            //Ошибка обновления
            console.log(err);
          }
          return cb(err);
        }
      );
    } else {
      const sql = 'UPDATE photo set name = ?,file = ?, cat = ?, descr = ?, image = ? \
                   WHERE id = ?';
      db.run(sql, data.name, data.file, data.cat, data.descr, data.image, data.id,
        function (err) {
          if (err) {
            //Ошибка обновления
            console.log(err);
          }
          return cb(err);
        }
      );
    }
  }
  //удаление описания фотографии по ее идентификатору
  static delete(id, cb) {
    db.get('SELECT id FROM photo WHERE id = ?', id,
      function (err, photo_id) {
        if (err) return cb(err);
        if (photo_id) {
          db.run('DELETE FROM photo WHERE id = ?', id, cb);
        } else {
          return cb(err, 'Нет фотографии');
        }
      }
    );
  }
}
module.exports = db;
module.exports.Photo = Photo;