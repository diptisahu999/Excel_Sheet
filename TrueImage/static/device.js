var connectionString = 'ws://' + window.location.host + '/component/';
var bmsSocket = new WebSocket(connectionString);

var card_config;

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

    var str = JSON.stringify(data, null, 2);

    var obj = JSON.parse(str);

    console.log(obj.payload.response);
    window.mydata = obj.payload.response
    //renderDataTable(obj.payload.response);
  };

  if (bmsSocket.readyState == WebSocket.OPEN) {
    bmsSocket.onopen();
  }
}

/*****************************************************device listing */
connect();
$('#change_device').on('change', function () {
  var cdtype = $(this).val();
  if (cdtype == "AC") {
    $(".ac").show();
    $(".tv").hide();
    $(".avr").hide();
    $(".rl").hide();
    $(".cam").hide();
    var acdata = []
    for (var i = 0; i < mydata.length; i++) {
      if (mydata[i]["device_type"] == "AC") {
        acdata.push(mydata[i])
      }
    }
    // function renderDataTable(data) {
    $('#acdevicelist').dataTable().fnDestroy();
    $('#acdevicelist').DataTable({
      processing: true,
      responsive: true,
      retrieve: true,
      data: acdata,
      "columns": [
        { "data": "device_name" },
        { "data": "floor_name" },
        { "data": "dept_name" },
        { "data": "sub_area_name" },
        { "data": "device_type_name" },
        { "data": "app_typename" },
        { "data": "device_id" },
        { "data": "channel_id" },
        { "data": "device_status" },
        {
          "data": "record_id",
          render: function (data) {
            return '<button id="' + data + '" class="updt_event"><i class="fas fa-edit"></i></button> <button id="' + data + '" class="dlt"><i class="fas fa-trash-alt"></i></button>';
            // '<button id="' + data + '" class="dlt">Delete</button> <button id="' + data + '" class="updt_event">Update</button>';
          }
        }
      ]
    });
    // }
  }
  if (cdtype == "AVR") {
    $(".ac").hide();
    $(".tv").hide();
    $(".avr").show();
    $(".rl").hide();
    $(".cam").hide();
    var acdata = []
    for (var i = 0; i < mydata.length; i++) {
      if (mydata[i]["device_type"] == "AVR") {
        acdata.push(mydata[i])
      }
    }
    // function renderDataTable(data) {
    $('#avrdevicelist').dataTable().fnDestroy();
    $('#avrdevicelist').DataTable({
      processing: true,
      responsive: true,
      retrieve: true,
      data: acdata,
      "columns": [
        { "data": "device_name" },
        { "data": "floor_name" },
        { "data": "dept_name" },
        { "data": "sub_area_name" },
        { "data": "device_type_name" },
        { "data": "app_typename" },
        { "data": "ip" },
        { "data": "port" },
        { "data": "device_status" },
        {
          "data": "record_id",
          render: function (data) {
            return '<button id="' + data + '" class="updt_event"><i class="fas fa-edit"></i></button> <button id="' + data + '" class="dlt"><i class="fas fa-trash-alt"></i></button>';
            // '<button id="' + data + '" class="dlt">Delete</button> <button id="' + data + '" class="updt_event">Update</button>';
          }
        }
      ]
    });
  }
  if (cdtype == "RL") {
    $(".ac").hide();
    $(".tv").hide();
    $(".avr").hide();
    $(".rl").show();
    $(".cam").hide();
    var rldata = []
    for (var i = 0; i < mydata.length; i++) {
      if (mydata[i]["device_type"] == "RL") {
        rldata.push(mydata[i])
      }
    }
    // function renderDataTable(data) {
    $('#rldevicelist').dataTable().fnDestroy();
    $('#rldevicelist').DataTable({
      processing: true,
      responsive: true,
      retrieve: true,
      data: rldata,
      "columns": [
        { "data": "device_name" },
        { "data": "floor_name" },
        { "data": "dept_name" },
        { "data": "sub_area_name" },
        { "data": "device_type_name" },
        { "data": "app_typename" },
        { "data": "device_id" },
        { "data": "channel_id" },
        { "data": "device_status" },
        {
          "data": "record_id",
          render: function (data) {
            return '<button id="' + data + '" class="updt_event"><i class="fas fa-edit"></i></button> <button id="' + data + '" class="dlt"><i class="fas fa-trash-alt"></i></button>';
            // '<button id="' + data + '" class="dlt">Delete</button> <button id="' + data + '" class="updt_event">Update</button>';
          }
        }
      ]
    });
  }
  if (cdtype == "TV") {
    $(".ac").hide();
    $(".tv").show();
    $(".avr").hide();
    $(".rl").hide();
    $(".cam").hide();
    var tvdata = []
    for (var i = 0; i < mydata.length; i++) {
      if (mydata[i]["device_type"] == "TV") {
        tvdata.push(mydata[i])
      }
    }
    // function renderDataTable(data) {
    $('#tvdevicelist').dataTable().fnDestroy();
    $('#tvdevicelist').DataTable({
      processing: true,
      responsive: true,
      retrieve: true,
      data: tvdata,
      "columns": [
        { "data": "device_name" },
        { "data": "floor_name" },
        { "data": "dept_name" },
        { "data": "sub_area_name" },
        { "data": "device_type_name" },
        { "data": "app_typename" },
        { "data": "ip" },
        { "data": "port" },
        { "data": "device_status" },
        {
          "data": "record_id",
          render: function (data) {
            return '<button id="' + data + '" class="updt_event"><i class="fas fa-edit"></i></button> <button id="' + data + '" class="dlt"><i class="fas fa-trash-alt"></i></button>';
            // '<button id="' + data + '" class="dlt">Delete</button> <button id="' + data + '" class="updt_event">Update</button>';
          }
        }
      ]
    });
  }
  if (cdtype == "CAM") {
    $(".ac").hide();
    $(".tv").hide();
    $(".avr").hide();
    $(".rl").hide();
    $(".cam").show();
    var camdata = []
    for (var i = 0; i < mydata.length; i++) {
      if (mydata[i]["device_type"] == "CAM") {
        camdata.push(mydata[i])
      }
    }
    // function renderDataTable(data) {
    $('#camdevicelist').dataTable().fnDestroy();
    $('#camdevicelist').DataTable({
      processing: true,
      responsive: true,
      retrieve: true,
      data: camdata,
      "columns": [
        { "data": "device_name" },
        { "data": "floor_name" },
        { "data": "dept_name" },
        { "data": "sub_area_name" },
        { "data": "device_type_name" },
        { "data": "app_typename" },
        { "data": "ip" },
        { "data": "port" },
        { "data": "user_name" },
        { "data": "device_status" },
        {
          "data": "record_id",
          render: function (data) {
            return '<button id="' + data + '" class="updt_event"><i class="fas fa-edit"></i></button> <button id="' + data + '" class="dlt"><i class="fas fa-trash-alt"></i></button>';
            // '<button id="' + data + '" class="dlt">Delete</button> <button id="' + data + '" class="updt_event">Update</button>';
          }
        }
      ]
    });
  }
});

