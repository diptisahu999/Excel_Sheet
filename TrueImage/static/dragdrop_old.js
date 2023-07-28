/*******************************************************Socket */
var connectionString = 'ws://' + window.location.host + '/true_image/';
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
        // console.log(devices_data)
        // console.log(device_position)
        // $('#clientsubarea').html('<option value="" selected disabled>Select Sub Area</option>');
        // $.each(device_position, function (index, value) {
        //     $("#clientsubarea").append("<option value='" + value.subarea_name + "' f-id='" + value.id + "'>" + value.subarea_name + "</option>");
        // });
    };

    if (bmsSocket.readyState == WebSocket.OPEN) {
        bmsSocket.onopen();
    }
}

connect();
/*******************************************************Socket end */
$(document).ready(function () {
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
        // console.log(subdata)
        // $("#devicelist").show();
        // $("#list_devices").show();
        // $("#save").show();
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
                                    // console.log(data_id)
                                    available_device.push(data_id['devices']['d_id'])
                                });
                                // console.log(subarea)
                                $("#images").show();
                                $("#device_card_name").show();
                                $('#img').attr("src", '/static/' + value.image_path + '/');
                                $(".drag").remove()
                                // window.deviceids = [];
                                var device = value.area_devices.split(",");
                                for (var j = 0; j < devicedata.length; j++) {
                                    for (var i = 0; i < device.length; i++) {
                                        if (Number(device[i]) == devicedata[j].record_id) {
                                            if (available_device.includes(String(devicedata[j].record_id)) == false) {
                                                // console.log(devicedata[j].record_id)    
                                                if (devicedata[j].app_type == "C" || devicedata[j].app_type == "L" || devicedata[j].app_type == "AC") {
                                                    console.log(devicedata[j].app_type)
                                                    $("#devicelist").append("<option value='" + devicedata[j].device_name + "' device-status='" + devicedata[j].device_status + "' device-id='" + devicedata[j].record_id + "'>" + devicedata[j].device_name + "</option>");
                                                }
                                            }
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

                                // $.each(value["areas"], function (id, rect) {
                                //     var html = ''
                                // if (rect["type"] == "circle") {
                                //     // console.log(rect["coords"]["cx"])
                                //     html += '<g>';
                                //     html += '<text x="' + rect["coords"]["cx"] + '" y="' + rect["coords"]["cy"] + '">' + rect["devices"]["device_name"] + '</text>'
                                //     html += '<circle cx="' + rect["coords"]["cx"] + '" cy="' + rect["coords"]["cy"] + '" r="' + rect["coords"]["radius"] + '"></circle>'
                                //     $.each(rect["devices"]["sub_rect"], function (id, sub_rect) {
                                //         if (sub_rect["class_name"] == 'helper move') {
                                //             html += '<rect class="' + sub_rect["class_name"] + '" x="' + sub_rect["x"] + '" y="' + sub_rect["y"] + '" width="' + sub_rect["width"] + '" height="' + sub_rect["height"] + '"></rect>';
                                //         }
                                //         if (sub_rect["class_name"] == 'helper n-resize') {
                                //             html += '<rect class="' + sub_rect["class_name"] + '" x="' + sub_rect["x"] + '" y="' + sub_rect["y"] + '" width="' + sub_rect["width"] + '" height="' + sub_rect["height"] + '"></rect>';
                                //         }
                                //         if (sub_rect["class_name"] == 'helper s-resize') {
                                //             html += '<rect class="' + sub_rect["class_name"] + '" x="' + sub_rect["x"] + '" y="' + sub_rect["y"] + '" width="' + sub_rect["width"] + '" height="' + sub_rect["height"] + '"></rect>';
                                //         }
                                //         if (sub_rect["class_name"] == 'helper e-resize') {
                                //             html += '<rect class="' + sub_rect["class_name"] + '" x="' + sub_rect["x"] + '" y="' + sub_rect["y"] + '" width="' + sub_rect["width"] + '" height="' + sub_rect["height"] + '"></rect>';
                                //         }
                                //         if (sub_rect["class_name"] == 'helper w-resize') {
                                //             html += '<rect class="' + sub_rect["class_name"] + '" x="' + sub_rect["x"] + '" y="' + sub_rect["y"] + '" width="' + sub_rect["width"] + '" height="' + sub_rect["height"] + '"></rect>';
                                //         }

                                //     });
                                //     html += '</g>';
                                // }
                                // document.getElementById('svg').innerHTML += html;
                                // });                                
                                // });
                                // }
                                // ***********************************************

                                $.each(value["areas"], function (id, recto) {
                                    if (recto["type"] == "rectangle") {
                                        $('#devicelist option[device-id="' + recto['devices']['d_id'] + '"]').prop('disabled', true);
                                        const svg = document.getElementById('svg');
                                        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                                        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
                                        const handles = [];
                                        const mytext = document.createElementNS("http://www.w3.org/2000/svg", "text");
                                        const clickedOnRect = (r_id) => {
                                            // alert("rectangle")
                                            var data = {
                                                'opr': 'deleteArea',
                                                'opr_type': 'imageMap',
                                                'id': r_id
                                            }
                                            $("#save_col").show();
                                            // bmsSocket.send(JSON.stringify(data));
                                            $('#del_id_' + r_id).remove();
                                            window.remove_device.push(r_id);
                                            $('#devicelist option[device-id="' + r_id + '"]').prop('disabled', false);
                                        }

                                        group.innerHTML = '<title>Double click to remove this device.</title>';
                                        // group.innerHTML = '<text class="button" x="'+ String(Number(recto["coords"]["x"])-21)+'" id="'+recto["devices"]["d_id"]+'" y="'+recto["coords"]["y"]+'">X</text>'
                                        svg.appendChild(group);
                                        group.appendChild(rect);
                                        group.appendChild(mytext)

                                        group.setAttribute('class', 'resize-me');

                                        mytext.setAttribute('x', Number(recto["coords"]["x"]));
                                        mytext.setAttribute('y', Number(recto["coords"]["y"]) - 8);
                                        mytext.innerHTML = recto["devices"]["device_name"];

                                        group.setAttribute('id', 'del_id_' + recto["devices"]["d_id"]);
                                        rect.setAttribute('class', 'existing_device');
                                        rect.setAttribute('x', recto["coords"]["x"]);
                                        rect.setAttribute('y', recto["coords"]["y"]);
                                        rect.setAttribute('width', recto["coords"]["width"]);
                                        rect.setAttribute('height', recto["coords"]["height"]);
                                        rect.setAttribute('stroke-width', 2);
                                        rect.setAttribute('stroke', 'white');
                                        rect.setAttribute('fill', 'grey');
                                        rect.setAttribute('d-id', recto["devices"]["d_id"]);
                                        rect.setAttribute('device_status', recto["devices"]["device_status"]);
                                        rect.setAttribute('device_name', recto["devices"]["device_name"]);
                                        rect.setAttribute('d-class', "existing_rect");
                                        rect.setAttributeNS(null, 'cursor', 'pointer');
                                        rect.addEventListener('dblclick', ($event) => {
                                            clickedOnRect(recto["devices"]["d_id"]);
                                        });

                                        // Create the handles

                                        for (let i = 0; i < 8; i++) {
                                            const handle = document.createElementNS("http://www.w3.org/2000/svg", "rect");

                                            handle.setAttribute('width', 5);
                                            handle.setAttribute('height', 5);
                                            // handle.setAttribute('stroke-width', 1);
                                            // handle.setAttribute('stroke', 'white');
                                            // handle.setAttribute('fill', 'black');

                                            handles.push(handle);
                                            group.appendChild(handle);
                                        }

                                        // Manually assign them their resize duties (R->L, T->B)
                                        handles[0].classList.add('resize-top', 'resize-left');
                                        handles[1].classList.add('resize-top');
                                        handles[2].classList.add('resize-top', 'resize-right');
                                        handles[3].classList.add('resize-left');
                                        handles[4].classList.add('resize-right');
                                        handles[5].classList.add('resize-bottom', 'resize-left');
                                        handles[6].classList.add('resize-bottom');
                                        handles[7].classList.add('resize-bottom', 'resize-right');

                                        // This function takes the rect and the list of handles and positions
                                        // the handles accordingly
                                        const findLocations = (r, h) => {
                                            const x = Number(r.getAttribute('x'));
                                            const y = Number(r.getAttribute('y'));
                                            const width = Number(r.getAttribute('width'));
                                            const height = Number(r.getAttribute('height'));

                                            // Important these are in the same order as the classes above
                                            let locations = [
                                                [0, 0],
                                                [width / 2, 0],
                                                [width, 0],
                                                [0, height / 2],
                                                [width, height / 2],
                                                [0, height],
                                                [width / 2, height],
                                                [width, height]
                                            ];

                                            // Move each location such that it's relative to the (x,y) of the rect,
                                            // and also subtract half the width of the handles to make up for their
                                            // own size.
                                            locations = locations.map(subarr => [
                                                subarr[0] + x - 4,
                                                subarr[1] + y - 4
                                            ]);

                                            for (let i = 0; i < locations.length; i++) {
                                                h[i].setAttribute('x', locations[i][0]);
                                                h[i].setAttribute('y', locations[i][1]);
                                            }
                                        }

                                        interact('.resize-me')
                                            .resizable({
                                                edges: {
                                                    left: '.resize-left',
                                                    right: '.resize-right',
                                                    bottom: '.resize-bottom',
                                                    top: '.resize-top'
                                                }
                                            })
                                            .on('resizemove', function (event) {
                                                // Resize the rect, not the group, it will resize automatically
                                                const target = event.target.querySelector('rect');
                                                const t_target = event.target.querySelector('text');

                                                for (const attr of ['width', 'height']) {
                                                    let v = Number(target.getAttribute(attr));
                                                    v += event.deltaRect[attr];
                                                    if (v > 0 == true) {
                                                        target.setAttribute(attr, v);
                                                    }
                                                }

                                                for (const attr of ['top', 'left']) {
                                                    const a = attr == 'left' ? 'x' : 'y';
                                                    let v = Number(target.getAttribute(a));
                                                    v += event.deltaRect[attr];
                                                    target.setAttribute(a, v);
                                                    $('#save_col').show();
                                                    // t_target.setAttribute(a,v);
                                                }

                                                findLocations(rect, handles);
                                            });

                                        findLocations(rect, handles);

                                    }

                                    if (recto["type"] == "polygon") {
                                        // console.log("1")
                                        $('#devicelist option[device-id="' + recto['devices']['d_id'] + '"]').prop('disabled', true);
                                        var coords = '';
                                        $.each(recto.coords["points"], function (index, i) {
                                            coords = coords + ' ' + i["x"] + ' ' + i["y"]
                                        });
                                        const svg = document.getElementById('svg');
                                        const poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                                        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
                                        const mytext = document.createElementNS("http://www.w3.org/2000/svg", "text");
                                        const clickedOnPoly = (p_id) => {
                                            // alert("poly")
                                            var data = {
                                                'opr': 'deleteArea',
                                                'opr_type': 'imageMap',
                                                'id': p_id
                                            }
                                            $("#save_col").show();
                                            // bmsSocket.send(JSON.stringify(data));
                                            $('#del_id_' + p_id).remove();
                                            $('.poly_' + p_id).remove();
                                            window.remove_device.push(p_id);
                                            $('#devicelist option[device-id="' + p_id + '"]').prop('disabled', false);
                                        }
                                        group.innerHTML = '<title>Double click to remove this device.</title>';
                                        svg.appendChild(group);
                                        group.appendChild(poly);
                                        group.appendChild(mytext);

                                        mytext.setAttribute('x', Number(recto.coords["points"][0]["x"]));
                                        mytext.setAttribute('y', Number(recto.coords["points"][0]["y"]) - 8);
                                        mytext.innerHTML = recto["devices"]["device_name"];

                                        group.setAttribute('id', 'del_id_' + recto["devices"]["d_id"]);
                                        poly.setAttribute('id', "x_" + recto.devices["d_id"]);
                                        poly.setAttribute('class', "existing_device");
                                        poly.setAttribute('d-class', "existing_poly");
                                        poly.setAttribute('points', coords.trim());
                                        poly.setAttribute('d-id', recto.devices["d_id"]);
                                        poly.setAttribute('device_status', recto.devices["device_status"]);
                                        poly.setAttribute('device_name', recto.devices["device_name"]);
                                        poly.setAttributeNS(null, 'cursor', 'pointer');
                                        poly.addEventListener('dblclick', ($event) => {
                                            clickedOnPoly(recto.devices["d_id"]);
                                        });
                                        draggablePolygon(document.getElementById("x_" + recto.devices["d_id"]));

                                        function draggablePolygon(polygon) {
                                            var points = polygon.points;
                                            // var svgRoot = $(polygon).closest("svg");
                                            // console.log(points)
                                            for (var i = 0; i < points.numberOfItems; i++) {
                                                (function (i) { // close over variables for drag call back
                                                    var point = points.getItem(i);
                                                    // console.log(point.x,point.y)
                                                    var handle = document.createElement("div");
                                                    handle.className = "handle poly_" + recto.devices["d_id"];
                                                    document.body.appendChild(handle);

                                                    // var base = svgRoot.position();
                                                    // center handles over polygon
                                                    // var cs = window.getComputedStyle(handle, null);
                                                    // base.left -= (parseInt(cs.width) + parseInt(cs.borderLeftWidth) + parseInt(cs.borderRightWidth)) / 2;
                                                    // base.top -= (parseInt(cs.height) + parseInt(cs.borderTopWidth) + parseInt(cs.borderBottomWidth)) / 2;
                                                    // console.log(point.x,point.y)
                                                    handle.style.left = -7 + point.x + 153 + "px";
                                                    handle.style.top = -7 + point.y + 131 + "px";
                                                    // console.log(base.left,base.top)
                                                    $(handle).draggable({
                                                        drag: function (event) {
                                                            setTimeout(function () { // jQuery apparently calls this *before* setting position, so defer
                                                                point.x = parseInt(handle.style.left) - (-7) - 153;
                                                                point.y = parseInt(handle.style.top) - (-7) - 131;
                                                                $("#save_col").show();
                                                            }, 0);
                                                        }
                                                    });
                                                    // console.log(point.x,point.y)
                                                }(i));
                                            }
                                        }
                                    }
                                });
                                // *******************************************
                                // $('.button').on('click', function () {
                                //     var del_id = $(this).attr('id');
                                //     $('#del_id_' + del_id).remove();
                                //     window.remove_device.push(del_id);
                                //     $('#devicelist option[device-id="' + del_id + '"]').prop('disabled', false);
                                // });
                                // ****************
                            }
                        });

                    }
                });
            }
        }

    });


    $("#device_cancel").click(function () {
        $("#device_col").hide();
        $("#shape_col").hide();
        $("#cancel_col").hide();
        $("#add_area").show();
        $("#save_col").hide();
        $("#add_col").show();
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
                                $.each(value["areas"], function (id, recto) {
                                    $('#devicelist option[device-id="' + recto['devices']['d_id'] + '"]').prop('disabled', true);
                                });
                                $('#devicelist option[value=""]').prop('disabled', true);
                                $('#devicelist option[value=""]').prop('selected', true);
                                for (var k = 0; k < remove_device.length; k++) {
                                    $('#devicelist option[device-id="' + remove_device[k] + '"]').prop('disabled', false);
                                }
                                // $("a.myClass").addClass("disabled");
                                // $("li.ctrl").removeClass("selected");
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
