//После загрузки страницы определить обработчик нажатия кнопки
$(document).ready(function () {
	//Определения функций обработчиков нажатия кнопок
	$('#search').click(function () {
		//alert('Нажата кнопка Поиск');
		$.ajax({
			url: '/api/photos', //url страницы
			type: 'GET', //метод отправки
			dataType: 'json',
			data: {},
			//Функция выполняется при получении ответа от сервера
			success: function (response) { //Данные отправлены успешно
				data = $.parseJSON(response);
				var str = "";
				str += '<table>'
				str += '<tr>' +
					'<th>ID</th>' +
					'<th>Название товара</th>' +
					'<th>Файл</th>' +
					'<th>Краткое описание товара</th>' +
					'<th>Категория товара</th>' +
					'</tr>';
				for (var i in data) { //перебор свойств объекта
					str += '<tr>' +
						'<td>' + data[i]['id'] + '</td>' +
						'<td>' + data[i]['name'] + '</td>' +
						'<td>' + data[i]['file'] + '</td>' +
						'<td>' + data[i]['descr'] + '</td>' +
						'<td>' + data[i]['cat'] + '</td>' +
						'</tr>';
				}
				str += '</table>';
				$('#photo_list').html(str); //Использование jQuery
			},
			//Обработка ошибки в случае, если данные не получены
			error: function (response) {
				alert('Данные для поиска не получены');
			}
		});
	});
	$('#select').click(function () {
		//alert('Нажата кнопка Выбор');
		var id = $('#select_id').val();
		if (id == '0' || id == '') {
			alert('Укажите идентификатор фотографии');
			return false;
		};
		$.ajax({
			url: '/api/photos/' + id, //url страницы
			type: 'GET', //метод отправки
			dataType: 'json',
			data: {},
			//Функция выполняется при получении ответа от сервера
			success: function (response) { //Данные отправлены успешно
				console.log('---------------------------------------------------------------------------------')
				data = $.parseJSON(response);
				if (data.message) {
					//Выдача сообщения об отсутствии фотографии
					alert(data.message + id);
				} else {
					$('#ph_id').html(data['id']);
					$('#photo_form').find("input[name='name']").val(data['name']);
					$('#photo_form').find("input[name='file']").val(data['file']);
					$('#photo_form').find("input[name='cat']").val(data['cat']);
					$('#photo_form').find("input[name='descr']").val(data['descr']);
					$('#photo_form').find("input[name='imagefile']").val('');
					$('#image').attr('src', data['image']);
				}
			},
			//Обработка ошибки в случае, если данные не получены
			error: function (response) {
				alert('Данные не получены');
			}
		});
	});
	$('#new').click(function () {
		//alert('Нажата кнопка Новый');
		$('#ph_id').html('0');
		$('#photo_form').find("input[name='name']").val('');
		$('#photo_form').find("input[name='file']").val('');
		$('#photo_form').find("input[name='cat']").val('');
		$('#photo_form').find("input[name='descr']").val('');
		$('#photo_form').find("input[name='imagefile']").val('');
		$('#image').attr('src', '0');
	});
	$('#add').click(function () {
		//alert('Нажата кнопка Добавить');
		if ($('#ph_id').html() != '0') {
			alert('Нажмите сначала кнопку "Новая фотография"');
			return false;
		};
		// Создание объекта для отправки формы
		var data = new FormData();
		var form = $("#photo_form");
		// Добавление данных из обычных полей формы в объект data
		form.find(':input[name]').not('[type="file"]').each(function () {
			var field = $(this);
			data.append(field.attr('name'), field.val());
		});
		// data.forEach(el=>console.log(el));
		// Добавление данных о файле в объект data
		var filesField = form.find('input[type="file"]');
		var fileName = filesField.attr('name');
		var file = filesField.prop('files')[0];
		data.append(fileName, file);
		$.ajax({
			url: '/api/photos', //url страницы
			type: 'POST', //метод отправки
			dataType: 'json', //формат возвращаемых данных
			processData: false, //Не преобразовывать передаваемые данные
			contentType: false,
			data: data, //Передаваемые данные
			//Функция выполняется при получении ответа от сервера
			success: function (response) { //Данные отправлены успешно
				data = $.parseJSON(response);
				$('#ph_id').html(data['id']);
			},
			//Обработка ошибки в случае, если данные не отправлены
			error: function (response) {
				alert('Данные для добавления не отправлены');
			}
		});
	});
	$('#update').click(function () {
		//alert('Нажата кнопка Обновить');
		var id = $('#ph_id').html();
		if (id == '0' || id == '') {
			alert('Укажите идентификатор фотографии');
			return false;
		};
		// Создание объекта для отправки формы
		var data = new FormData();
		var form = $("#photo_form");
		// Добавление данных из обычных полей формы в объект data
		form.find(':input[name]').not('[type="file"]').each(function () {
			var field = $(this);
			data.append(field.attr('name'), field.val());
		});
		// Добавление данных о файле в объект data
		var filesField = form.find('input[type="file"]');
		var fileName = filesField.attr('name');
		var file = filesField.prop('files')[0];
		data.append(fileName, file);
		$.ajax({
			url: '/api/photos/' + id, //url страницы
			type: 'PUT', //метод отправки
			dataType: 'json',
			processData: false, //Не преобразовывать передаваемые данные
			contentType: false,
			data: data,
			//Функция выполняется при получении ответа от сервера
			success: function (response) { //Данные отправлены успешно
				//alert (response);
			},
			//Обработка ошибки в случае, если данные не отправлены
			error: function (response) {
				alert('Данные для обновления не отправлены');
			}
		});
	});
	$('#delete').click(function () {
		//alert('Нажата кнопка Удалить');
		var id = $('#select_id').val();
		if (id == '0' || id == '') {
			alert('Укажите идентификатор фотографии');
			return false;
		};
		$.ajax({
			url: '/api/photos/' + id, //url страницы
			type: 'DELETE', //метод отправки
			dataType: 'json',
			data: {},
			//Функция выполняется при получении ответа от сервера
			success: function (response) { //Данные отправлены успешно
				//alert (response);
				data = $.parseJSON(response);
				alert(data['message']);
			},
			//Обработка ошибки в случае, если данные не удалены
			error: function (response) {
				alert('Данные не удалены');
			}
		});
	});
});