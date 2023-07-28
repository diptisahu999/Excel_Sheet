$(document).ready(function () {
    $("#craete_trigger").show();//n


    $(function () {
        var dtToday = new Date();

        var month = dtToday.getMonth() + 1;
        var day = dtToday.getDate();
        var year = dtToday.getFullYear();
        if (month < 10)
            month = '0' + month.toString();
        if (day < 10)
            day = '0' + day.toString();

        var maxDate = year + '-' + month + '-' + day;
        // alert(maxDate);
        $('#scheduledate').attr('min', maxDate);
        $('#up_scheduledate').attr('min', maxDate);
    });
    // ********************************************************** Event Listing
    $('#table_id').DataTable({
        processing: true,
        responsive: true,
        "ajax": { url: "/triggerAction/getTriggerName/", dataSrc: "" },
        "columns": [
            { "data": "name" },
            { "data": "trigger_type_name" },
            { "data": "area.floor_name" },
            { "data": "area.area_name" },
            { "data": "area.sub_area_name" },
            { "data": "area.app_type_name" },
            { "data": "trigger.device_type_name" },
            { "data": "trigger.device_name" },
            { "data": "trigger.app_type_name" },
            { "data": "trigger.opreration" },
            { "data": "trigger.opr_value" },
            { "data": "scene_name" },
            {
                "data": "id",
                render: function (data) {
                    return '<button id="' + data + '" class="updt_event"><i class="fas fa-edit"></i></button> <button id="' + data + '" class="dlt"><i class="fas fa-trash-alt"></i></button>';
                    // '<button id="' + data + '" class="dlt">Delete</button> <button id="' + data + '" class="updt_event">Update</button>';
                }
            }
        ]
    });
    // ********************************************************** Delete Event
    $('#table_id tbody').on('click', '.dlt', function () {
        var id = $(this).attr("id");
        $.ajax({
            type: "POST",
            url: "/triggerAction/deleteTrigger/",
            data: {
                "pk": id,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
            },
            success: function (data) {
                console.log(data);
            }
        });
    });
    // ********************************************************** update Event
    $('#table_id tbody').on('click', '.updt_event', function () {
        // $("#ttable").hide();
        document.getElementById("up_triggername").readOnly = true;
        $("#stb").hide();
        $("#up_schedule_table").hide();
        $("#craete_trigger").hide();//n
        $("#updt_event_table").show();
        $("#etable").show();
        $("#ttable").hide();//n
        $("#tbl").hide();//n
        $("#event_table").hide();
        $("#schedule_table").hide();
        $("#scene").hide();
        $("#scene_msg").hide();
        var id = $(this).attr("id");
        $.ajax({
            url: '/triggerAction/getActionTrigger/',
            dataType: 'json',
            type: 'GET',
            cache: false,
            success: function (data) {
                $.each(data, function (i, v) {
                    if (v.id == id) {
                        $("#upid").val(id);
                        $("#up_triggername").val(v.name);
                        $.ajax({
                            url: '/triggerAction/getArea/',
                            dataType: 'json',
                            type: 'GET',
                            success: function (data) {
                                $('#up_floor').html('<option value="" >Select Floor</option>');
                                $.each(data.areas, function (index, value) {
                                    $("#up_floor").append("<option value='" + value.name + "' f-id='" + value.id + "'>" + value.name + "</option>");
                                    $("#up_floor option[f-id='" + Number(v.area.floor) + "']").prop("selected", true);
                                    var s_a = $("#up_floor option[f-id='" + Number(v.area.floor) + "']").val();

                                    for (var i = 0; i < data.areas.length; i++) {
                                        if (data.areas[i].name == s_a) {
                                            $('#up_area').html('<option value="">Select Area</option>');
                                            $.each(data.areas[i].departments, function (i, j) {
                                                var op = "<option value='" + String(j.name) + "' a-id='" + j.id + "'>" + String(j.name) + "</option>";
                                                $(op).appendTo("#up_area");
                                                $("#up_area option[a-id='" + Number(v.area.area) + "']").prop("selected", true);

                                            });
                                        }
                                    }
                                    var s_dep = $("#up_area option[a-id='" + Number(v.area.area) + "']").val();
                                    var s_ar = $("#up_floor").val();
                                    for (var i = 0; i < data.areas.length; i++) {
                                        if (data.areas[i].name == s_ar) {
                                            $.each(data.areas[i].departments, function (k, j) {
                                                if (j.name == s_dep) {
                                                    $('#up_subarea').html('<option value="">Select Sub Area</option>');
                                                    $.each(data.areas[i].departments[k].sub_area, function (l, m) {
                                                        var op = "<option value='" + String(m.name) + "' sub-id='" + m.id + "'>" + String(m.name) + "</option>";
                                                        $(op).appendTo("#up_subarea");
                                                        $("#up_subarea option[sub-id='" + Number(v.area.sub_area) + "']").prop("selected", true);
                                                    });
                                                }
                                            });
                                        }
                                    }

                                    $("#up_appliancetype option[value='" + v.area.app_type + "']").prop("selected", true);

                                    var s_subare = $("#up_subarea").val();
                                    var s_de = $("#up_area").val();
                                    var s_are = $("#up_floor").val();
                                    var s_appliancetyp = $("#up_appliancetype").val();
                                    console.log(s_subare, s_de, s_are, s_appliancetyp)
                                    for (var i = 0; i < data.areas.length; i++) {
                                        if (data.areas[i].name == s_are) {
                                            $.each(data.areas[i].departments, function (k, j) {
                                                if (j.name == s_de) {
                                                    $.each(data.areas[i].departments[k].sub_area, function (l, m) {
                                                        if (m.name == s_subare) {
                                                            var device = m.area_devices.split(",");
                                                            $('#up_appliances').html('<option value="">Select Appliances</option>');
                                                            for (var j = 0; j < data.devices.length; j++) {
                                                                for (var i = 0; i < device.length; i++) {
                                                                    if (Number(device[i]) == data.devices[j].record_id) {
                                                                        if (s_appliancetyp == "AC" && data.devices[j].app_type == "AC") {
                                                                            var op = "<option value='" + String(data.devices[j].device_name) + "' record-id = '" + data.devices[j].record_id + "' app-type = '" + data.devices[j].app_type + "' device-type = '" + data.devices[j].device_type + "' device-id = '" + data.devices[j].device_id + "' channel-id = '" + data.devices[j].channel_id + "' status = '" + data.devices[j].device_status + "'>" + String(data.devices[j].device_name) + "</option>";
                                                                            $(op).appendTo("#up_appliances");
                                                                            $("#up_appliances option[value='" + v.trigger.device_name + "']").prop("selected", true);
                                                                        }
                                                                        if (s_appliancetyp == "L" && data.devices[j].app_type == "L") {
                                                                            var op = "<option value='" + String(data.devices[j].device_name) + "' record-id = '" + data.devices[j].record_id + "' app-type = '" + data.devices[j].app_type + "' device-type = '" + data.devices[j].device_type + "' device-id = '" + data.devices[j].device_id + "' channel-id = '" + data.devices[j].channel_id + "' status = '" + data.devices[j].device_status + "'>" + String(data.devices[j].device_name) + "</option>";
                                                                            $(op).appendTo("#up_appliances");
                                                                            $("#up_appliances option[value='" + v.trigger.device_name + "']").prop("selected", true);
                                                                        }
                                                                        if (s_appliancetyp == "S" && data.devices[j].app_type == "S") {
                                                                            var op = "<option value='" + String(data.devices[j].device_name) + "' record-id = '" + data.devices[j].record_id + "' app-type = '" + data.devices[j].app_type + "' device-type = '" + data.devices[j].device_type + "' device-id = '" + data.devices[j].device_id + "' channel-id = '" + data.devices[j].channel_id + "' status = '" + data.devices[j].device_status + "'>" + String(data.devices[j].device_name) + "</option>";
                                                                            $(op).appendTo("#up_appliances");
                                                                            $("#up_appliances option[value='" + v.trigger.device_name + "']").prop("selected", true);
                                                                        }
                                                                        if (s_appliancetyp == "C" && data.devices[j].app_type == "C") {
                                                                            var op = "<option value='" + String(data.devices[j].device_name) + "' record-id = '" + data.devices[j].record_id + "' app-type = '" + data.devices[j].app_type + "' device-type = '" + data.devices[j].device_type + "' device-id = '" + data.devices[j].device_id + "' channel-id = '" + data.devices[j].channel_id + "' status = '" + data.devices[j].device_status + "'>" + String(data.devices[j].device_name) + "</option>";
                                                                            $(op).appendTo("#up_appliances");
                                                                            $("#up_appliances option[value='" + v.trigger.device_name + "']").prop("selected", true);
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

                                    $("#up_devicevalue").val(v.trigger.opr_value);
                                    $('#up_devicestatus').html('<option value="">Select Operation</option>');
                                    if (s_appliancetyp == "AC") {
                                        var html = '';
                                        html += "<option id='power' value='" + String("on") + "'>" + String("on") + "</option>";
                                        html += "<option id='power' value='" + String("off") + "'>" + String("off") + "</option>";
                                        html += "<option id='ac_temp' value='" + String("temprature ") + "'>" + String("temprature") + "</option>";
                                        $(html).appendTo("#up_devicestatus");
                                        $("#up_devicestatus option[value='" + v.trigger.opreration + "']").prop("selected", true);
                                    }
                                    if (s_appliancetyp == "L" || s_appliancetyp == "S" || s_appliancetyp == "C") {
                                        var html = '';
                                        html += "<option id='power' value='" + String("on") + "'>" + String("on") + "</option>";
                                        html += "<option id='power' value='" + String("off") + "'>" + String("off") + "</option>";
                                        $(html).appendTo("#up_devicestatus");
                                        $("#up_devicestatus option[value='" + v.trigger.opreration + "']").prop("selected", true);
                                    }


                                    $.ajax({
                                        url: '/triggerAction/getScene/',
                                        dataType: 'json',
                                        type: 'GET',
                                        success: function (data) {
                                            $('#up_scene').html('<option value="">Select Scene</option>');
                                            $.each(data, function (index, value) {
                                                $("#up_scene").append("<option value='" + value.id + "' f-id='" + value.id + "'>" + value.scene_name + "</option>");
                                                $("#up_scene option[f-id='" + Number(v.scene) + "']").prop("selected", true);
                                            });
                                        }
                                    });

                                });
                            }
                        });
                        console.log(v.area.floor);
                    }
                });
            }
        });
    });

    // *********************************************************schedule listing
    $('#schedule-table').DataTable({
        processing: true,
        "ajax": { url: "/triggerAction/getScheduleTrigger/", dataSrc: "" },
        "columns": [
            { "data": "name" },
            {
                "data": "trigger.occurance",
                render: function (data) {
                    if (data == "M") {
                        return "Monthly";
                    }
                    if (data == "O") {
                        return "Once";
                    }
                    if (data == "D") {
                        return "Daily";
                    }
                    if (data == "W") {
                        return "Weekly";
                    }
                }
            },
            { "data": "trigger.time" },
            { "data": "scene_name" },
            {
                "data": "id",
                render: function (data) {
                    // <button id="' + data + '" class="dlt">Delete</button>                     
                    return '<button id="' + data + '" class="updt_schedule"><i class="fas fa-edit"></i></button> <button id="' + data + '" class="dlt"><i class="fas fa-trash-alt"></i></button>';
                }
            }

        ]
    });
    // ********************************************************** Delete Schedule
    $('#schedule-list tbody').on('click', '.dlt', function () {
        var id = $(this).attr("id");
        $.ajax({
            type: "POST",
            url: "/triggerAction/deleteTrigger/",
            data: {
                "pk": id,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
            },
            success: function (data) {
                console.log(data);
            }
        });
    });
    // ********************************************************** Update Schedule
    $('#schedule-list tbody').on('click', '.updt_schedule', function () {
        document.getElementById("up_schedule_triggername").readOnly = true;
        $("#ttable").hide();
        $("#updt_event_table").hide();
        $("#etable").hide();
        $("#stb").show();
        $("#up_schedule_table").show();
        $("#craete_trigger").hide();//n
        $("#tbl").hide();//n
        $("#event_table").hide();
        $("#schedule_table").hide();
        $("#scene").hide();
        $("#scene_msg").hide();
        var sid = $(this).attr("id");
        $.ajax({
            url: '/triggerAction/getScheduleTrigger/',
            dataType: 'json',
            type: 'GET',
            cache: false,
            success: function (data) {
                $.each(data, function (i, k) {
                    if (k.id == sid) {
                        $("#scheduleupid").val(k.id);
                        $("#up_schedule_triggername").val(k.name);
                        // console.log(k.trigger.occurance);
                        $("#sgroup label input[name=schedules][value='" + String(k.trigger.occurance) + "']").parent().button('toggle');
                        if (k.trigger.occurance == "O") {
                            $("#up-timepicker-12-hr").val(k.trigger.time);
                            var date = k.trigger.date;
                            l_date = date.split('/');
                            s_date = l_date[2] + '-' + l_date[1] + '-' + l_date[0];
                            console.log(s_date);
                            $("#up_scheduledate").val(s_date);
                        }
                        if (k.trigger.occurance == "D") {
                            $("#up-timepicker-12-hr").val(k.trigger.time);
                        }
                        if (k.trigger.occurance == "W") {
                            $("#up_days option[value='" + k.trigger.day + "']").prop("selected", true);
                            $("#up-timepicker-12-hr").val(k.trigger.time);
                        }
                        if (k.trigger.occurance == "M") {
                            $("#up-timepicker-12-hr").val(k.trigger.time);
                        }
                        console.log(k.scene);
                        $.ajax({
                            url: '/triggerAction/getScene/',
                            dataType: 'json',
                            type: 'GET',
                            success: function (data) {
                                $('#up_schedule_scene').html('<option value="">Select Scene</option>');
                                $.each(data, function (index, value) {
                                    $("#up_schedule_scene").append("<option value='" + value.id + "' f-id='" + value.id + "'>" + value.scene_name + "</option>");
                                    $("#up_schedule_scene option[f-id='" + Number(k.scene) + "']").prop("selected", true);
                                });
                            }
                        });
                    }
                })
            }
        });
    });
    // ***********************************************************************************
    getData()
    getScene();
    function getScene() {
        $.ajax({
            url: '/triggerAction/getScene/',
            dataType: 'json',
            type: 'GET',
            success: function (data) {
                console.log(data)
                $.each(data, function (index, value) {
                    console.log(value.scene_name);
                    $("#scene").append("<option value='" + value.id + "' f-id='" + value.id + "'>" + value.scene_name + "</option>");
                });
            }
        });
    }
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
                // *******update event
                $('#up_floor').on('change', function () {
                    var s_area = $(this).val();
                    for (var i = 0; i < data.areas.length; i++) {
                        if (data.areas[i].name == s_area) {
                            $('#up_area').html('<option value="">Select Area</option>');
                            $('#up_subarea').html('<option value="">Select Sub Area</option>');
                            $('#up_areadevice').html('<option value="">Select Appliances</option>');
                            $('#up_devicestatus').html('<option value="">Select Operation</option>');
                            $('#up_appliances').html('<option value="">Select Appliances</option>');
                            $.each(data.areas[i].departments, function (i, v) {
                                var op = "<option value='" + String(v.name) + "' a-id='" + v.id + "'>" + String(v.name) + "</option>";
                                $(op).appendTo("#up_area");
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
                // *******update event
                $('#up_area').on('change', function () {
                    var s_dept = $(this).val();
                    var s_area = $("#up_floor").val();
                    for (var i = 0; i < data.areas.length; i++) {
                        if (data.areas[i].name == s_area) {
                            $.each(data.areas[i].departments, function (k, j) {
                                if (j.name == s_dept) {
                                    $('#up_subarea').html('<option value="">Select Sub Area</option>');
                                    $('#up_areadevice').html('<option value="">Select Appliances</option>');
                                    $.each(data.areas[i].departments[k].sub_area, function (l, m) {
                                        var op = "<option value='" + String(m.name) + "' sub-id='" + m.id + "'>" + String(m.name) + "</option>";
                                        $(op).appendTo("#up_subarea");
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
                    if (device == "L") {
                        var html = '';
                        html += "<option id='power' value='" + String("on") + "'>" + String("on") + "</option>";
                        html += "<option id='power' value='" + String("off") + "'>" + String("off") + "</option>";
                        $(html).appendTo("#devicestatus");
                    }
                    if (device == "S" || device == "C") {
                        var html = '';
                        html += "<option id='power' value='" + String("on") + "'>" + String("on") + "</option>";
                        html += "<option id='power' value='" + String("off") + "'>" + String("off") + "</option>";
                        $(html).appendTo("#devicestatus");
                    }
                });
                // ************** update event
                $('#up_appliances').on('change', function () {
                    var device = $("#up_appliancetype").val();
                    $('#up_devicestatus').html('<option value="">Select Operation</option>');
                    if (device == "AC") {
                        var html = '';
                        html += "<option id='power' value='" + String("on") + "'>" + String("on") + "</option>";
                        html += "<option id='power' value='" + String("off") + "'>" + String("off") + "</option>";
                        html += "<option id='ac_temp' value='" + String("temprature ") + "'>" + String("temprature") + "</option>";
                        $(html).appendTo("#up_devicestatus");
                    }
                    if (device == "L") {
                        var html = '';
                        html += "<option id='power' value='" + String("on") + "'>" + String("on") + "</option>";
                        html += "<option id='power' value='" + String("off") + "'>" + String("off") + "</option>";
                        $(html).appendTo("#up_devicestatus");
                    }
                    if (device == "S" || device == "C") {
                        var html = '';
                        html += "<option id='power' value='" + String("on") + "'>" + String("on") + "</option>";
                        html += "<option id='power' value='" + String("off") + "'>" + String("off") + "</option>";
                        $(html).appendTo("#up_devicestatus");
                    }
                });
                $('#appliancetype').on('change', function () {
                    $('#devicestatus').html('<option value="">Select Operation</option>');
                });
                // /*******************************************************On Change Appliance type
                $('#appliancetype').on('change', function () {
                    var s_subarea = $("#subarea").val();
                    var s_dept = $("#area").val();
                    var s_area = $("#floor").val();
                    var s_appliancetype = $("#appliancetype").val();
                    console.log(s_subarea, s_dept, s_area, s_appliancetype)
                    for (var i = 0; i < data.areas.length; i++) {
                        if (data.areas[i].name == s_area) {
                            $.each(data.areas[i].departments, function (k, j) {
                                if (j.name == s_dept) {
                                    $.each(data.areas[i].departments[k].sub_area, function (l, m) {
                                        if (m.name == s_subarea) {
                                            var device = m.area_devices.split(",");
                                            $('#appliances').html('<option value="">Select Appliances</option>');
                                            $('#devicestatus').html('<option value="">Select Operations</option>');
                                            $("#temp").hide();
                                            $("#set_temp").hide();
                                            $("#sp").hide();
                                            for (var j = 0; j < data.devices.length; j++) {
                                                for (var i = 0; i < device.length; i++) {
                                                    if (Number(device[i]) == data.devices[j].record_id) {
                                                        if (s_appliancetype == "AC" && data.devices[j].app_type == "AC") {
                                                            var op = "<option value='" + String(data.devices[j].device_name) + "' record-id = '" + data.devices[j].record_id + "' app-type = '" + data.devices[j].app_type + "' device-type = '" + data.devices[j].device_type + "' device-id = '" + data.devices[j].device_id + "' channel-id = '" + data.devices[j].channel_id + "' status = '" + data.devices[j].device_status + "'>" + String(data.devices[j].device_name) + "</option>";
                                                            $(op).appendTo("#appliances");
                                                        }
                                                        if (s_appliancetype == "L" && data.devices[j].app_type == "L") {
                                                            var op = "<option value='" + String(data.devices[j].device_name) + "' record-id = '" + data.devices[j].record_id + "' app-type = '" + data.devices[j].app_type + "' device-type = '" + data.devices[j].device_type + "' device-id = '" + data.devices[j].device_id + "' channel-id = '" + data.devices[j].channel_id + "' status = '" + data.devices[j].device_status + "'>" + String(data.devices[j].device_name) + "</option>";
                                                            $(op).appendTo("#appliances");
                                                        }
                                                        if (s_appliancetype == "S" && data.devices[j].app_type == "S") {
                                                            var op = "<option value='" + String(data.devices[j].device_name) + "' record-id = '" + data.devices[j].record_id + "' app-type = '" + data.devices[j].app_type + "' device-type = '" + data.devices[j].device_type + "' device-id = '" + data.devices[j].device_id + "' channel-id = '" + data.devices[j].channel_id + "' status = '" + data.devices[j].device_status + "'>" + String(data.devices[j].device_name) + "</option>";
                                                            $(op).appendTo("#appliances");
                                                        }
                                                        if (s_appliancetype == "C" && data.devices[j].app_type == "C") {
                                                            var op = "<option value='" + String(data.devices[j].device_name) + "' record-id = '" + data.devices[j].record_id + "' app-type = '" + data.devices[j].app_type + "' device-type = '" + data.devices[j].device_type + "' device-id = '" + data.devices[j].device_id + "' channel-id = '" + data.devices[j].channel_id + "' status = '" + data.devices[j].device_status + "'>" + String(data.devices[j].device_name) + "</option>";
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
                });
                //*************update event */
                $('#up_appliancetype').on('change', function () {
                    var s_subarea = $("#up_subarea").val();
                    var s_dept = $("#up_area").val();
                    var s_area = $("#up_floor").val();
                    var s_appliancetype = $("#up_appliancetype").val();
                    console.log(s_subarea, s_dept, s_area, s_appliancetype)
                    for (var i = 0; i < data.areas.length; i++) {
                        if (data.areas[i].name == s_area) {
                            $.each(data.areas[i].departments, function (k, j) {
                                if (j.name == s_dept) {
                                    $.each(data.areas[i].departments[k].sub_area, function (l, m) {
                                        if (m.name == s_subarea) {
                                            var device = m.area_devices.split(",");
                                            $('#up_appliances').html('<option value="">Select Appliances</option>');
                                            $('#up_devicestatus').html('<option value="">Select Operations</option>');
                                            for (var j = 0; j < data.devices.length; j++) {
                                                for (var i = 0; i < device.length; i++) {
                                                    if (Number(device[i]) == data.devices[j].record_id) {
                                                        if (s_appliancetype == "AC" && data.devices[j].app_type == "AC") {
                                                            var op = "<option value='" + String(data.devices[j].device_name) + "' record-id = '" + data.devices[j].record_id + "' app-type = '" + data.devices[j].app_type + "' device-type = '" + data.devices[j].device_type + "' device-id = '" + data.devices[j].device_id + "' channel-id = '" + data.devices[j].channel_id + "' status = '" + data.devices[j].device_status + "'>" + String(data.devices[j].device_name) + "</option>";
                                                            $(op).appendTo("#up_appliances");
                                                        }
                                                        if (s_appliancetype == "L" && data.devices[j].app_type == "L") {
                                                            var op = "<option value='" + String(data.devices[j].device_name) + "' record-id = '" + data.devices[j].record_id + "' app-type = '" + data.devices[j].app_type + "' device-type = '" + data.devices[j].device_type + "' device-id = '" + data.devices[j].device_id + "' channel-id = '" + data.devices[j].channel_id + "' status = '" + data.devices[j].device_status + "'>" + String(data.devices[j].device_name) + "</option>";
                                                            $(op).appendTo("#up_appliances");
                                                        }
                                                        if (s_appliancetype == "S" && data.devices[j].app_type == "S") {
                                                            var op = "<option value='" + String(data.devices[j].device_name) + "' record-id = '" + data.devices[j].record_id + "' app-type = '" + data.devices[j].app_type + "' device-type = '" + data.devices[j].device_type + "' device-id = '" + data.devices[j].device_id + "' channel-id = '" + data.devices[j].channel_id + "' status = '" + data.devices[j].device_status + "'>" + String(data.devices[j].device_name) + "</option>";
                                                            $(op).appendTo("#up_appliances");
                                                        }
                                                        if (s_appliancetype == "C" && data.devices[j].app_type == "C") {
                                                            var op = "<option value='" + String(data.devices[j].device_name) + "' record-id = '" + data.devices[j].record_id + "' app-type = '" + data.devices[j].app_type + "' device-type = '" + data.devices[j].device_type + "' device-id = '" + data.devices[j].device_id + "' channel-id = '" + data.devices[j].channel_id + "' status = '" + data.devices[j].device_status + "'>" + String(data.devices[j].device_name) + "</option>";
                                                            $(op).appendTo("#up_appliances");
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
                });
                /********end */
            }
        })
    }
    $("#craete_trigger").click(function () {//n
        $("#ttable").show();
    });

    $('#triggertype').on('change', function () {
        var trigger_type = $(this).val();
        if (trigger_type == "A") {
            $("#event_table").show();
            $("#schedule_table").hide();
            $("#scene").show();
            $("#scene_msg").show();
            $("#tbl").show();
        }
        if (trigger_type == "S") {
            $("#schedule_table").show();
            $("#event_table").hide();
            $("#scene").show();
            $("#scene_msg").show();
            $("#tbl").show();
        }
    });
    //************************************************update event */
    $("#updateeventaction").click(function () {
        var scene = $("#up_scene").val();
        var mtriggername = $("#up_triggername").val();
        var upid = $("#upid").val();
        var opr = $("#up_devicestatus").val();
        var opr_value = $("#up_devicevalue").val();
        var appliances;
        appliances = $("#up_appliances option:selected").map(function () {
            var did = $(this).attr("device-id");
            var cid = $(this).attr("channel-id");
            var dtype = $(this).attr("device-type");
            var atype = $(this).attr("app-type");
            var rid = $(this).attr("record-id");
            var dname = $(this).val();
            dict = {
                "record_id": rid,
                "device_type": dtype,
                "device_name": dname,
                "app_type": atype,
                "device_id": String(did),
                "channel_id": String(cid),
                "opreration": opr,
                "opr_value": opr_value
            }
            return dict
        }).get();
        var fid;
        fid = $("#up_floor option:selected").map(function () {
            return $(this).attr("f-id");
        });
        var aid;
        aid = $("#up_area option:selected").map(function () {
            return $(this).attr("a-id");
        });
        var subid;
        subid = $("#up_subarea option:selected").map(function () {
            return $(this).attr("sub-id");
        });
        var floor = fid[0];
        var area = aid[0];
        var subarea = subid[0];
        var atype = $("#up_appliancetype").val();
        var areas = { "floor": floor, "area": area, "sub_area": subarea, "app_type": atype }
        var event_action = { "id": Number(upid), "name": mtriggername, "trigger_type": "A", "area": areas, "trigger": appliances[0], "scene": scene };
        console.log(event_action);

        $.ajax({
            url: '/triggerAction/updateEvent/',
            dataType: 'json',
            type: 'POST',
            data: {
                "data": JSON.stringify(event_action),
                "upid": upid
            },
            success: function (data) {
                $("#craete_trigger").show();//n
                $("#updt_event_table").hide();
                $("#etable").hide();
                console.log(data);
            }
        });

    });
    //**********************************************update event end

    //************************************************Update Schedule */
    $("#scheduleupdate").click(function () {
        var supid = $("#scheduleupid").val();
        var b_date = $("#up_scheduledate").val();
        var scene = $("#up_schedule_scene").val();
        var mtriggername = $("#up_schedule_triggername").val();
        l_date = b_date.split('-');
        s_date = l_date[2] + '/' + l_date[1] + '/' + l_date[0];

        var s_day = $('#up_days').val();
        var occurance = $("input[name='schedules']:checked").val();
        var s_time = $("#up-timepicker-12-hr").val();
        s_time = s_time.replace(/\s+/g, '');

        var date_components = s_date.split("/");
        var s_month = date_components[1];
        var o_date = date_components[0];

        var schedule_trigger;
        if (occurance == "O" && s_date != "") {
            s_trigger = { "occurance": occurance, "date": s_date, "time": s_time }
            schedule_trigger = { "id": Number(supid), "name": mtriggername, "trigger_type": "S", "trigger": s_trigger, "scene": scene }
            console.log(schedule_trigger);
        }
        if (occurance == "D") {
            s_trigger = { "occurance": occurance, "time": s_time }
            schedule_trigger = { "id": Number(supid), "name": mtriggername, "trigger_type": "S", "trigger": s_trigger, "scene": scene }
            console.log(schedule_trigger);
        }
        if (occurance == "W" && s_day != "") {
            s_trigger = { "occurance": occurance, "day": s_day, "time": s_time }
            schedule_trigger = { "id": Number(supid), "name": mtriggername, "trigger_type": "S", "trigger": s_trigger, "scene": scene }
            console.log(schedule_trigger);
        }
        if (occurance == "M" && s_date != "") {
            s_trigger = { "occurance": occurance, "month": s_month, "date": o_date, "time": s_time }
            schedule_trigger = { "id": Number(supid), "name": mtriggername, "trigger_type": "S", "trigger": s_trigger, "scene": scene }
            console.log(schedule_trigger);
        }
        $.ajax({
            url: '/triggerAction/updateEvent/',
            dataType: 'json',
            type: 'POST',
            data: {
                "data": JSON.stringify(schedule_trigger),
                "upid": supid
            },
            success: function (data) {
                $("#stb").hide();
                $("#up_schedule_table").hide();
                $("#craete_trigger").show();//n
                console.log(data);
            }
        });

    });
    //************************************************End Update Schedule */
    $("#cancel").click(function (e) {
        $("#ttable").hide();
        $("#event_table").hide();
        $("#schedule_table").hide();
        $("#scene").hide();
        $("#scene_msg").hide();
        $("#tbl").hide();
    });
    $("#up_scheduel_cancel").click(function (e) {
        $("#up_schedule_table").hide();
        $("#stb").hide();
        $("#craete_trigger").show();
    });
    $("#up_event_cancel").click(function (e) {
        $("#updt_event_table").hide();
        $("#etable").hide();
        // $("#stb").hide();
        $("#craete_trigger").show();
    });
    //************************************************Add Trigger Schedule */
    $("#submiteventaction").click(function (e) {
        e.preventDefault();
        $("#eventform").validate({
            rules: {
                floor: "required",
                area: "required",
                subarea: "required",
                appliancetype: "required",
                appliances: "required",
                devicestatus: "required",
                devicevalue: "required"
            },
            messages: {
                floor: "Please select floor",
                area: "Please select area",
                subarea: "Please select sub area",
                appliancetype: "Please select appliance type",
                appliances: "Please select appliances",
                devicestatus: "please select Operation",
                devicevalue: "Please enter device value"

            }
        });

        $("#scheduleform").validate({
            rules: {
                triggername: "required",
                scheduledate: "required",
                days: "required"
            },
            messages: {
                scheduledate: "Please select schedule date",
                triggername: "Please specify your trigger name",
                days: "Please select day"
            }

        });

        $("#tnameform").validate({
            rules: {
                triggername: "required",
                mtriggertype: "required"
            },
            messages: {
                triggername: "Please specify your trigger name",
                mtriggertype: "Please select trigger type"
            }
        });

        $("#sceneform").validate({
            rules: {
                schedule_scene: "required"
            },
            messages: {
                schedule_scene: "Please select scene"
            }
        });

        var mtriggername = $("#triggername").val();
        var scene = $("#scene").val();
        var mtriggertype = $("#triggertype").val();
        if (mtriggertype == "A") {
            $("#tnameform").valid();
            $("#eventform").valid();
            $("#sceneform").valid();
            var mfloor = $("#floor").val();
            var marea = $("#area").val();
            var msubarea = $("#subarea").val();
            var mappliancetype = $("#appliancetype").val();
            var mappliances = $("#appliances").val();
            var mdevicestatus = $("#devicestatus").val();
            var mdevicevalue = $("#devicevalue").val();
        }
        if (mtriggertype == "S") {
            $("#scheduleform").valid();
            $("#sceneform").valid();
            $("#tnameform").valid();
            var date = $("#scheduledate").val();
        }

        /******************************************************************************************* Event Trigger*/
        if (mtriggertype == "A") {
            var same = 1;
            $.ajax({
                url: '/triggerAction/getActionTrigger/',
                dataType: 'json',
                type: 'GET',
                cache: false,
                success: function (data) {
                    $.each(data, function (i, v) {
                        if (mtriggername == v.name) {
                            same = 0;
                        }
                    });
                    if (same == 0) {
                        alert("Trigger Name Already Exist.!")
                    } else {
                        if (mtriggername != "" && mtriggertype == "A" && mfloor != "" && marea != "" && msubarea != "" && mappliancetype != "" && mappliances != "" && mdevicestatus != "" && mdevicevalue != "" && scene != "") {
                            var opr = $("#devicestatus").val();
                            var opr_value = $("#devicevalue").val();
                            var appliances;
                            appliances = $("#appliances option:selected").map(function () {
                                var did = $(this).attr("device-id");
                                var cid = $(this).attr("channel-id");
                                var dtype = $(this).attr("device-type");
                                var atype = $(this).attr("app-type");
                                var rid = $(this).attr("record-id");
                                var dname = $(this).val();
                                dict = {
                                    "record_id": rid,
                                    "device_type": dtype,
                                    "device_name": dname,
                                    "app_type": atype,
                                    "device_id": String(did),
                                    "channel_id": String(cid),
                                    "opreration": opr,
                                    "opr_value": opr_value
                                }
                                return dict
                            }).get();
                            var fid;
                            fid = $("#floor option:selected").map(function () {
                                return $(this).attr("f-id");
                            });
                            var aid;
                            aid = $("#area option:selected").map(function () {
                                return $(this).attr("a-id");
                            });
                            var subid;
                            subid = $("#subarea option:selected").map(function () {
                                return $(this).attr("sub-id");
                            });
                            var floor = fid[0];
                            var area = aid[0];
                            var subarea = subid[0];
                            var atype = $("#appliancetype").val();
                            var areas = { "floor": floor, "area": area, "sub_area": subarea, "app_type": atype }
                            var event_action = { "id": 1, "name": mtriggername, "trigger_type": mtriggertype, "area": areas, "trigger": appliances[0], "scene": scene };
                            // var event_action = { "id": 1, "name": mtriggername, "trigger_type": mtriggertype, "trigger": appliances[0], "scene": scene };
                            m = { "data": JSON.stringify(event_action) }
                            console.log('-----------------');
                            console.log(m);

                            $.ajax({
                                url: '/triggerAction/addTrigger/',
                                dataType: 'json',
                                type: 'POST',
                                data: { "data": JSON.stringify(event_action) },
                                success: function (data) {
                                    $("#triggername").val("");
                                    $("#triggertype").val("");
                                    $("#floor").val("");
                                    $("#area").val("");
                                    $("#subarea").val("");
                                    $("#appliancetype").val("");
                                    $("#appliances").val("");
                                    $("#devicestatus").val("");
                                    $("#devicevalue").val("");
                                    $("#scene").val("");
                                    $("#ttable").hide();//n
                                    $("#tbl").hide();//n
                                    $("#event_table").hide();
                                    $("#schedule_table").hide();
                                    $("#scene").hide();
                                    $("#scene_msg").hide();
                                    console.log(data);
                                }
                            });
                        }
                        else {
                            console.log("");
                        }
                    }
                }
            });
        }
        /******************************************************************************************* Schedule Trigger*/
        if (mtriggertype == "S") {
            var ssame = 1;
            $.ajax({
                url: '/triggerAction/getScheduleTrigger/',
                dataType: 'json',
                type: 'GET',
                cache: false,
                success: function (data) {
                    $.each(data, function (i, k) {
                        if (k.name == mtriggername) {
                            ssame = 0;
                        }
                    });
                    if (ssame == 0) {
                        alert("Trigger Name Already Exist.!")
                    } else {
                        if (mtriggertype == "S" && mtriggername != "" && scene != "") {
                            var b_date = $("#scheduledate").val();
                            l_date = b_date.split('-');
                            s_date = l_date[2] + '/' + l_date[1] + '/' + l_date[0];

                            var s_day = $('#days').val();

                            var occurance = $("input[name='options']:checked").val();
                            var s_time = $("#timepicker-12-hr").val();
                            s_time = s_time.replace(/\s+/g, '');

                            var date_components = s_date.split("/");
                            var s_month = date_components[1];
                            var o_date = date_components[0];

                            var schedule_trigger;
                            if (occurance == "O" && s_date != "") {
                                s_trigger = { "occurance": occurance, "date": s_date, "time": s_time }
                                schedule_trigger = { "id": 1, "name": mtriggername, "trigger_type": mtriggertype, "trigger": s_trigger, "scene": scene }
                                console.log(schedule_trigger);
                            }
                            if (occurance == "D") {
                                s_trigger = { "occurance": occurance, "time": s_time }
                                schedule_trigger = { "id": 1, "name": mtriggername, "trigger_type": mtriggertype, "trigger": s_trigger, "scene": scene }
                                console.log(schedule_trigger);
                            }
                            if (occurance == "W" && s_day != "") {
                                s_trigger = { "occurance": occurance, "day": s_day, "time": s_time }
                                schedule_trigger = { "id": 1, "name": mtriggername, "trigger_type": mtriggertype, "trigger": s_trigger, "scene": scene }
                                console.log(schedule_trigger);
                            }
                            if (occurance == "M" && s_date != "") {
                                s_trigger = { "occurance": occurance, "month": s_month, "date": o_date, "time": s_time }
                                schedule_trigger = { "id": 1, "name": mtriggername, "trigger_type": mtriggertype, "trigger": s_trigger, "scene": scene }
                                console.log(schedule_trigger);
                            }
                            console.log({ "data": JSON.stringify(schedule_trigger) });
                            $.ajax({
                                url: '/triggerAction/addTrigger/',
                                dataType: 'json',
                                type: 'POST',
                                data: { "data": JSON.stringify(schedule_trigger) },
                                success: function (data) {
                                    $("#triggername").val("");
                                    $("#triggertype").val("");
                                    $("#scene").val("");
                                    $("#days").val("");
                                    $("#scheduledate").val("");
                                    $("#ttable").hide();
                                    $("#tbl").hide();
                                    $("#event_table").hide();
                                    $("#schedule_table").hide();
                                    $("#scene").hide();
                                    $("#scene_msg").hide();
                                    console.log(data);
                                }
                            });
                        }
                    }
                }
            });
        }
        return false;
    });
});


// # Short Terminology

// # Devices_types
// # RL    =   Relays (TIS)
// # AC    =   Air Condition
// # TV    =   Television
// # AVR   =   Audio Video Receiver

// # Appliances_types
// # L     =   Light
// # S     =   Speaker
// # CM    =   Curtain Motor

// # Schedules
// # O     =   Once
// # D     =   Date
// # W     =   Weekly
// # M     =   Monthly

