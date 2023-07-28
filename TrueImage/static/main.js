
var connectionString = 'ws://' + window.location.host + '/ws/';
var bmsSocket = new WebSocket(connectionString);


function connect() {
    bmsSocket.onopen = function open() {
        console.log('WebSockets connection created.');
    };
    
    bmsSocket.onerror = function (event) {
        console.log("Error");
    }
    
    bmsSocket.onclose = function (e) {
        console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
        setTimeout(function () {
            connect();
        }, 3000);
    };
    // Sending the info about the room

    bmsSocket.onmessage = function (e) {
        let data = JSON.parse(e.data);
        console.log(data);
        var str = JSON.stringify(data, null, 2);
        var obj = JSON.parse(str);
        var res=obj.payload.response.devices;
        
        var len=res.length;
        var html="<table>";
        for(var a=0;a<len;a++){
            html += "<tr>";
            var chk="";
            if(res[a].device_status == "true"){
                chk="checked";
            }
            html += "<td>"+res[a].record_id+"</td>";
            html += "<td>"+res[a].device_name+"</td>";
            html += "<td><input data-record_id="+res[a].record_id +" data-device_id="+res[a].device_id +" data-channel_id="+res[a].channel_id +" type='checkbox' "+ chk +" class='device_active' name="+res[a].device_name+"></td>";          
            html += "</tr>";
        }
        html +="</table>";
        //console.log(html);
        jQuery(".live_data").html(html);
    };

    if (bmsSocket.readyState == WebSocket.OPEN) {
        bmsSocket.onopen();
    }
}

connect();

$(document).on('change', 'input[type="checkbox"]', function(e){
    record_id = $(this).data('record_id');
    var o;
    var deviceId = $(this).data('device_id');
    var channelId = $(this).data('channel_id');
    console.log(record_id);

    if ($(this).is(':checked')) {
        console.log('true');
        o = 'true';
    }else{
        console.log('false');
        o = 'false';
    }

    data = {
        'record_id': record_id,
        'device_id': deviceId,
        'channel_id': channelId,
        'device_status': o,
    };

    console.log(data);
    bmsSocket.send(JSON.stringify(data));
    console.log('sending');

    // $.getJSON('/relay_opr_api',data,
    //     function(data) {
    //             console.log(data);
    //     });

});

// $( document ).on('change','.switch', function(){
//     console.log('Print');
//     var o;
//     event.preventDefault();
//     var deviceId = $(this).data('device_id');
//     var channelId = $(this).data('channel_id');
//     var packet = $(this).data('packet');
//     var id = $(this).attr('id');
    
//     // console.log(id);
//     if(document.getElementById(id).checked){
//         o = true;
//     }else{
//         o = false;
//     }
//     if(packet == "UDP"){
//         $.getJSON('/send',
//         {
//             'deviceId': deviceId,
//             'channelId': channelId,
//             'operation': o,
//         },
//         function(data) {
//                 console.log(data);
//         });
//     }
//     else{
//         $.getJSON('/ac_control',
//         {
//             'deviceId': deviceId,
//             'channelId': channelId,
//             'operation': o,
//         },
//         function(data) {
//                 console.log(data);
//         });  
//     }
//     return true;		     
// });


// $( document ).ready(function(){  
//     var intervalId = window.setInterval(function(){
//         var data = {
//             "devices": [
//                 {
//                     "record_id": 1,
//                     "device_name": "Main Hall Light",
//                     "device_status": true
//                 },
//                 {
//                     "record_id": 2,
//                     "device_name": "Bedroom Light First",
//                     "device_status": true
//                 },
//                 {
//                     "record_id": 3,
//                     "device_name": "Bedroom Light Second",
//                     "device_status": false
//                 },
//                 {
//                     "record_id": 4,
//                     "device_name": "Main Hall AC",
//                     "device_status": false
//                 },
//                 {
//                     "record_id": 5,
//                     "device_name": "Bedroom AC",
//                     "device_status": false
//                 },
//                 {
//                     "record_id": 6,
//                     "device_name": "Hall Curtain",
//                     "device_status": true
//                 },
//                 {
//                     "record_id": 7,
//                     "device_name": "Bedroom Curtain",
//                     "device_status": true
//                 }
//             ]
//         }         
//         bmsSocket.send(JSON.stringify(data));
//     }, 10000);  
// });