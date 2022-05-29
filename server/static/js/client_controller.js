

// function setupFlip(tick) {

//     tick.value = 0;

//     let points = document.getElementById("points");


//     let timer = Tick.helper.interval(function() {
  
//       tick.value++;
  
//       if (tick.value == points.getAttribute("data-value")){
//         timer.stop();
//       }
//     }, 20);
//   }


var socket = io.connect("http://127.0.0.1:9092")

socket.on("echo", function (data) {
    console.log(data);
    let id = data["external_id"];

    var xhr = new XMLHttpRequest();
    var url = "http://127.0.0.1:9091/client_points";

    xhr.open("POST", url, true);

    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);

            // Баллы клиента!!!!
            console.log(json.client_points);
            
            let points = document.getElementById("points");
            points.setAttribute("data-value", json.client_points)

            
        }
    };
var data = JSON.stringify({"external_id": id});
xhr.send(data);

});


socket.emit('my_message', 'hi mark II');



