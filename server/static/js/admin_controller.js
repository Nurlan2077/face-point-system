let inputMode = 1


function setupFlip(tick) {

  let timer = Tick.helper.interval(function() {

    tick.value++;

    // Вместо 150 поставить переменную кол-ва баллов из БД.
    if (tick.value == 150){
      timer.stop();
    }
  }, 20);

}

// Строка для снятия.
let withdrawal = document.getElementById("withdrawal");

// Строка для подсчета баллов.
let inputSum = document.getElementById("inputSum");


// Ввод цифр с нумпада.
function numpadClicked(num){
  if (inputMode == 1){
    inputSum.value += num;
  }
  else if(inputMode == 2){
    withdrawal.value += num;
  }
}

// Очистка ввода.
function numpadClear(){

  if (inputMode == 1){
    inputSum.value = "";
  }
  else if(inputMode == 2){
    withdrawal.value = "";
  }

}

// Удаление последней цифры.
function numpadDelete(){

  if (inputMode == 1){
    inputSum.value = ~~(inputSum.value / 10);

  }
  else if(inputMode == 2){
    withdrawal.value = ~~(withdrawal.value / 10);

  }


  if (withdrawal.value == 0){
    withdrawal.value = ""
  }

  if (inputSum.value == 0){
    inputSum.value = ""
  }

}

// Индикатор работы видеопотока.
let videoStreamIndicator = document.getElementById("indicator");

function videoStreamOn(isTrue){
  if (isTrue){
    videoStreamIndicator.style.backgroundColor = "#66ffcc"
  }
  else{
    videoStreamIndicator.style.backgroundColor = "#a50000"
  }
}


function changeFieldInput(){
  inputMode = 1
}

function changeFieldWithdrawal(){
  inputMode = 2
}


// Отправляет на сервер подтверждение добавления нового клиента.
function addPerson(){




  let xhr = new XMLHttpRequest();
  xhr.open("POST", "http://127.0.0.1:9091/confirm_add_person");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");

  

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      console.log(xhr.status);

      console.log(JSON.parse(xhr.responseText)["ErrorMessage"]); 

      if (JSON.parse(xhr.responseText)["ErrorMessage"])
      {
        new Toast({
          title: false,
          text: 'Попробуйте еще!',
          theme: 'dark',
          autohide: true,
          interval: 3000
        });
      } 
      else{
        new Toast({
          title: false,
          text: 'Успешно добавлен новый клиент!',
          theme: 'success',
          autohide: true,
          interval: 3000
        });
      }

      
    }};

  let data = JSON.stringify({"confirm": "yes"});


  xhr.send(data);
}




// Получает по сокету данные об айди распознанного клиента.
let id = 0

var socket = io.connect("http://127.0.0.1:9092")

socket.on("echo", function (data) {
    console.log(data);
    id = data["external_id"];

    
    var xhr = new XMLHttpRequest();
    var url = "http://127.0.0.1:9091/client_points";

    xhr.open("POST", url, true);

    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);

            console.log(json.client_points);
            
            let points = document.getElementById("actual_points");
            points.textContent = json.client_points

            
        }
    };
var data = JSON.stringify({"external_id": id});
xhr.send(data);
});



// Отправляет запрос на сервер с добавлением баллов распознанному клиенту.
function addPoints(){
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "http://127.0.0.1:9091/add_points");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");


  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      console.log(xhr.status);
      console.log(xhr.responseText);

      let points = document.getElementById("actual_points");
      points.textContent = JSON.parse(xhr.responseText)["new_points"]
    }};

  purchase_amount = parseInt(document.getElementById("inputSum").value);
  console.log("Сумма покупки " + purchase_amount)

  let data = JSON.stringify({"external_id": id,
                              "purchase_amount": purchase_amount});

  document.getElementById("inputSum").value = ""

  xhr.send(data);
}


// Отправляет запрос на сервер с добавлением баллов распознанному клиенту.
function withdrawPoints(){
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "http://127.0.0.1:9091/withdraw_points");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");


  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      console.log(xhr.status);
      console.log(xhr.responseText);

      let points = document.getElementById("actual_points");
      points.textContent = JSON.parse(xhr.responseText)["new_points"]
    }};

  withdraw_num = parseInt(document.getElementById("withdrawal").value);
  console.log("Сумма снятия " + withdraw_num)

  let data = JSON.stringify({"external_id": id,
                              "withdraw_num": withdraw_num});

  document.getElementById("withdrawal").value = ""

  xhr.send(data);
}