$(document).ready(function () {
  $("#craete_device").show();
  $.ajax({
    url: '/device/getDevice/',
    dataType: 'json',
    type: 'GET',
    success: function (data) {
      window.device_data = data;
    }
  });
  // ********************************************************** Delete Device
  $(document).on('click', '.dlt', function () {
    var id = $(this).attr("id");
    data = {
      'pk': id,
      'opr_type': 'comp_opr',
      'opr': 'del'
    }
    bmsSocket.send(JSON.stringify(data));
  });
  // ********************************************************** update Device
  $(document).on('click', '.updt_event', function () {
    var id = $(this).attr("id");
    $("#craete_device").hide();
    $("#up_submit_form").show();
    $("#up_cancel").show();
    $("#update_deviceform").show();
    $("#deviceform").hide();
    $("#submit_form").hide();
    $("#cancel").hide();
    $('.commonaddmore').remove();
    $.ajax({
      url: '/device/getDevice/',
      dataType: 'json',
      type: 'GET',
      success: function (data) {
        $.each(data, function (index, value) {
          if (Number(id) == value.record_id) {
            $("#upid").val(id);
            $("#up_device_name").val(value.device_name);
            $("#up_device_type option[value='" + value.device_type + "']").prop("selected", true);
            $("#up_app_type option[value='" + value.app_type + "']").prop("selected", true);
            console.log(value.ip, value.port, value.record_id)
            if (value.device_type == "RL") {
              $(".udevice_id").show();
              $(".uchannel_id").show();
              $(".uip_address").hide();
              $(".uport").hide();
              $(".uusername").hide();
              $(".upassword").hide();
              $("#up_device_id").val(value.device_id);
              $("#up_channel_id").val(value.channel_id);
            }
            if (value.device_type == "TV") {
              $(".uip_address").show();
              $(".uport").show();
              $(".udevice_id").hide();
              $(".uchannel_id").hide();
              $(".uusername").hide();
              $(".upassword").hide();
              $("#up_port").val(value.port);
              $("#up_ip_address").val(value.ip);
              $("#up_device_id").val("");
              $("#up_channel_id").val("");
            }
            if (value.device_type == "AVR") {
              $(".uip_address").show();
              $(".uport").show();
              $(".udevice_id").hide();
              $(".uchannel_id").hide();
              $(".uusername").hide();
              $(".upassword").hide();
              $("#up_port").val(value.port);
              $("#up_ip_address").val(value.ip);
              $("#up_device_id").val("");
              $("#up_channel_id").val("");
            }
            if (value.device_type == "CAM") {
              $(".uip_address").show();
              $(".uport").show();
              $(".uusername").show();
              $(".upassword").show();
              $(".udevice_id").hide();
              $(".uchannel_id").hide();
              $("#up_port").val(value.port);
              $("#up_ip_address").val(value.ip);
              $("#up_username").val(value.user_name);
              $("#up_password").val(value.password);
              $("#up_device_id").val("");
              $("#up_channel_id").val("");
            }
            if (value.device_type == "AC") {
              $(".udevice_id").show();
              $(".uchannel_id").show();
              $(".uip_address").hide();
              $(".uusername").hide();
              $(".upassword").hide();
              $(".uport").hide();
              $("#up_device_id").val(value.device_id);
              $("#up_channel_id").val(value.channel_id);
            }

            $.ajax({
              url: '/triggerAction/getArea/',
              dataType: 'json',
              type: 'GET',
              success: function (data) {
                $('#up_floor').html('<option value="">Select Floor</option>');
                $.each(data.areas, function (index, value) {
                  $("#up_floor").append("<option value='" + value.name + "' f-id='" + value.id + "'>" + value.name + "</option>");
                });
                /********************* */
                for (var i = 0; i < data.areas.length; i++) {
                  $.each(data.areas[i].departments, function (k, j) {
                    $.each(data.areas[i].departments[k].sub_area, function (l, m) {
                      var record = m.area_devices.split(",");
                      for (var n = 0; n < record.length; n++) {
                        if (record[n] == String(id)) {
                          $("#up_floor option[value='" + data.areas[i].name + "']").prop("selected", true);
                          // console.log(data.areas[i].name)
                          // console.log(j.name)
                          // console.log(m.name)
                        }
                      }
                    });
                  });
                }
                /********************* */
                var s_area = $("#up_floor").val();
                for (var i = 0; i < data.areas.length; i++) {
                  if (data.areas[i].name == s_area) {
                    $('#up_area').html('<option value="">Select Area</option>');
                    $('#up_subarea').html('<option value="">Select Sub Area</option>');
                    $.each(data.areas[i].departments, function (i, v) {
                      var op = "<option value='" + String(v.name) + "' a-id='" + v.id + "'>" + String(v.name) + "</option>";
                      $(op).appendTo("#up_area");
                    });
                  }
                }
                /********************* */
                for (var i = 0; i < data.areas.length; i++) {
                  $.each(data.areas[i].departments, function (k, j) {
                    $.each(data.areas[i].departments[k].sub_area, function (l, m) {
                      var record = m.area_devices.split(",");
                      for (var n = 0; n < record.length; n++) {
                        if (record[n] == String(id)) {
                          $("#up_area option[value='" + j.name + "']").prop("selected", true);
                          // console.log(data.areas[i].name)
                          // console.log(j.name)
                          // console.log(m.name)
                        }
                      }
                    });
                  });
                }
                /********************* */
                var s_dept = $("#up_area").val();
                var s_area = $("#up_floor").val();
                for (var i = 0; i < data.areas.length; i++) {
                  if (data.areas[i].name == s_area) {
                    $.each(data.areas[i].departments, function (k, j) {
                      if (j.name == s_dept) {
                        $('#up_subarea').html('<option value="">Select Sub Area</option>');
                        $.each(data.areas[i].departments[k].sub_area, function (l, m) {
                          var op = "<option value='" + String(m.name) + "' sub-id='" + m.id + "'>" + String(m.name) + "</option>";
                          $(op).appendTo("#up_subarea");
                        });
                      }
                    });
                  }
                }
                /********************* */
                for (var i = 0; i < data.areas.length; i++) {
                  $.each(data.areas[i].departments, function (k, j) {
                    $.each(data.areas[i].departments[k].sub_area, function (l, m) {
                      var record = m.area_devices.split(",");
                      for (var n = 0; n < record.length; n++) {
                        if (record[n] == String(id)) {
                          $("#up_subarea option[value='" + m.name + "']").prop("selected", true);
                          // console.log(data.areas[i].name)
                          // console.log(j.name)
                          // console.log(m.name)
                        }
                      }
                    });
                  });
                }
              }
            });
          }
        });
      }
    })
  });
  /*********************************************************get floor,area,sub area */
  getData();
  function getData() {
    $.ajax({
      url: '/triggerAction/getArea/',
      dataType: 'json',
      type: 'GET',
      success: function (data) {
        // /*******************************************************Add Floor 
        // window.jdata = data;
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
              $.each(data.areas[i].departments, function (i, v) {
                var op = "<option value='" + String(v.name) + "' a-id='" + v.id + "'>" + String(v.name) + "</option>";
                $(op).appendTo("#area");
              });
            }
          }
        });
        //********* */
        $('#up_floor').on('change', function () {
          var s_area = $(this).val();
          for (var i = 0; i < data.areas.length; i++) {
            if (data.areas[i].name == s_area) {
              $('#up_area').html('<option value="">Select Area</option>');
              $('#up_subarea').html('<option value="">Select Sub Area</option>');
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
                  $.each(data.areas[i].departments[k].sub_area, function (l, m) {
                    var op = "<option value='" + String(m.name) + "' sub-id='" + m.id + "'>" + String(m.name) + "</option>";
                    $(op).appendTo("#subarea");
                  });
                }
              });
            }
          }
        });
        /****************** */
        $('#up_area').on('change', function () {
          var s_dept = $(this).val();
          var s_area = $("#up_floor").val();
          for (var i = 0; i < data.areas.length; i++) {
            if (data.areas[i].name == s_area) {
              $.each(data.areas[i].departments, function (k, j) {
                if (j.name == s_dept) {
                  $('#up_subarea').html('<option value="">Select Sub Area</option>');
                  $.each(data.areas[i].departments[k].sub_area, function (l, m) {
                    var op = "<option value='" + String(m.name) + "' sub-id='" + m.id + "'>" + String(m.name) + "</option>";
                    $(op).appendTo("#up_subarea");
                  });
                }
              });
            }
          }
        });
        // ****************************************************Add more device
        window.d_id = 3;
        window.select = 1;
        $(".add-more").click(function () {
          select++;
          var html = '';
          // html +='<tr id="addmoreth" class = "commonaddmore">';
          // html +='<th>';
          // html +='<p>Device Name</p>';
          // html +='</th>';
          // html +='<th>';
          // html +='<p>Device Type</p>';
          // html +='</th>';
          // html +='<th>';
          // html +='<p>Appliances</p>';
          // html +='</th>';
          // html +='<th id="hdevice_id_'+d_id+'" class="hdevice_id">';
          // html +='<p>Device Id</p>';
          // html +='</th>';
          // html +='<th id="hchannel_id_'+d_id+'" class="hchannel_id">';
          // html +='<p>Channel Id</p>';
          // html +='</th>';
          // html +='<th id="hip_address_'+d_id+'" class="hip_address">';
          // html +='<p>Ip Address</p>';
          // html +='</th>';
          // html +='<th id="hport_'+d_id+'" class="hport">';
          // html +='<p>Port</p>';
          // html +='</th>';
          // html +='<th id="husername_'+d_id+'" class="husername">';
          // html +='<p>User Name</p>';
          // html +='</th>';
          // html +='<th id="hpassword_'+d_id+'" class="hpassword">';
          // html +='<p>Password</p>';
          // html +='</th>';
          // html +='</tr >';
          html += '<tr id="addmoretr" class = "commonaddmore">';
          html += '<td>';
          html += '<input type="text" name="device_name" id="device_name_' + d_id + '" class="device_name" placeholder="enter device name..">';
          html += '</td>';
          html += '<td>';
          html += '<select name="device_type" id="device_type_' + d_id + '" device-id="' + d_id + '">';
          html += '<option selected disabled>Select Device</option>';
          html += '<option value="AC">Air Ccondtion</option>';
          html += '<option value="RL">Relays</option>';
          html += '<option value="TV">Television</option>';
          html += '<option value="AVR">Audio Video Receiver</option>';
          html += '<option value="CAM">CCTV Camera</option>';
          html += '</select>';
          html += '</td>';
          html += '<td>';
          html += '<select name="app_type" id="app_type_' + d_id + '">';
          html += '<option selected disabled>Select Appliances</option>';
          html += '<option value="AC">Air Ccondtion</option>';
          html += '<option value="L">Light</option>';
          html += '<option value="S">Speaker</option>';
          html += '<option value="C">Curtain</option>';
          html += '<option value="CAM">CCTV Camera</option>';
          html += '</select>';
          html += '</td>';
          html += '<td id="d_id_' + d_id + '" class="addevice_id">';
          html += '<input type="text" name="device_id" id="device_id_' + d_id + '" class="adevice_id" placeholder="enter device id..">';
          html += '</td>';
          html += '<td id="c_id_' + d_id + '" class="adchannel_id">';
          html += '<input type="text" name="channel_id" id="channel_id_' + d_id + '" class="achannel_id" placeholder="enter channel id..">';
          html += '</td>';
          html += ' <td id="ip_' + d_id + '" class="adip_address">';
          html += '<input type="text" name="ip_address" id="ip_address_' + d_id + '" class="aip_address" placeholder="enter ip address..">';
          html += '</td>';
          html += '<td id="port_' + d_id + '" class="adport">';
          html += '<input type="text" name="port" id="ports_' + d_id + '" class="aport" placeholder="enter port number..">';
          html += '</td>';
          html += '<td id="uname_' + d_id + '" class="adusername">';
          html += '<input type="text" name="username" id="username_' + d_id + '" class="ausername" placeholder="enter user name..">';
          html += '</td>';
          html += '<td id="pwd_' + d_id + '" class="adpassword">';
          html += '<input type="password" name="password" id="password_' + d_id + '" class="apassword" placeholder="enter password..">';
          html += '</td>';
          html += '<td>';
          html += '<a id="remove_tr" href="#"><i class="fa fa-trash" aria-hidden="true"></i></a>';
          html += '</td>';
          html += '</tr>';

          $('table#device_tbl > tbody > tr:last').after(html);

          $("select[name='device_type']").change(function () {
            var did = $(this).attr("device-id");
            var name = $(this).val();
            // console.log(did, name)
            if (name == "RL") {
              $("#d_id_" + did).show();
              $("#c_id_" + did).show();
              $("#ip_" + did).hide();
              $("#port_" + did).hide();
              $("#uname_" + did).hide();
              $("#pwd_" + did).hide();
              $("#hdevice_id_" + did).show();
              $("#hchannel_id_" + did).show();
              $("#hip_address_" + did).hide();
              $("#hport_" + did).hide();
              $("#husername_" + did).hide();
              $("#hpassword_" + did).hide();
            }
            if (name == "TV") {
              $("#d_id_" + did).hide();
              $("#c_id_" + did).hide();
              $("#ip_" + did).show();
              $("#port_" + did).show();
              $("#uname_" + did).hide();
              $("#pwd_" + did).hide();
              $("#hdevice_id_" + did).hide();
              $("#hchannel_id_" + did).hide();
              $("#hip_address_" + did).show();
              $("#hport_" + did).show();
              $("#husername_" + did).hide();
              $("#hpassword_" + did).hide();
            }
            if (name == "AVR") {
              $("#d_id_" + did).hide();
              $("#c_id_" + did).hide();
              $("#ip_" + did).show();
              $("#port_" + did).show();
              $("#uname_" + did).hide();
              $("#pwd_" + did).hide();
              $("#hdevice_id_" + did).hide();
              $("#hchannel_id_" + did).hide();
              $("#hip_address_" + did).show();
              $("#hport_" + did).show();
              $("#husername_" + did).hide();
              $("#hpassword_" + did).hide();
            }
            if (name == "CAM") {
              $("#d_id_" + did).hide();
              $("#c_id_" + did).hide();
              $("#ip_" + did).show();
              $("#port_" + did).show();
              $("#uname_" + did).show();
              $("#pwd_" + did).show();
              $("#hdevice_id_" + did).hide();
              $("#hchannel_id_" + did).hide();
              $("#hip_address_" + did).show();
              $("#hport_" + did).show();
              $("#husername_" + did).show();
              $("#hpassword_" + did).show();
            }
            if (name == "AC") {
              $("#d_id_" + did).show();
              $("#c_id_" + did).show();
              $("#ip_" + did).hide();
              $("#port_" + did).hide();
              $("#uname_" + did).hide();
              $("#pwd_" + did).hide();
              $("#hdevice_id_" + did).show();
              $("#hchannel_id_" + did).show();
              $("#hip_address_" + did).hide();
              $("#hport_" + did).hide();
              $("#husername_" + did).hide();
              $("#hpassword_" + did).hide();
            }
          });

          d_id++;
        });
        // console.log($("#device_name_3").val());
      }
    })
  }
  // ****************************************************Remove more device
  $(document).on('click', '#remove_tr', function () {
    $(this).closest('#addmoretr').remove();
  });
  $("#craete_device").click(function (e) {
    $("#up_submit_form").hide();
    $("#up_cancel").hide();
    $("#update_deviceform").hide();
    $("#deviceform").show();
    $("#submit_form").show();
    $("#cancel").show();
  });
  $("#cancel").click(function (e) {
    $("#deviceform").hide();
    $("#submit_form").hide();
    $("#cancel").hide();
    $('.commonaddmore').remove();
    $("#up_submit_form").hide();
    $("#up_cancel").hide();
    $("#update_deviceform").hide();
  });
  $("#up_cancel").click(function (e) {
    $("#deviceform").hide();
    $("#submit_form").hide();
    $("#craete_device").show();
    $("#cancel").hide();
    $("#up_submit_form").hide();
    $("#up_cancel").hide();
    $("#update_deviceform").hide();
  });
  /******************************************************on change device type */
  $('#device_type').on('change', function () {
    var dtype = $(this).val();
    if (dtype == "RL") {
      $(".device_id").show();
      $(".channel_id").show();
      $(".ip_address").hide();
      $(".port").hide();
      $(".username").hide();
      $(".password").hide();
    }
    if (dtype == "TV") {
      $(".ip_address").show();
      $(".port").show();
      $(".device_id").hide();
      $(".channel_id").hide();
      $(".username").hide();
      $(".password").hide();
    }
    if (dtype == "AVR") {
      $(".ip_address").show();
      $(".port").show();
      $(".device_id").hide();
      $(".channel_id").hide();
      $(".username").hide();
      $(".password").hide();
    }
    if (dtype == "CAM") {
      $(".ip_address").show();
      $(".port").show();
      $(".username").show();
      $(".password").show();
      $(".device_id").hide();
      $(".channel_id").hide();
    }
    if (dtype == "AC") {
      $(".device_id").show();
      $(".channel_id").show();
      $(".ip_address").hide();
      $(".username").hide();
      $(".password").hide();
      $(".port").hide();
    }
  });


  // ****************************************************Insert device
  $("#submit_form").click(function (e) {
    $("#deviceform").validate({
      rules: {
        floor: "required",
        area: "required",
        subarea: "required",
        device_name: "required",
        device_type: "required",
        app_type: "required",
        device_id: "required",
        channel_id: "required",
      },
      messages: {
        floor: "Please Select Floor",
        area: "Please Select Area",
        subarea: "Please Select Sub Area",
        device_name: "Please Enter Device Name",
        device_type: "Please Select Device Type",
        app_type: "Please Select App Type",
        device_id: "Please Enter Device Id",
        channel_id: "Please Enter Channel Id",
      }
    });
    //   $('input.device_id').each(function() {
    //     $(this).rules('add', {
    //         required: true,
    //         messages: {
    //             required: 'Please Enter Device Id'
    //         }
    //     });
    // });
    $("#deviceform").valid();
    e.preventDefault();
    var floor = $("#floor").find(':selected').attr('f-id');
    var area = $("#area").find(':selected').attr('a-id');
    var subarea = $("#subarea").find(':selected').attr('sub-id');
    var device_name = $('#device_name').val();
    var device_type = $('#device_type').val();
    var app_type = $('#app_type').val();
    var device_id = $('#device_id').val();
    var channel_id = $('#channel_id').val();
    var ip = $('#ip_address').val();
    var port = $('#port').val();
    var username = $('#username').val();
    var password = $('#password').val();
    var devices = []
    if (device_type == "RL") {
      devices.push({
        "record_id": 1,
        "device_name": device_name,
        "device_type": device_type,
        "app_type": app_type,
        "device_id": device_id,
        "channel_id": channel_id,
        "device_status": "false"
      });
    }
    if (device_type == "AC") {
      devices.push({
        "record_id": 1,
        "device_name": device_name,
        "device_type": device_type,
        "app_type": app_type,
        "device_id": device_id,
        "channel_id": channel_id,
        "ac_temp": "",
        "rm_temp": "",
        "mode": "",
        "swing": "",
        "fspeed": "",
        "device_status": "false"
      });
    }
    if (device_type == "TV" || device_type == "AVR") {
      devices.push({
        "record_id": 1,
        "device_name": device_name,
        "device_type": device_type,
        "app_type": app_type,
        "ip": ip,
        "port": port,
        "device_status": "false"
      });
    }
    if (device_type == "CAM") {
      devices.push({
        "record_id": 1,
        "device_name": device_name,
        "device_type": device_type,
        "app_type": app_type,
        "ip": ip,
        "port": port,
        "user_name": username,
        "password": password,
        "device_status": "false"
      });
    }
    var len = window.d_id;
    var i = 0;
    for (i = 3; i < Number(len); i++) {
      // console.log(i);
      // console.log($("#device_name_3").val());
      // if ($("#device_name_" + i).val() != null && $("#device_type_" + i).val() != null && $("#app_type_" + i).val() != null && $("#device_id_" + i).val() != null && $("#channel_id_" + i).val() != null) {
      //   if ($("#device_name_" + i).val() != "" && $("#device_type_" + i).val() != "" && $("#app_type_" + i).val() != "" && $("#device_id_" + i).val() != "" && $("#channel_id_" + i).val() != "") {
      var channelid = $("#channel_id_" + i).val();
      var deviceid = $("#device_id_" + i).val();
      var dname = $("#device_name_" + i).val();
      var d_type = $("#device_type_" + i).val();
      var a_type = $("#app_type_" + i).val();
      var aip = $('#ip_address_' + i).val();
      var aport = $('#ports_' + i).val();
      var ausername = $('#username_' + i).val();
      var apassword = $('#password_' + i).val();
      // console.log(d_type);
      /**** */
      if (d_type == "RL" || d_type == "AC") {
        console.log(device_data)
        mcid = false;
        mdid = false;
        $.each(device_data, function (index, value) {
          // console.log(value.channel_id,channelid)
          if (value.channel_id == channelid) {
            mcid = true;
          }
          if (value.device_id == deviceid) {
            mdid = true;
          }
        });
        if (mdid == true && mcid == true) {
          alert(dname + " Channel Id and Device Id Already Exist.!")
        }
        if (mdid == true && mcid == false) {
          alert(dname + " Device Id Already Exist.!")
        }
        if (mdid == false && mcid == true) {
          alert(dname + " Channel Id Already Exist.!")
        }
        if (mdid == false && mcid == false) {
          console.log(i)
          if (d_type == "RL") {
            devices.push({
              "record_id": 1,
              "device_name": dname,
              "device_type": d_type,
              "app_type": a_type,
              "device_id": deviceid,
              "channel_id": channelid,
              "device_status": "false"
            })
          }
          if (d_type == "AC") {
            devices.push({
              "record_id": 1,
              "device_name": dname,
              "device_type": d_type,
              "app_type": a_type,
              "device_id": deviceid,
              "channel_id": channelid,
              "ac_temp": "",
              "rm_temp": "",
              "mode": "",
              "swing": "",
              "fspeed": "",
              "device_status": "false"
            })
          }
        }
      }
      if (d_type == "TV" || d_type == "AVR") {
        devices.push({
          "record_id": 1,
          "device_name": dname,
          "device_type": d_type,
          "app_type": a_type,
          "ip": aip,
          "port": aport,
          "device_status": "false"
        });
      }
      if (d_type == "CAM") {
        devices.push({
          "record_id": 1,
          "device_name": dname,
          "device_type": d_type,
          "app_type": a_type,
          "ip": aip,
          "port": aport,
          "user_name": ausername,
          "password": apassword,
          "device_status": "false"
        });
      }
    }
    console.log(device_data);
    var c_id = false;
    var d_id = false;
    $.each(device_data, function (index, value) {
      if (value.channel_id == channel_id) {
        console.log(value.channel_id, channel_id);
        c_id = true;
      }
      if (value.device_id == device_id) {
        d_id = true;
      }
    });
    console.log(d_id, c_id)
    if (d_id == true && c_id == true) {
      alert(device_name + " Channel Id and Device Id Already Exist.!")
    }
    if (d_id == true && c_id == false) {
      alert(device_name + " Device Id Already Exist.!")
    }
    if (d_id == false && c_id == true) {
      alert(device_name + " Channel Id Already Exist.!")
    }
    if (d_id == false && c_id == false) {
      console.log("updated", devices)
      if (floor != "" && area != "" && subarea != "" && device_name != "") {
        data = {
          'floor': Number(floor),
          'area': Number(area),
          'subarea': Number(subarea),
          'devices': devices,
          'opr_type': 'comp_opr',
          'opr': 'add'
        }
        $('.commonaddmore').remove();
        $("#deviceform").hide();
        $("#submit_form").hide();
        $("#cancel").hide();
        $('#floor').val("");
        $('#area').val("");
        $('#subarea').val("");
        $('#device_name').val("");
        $('#device_type').val("");
        $('#app_type').val("");
        $('#device_id').val("");
        $('#channel_id').val("");
        bmsSocket.send(JSON.stringify(data));
      }

    }
    // console.log(devices)

    return false;
  });
  /******************************************************on change update device */
  $('#up_device_type').on('change', function () {
    var dtype = $(this).val();
    if (dtype == "RL") {
      $(".udevice_id").show();
      $(".uchannel_id").show();
      $(".uip_address").hide();
      $(".uport").hide();
      $(".uusername").hide();
      $(".upassword").hide();
      $("#up_device_id").val("");
      $("#up_channel_id").val("");
      $("#up_ip_address").val("");
      $("#up_port").val("");
    }
    if (dtype == "TV") {
      $(".uip_address").show();
      $(".uport").show();
      $(".udevice_id").hide();
      $(".uchannel_id").hide();
      $(".uusername").hide();
      $(".upassword").hide();
      $("#up_device_id").val("");
      $("#up_channel_id").val("");
      $("#up_ip_address").val("");
      $("#up_port").val("");
    }
    if (dtype == "AVR") {
      $(".uip_address").show();
      $(".uport").show();
      $(".udevice_id").hide();
      $(".uchannel_id").hide();
      $(".uusername").hide();
      $(".upassword").hide();
      $("#up_device_id").val("");
      $("#up_channel_id").val("");
      $("#up_ip_address").val("");
      $("#up_port").val("");
    }
    if (dtype == "CAM") {
      $(".uip_address").show();
      $(".uport").show();
      $(".uusername").show();
      $(".upassword").show();
      $(".udevice_id").hide();
      $(".uchannel_id").hide();
      $("#up_device_id").val("");
      $("#up_channel_id").val("");
      $("#up_ip_address").val("");
      $("#up_port").val("");
      $("#up_username").val("");
      $("#up_password").val("");
    }
    if (dtype == "AC") {
      $(".udevice_id").show();
      $(".uchannel_id").show();
      $(".uip_address").hide();
      $(".uusername").hide();
      $(".upassword").hide();
      $(".uport").hide();
      $("#up_device_id").val("");
      $("#up_channel_id").val("");
      $("#up_ip_address").val("");
      $("#up_port").val("");
    }
  });
  // ****************************************************update device
  $("#up_submit_form").click(function (e) {
    console.log("update", device_data)
    var c_id = false;
    var d_id = false;
    var up_id = 0;
    $.each(device_data, function (index, value) {
      if (value.record_id == Number($("#upid").val())) {
        up_id = value.record_id;
      }
      if (value.channel_id == $("#up_channel_id").val()) {
        console.log(value.channel_id, channel_id);
        c_id = true;
      }
      if (value.device_id == $("#up_device_id").val()) {
        d_id = true;
      }
    });
    console.log(up_id, $("#upid").val())
    if (d_id == false && c_id == false) {
      $("#update_deviceform").validate({
        rules: {
          up_floor: "required",
          up_area: "required",
          up_subarea: "required",
        },
        messages: {
          up_floor: "Please Select Floor",
          up_area: "Please Select Area",
          up_subarea: "Please Select Sub Area",
        }
      });
      $("#update_deviceform").valid();
      var floor = $("#up_floor").find(':selected').attr('f-id');
      var area = $("#up_area").find(':selected').attr('a-id');
      var subarea = $("#up_subarea").find(':selected').attr('sub-id');
      if ($("#up_device_type").val() == "RL") {
        up_device = {
          "record_id": Number($("#upid").val()),
          "device_name": $("#up_device_name").val(),
          "device_type": $("#up_device_type").val(),
          "app_type": $("#up_app_type").val(),
          "device_id": $("#up_device_id").val(),
          "channel_id": $("#up_channel_id").val(),
          "device_status": "false"
        }
      }
      if ($("#up_device_type").val() == "AC") {
        up_device = {
          "record_id": Number($("#upid").val()),
          "device_name": $("#up_device_name").val(),
          "device_type": $("#up_device_type").val(),
          "app_type": $("#up_app_type").val(),
          "device_id": $("#up_device_id").val(),
          "channel_id": $("#up_channel_id").val(),
          "ac_temp": "",
          "rm_temp": "",
          "mode": "",
          "swing": "",
          "fspeed": "",
          "device_status": "false"
        }
      }
      if ($("#up_device_type").val() == "TV" || $("#up_device_type").val() == "AVR") {
        up_device = {
          "record_id": Number($("#upid").val()),
          "device_name": $("#up_device_name").val(),
          "device_type": $("#up_device_type").val(),
          "app_type": $("#up_app_type").val(),
          "ip": $("#up_ip_address").val(),
          "port": $("#up_port").val(),
          "device_status": "false"
        }
      }
      if ($("#up_device_type").val() == "CAM") {
        up_device = {
          "record_id": Number($("#upid").val()),
          "device_name": $("#up_device_name").val(),
          "device_type": $("#up_device_type").val(),
          "app_type": $("#up_app_type").val(),
          "ip": $("#up_ip_address").val(),
          "port": $("#up_port").val(),
          "user_name": $("#up_username").val(),
          "password": $("#up_password").val(),
          "device_status": "false"
        }
      }

      console.log(up_device)
      if (floor != "" && area != "" && subarea != "") {
        data = {
          'floor': Number(floor),
          'area': Number(area),
          'subarea': Number(subarea),
          'up_devices': up_device,
          'opr_type': 'comp_opr',
          'opr': 'update'
        }
        console.log(data)
        $("#up_submit_form").hide();
        $("#up_cancel").hide();
        $("#update_deviceform").hide();
        $("#craete_device").show();
        bmsSocket.send(JSON.stringify(data));
      }
    }
    if (d_id == true && c_id == true) {
      alert(" Channel Id and Device Id Already Exist.!")
    }
    if (d_id == true && c_id == false) {
      alert(" Device Id Already Exist.!")
    }
    if (d_id == false && c_id == true) {
      alert(" Channel Id Already Exist.!")
    }
  });
});
