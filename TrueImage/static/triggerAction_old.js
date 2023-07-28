$(document).ready(function () {
    getData()
    // ***********************************************************************************
    function getData() {
        $.ajax({
            url: 'triggerAction/getArea',
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
                        html += "<option id='power' value='" + String("power") + "'>" + String("power") + "</option>";
                        html += "<option id='ac_temp' value='" + String("temprature ") + "'>" + String("temprature") + "</option>";
                        $(html).appendTo("#devicestatus");
                    }
                    if (device == "Light") {
                        var html = '';
                        html += "<option id='power' value='" + String("power") + "'>" + String("power") + "</option>";
                        html += "<option value='" + String("dimming ") + "'>" + String("dimming ") + "</option>";
                        $(html).appendTo("#devicestatus");
                    }
                    if (device == "Speaker" || device == "Curtain") {
                        html += "<option id='power' value='" + String("power") + "'>" + String("power") + "</option>";
                        $(html).appendTo("#devicestatus");
                    }
                });
                $('#appliancetype').on('change', function () {
                    $('#devicestatus').html('<option value="">Select Operation</option>');
                });
                // /*******************************************************On Change Area Subarea
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
                                            $('#devicestatus').html('<option value="">Select Devices Operations</option>');
                                            $("#temp").hide();
                                            $("#set_temp").hide();
                                            $("#sp").hide();
                                            for (var j = 0; j < data.devices.length; j++) {
                                                for (var i = 0; i < device.length; i++) {
                                                    if (Number(device[i]) == data.devices[j].record_id) {
                                                        if (s_appliancetype == "AC" && data.devices[j].app_type == "AC") {
                                                            var op = "<option value='" + String(data.devices[j].device_name) + "' app-type = '" + data.devices[j].app_type + "' device-type = '" + data.devices[j].device_type + " ' device-id = '" + data.devices[j].device_id + " ' channel-id = '" + data.devices[j].channel_id + " ' status = '" + data.devices[j].device_status + " '>" + String(data.devices[j].device_name) + "</option>";
                                                            $(op).appendTo("#appliances");
                                                        }
                                                        if (s_appliancetype == "Light" && data.devices[j].app_type == "L") {
                                                            var op = "<option value='" + String(data.devices[j].device_name) + "' app-type = '" + data.devices[j].app_type + "' device-type = '" + data.devices[j].device_type + " ' device-id = '" + data.devices[j].device_id + " ' channel-id = '" + data.devices[j].channel_id + " ' status = '" + data.devices[j].device_status + " '>" + String(data.devices[j].device_name) + "</option>";
                                                            $(op).appendTo("#appliances");
                                                        }
                                                        if (s_appliancetype == "Speaker" && data.devices[j].app_type == "S") {
                                                            var op = "<option value='" + String(data.devices[j].device_name) + "' app-type = '" + data.devices[j].app_type + "' device-type = '" + data.devices[j].device_type + " ' device-id = '" + data.devices[j].device_id + " ' channel-id = '" + data.devices[j].channel_id + " ' status = '" + data.devices[j].device_status + " '>" + String(data.devices[j].device_name) + "</option>";
                                                            $(op).appendTo("#appliances");
                                                        }
                                                        if (s_appliancetype == "Curtain" && data.devices[j].app_type == "C") {
                                                            var op = "<option value='" + String(data.devices[j].device_name) + "' app-type = '" + data.devices[j].app_type + "' device-type = '" + data.devices[j].device_type + " ' device-id = '" + data.devices[j].device_id + " ' channel-id = '" + data.devices[j].channel_id + " ' status = '" + data.devices[j].device_status + " '>" + String(data.devices[j].device_name) + "</option>";
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
            }
        })
    }
    $('#triggertype').on('change', function () {
        var trigger_type = $(this).val();
        if (trigger_type == "A") {
            $("#event_table").show();
            $("#schedule_table").hide();
        }
        if (trigger_type == "S") {
            $("#schedule_table").show();
            $("#event_table").hide();
        }
    });

    $("#submiteventaction").click(function () {
        var mtriggername = $("#triggername").val();
        if (mtriggername != "") {
            document.getElementById("triggername_msg").innerHTML = "";
        } else {
            document.getElementById("triggername_msg").innerHTML = "Please enter trigger value.!";
        }
        var mtriggertype = $("#triggertype").val();
        if (mtriggertype != "") {
            document.getElementById("triggertype_msg").innerHTML = "";
        } else {
            document.getElementById("triggertype_msg").innerHTML = "Please select trigger type.!";
        }
        if (mtriggertype == "A") {
            var mfloor = $("#floor").val();
            if (mfloor != "") {
                document.getElementById("floor_msg").innerHTML = "";
            } else {
                document.getElementById("floor_msg").innerHTML = "Please select floor.!";
            }
            var marea = $("#area").val();
            if (marea != "") {
                document.getElementById("area_msg").innerHTML = "";
            } else {
                document.getElementById("area_msg").innerHTML = "Please select area.!";
            }
            var msubarea = $("#subarea").val();
            if (msubarea != "") {
                document.getElementById("subarea_msg").innerHTML = "";
            } else {
                document.getElementById("subarea_msg").innerHTML = "Please select sub area.!";
            }
            var mappliancetype = $("#appliancetype").val();
            if (mappliancetype != "") {
                document.getElementById("appliancetype_msg").innerHTML = "";
            } else {
                document.getElementById("appliancetype_msg").innerHTML = "Please select appliance type.!";
            }
            var mappliances = $("#appliances").val();
            if (mappliances != "") {
                document.getElementById("appliances_msg").innerHTML = "";
            } else {
                document.getElementById("appliances_msg").innerHTML = "Please select appliances.!";
            }
            var mdevicestatus = $("#devicestatus").val();
            if (mdevicestatus != "") {
                document.getElementById("devicestatus_msg").innerHTML = "";
            } else {
                document.getElementById("devicestatus_msg").innerHTML = "Please select operation.!";
            }
            var mdevicevalue = $("#devicevalue").val();
            if (mdevicevalue != "") {
                document.getElementById("devicevalue_msg").innerHTML = "";
            } else {
                document.getElementById("devicevalue_msg").innerHTML = "Please enter device value.!";
            }
            var e_scene = $("#event_scene").val();
            if (e_scene != "") {
                document.getElementById("e_scene_msg").innerHTML = "";
            } else {
                document.getElementById("e_scene_msg").innerHTML = "Please select Scene.!";
            }
        }
        if (mtriggertype == "S") {
            var date = $("#scheduledate").val();
            if (date != "") {
                document.getElementById("date_msg").innerHTML = "";
            } else {
                document.getElementById("date_msg").innerHTML = "Please enter select date.!";
            }
            var s_scene = $("#schedule_scene").val();
            if (s_scene != "") {
                document.getElementById("s_scene_msg").innerHTML = "";
            } else {
                document.getElementById("s_scene_msg").innerHTML = "Please select Scene.!";
            }
        }
        /******************************************************************************************* Event Trigger*/
        if (mtriggername != "" && mtriggertype == "A" && mfloor != "" && marea != "" && msubarea != "" && mappliancetype != "" && mappliances != "" && mdevicestatus != "" && mdevicevalue != "") {
            var opr = $("#devicestatus").val();
            var opr_value = $("#devicevalue").val();
            var appliances = [];
            appliances = $("#appliances option:selected").map(function () {
                var did = $(this).attr("device-id");
                var cid = $(this).attr("channel-id");
                var dtype = $(this).attr("device-type");
                var atype = $(this).attr("app-type");
                dict = {
                    "device_type": dtype,
                    "app_type": atype,
                    "device_id": String(did),
                    "channel_id": String(cid),
                    "opreration": opr,
                    "opr_value": opr_value
                }
                return dict
            }).get();
            var event_action = { "id": 1, "name": mtriggername, "trigger_type": mtriggertype, "trigger": appliances };
            console.log(event_action);
        }
        else {
            console.log("");
        }
        /******************************************************************************************* Schedule Trigger*/
        var s_date = $("#scheduledate").val();
        var s_day = $('#days').find(":selected").text();
        if (mtriggertype == "S" && mtriggername != "") {
            var occurance = $("input[name='options']:checked").val();
            var s_time = $("#timepicker-12-hr").val();
            var date_components = s_date.split("-");
            var s_month = date_components[2];
            var o_date = date_components[1];
            var schedule_trigger;
            if (occurance == "O" && s_date != "") {
                s_trigger = { "occurance": occurance, "date": s_date, "time": s_time }
                schedule_trigger = { "id": 1, "name": mtriggername, "trigger_type": mtriggertype, "trigger": s_trigger }
                console.log(schedule_trigger);
            }
            if (occurance == "D") {
                s_trigger = { "occurance": occurance, "time": s_time }
                schedule_trigger = { "id": 1, "name": mtriggername, "trigger_type": mtriggertype, "trigger": s_trigger }
                console.log(schedule_trigger);
            }
            if (occurance == "W" && s_day != "") {
                document.getElementById("day_msg").innerHTML = "";
                s_trigger = { "occurance": occurance, "day": s_day, "time": s_time }
                schedule_trigger = { "id": 1, "name": mtriggername, "trigger_type": mtriggertype, "trigger": s_trigger }
                console.log(schedule_trigger);
            }else{
                document.getElementById("day_msg").innerHTML = "Please select Day.!";
            }
            if (occurance == "M" && s_date != "") {
                s_trigger = { "occurance": occurance, "month": s_month, "date": o_date, "time": s_time }
                schedule_trigger = { "id": 1, "name": mtriggername, "trigger_type": mtriggertype, "trigger": s_trigger }
                console.log(schedule_trigger);
            }

            
        }
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

