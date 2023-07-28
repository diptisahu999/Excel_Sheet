$(document).ready(function () {
    new SlimSelect({
        select: '#appliances'
      })

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
                        html += "<option id='ac_on' value='" + String("on") + "'>" + String("on") + "</option>";
                        html += "<option id='ac_off' value='" + String("off") + "'>" + String("off") + "</option>";
                        html += "<option id='ac_temp' value='" + String("temp") + "'>" + String("temp") + "</option>";
                        $(html).appendTo("#devicestatus");
                        var ht = '';

                    }
                    if (device == "Light" || device == "Speaker" || device == "Curtain") {
                        var html = '';
                        html += "<option value='" + String("on") + "'>" + String("on") + "</option>";
                        html += "<option value='" + String("off") + "'>" + String("off") + "</option>";
                        $(html).appendTo("#devicestatus");
                    }
                });
                $('#appliancetype').on('change', function () {
                    $('#devicestatus').html('<option value="">Select Operation</option>');
                });

                // /*******************************************************On Change Area Devices Status               

                $('#appliancetype').on('change', function () {
                    var s_devices = $(this).val();
                    $('#appliances').html('<option value="" disabled>Select Appliances</option>');
                    $.each(data.devices, function (index, value) {
                        
                        if (s_devices == "AC" && value.device_type == "AC") {
                            // val = "<option value='" + value.device_name + "' record-id = '" + value.record_id + "' device-id = '" + value.device_id + " ' channel-id = '" + value.channel_id + " ' status = '" + value.device_status + " '>" + value.device_name + "</option>"
                            // $(val).appendTo("#appliances");
                            $("#appliances").append("<option value='" + value.device_name + "' record-id = '" + value.record_id + "' device-id = '" + value.device_id + " ' channel-id = '" + value.channel_id + " ' status = '" + value.device_status + " '>" + value.device_name + "</option>");
                        }
                        if (s_devices == "Light" && value.device_type == "L") {
                            $("#appliances").append("<option value='" + value.device_name + "' record-id = '" + value.record_id + "' device-id = '" + value.device_id + "' channel-id = '" + value.channel_id + " ' status = '" + value.device_status + " '>" + value.device_name + "</option>");
                        }
                        if (s_devices == "Speaker" && value.device_type == "S") {
                            $("#appliances").append("<option value='" + value.device_name + "' record-id = '" + value.record_id + "' device-id = '" + value.device_id + "' channel-id = '" + value.channel_id + " ' status = '" + value.device_status + " '>" + value.device_name + "</option>");
                        }
                        if (s_devices == "Curtain" && value.device_type == "C") {
                            $("#appliances").append("<option value='" + value.device_name + "' record-id = '" + value.record_id + "' device-id = '" + value.device_id + "' channel-id = '" + value.channel_id + " ' status = '" + value.device_status + " '>" + value.device_name + "</option>");
                        }
                    });
                    new SlimSelect({
                        select: '#appliances'
                      })
                });
                // **************************************************************************************add more    
                window.d_id = 3;
                window.select = 1;
                $(".add-more").click(function () {
                    select++;
                    var html = '';
                    html += '<tr id="inputFormRow">';
                    html += '<td>';
                    html += '<select name="floor" id="floor_' + d_id + '" floor-id="' + d_id + '">';
                    html += '<option value="">Select Floor</option>';
                    html += '</select>';
                    html += '<p id="floor_msg_' + d_id + '" style="color: red;"></p>';
                    html += '</td>';
                    html += '<td>';
                    html += '<select name="area" id="area_' + d_id + '" area-id="' + d_id + '">';
                    html += '<option value="">Select Area</option>';
                    html += '</select>';
                    html += '<p id="area_msg_' + d_id + '" style="color: red;"></p>';
                    html += '</td>';
                    html += '<td>';
                    html += '<select name="subarea" id="subarea_' + d_id + '" subarea-id="' + d_id + '">';
                    html += '<option value="">Select Sub Area</option>';
                    html += '</select>';
                    html += '<p id="subarea_msg_' + d_id + '" style="color: red;"></p>';
                    html += '</td>';
                    html += '<td>';
                    html += '<select name="appliancetype" id="appliancetype_' + d_id + '" type-id="' + d_id + '">';
                    html += '<option value="">Appliances Type</option>';
                    html += '<option value="Light">Light</option>';
                    html += '<option value="AC">AC</option>';
                    html += '<option value="Speaker">Speaker</option>';
                    html += '<option value="Curtain">Curtain</option>';
                    html += '</select>';
                    html += '<p id="appliancetype_msg_' + d_id + '" style="color: red;"></p>';
                    html += '</td>';
                    html += '<td>';
                    html += '<select name="appliances" multiple="multiple" id="appliances_' + d_id + '" type-id="' + d_id + '">';
                    html += '</select>';
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
                    $('table > tbody > tr:first').after(html);
                    new SlimSelect({
                        select: '#appliance_'+ d_id
                      })

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
                        var s_devices = $(this).val();
                        var appliancetypeID = $(this).attr("type-id");
                        $('#appliances_' + appliancetypeID).html('<option value="">Select Appliances</option>');
                        $.each(jdata.devices, function (index, value) {
                            if (s_devices == "AC" && value.device_type == "AC") {
                                $("#appliances_" + appliancetypeID).append("<option value='" + value.device_name + "' record-id = '" + value.record_id + "' device-id = '" + value.device_id + " ' channel-id = '" + value.channel_id + " ' status = '" + value.device_status + " '>" + value.device_name + "</option>");
                            }
                            if (s_devices == "Light" && value.device_type == "L") {
                                $("#appliances_" + appliancetypeID).append("<option value='" + value.device_name + "' record-id = '" + value.record_id + "' device-id = '" + value.device_id + "' channel-id = '" + value.channel_id + " ' status = '" + value.device_status + " '>" + value.device_name + "</option>");
                            }
                            if (s_devices == "Speaker" && value.device_type == "S") {
                                $("#appliances_" + appliancetypeID).append("<option value='" + value.device_name + "' record-id = '" + value.record_id + "' device-id = '" + value.device_id + "' channel-id = '" + value.channel_id + " ' status = '" + value.device_status + " '>" + value.device_name + "</option>");
                            }
                            if (s_devices == "Curtain" && value.device_type == "C") {
                                $("#appliances_" + appliancetypeID).append("<option value='" + value.device_name + "' record-id = '" + value.record_id + "' device-id = '" + value.device_id + "' channel-id = '" + value.channel_id + " ' status = '" + value.device_status + " '>" + value.device_name + "</option>");
                            }
                        });
                    });
                    // ***********************************************************************************************************
                    $("select[name='appliancetype']").change(function () {
                        var device = $(this).val();
                        var typeId = $(this).attr("type-id");
                        $('#devicestatus_' + typeId).html('<option value="">Select Operation</option>');
                        if (device == "AC") {
                            var html = '';
                            html += "<option id='ac_on' value='" + String("on") + "'>" + String("on") + "</option>";
                            html += "<option id='ac_off' value='" + String("off") + "'>" + String("off") + "</option>";
                            html += "<option id='ac_temp' value='" + String("temp") + "'>" + String("temp") + "</option>";
                            $(html).appendTo("#devicestatus_" + typeId);
                        }
                        if (device == "Light" || device == "Speaker" || device == "Curtain") {
                            var html = '';
                            html += "<option value='" + String("on") + "'>" + String("on") + "</option>";
                            html += "<option value='" + String("off") + "'>" + String("off") + "</option>";
                            $(html).appendTo("#devicestatus_" + typeId);
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
    // **************************************************************************************create scene
    $("#submit_scene").click(function (e) {
        // ***************
        var mtriggername = $("#scenename").val();
        if (mtriggername != "") {
            document.getElementById("scenename_msg").innerHTML = "";
        } else {
            document.getElementById("scenename_msg").innerHTML = "Please enter trigger value.!";
        }
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

        // ***************
        var fid;
        fid = $("#floor option:selected").map(function () {
            return $(this).attr("f-id");
        });
        var sceneName = $("#scenename").val();
        // var floor = $("#floor").val();
        var aid;
        aid = $("#area option:selected").map(function () {
            return $(this).attr("a-id");
        });
        // var sarea = $("#area").val();
        var subid;
        subid = $("#subarea option:selected").map(function () {
            return $(this).attr("sub-id");
        });
        var subarea = $("#subarea").val();
        var len = window.d_id;
        var opr = $("#devicestatus").val();
        var opr_value = $("#devicevalue").val();
        var appliances = [];
        appliances = $("#appliances option:selected").map(function () {
            var rid = Number($(this).attr("record-id"));
            var did = $(this).attr("device-id");
            var cid = $(this).attr("channel-id");
            dict = {
                "record_id": Number(rid),
                "device_id": String(did),
                "channel_id": String(cid),
                "opr": opr,
                "opr_value": opr_value
            }
            return dict
        }).get();
        var area = [{ "floor": fid[0], "area": aid[0], "sub_area": subid[0], "app_type": "C", "appliances": appliances }];
        var scenes = [{ "id": 1, "scene_name": sceneName, "status": "E", "area": area }];
        console.log(scenes);
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

                if ($('#floor_' + i).val() != "" && $('#area_' + i).val() != "" && $('#subarea_' + i).val() != "") {
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
                        dict = {
                            "record_id": Number(rid),
                            "device_id": String(did),
                            "channel_id": String(cid),
                            "opr": status,
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
                    console.log("");
                }
            } else {
                console.log("");
            }

        }
    });

});

