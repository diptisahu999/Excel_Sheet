/*******************************************************Socket */
var connectionString = 'ws://' + window.location.host + '/true_image/';
// console.log("connectionString",connectionString)
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

    bmsSocket.onmessage = function (e) {

        let data = JSON.parse(e.data);

        var str = JSON.stringify(data, null, 2);

        var obj = JSON.parse(str);

        window.devices_data = obj.payload.response


        // ---------------------------------------------------------------

    };

    if (bmsSocket.readyState == WebSocket.OPEN) {
        bmsSocket.onopen();
    }
}

connect();
/*******************************************************Socket end */
$(document).ready(function () {

    // -------------------------------------------------------------
    // $("#floor").hide();
    // $("#departments").hide();
    $.ajax({
        url: '/imageMap/getSubArea/',
        dataType: 'json',
        type: 'GET',
        success: function (data) {
            window.subdata = data;
            $.each(data, function (index, value) {
                $("#floor").append("<option value='" + value.name + "' f-id='" + value.id + "'>" + value.name + "</option>");
                if (index == 0) {
                    $("#floor option[value='" + value.name + "']").prop("selected", true);
                    $('#departments').html('<option value="" selected disabled>Select Departments</option>');
                    $('#subarea').html('<option value="" selected disabled>Select Sub Area</option>');
                    $.each(value.departments, function (i, v) {
                        var op = "<option value='" + String(v.name) + "' a-id='" + v.id + "'>" + String(v.name) + "</option>";
                        $(op).appendTo("#departments");
                        if (i == 0) {
                            $("#departments option[value='" + v.name + "']").prop("selected", true);
                            $.each(v.sub_area, function (l, m) {
                                var op = "<option value='" + String(m.name) + "' sub-id='" + m.id + "'>" + String(m.name) + "</option>";
                                $(op).appendTo("#subarea");
                            });
                        }
                    });

                }
            });
        }
    });
    $('#floor').on('change', function () {
        $(".handle").remove();
        var s_area = $(this).val();
        for (var i = 0; i < subdata.length; i++) {
            if (subdata[i].name == s_area) {
                $('#departments').html('<option value="" selected disabled>Select Departments</option>');
                $('#subarea').html('<option value="" selected disabled>Select Sub Area</option>');
                $.each(subdata[i].departments, function (i, v) {
                    var op = "<option value='" + String(v.name) + "' a-id='" + v.id + "'>" + String(v.name) + "</option>";
                    $(op).appendTo("#departments");
                });
            }
        }
    });

    $('#departments').on('change', function () {
        $(".handle").remove();
        var s_dept = $(this).val();
        var s_area = $("#floor").val();
        for (var i = 0; i < subdata.length; i++) {
            if (subdata[i].name == s_area) {
                $.each(subdata[i].departments, function (k, j) {
                    if (j.name == s_dept) {
                        $('#subarea').html('<option value="" selected disabled>Select Sub Area</option>');
                        $.each(subdata[i].departments[k].sub_area, function (l, m) {
                            var op = "<option value='" + String(m.name) + "' sub-id='" + m.id + "'>" + String(m.name) + "</option>";
                            $(op).appendTo("#subarea");
                        });
                    }
                });
            }
        }
    });
    $.ajax({
        url: '/imageMap/getDevice/',
        dataType: 'json',
        type: 'GET',
        success: function (data) {
            window.devicedata = data;
            // console.log(window.device_position)
        }
    });

    window.remove_device = []
    window.deviceids = [];
    $('#subarea').on('change', function () {
        allareas = []
        $("a.myClass").addClass("disabled");
        $(".handle").remove();
        window.deviceids = [];
        window.subarea = $(this).val();
        var s_floor = $("#floor").val();
        var s_dept = $('#departments').val();
      
        $("#add_area").show();
        // $("#t_device").show();
        // $("#device_cancel").show();
        var available_device = []
        $('#devicelist').html('<option value="" selected disabled>Select Device</option>');
        for (var i = 0; i < devices_data.length; i++) {
            if (devices_data[i].name == s_floor) {
                $.each(devices_data[i].departments, function (k, j) {
                    if (j.name == s_dept) {
                        $.each(devices_data[i].departments[k].sub_area, function (index, value) {
                            // console.log("**************", value.image_path)
                            // console.log(value.name,subarea)
                            if (value.name == subarea) {
                                $.each(value["areas"], function (id, data_id) {
                                    // console.log(data_id["record_id"])
                                    available_device.push(data_id["record_id"])
                                });
                                // console.log(subarea)
                                $("#images").show();
                                $("#device_card_name").show();
                                $('#img').attr("src", '/static/' + value.on_image_path + '/');
                                $(".drag").remove()
                                // window.deviceids = [];
                                var device = value.area_devices.split(",");
                                for (var j = 0; j < devicedata.length; j++) {
                                    for (var i = 0; i < device.length; i++) {
                                        if (Number(device[i]) == devicedata[j].record_id) {
                                            // if (available_device.includes(String(devicedata[j].record_id)) == false) {
                                                // console.log(devicedata[j].record_id)    
                                                if (devicedata[j].app_type == "C" || devicedata[j].app_type == "L" || devicedata[j].app_type == "AC" || devicedata[j].app_type == "TV" || devicedata[j].app_type == "STB") {
                                                    // console.log(devicedata[j].app_type)
                                                    $("#devicelist").append("<option value='" + devicedata[j].device_name + "' app-type='" + devicedata[j].app_type + "' device-status='" + devicedata[j].device_status + "' device-id='" + devicedata[j].record_id + "'>" + devicedata[j].device_name + "</option>");
                                                }
                                            // }
                                            deviceids.push(devicedata[j].record_id);
                                            $('#subarea option[value=""]').prop('disabled', true);
                                            // console.log(deviceids)
                                            var html = ''
                                            if (devicedata[j].app_type == "AC") {

                                                html += '<div id="card_' + devicedata[j].record_id + '" d-status="' + devicedata[j].device_status + '" d-name="' + devicedata[j].device_name + '" d-id ="' + devicedata[j].record_id + '" a-type ="' + devicedata[j].app_type + '"  class="drag">';
                                                // html += '<img src="/static/images/air-conditioner.svg/" class="card-header" height="25px" width="25px"/><p class="dname"></p>';
                                                // html += '<p class="position" style="display: none;"></p>';
                                                html += '</div>';
                                            }
                                            if (devicedata[j].app_type == "C") {
                                                html += '<div id="card_' + devicedata[j].record_id + '" d-status="' + devicedata[j].device_status + '" d-name="' + devicedata[j].device_name + '" d-id ="' + devicedata[j].record_id + '" a-type ="' + devicedata[j].app_type + '"  class="drag" >';
                                                // html += '<img src="/static/images/curtains.png/" class="card-header" height="25px" width="25px"/><p class="dname"></p>';
                                                // html += '<p class="position" style="display: none;"></p>';
                                                html += '</div>';
                                            }
                                            if (devicedata[j].app_type == "L") {
                                                html += '<div id="card_' + devicedata[j].record_id + '" d-status="' + devicedata[j].device_status + '" d-name="' + devicedata[j].device_name + '" d-id ="' + devicedata[j].record_id + '" a-type ="' + devicedata[j].app_type + '" class="drag">';
                                                // html += '<img src="/static/images/lightbulb-on.svg/" class="card-header" height="25px" width="25px"/><p class="dname"></p>';
                                                // html += '<p class="position" style="display: none;"></p>';
                                                html += '</div>';
                                            }
                                            if (devicedata[j].app_type == "S") {
                                                html += '<div id="card_' + devicedata[j].record_id + '" d-status="' + devicedata[j].device_status + '" d-name="' + devicedata[j].device_name + '" d-id ="' + devicedata[j].record_id + '" a-type ="' + devicedata[j].app_type + '" class="drag">';
                                                // html += '<img src="/static/images/volume-img.svg/" class="card-header" height="25px" width="25px"/><p class="dname"></p>';
                                                // html += '<p class="position" style="display: none;"></p>';
                                                html += '</div>';
                                            }

                                            $("#icons").append(html);
                                            window.positions;
                                            $('.drag').draggable({
                                                cursor: "move",
                                                handle: '.card-header',
                                                containment: '#img',
                                                scroll: false,
                                                stop: function (event, ui) {
                                                    positions = ui.position;
                                                    coord = positions;
                                                    // console.log(coord)
                                                    $(this).find("p.position").text("(" + coord.left + "," + coord.top + ")");
                                                }
                                            })
                                            $(".drag").draggable({ disabled: true });
                                        }
                                    }
                                }
                           
                                // ***********************************************

                                $.each(value["areas"], function (id, recto) {                                    
                                    
                                    // $.each(recto["interactive_areas"], function (id, recto) { 
                                    if (recto["shape_type"] == "rectangle") {
                                        // $('#devicelist option[device-id="' + recto['record_id'] + '"]').prop('disabled', true);
                                        const svg = document.getElementById('svg');
                                        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                                        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
                                        const handles = [];
                                        const mytext = document.createElementNS("http://www.w3.org/2000/svg", "text");
                                        
                                        // console.log(recto)

                                        group.innerHTML = '<title>Double click to remove this device area.</title>';
                                        // group.innerHTML = '<text class="button" x="'+ String(Number(recto["coords"]["x"])-21)+'" id="'+recto["devices"]["d_id"]+'" y="'+recto["coords"]["y"]+'">X</text>'
                                        svg.appendChild(group);
                                        group.appendChild(rect);
                                        group.appendChild(mytext)

                                        group.setAttribute('class', 'resize-me');

                                        mytext.setAttribute('x', Number(recto["real_img_mx"]));
                                        mytext.setAttribute('y', Number(recto["real_img_my"]) - 8);
                                        mytext.innerHTML = recto["device_name"];

                                        group.setAttribute('id', 'del_id_'+ recto["id"]);
                                        rect.setAttribute('class', 'existing_device');
                                        rect.setAttribute('x', recto["real_img_mx"]);
                                        rect.setAttribute('y', recto["real_img_my"]);
                                        rect.setAttribute('width', recto["real_img_width"]);
                                        rect.setAttribute('height', recto["real_img_height"]);
                                        rect.setAttribute('stroke-width', 2);
                                        rect.setAttribute('stroke', 'white');
                                        rect.setAttribute('fill', 'grey');
                                        rect.setAttribute('d-id', recto["record_id"]);
                                        rect.setAttribute('isDevice', recto["isDevice"]);
                                        // rect.setAttribute('device_status', recto["status"]);
                                        rect.setAttribute('device_name', recto["device_name"]);
                                        rect.setAttribute('d-class', "existing_rect");
                                        rect.setAttribute('ondblclick', 'remove('+recto["id"]+','+recto["record_id"]+')');
                                        rect.setAttributeNS(null, 'cursor', 'pointer');
                                        
                                    }

                                    if (recto["shape_type"] == "polygon") {
                                        // console.log("1")
                                        // $('#devicelist option[device-id="' + recto['record_id'] + '"]').prop('disabled', true);
                                        var coords = '';
                                        
                                        const svg = document.getElementById('svg');
                                        const poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                                        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
                                        const mytext = document.createElementNS("http://www.w3.org/2000/svg", "text");
                                        
                                        group.innerHTML = '<title>Double click to remove this device area.</title>';
                                        svg.appendChild(group);
                                        group.appendChild(poly);
                                        group.appendChild(mytext);

                                        mytext.setAttribute('x', Number(recto["real_img_x"]));
                                        mytext.setAttribute('y', Number(recto["real_img_y"]) - 8);

                                        mytext.innerHTML = recto["device_name"];
                                        group.setAttribute('id', 'del_id_'+ recto["id"]);
                                        poly.setAttribute('id', "x_" + recto["record_id"]);
                                        poly.setAttribute('class', "existing_device");
                                        poly.setAttribute('d-class', "existing_poly");
                                        poly.setAttribute('points', recto["real_img_pints"]);
                                        poly.setAttribute('d-id', recto["record_id"]);
                                        poly.setAttribute('isDevice', recto["isDevice"]);
                                        // poly.setAttribute('device_status', recto["status"]);
                                        poly.setAttribute('device_name', recto["device_name"]);
                                        poly.setAttribute('ondblclick', 'remove('+recto["id"]+','+recto["record_id"]+')');
                                        poly.setAttributeNS(null, 'cursor', 'pointer');                                        
                                    }
                                    var html = '';
                                    if (recto["shape_type"] == "circle") {
                                        html += '<g id="del_id_'+recto["id"]+'">';
                                        html += '<title>Double click to remove this device area.</title>';
                                        html += '<circle class="existing_device" cx="' + Number(recto["real_img_mx"]) + '" cy="' + Number(recto["real_img_my"]) + '" r="' + recto["real_img_r"] + '" d-id="'+recto["record_id"]+'" isDevice="'+recto["isDevice"]+'"  device_name="'+recto["device_name"]+'" ondblclick="remove('+recto["id"]+','+recto["record_id"]+')" cursor="pointer"></circle>'
                                        html += '<text x="' + Number(recto["real_img_mx"]) + '" y="' + Number(recto["real_img_my"]) + '">' + recto["device_name"] + '</text>'
                                        html += '</g>';
                                    }
                                    if (recto["shape_type"] == "ellipse"){
                                        html += '<g id="del_id_'+recto["id"]+'">';
                                        html += '<title>Double click to remove this device area.</title>';
                                        html += '<ellipse cx="'+Number(recto["real_img_mx"])+'" cy="'+Number(recto["real_img_my"])+'" rx="'+Number(recto["real_img_rx"])+'" ry="'+Number(recto["real_img_ry"])+'" d-id="'+recto["record_id"]+'" isDevice="'+recto["isDevice"]+'"  device_name="'+recto["device_name"]+'" ondblclick="remove('+recto["id"]+','+recto["record_id"]+')" cursor="pointer"></ellipse>;'
                                        html += '<text x="' + Number(recto["real_img_mx"]) + '" y="' + Number(recto["real_img_my"]) + '">' + recto["device_name"] + '</text>'
                                        html += '</g>';
                                    }
                                    document.getElementById('svg').innerHTML += html;
                                // });
                                });
                                
                            }
                        });

                    }
                });
            }
        }
        
        // ----------------------------------------------------------------
        var lists_data = [];
        var old_obj = [];
        let new_obj = [];
        for (var i = 0; i < devices_data.length; i++) {
            if (devices_data[i].name == s_floor) {
                $.each(devices_data[i].departments, function (k, j) {
                    if (j.name == s_dept) {
                        $.each(devices_data[i].departments[k].sub_area, function (index, value) {
                            if (value.name == subarea) {
                                // console.log("check json data")
                                $.each(devices_data[i].departments[k].sub_area[index].areas, function (index, t) {
                                    // console.log(t.device_id +"_"+t.device_name)
                                    lists_data.push(t.id + "_" + t.device_name)
                                    old_obj.push(t)
                                });

                                // lists_data.push()
                            }
                        });
                    }
                });
            }
        }


        // alert(lists_data)
        var list = document.getElementById('list')
        // alert(list);
        // var nums = [0, 1, 2, 3, 4, 5, 6];
        var dragging, draggedOver;
        var randomNums = lists_data;
        var isRight = 'All Cropped Devices';


        const genRandom = () => {
            // randomNums = randomNums.sort(() => Math.random() - 0.5)
            renderItems(randomNums)
        }

        const renderItems = (data) => {
            // alert(data);
            document.getElementById('isRight').innerText = isRight
            list.innerText = ''
            data.forEach(num => {
                var node = document.createElement("li");
                node.draggable = true
                var a = document.createAttribute("id");
                a.value = num;
                node.setAttributeNode(a);
                node.addEventListener('drag', setDragging)
                node.addEventListener('drop', compare)
                node.addEventListener('dragover', allowDrop)
                var arr = [];             //new storage
                num = num.split('_');     //split by spaces
                arr.push(num.shift());    //add the number
                arr.push(num.join('_'));
                var textnode = document.createTextNode(`${arr[1]}`);
                node.appendChild(textnode);
                list.appendChild(node)
            })
            dragging = null
            draggedOver = null
        }

        const compare = (e) => {
            var index1 = randomNums.indexOf(dragging);
            var index2 = randomNums.indexOf(draggedOver);
            // alert(index1); this is old Id
            // alert(index2); this is new Id
            randomNums.splice(index1, 1)
            randomNums.splice(index2, 0, dragging)
            var idData = []
            // debugger
            for (var i = 0; i < randomNums.length; i++) {
                // console.log(randomNums[i].split("_")[0])
                idData.push(randomNums[i].split("_")[0])
                let idDatas = randomNums[i].split("_")[0]
                for (var j = 0; j < old_obj.length; j++) {
                    if (old_obj[j]['id'] == idDatas) {
                        // console.log(old_obj[j])
                        new_obj.push(old_obj[j])
                    }
                }
            }

            // console.log('new_obj:', new_obj);
            renderItems(randomNums)
            const clickedOnPoly = () => {
                //alert(new_obj);
                var data = {
                    'opr': 'update_imageMap',
                    'opr_type': 'imageMap',
                    'data': new_obj
                }
                // console.log("data",data)
                bmsSocket.send(JSON.stringify(data));

            }
            clickedOnPoly();
            new_obj = []



        };

        function allowDrop(ev) {
            ev.preventDefault();
            // draggedOver = parseInt(ev.target.innerText)
            draggedOver = ev.target.id
        }

        const setDragging = (e) => {
            // dragging = parseInt(e.target.innerText)
            dragging = e.target.id
        }

        genRandom()

    });


    $("#device_cancel").click(function () {
        $("#device_col").hide();
        $("#shape_col").hide();
        $("#cancel_col").hide();
        $("#add_area").show();
        $("#save_col").hide();
        $("#add_col").show();
        $("#dots_col").hide()
        $("#isInteractive_col").hide()
        var s_floor = $("#floor").val();
        var s_dept = $('#departments').val();
        var s_area = $('#subarea').val();
        for (var i = 0; i < devices_data.length; i++) {
            if (devices_data[i].name == s_floor) {
                $.each(devices_data[i].departments, function (k, j) {
                    if (j.name == s_dept) {
                        $.each(devices_data[i].departments[k].sub_area, function (index, value) {
                            if (value.name == s_area) {
                                $('#devicelist option').each(function () {
                                    $('select').find('option[value="' + $(this).val() + '"]').prop('disabled', false);
                                });
                                $('#devicelist option[value=""]').prop('disabled', true);
                                $('#devicelist option[value=""]').prop('selected', true);
                                for (var k = 0; k < remove_device.length; k++) {
                                    $('#devicelist option[device-id="' + remove_device[k] + '"]').prop('disabled', false);
                                }
                            }
                        })
                    }
                })
            }
        }
        $('#shapeType option').each(function () {
            $('select').find('option[value="' + $(this).val() + '"]').prop('disabled', true);
        });
        document.getElementById('shapeType').value = '';
        window.counter = 1
    });

    $('#devicelist').on('change', function () {
        var id = $('#devicelist option:checked').attr('device-id');
        // alert(id)
        $(".drag").draggable({ disabled: true });
        $('#card_' + id).draggable({ disabled: false });
        $("a.myClass").removeClass("disabled");
        // var s_device = $(this).val();
        $('#devicelist option').prop('disabled', true);
        $('#devicelist option:checked').prop('disabled', false);

        $(".drag").each(function () {
            var sc_id = $(this).attr('d-id');
            if (Number(id) == Number(sc_id)) {
                $(this).show();
            }
        })
    });
});

function remove(id,rid) {
    var data = {
        'opr': 'deleteArea',
        'opr_type': 'imageMap',
        'id': id,
        'record_id':rid
    }
    console.log(data)
    bmsSocket.send(JSON.stringify(data));
    $('#del_id_'+id).remove();
    window.remove_device.push(id);
    // $('#devicelist option[device-id="' + id + '"]').prop('disabled', false);
    location.reload()
  }