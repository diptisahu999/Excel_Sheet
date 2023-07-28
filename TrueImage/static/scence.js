$(document).ready(function () {
    // new SlimSelect({
    //     select: '.appliances'
    // });
    $('#table_id').DataTable({
        processing: true,
        responsive: true,
        // serverSide: true,
        "ajax": { url: "/Scenes/getSceneName/", dataSrc: "" },
        "columns": [
            { "data": "scene_name" },
            { "data": "area.[].floor_name" },
            { "data": "area.[].area_name" },
            { "data": "area.[].sub_area_name" },
            { "data": "area.[].app_type_name" },
            { "data": "area.[].appliances[].device_name" },
            { "data": "area.[].appliances[].operation" },
            { "data": "area.[].appliances[].opr_value" },
            {
                "data": "id",
                render: function (data) {
                    return '<div class="switch-wrapper line-switch"><input type="checkbox" id="switchBox2"class="switch-input" checked><label for="switchBox2" class="switch-label"></label></div>';
                }
            },
            {
                "data": "id",
                render: function (data) {
                    return '<button id="' + data + '" class="updt_schedule"><i class="fas fa-edit"></i></button> <button id="' + data + '" class="dlt"><i class="fas fa-trash-alt"></i></button>';
                }
            }
        ]
    });
    // *********************************************************** delete scene
    $('#table_id tbody').on('click', '.dlt', function () {
        var id = $(this).attr("id");
        $.ajax({
            type: "POST",
            url: "/Scenes/deleteScene/",
            data: {
                "pk": id,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
            },
            success: function (data) {
                alert(data);
            }
        });
    });

    // ***********************************************************************************
    getData();
    function getData() {
        $.ajax({
            url: '/triggerAction/getArea/',
            dataType: 'json',
            type: 'GET',
            success: function (data) {
                // /*******************************************************Add Floor 
                window.jdata = data;
                $.each(data.areas, function (index, value) {
                    $("#floor").append("<option value='" + value.name + "' f-id='" + value.id + "'>" + value.name + "</option>");
                });
                // /*******************************************************On Change Floor
                $('#floor').on('change', function () {
                    var s_area = $(this).val();
                    for (var i = 0; i < data.areas.length; i++) {
                        if (data.areas[i].name == s_area) {
                            $('#area').html('<option value="">Select Area</option>');
                            $('#subarea').html('<option value="">Select Sub Area</option>');
                            $('#areadevice').html('<option value="">Select Appliances</option>');
                            $('#devicestatus').html('<option value="">Select Operation</option>');
                            $('#appliances').html('<option value="">Select Appliances</option>');
                            $.each(data.areas[i].departments, function (i, v) {
                                var op = "<option value='" + String(v.name) + "' a-id='" + v.id + "'>" + String(v.name) + "</option>";
                                $(op).appendTo("#area");
                            });
                        }
                    }
                });
                // /*******************************************************On Change Area
                $('#area').on('change', function () {
                    var s_dept = $(this).val();
                    var s_area = $("#floor").val();
                    for (var i = 0; i < data.areas.length; i++) {
                        if (data.areas[i].name == s_area) {
                            $.each(data.areas[i].departments, function (k, j) {
                                if (j.name == s_dept) {
                                    $('#subarea').html('<option value="">Select Sub Area</option>');
                                    $('#areadevice').html('<option value="">Select Appliances</option>');
                                    $.each(data.areas[i].departments[k].sub_area, function (l, m) {
                                        var op = "<option value='" + String(m.name) + "' sub-id='" + m.id + "'>" + String(m.name) + "</option>";
                                        $(op).appendTo("#subarea");
                                    });
                                }
                            });
                        }
                    }
                });
                // /*******************************************************On Change Area Devices
                $('#appliances').on('change', function () {
                    var device = $("#appliancetype").val();
                    $('#devicestatus').html('<option value="">Select Operation</option>');
                    if (device == "AC") {
                        var html = '';
                        html += "<option id='power' value='" + String("on") + "'>" + String("on") + "</option>";
                        html += "<option id='power' value='" + String("off") + "'>" + String("off") + "</option>";
                        html += "<option id='ac_temp' value='" + String("temprature ") + "'>" + String("temprature") + "</option>";
                        $(html).appendTo("#devicestatus");
                    }
                    if (device == "L" || device == "S" || device == "C") {
                        var html = '';
                        html += "<option id='power' value='" + String("on") + "'>" + String("on") + "</option>";
                        html += "<option id='power' value='" + String("off") + "'>" + String("off") + "</option>";
                        $(html).appendTo("#devicestatus");
                    }
                });
                // /*******************************************************On Change Area Devices Status      

                $('#subarea').on('change', function () {
                    $('#devicestatus').html('<option value="">Select Operation</option>');
                    $('#appliances').html('<option value="">Select Appliances</option>');
                });
                // /*******************************************************On Change Appliance type
                $('#appliancetype').on('change', function () {
                    var s_subarea = $("#subarea").val();
                    var s_dept = $("#area").val();
                    var s_area = $("#floor").val();
                    var s_appliancetype = $("#appliancetype").val();
                    for (var i = 0; i < data.areas.length; i++) {
                        if (data.areas[i].name == s_area) {
                            $.each(data.areas[i].departments, function (k, j) {
                                if (j.name == s_dept) {
                                    $.each(data.areas[i].departments[k].sub_area, function (l, m) {
                                        if (m.name == s_subarea) {
                                            var device = m.area_devices.split(",");
                                            $('#appliances').html('<option value="">Select Appliances</option>');
                                            $('#devicestatus').html('<option value="">Select Operations</option>');
                                            for (var j = 0; j < data.devices.length; j++) {
                                                for (var i = 0; i < device.length; i++) {
                                                    if (Number(device[i]) == data.devices[j].record_id) {
                                                        if (s_appliancetype == "AC" && data.devices[j].app_type == "AC") {
                                                            var op = "<option value='" + String(data.devices[j].device_name) + "' record-id='" + data.devices[j].record_id + "' app-type = '" + data.devices[j].app_type + "' device-type = '" + data.devices[j].device_type + "' device-id = '" + data.devices[j].device_id + "' channel-id = '" + data.devices[j].channel_id + "' status = '" + data.devices[j].device_status + "'>" + String(data.devices[j].device_name) + "</option>";
                                                            $(op).appendTo("#appliances");
                                                        }
                                                        if (s_appliancetype == "L" && data.devices[j].app_type == "L") {
                                                            var op = "<option value='" + String(data.devices[j].device_name) + "' record-id='" + data.devices[j].record_id + "' app-type = '" + data.devices[j].app_type + "' device-type = '" + data.devices[j].device_type + "' device-id = '" + data.devices[j].device_id + "' channel-id = '" + data.devices[j].channel_id + "' status = '" + data.devices[j].device_status + "'>" + String(data.devices[j].device_name) + "</option>";
                                                            $(op).appendTo("#appliances");
                                                        }
                                                        if (s_appliancetype == "S" && data.devices[j].app_type == "S") {
                                                            var op = "<option value='" + String(data.devices[j].device_name) + "' record-id='" + data.devices[j].record_id + "' app-type = '" + data.devices[j].app_type + "' device-type = '" + data.devices[j].device_type + "' device-id = '" + data.devices[j].device_id + "' channel-id = '" + data.devices[j].channel_id + "' status = '" + data.devices[j].device_status + "'>" + String(data.devices[j].device_name) + "</option>";
                                                            $(op).appendTo("#appliances");
                                                        }
                                                        if (s_appliancetype == "C" && data.devices[j].app_type == "C") {
                                                            var op = "<option value='" + String(data.devices[j].device_name) + "' record-id='" + data.devices[j].record_id + "' app-type = '" + data.devices[j].app_type + "' device-type = '" + data.devices[j].device_type + "' device-id = '" + data.devices[j].device_id + "' channel-id = '" + data.devices[j].channel_id + "' status = '" + data.devices[j].device_status + "'>" + String(data.devices[j].device_name) + "</option>";
                                                            $(op).appendTo("#appliances");

                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    }
                    $('.example').bsMultiSelect("Update");
                });


                // **************************************************************************************add more    
                window.d_id = 3;
                window.select = 1;
                $(".add-more").click(function () {
                    select++;
                    var html = '';
                    html += '<tr id="inputFormRow" class="someclass">';
                    html += '<td>';
                    html += '<select name="floor" id="floor_' + d_id + '" class="floor" floor-id="' + d_id + '">';
                    html += '<option value="">Select Floor</option>';
                    html += '</select>';
                    html += '<p id="floor_msg_' + d_id + '" style="color: red;"></p>';
                    html += '</td>';
                    html += '<td>';
                    html += '<select name="area" id="area_' + d_id + '" class="area" area-id="' + d_id + '">';
                    html += '<option value="">Select Area</option>';
                    html += '</select>';
                    html += '<p id="area_msg_' + d_id + '" style="color: red;"></p>';
                    html += '</td>';
                    html += '<td>';
                    html += '<select name="subarea" id="subarea_' + d_id + '" class="subarea" subarea-id="' + d_id + '">';
                    html += '<option value="">Select Sub Area</option>';
                    html += '</select>';
                    html += '<p id="subarea_msg_' + d_id + '" style="color: red;"></p>';
                    html += '</td>';
                    html += '<td>';
                    html += '<select name="appliancetype"  id="appliancetype_' + d_id + '" type-id="' + d_id + '">';
                    html += '<option value="">Appliances Type</option>';
                    html += '<option value="L">Light</option>';
                    html += '<option value="AC">AC</option>';
                    html += '<option value="S">Speaker</option>';
                    html += '<option value="C">Curtain</option>';
                    html += '</select>';
                    html += '<p id="appliancetype_msg_' + d_id + '" style="color: red;"></p>';
                    html += '</td>';
                    html += '<td>';
                    html += '<select name="appliances" multiple="multiple" id="appliances_' + d_id + '" app-id="' + d_id + '" >';
                    html += ' <option value="" disabled>Select Appliances</option>';
                    html += '</select>';
                    // html += '<select name="appliances" id="example" class="form-control example"  multiple="multiple" style="display: none;">';

                    // html += '</select>';
                    html += '<p id="appliances_msg_' + d_id + '" style="color: red;"></p>';
                    html += '</td>';
                    html += '<td>';
                    html += '<select name="devicestatus" id="devicestatus_' + d_id + '" op-id="' + d_id + '">';
                    html += '<option value="">Select Operation</option>';
                    html += '</select>';
                    html += ' <p id="devicestatus_msg_' + d_id + '" style="color: red;"></p>';
                    html += '</td>';
                    html += '<td>';
                    html += '<input type="text" name="devicevalue" id="devicevalue_' + d_id + '" value-id="' + d_id + '">';
                    html += ' <p id="devicevalue_msg_' + d_id + '" style="color: red;"></p>';
                    html += '</td>';
                    html += '<td>';
                    html += '<a id="removeRow" class="add-more" href="#"><i class="fa fa-trash" aria-hidden="true"></i></a>';
                    html += '</td>';
                    html += '</tr>';
                    $('table.scene_table > tbody > tr:last').after(html);

                    // SlimSelect({
                    //     select: '.appliance'
                    //   });
                    $('.example').bsMultiSelect("UpdateAppearance");



                    $.each(jdata.areas, function (index, value) {
                        $("#floor_" + d_id).append("<option value='" + value.name + "' f-id='" + value.id + "'>" + value.name + "</option>");
                    });
                    // ***************************************************************************************************
                    $("select[name='floor']").change(function () {
                        var floorId = $(this).attr("floor-id");
                        var floor = $('#floor_' + floorId).find(":selected").text();
                        for (var i = 0; i < jdata.areas.length; i++) {
                            if (jdata.areas[i].name == floor) {
                                $('#area_' + floorId).html('<option value="">Select Area</option>');
                                $('#subarea_' + floorId).html('<option value="">Select Sub Area</option>');
                                $('#devicestatus_' + floorId).html('<option value="">Select Operation</option>');
                                $('#appliances_' + floorId).html('<option value="">Select Appliances</option>');
                                $.each(jdata.areas[i].departments, function (i, v) {
                                    var op = "<option value='" + String(v.name) + "'  a-id='" + v.id + "'>" + String(v.name) + "</option>";
                                    $(op).appendTo("#area_" + floorId);
                                });
                            }
                        }
                    });
                    // *******************************************************************************************************
                    $("select[name='area']").change(function () {
                        var areaId = $(this).attr("area-id");
                        var floor = $('#floor_' + areaId).find(":selected").text();
                        var area = $('#area_' + areaId).find(":selected").text();
                        for (var i = 0; i < jdata.areas.length; i++) {
                            if (jdata.areas[i].name == floor) {
                                $.each(jdata.areas[i].departments, function (k, j) {
                                    if (j.name == area) {
                                        $('#subarea_' + areaId).html('<option value="">Select Sub Area</option>');
                                        $('#areadevice_' + areaId).html('<option value="">Select Appliances</option>');
                                        $.each(jdata.areas[i].departments[k].sub_area, function (l, m) {
                                            var op = "<option value='" + String(m.name) + "' sub-id='" + m.id + "'>" + String(m.name) + "</option>";
                                            $(op).appendTo("#subarea_" + areaId);
                                        });
                                    }
                                });
                            }
                        }
                    });
                    // ****************************************************************************************************************
                    $("select[name='appliancetype']").change(function () {
                        var appliancetypeID = $(this).attr("type-id");
                        var s_subarea = $("#subarea_" + appliancetypeID).val();
                        var s_dept = $("#area_" + appliancetypeID).val();
                        var s_area = $("#floor_" + appliancetypeID).val();
                        var s_appliancetype = $(this).val();
                        for (var i = 0; i < data.areas.length; i++) {
                            if (data.areas[i].name == s_area) {
                                $.each(data.areas[i].departments, function (k, j) {
                                    if (j.name == s_dept) {
                                        // alert('hello1');
                                        $.each(data.areas[i].departments[k].sub_area, function (l, m) {
                                            if (m.name == s_subarea) {
                                                var device = m.area_devices.split(",");
                                                // $('#appliances_' + appliancetypeID).html('<option value="" disabled>Select Appliances</option>');
                                                $('#devicestatus_' + appliancetypeID).html('<option value="" disabled>Select Operations</option>');

                                                for (var j = 0; j < data.devices.length; j++) {
                                                    for (var i = 0; i < device.length; i++) {
                                                        if (Number(device[i]) == data.devices[j].record_id) {
                                                            if (s_appliancetype == "AC" && data.devices[j].app_type == "AC") {
                                                                var op = "<option value='" + String(data.devices[j].device_name) + "' record-id='" + data.devices[j].record_id + "' app-type = '" + data.devices[j].app_type + "' device-type = '" + data.devices[j].device_type + "' device-id = '" + data.devices[j].device_id + " ' channel-id = '" + data.devices[j].channel_id + "' status = '" + data.devices[j].device_status + "'>" + String(data.devices[j].device_name) + "</option>";
                                                                $(op).appendTo("#appliances_" + appliancetypeID);
                                                            }
                                                            if (s_appliancetype == "L" && data.devices[j].app_type == "L") {
                                                                var op = "<option value='" + String(data.devices[j].device_name) + "'  record-id='" + data.devices[j].record_id + "' app-type = '" + data.devices[j].app_type + "' device-type = '" + data.devices[j].device_type + "' device-id = '" + data.devices[j].device_id + "' channel-id = '" + data.devices[j].channel_id + "' status = '" + data.devices[j].device_status + "'>" + String(data.devices[j].device_name) + "</option>";
                                                                $(op).appendTo("#appliances_" + appliancetypeID);
                                                            }
                                                            if (s_appliancetype == "S" && data.devices[j].app_type == "S") {
                                                                var op = "<option value='" + String(data.devices[j].device_name) + "'  record-id='" + data.devices[j].record_id + "' app-type = '" + data.devices[j].app_type + "' device-type = '" + data.devices[j].device_type + "' device-id = '" + data.devices[j].device_id + "' channel-id = '" + data.devices[j].channel_id + "' status = '" + data.devices[j].device_status + "'>" + String(data.devices[j].device_name) + "</option>";
                                                                $(op).appendTo("#appliances_" + appliancetypeID);
                                                            }
                                                            if (s_appliancetype == "C" && data.devices[j].app_type == "C") {
                                                                var op = "<option value='" + String(data.devices[j].device_name) + "'  record-id='" + data.devices[j].record_id + "' app-type = '" + data.devices[j].app_type + "' device-type = '" + data.devices[j].device_type + "' device-id = '" + data.devices[j].device_id + "' channel-id = '" + data.devices[j].channel_id + "' status = '" + data.devices[j].device_status + "'>" + String(data.devices[j].device_name) + "</option>";
                                                                $(op).appendTo("#appliances_" + appliancetypeID);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        });
                                        // alert('hello');
                                        // SlimSelect({
                                        //     select: '#appliance_'+ appliancetypeID
                                        //   });
                                    }
                                });
                            }
                        }
                    });
                    // ******************************************************************************
                    $("select[name='subarea']").change(function () {
                        var subId = $(this).attr("subarea-id");
                        $('#devicestatus_' + subId).html('<option value="">Select Operation</option>');
                        $('#appliances_' + subId).html('<option value="">Select Appliances</option>');
                    });

                    // ***********************************************************************************************************
                    $("select[name='appliances']").change(function () {
                        var appId = $(this).attr("app-id");
                        var device = $("#appliancetype_" + appId).val();
                        $('#devicestatus_' + appId).html('<option value="">Select Operation</option>');
                        if (device == "AC") {
                            var html = '';
                            html += "<option id='power' value='" + String("on") + "'>" + String("on") + "</option>";
                            html += "<option id='power' value='" + String("off") + "'>" + String("off") + "</option>";
                            html += "<option id='ac_temp' value='" + String("temprature ") + "'>" + String("temprature") + "</option>";
                            $(html).appendTo("#devicestatus_" + appId);
                        }
                        if (device == "L" || device == "S" || device == "C") {
                            var html = '';
                            html += "<option id='power' value='" + String("on") + "'>" + String("on") + "</option>";
                            html += "<option value='" + String("off ") + "'>" + String("off ") + "</option>";
                            $(html).appendTo("#devicestatus_" + appId);
                        }

                    });

                    // ***********************************************************************************************************
                    d_id++;
                });
            }
        })
    }

    $(document).on('click', '#removeRow', function () {
        $(this).closest('#inputFormRow').remove();
    });
    $("#scene_create").click(function (e) {//n
        $("#stbl").show();
        $(".scene_table").show();
        $("#sub").show();
    });
    $("#cancel").click(function (e) {
        $('.someclass').remove();
        $("#stbl").hide();
        $(".scene_table").hide();
        $("#sub").hide();
    });
    // **************************************************************************************create scene
    $("#submit_scene").click(function (e) {
        e.preventDefault();
        $("#sceneform").validate({
            rules: {
                scenename: "required",
                floor:"required",
                area:"required",
                subarea:"required",
                appliancetype:"required",
                appliances:"required",
                devicestatus:"required",
                devicevalue:"required"
            },
            messages: {
                scenename: "Please enter scene name",
                floor:"Please select floor",
                area:"Please select area",
                subarea:"Please select sub area",
                appliancetype:"Please select appliance type",
                appliances:"Please select appliances",
                devicestatus:"Please select operation",
                devicevalue:"Please enter value"
            }
        });
        
        // $('.floor').each(function() {
        //     $(this).rules("add", 
        //     {
        //         required: true,
        //         messages: {
        //             required: "Name is required",
        //         }
        //     });
        // });
        // $("#sceneform").validate();
        $("#sceneform").valid();
        
        var mtriggername = $("#scenename").val();
        var mfloor = $("#floor").val();
        var marea = $("#area").val();
        var msubarea = $("#subarea").val();
        var mappliancetype = $("#appliancetype").val();
        var mappliances = $("#appliances").val();
        var mdevicestatus = $("#devicestatus").val();
        var mdevicevalue = $("#devicevalue").val();
        var same = 1;
        $.ajax({
            url: '/triggerAction/getScene/',
            dataType: 'json',
            type: 'GET',
            success: function (data) {
                $.each(data, function (index, value) {
                    if (value.scene_name == mtriggername) {
                        same = 0;
                    }
                });
                if (same == 0) {
                    alert("scene name already exist.!")
                }
                else {
                    // ***************
                    if (mtriggername != "" && mfloor != "" && marea != "" && msubarea != "" && mappliancetype != "" && mappliances != "" && mdevicestatus != "" && mdevicevalue != "") {
                        var fid;
                        fid = $("#floor option:selected").map(function () {
                            return $(this).attr("f-id");
                        });
                        var sceneName = $("#scenename").val();
                        var aid;
                        aid = $("#area option:selected").map(function () {
                            return $(this).attr("a-id");
                        });
                        var subid;
                        subid = $("#subarea option:selected").map(function () {
                            return $(this).attr("sub-id");
                        });
                        var len = window.d_id;
                        var opr = $("#devicestatus").val();
                        var opr_value = $("#devicevalue").val();
                        var appliances = [];
                        appliances = $("#appliances option:selected").map(function () {
                            var rid = Number($(this).attr("record-id"));
                            var did = $(this).attr("device-id");
                            var cid = $(this).attr("channel-id");
                            var dname = $(this).val();
                            var apptype = $(this).attr("app-type");
                            var dtype = $(this).attr("device-type");
                            dict = {
                                "record_id": Number(rid),
                                "device_name": dname,
                                "device_type": dtype,
                                "app_type": apptype,
                                "device_id": String(did),
                                "channel_id": String(cid),
                                "operation": opr,
                                "opr_value": opr_value
                            }
                            return dict
                        }).get();
                        var app_type = $("#appliancetype").val();
                        var area = [{ "floor": fid[0], "area": aid[0], "sub_area": subid[0], "app_type": app_type, "appliances": appliances }];
                        var scenes = [{ "id": 1, "scene_name": sceneName, "status": "E", "area": area }];

                        var applianceaddmore = [];
                        for (i = 3; i < len; i++) {                            
                            if ($('#floor_' + i).val() != null && $('#area_' + i).val() != null && $('#subarea_' + i).val() != null) {
                                // *********************

                                if ($("#floor_" + i).val() != "") {
                                    document.getElementById("floor_msg_" + i).innerHTML = "";
                                } else {
                                    document.getElementById("floor_msg_" + i).innerHTML = "Please select floor.!";
                                }
                                if ($("#area_" + i).val() != "") {
                                    document.getElementById("area_msg_" + i).innerHTML = "";
                                } else {
                                    document.getElementById("area_msg_" + i).innerHTML = "Please select area.!";
                                }
                                if ($("#subarea_" + i).val() != "") {
                                    document.getElementById("subarea_msg_" + i).innerHTML = "";
                                } else {
                                    document.getElementById("subarea_msg_" + i).innerHTML = "Please select sub area.!";
                                }
                                if ($("#appliancetype_" + i).val() != "") {
                                    document.getElementById("appliancetype_msg_" + i).innerHTML = "";
                                } else {
                                    document.getElementById("appliancetype_msg_" + i).innerHTML = "Please select appliance type.!";
                                }
                                if ($("#appliances_" + i).val() != "") {
                                    document.getElementById("appliances_msg_" + i).innerHTML = "";
                                } else {
                                    document.getElementById("appliances_msg_" + i).innerHTML = "Please select appliances.!";
                                }
                                if ($("#devicestatus_" + i).val() != "") {
                                    document.getElementById("devicestatus_msg_" + i).innerHTML = "";
                                } else {
                                    document.getElementById("devicestatus_msg_" + i).innerHTML = "Please select operation.!";
                                }
                                if ($("#devicevalue_" + i).val() != "") {
                                    document.getElementById("devicevalue_msg_" + i).innerHTML = "";
                                } else {
                                    document.getElementById("devicevalue_msg_" + i).innerHTML = "Please enter device value.!";
                                }
                                // *********************

                                if ($('#floor_' + i).val() != "" && $('#area_' + i).val() != "" && $('#subarea_' + i).val() != "" && $("#appliancetype_" + i).val() != "" && $("#appliances_" + i).val() != "" && $("#devicestatus_" + i).val() != "" && $("#devicevalue_" + i).val() != "") {
                                    var status = $("#devicestatus_" + i).val();
                                    var op_value = $("#devicevalue_" + i).val();
                                    var afid;
                                    afid = $("#floor_" + i + " option:selected").map(function () {
                                        return $(this).attr("f-id");
                                    });
                                    var aaid;
                                    aaid = $("#area_" + i + " option:selected").map(function () {
                                        return $(this).attr("a-id");
                                    });
                                    var asubid;
                                    asubid = $("#subarea_" + i + " option:selected").map(function () {
                                        return $(this).attr("sub-id");
                                    });
                                    applianceaddmore = $("#appliances_" + i + " option:selected").map(function () {
                                        var rid = Number($(this).attr("record-id"));
                                        var did = $(this).attr("device-id");
                                        var cid = $(this).attr("channel-id");
                                        var dname = $(this).val();
                                        var apptype = $(this).attr("app-type");
                                        var dtype = $(this).attr("device-type");
                                        dict = {
                                            "record_id": Number(rid),
                                            "device_name": dname,
                                            "device_type": dtype,
                                            "app_type": apptype,
                                            "device_id": String(did),
                                            "channel_id": String(cid),
                                            "operation": status,
                                            "opr_value": op_value
                                        }
                                        return dict
                                    }).get();
                                    area.push({
                                        "floor": afid[0],
                                        "area": aaid[0],
                                        "sub_area": asubid[0],
                                        "app_type": "C",
                                        "appliances": applianceaddmore
                                    })

                                } else {
                                    console.log("validate");
                                }
                            } else {
                                console.log("dsa");
                            }
                        }
                        console.log(scenes);
                        $.ajax({
                            url: '/Scenes/addScene/',
                            dataType: 'json',
                            type: 'POST',
                            data: { "data": JSON.stringify(scenes) },
                            success: function (data) {
                                $("#scenename").val("");
                                $("#floor").val("");
                                $("#area").val("");
                                $("#subarea").val("");
                                document.getElementById("appliances").innerHTML = "";//n
                                $("#appliancetype").val("");
                                $("#devicestatus").val("");
                                $("#devicevalue").val("");
                                $('.someclass').remove();//n
                                $("#stbl").hide();//n
                                $(".scene_table").hide();//n
                                $("#sub").hide();//n
                                console.log(data);
                            }
                        });

                    }
                    else {
                        console.log("dont know");
                    }
                }
            }
        })
        return false;
    });

});

