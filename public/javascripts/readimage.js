var readImage = function(event) {
    //input - элемент формы imagefile
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function(){
      var dataURL = reader.result;
      //alert(dataURL);
      //Загрузка содержимого файла в элемент image
      $('#image').attr('src', dataURL);
      // или так:
      // var image =  document.getElementById('image');
      // image.src = dataURL;
    };
    // Чтение файла в элемент imagefile
    reader.readAsDataURL(input.files[0]);
    //Загрузка имени файла в элемент file формы
    var file = document.getElementById('photo_form').elements.file;
    file.value = input.files[0].name;
  };
