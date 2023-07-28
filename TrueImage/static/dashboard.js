
var connectionString = 'ws://' + window.location.host + '/dash/';
var bmsSocket = new WebSocket(connectionString);

var card_config;
var card_types;
var site_config;

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
    // Sending info about the room

    bmsSocket.onmessage = function (e) {
        let data = JSON.parse(e.data);
        
        var str = JSON.stringify(data, null, 2);

        var obj = JSON.parse(str);
        card_config = {}; 
        if(obj.payload.type == 'card_config'){
            card_config = obj.payload.response.cards;
            console.log(card_config);
            card_config.sort(function(a, b){
                var a1= a.position, b1= b.position;
                if(a1== b1) return 0;
                return a1> b1? 1: -1;
            });
            
            $("#col_1").empty();
            $("#col_2").empty();
            $("#col_3").empty();
            $("#col_4").empty();
            $("#col_main").empty();

            renderCards(card_config);
        }
        if(obj.payload.type == 'cards_type_config'){
            card_types = obj.payload.response;
            console.log(card_types);
            renderCardTypes(card_types);
        }
        if(obj.payload.type == 'site_config'){          
            site_config = obj.payload.response;
            console.log(site_config);          
        }
        
    };

    if (bmsSocket.readyState == WebSocket.OPEN) {
        bmsSocket.onopen();
    }
}

// connect dahboard socket on load
connect();

// delete card
$(document).on('click', '.card_del', function(){
    var card_id = $(this).data('card_id');
    data = {
        'card_id' : card_id,
        'opr_type' : 'card_opr',
        'opr' : 'del'
    }
    bmsSocket.send(JSON.stringify(data));
});

// move card up
$(document).on('click', '.card_move_up', function(){
    // console.log('Moving up');
    var card_id = $(this).data('card_id');
    var card_col = $(this).data('col');
    var card_pos = $(this).data('pos');
    var  index = card_config.findIndex(p => p.position == card_pos);
    
    if(index == 0){
        alert('Something is wrong');
    }else {
        card_1 = card_config[index - 1].id;
        card_2 = card_config[index].id;
        // console.log(index);
        // console.log(card_config)
        
        data = {
            'card_id' : card_id,
            'opr_type' : 'card_opr',
            'opr' : 'move_up',
            'cards': card_1 + ',' + card_2
        }
        // console.log(data);
        bmsSocket.send(JSON.stringify(data));
    }
});

// move card down
$(document).on('click', '.card_move_down', function(){
    // console.log('Moving down');
    var card_id = $(this).data('card_id');
    var card_col = $(this).data('col');
    var card_pos = $(this).data('pos');
    var  index = card_config.findIndex(p => p.position == card_pos);
    // console.log(card_config[index], card_config[index + 1])
    var last_index = card_config.length - 2
    // console.log(index, last_index);
    if(index == last_index){
       alert('Sorry your cannot move last cards');
    }else{
        card_1 = card_config[index + 1].id;
        card_2 = card_config[index].id;
        // console.log(index);
        // console.log(card_config)
        data = {
            'card_id' : card_id,
            'opr_type' : 'card_opr',
            'opr' : 'move_down',
            'cards': card_1 + ',' + card_2
        }
        // console.log(data);
        bmsSocket.send(JSON.stringify(data));
    }
});

// get card types from socket
$(document).on('click', '.card_add', function(){ 
    if(card_types == null){
        data = {
            'opr_type' : 'get',
            'opr' : 'get_card_types'
        }
        bmsSocket.send(JSON.stringify(data));
    }
    if(site_config == null){
        data = {
            'opr_type' : 'get',
            'opr' : 'get_site_config'
        }
        bmsSocket.send(JSON.stringify(data));
    }
    // console.log('starting waiting');
    setTimeout(
        function() 
        {
        
            // console.log('end');
            // console.log(card_types, site_config);
            $('.card_type_submit').attr("hidden",true);
            $('.card_type_back').attr("hidden",true);

            $('.card_type_cancel').removeAttr('hidden');
            $('.card_type_next').removeAttr('hidden');
            $('.card_types_modal').empty(html);
            
            // console.log('waiting for data');
            renderCardTypes(card_types);
        }, 2000);
        
});

var selected_card_type;
// card insertion wizard
$(document).on('click', '.card_type_next', function(){
    
    selected_card_type = $('input[name="card_type"]:checked').val();
   
    if(selected_card_type == null){
        alert('Please select card type');
    }else{
        $('.card_type_submit').removeAttr('hidden');
        $('.card_type_back').removeAttr('hidden');

        $('.card_type_cancel').attr("hidden",true);
        $('.card_type_next').attr("hidden",true);

        $('.card_types_modal').empty(html);
        renderCardEditor(selected_card_type, site_config);
    }
});

$(document).on('click', '.card_type_back', function(){
    
    $('.card_type_submit').attr("hidden",true);
    $('.card_type_back').attr("hidden",true);

    $('.card_type_cancel').removeAttr('hidden');
    $('.card_type_next').removeAttr('hidden');
    $('.card_types_modal').empty(html);
    renderCardTypes(card_types);
});

// $(".s_ac_selection").on('change', function(){
//     var selectedCountry = $(this).children("option:selected").val();
//     alert("You have selected the country - " + selectedCountry);
// });




// function getSingleAC(sel){
//     console.log(sel.value);
// }
$(document).on('click', '.card_type_submit', function(){
    console.log('submitting');
    if(selected_card_type == 'S_AC'){
        var card_name = $('#s_ac_card_name').val();
        var selected_comp = $('#s_ac').val();
        var card_column = $('#card_column').val();
            
        if(card_name == ''){    
            alert("Please Enter card title.");  
            return false;   
        }   
        if(selected_comp != ''){    
            card_data = {   
                "card_type": "S_AC",    
                "col": card_column, 
                "record_id" : selected_comp,    
                "title" : card_name,    
            },  
            data = {    
                'card_id' : 0,  
                'opr_type' : 'card_opr',    
                'opr' : 'add',  
                'card' : card_data  
            }   
            bmsSocket.send(JSON.stringify(data));   
            $('#exampleModal').modal('hide');   
        }else{  
            alert("Please select devices.");    
            return false;   
        }
        
    }else if(selected_card_type == 'M_AC'){
        var card_name = $('#m_ac_card_name').val();
        var card_column = $('#card_column').val();
        
        if(card_name == ''){   
            alert("Please Enter card title.");  
            return false;   
        }

        var selected_comp = [];
        $('select[name="m_card_ac[]"]').each(function(){
            var text = $(this).children("option").filter(":selected").text();
            var value = $(this).val();
            // selected_comp[text] = value;
            if(value > 0){  
                selected_comp.push(value);  
            }
        });
        selected_comp = selected_comp.join(',');

        if(selected_comp != ''){    
            card_data = {   
                "card_type": "M_AC",    
                "col": card_column, 
                "record_id" : selected_comp,    
                "title" : card_name,    
            },  
            data = {    
                'card_id' : 0,  
                'opr_type' : 'card_opr',    
                'opr' : 'add',  
                'card' : card_data  
            }   
            bmsSocket.send(JSON.stringify(data));   
            $('#exampleModal').modal('hide');   
        }else{  
            alert("Please select devices.");    
            return false;   
        }
    }else if(selected_card_type == 'CAM'){
        var card_name = $('#cam_card_name').val();
        var card_column = $('#card_column').val();
        var selected_comp = $('#cam_device').val();

        if(card_name == ''){   
            alert("Please Enter card title.");  
            return false;   
        }

        if(selected_comp != ''){    
            card_data = {   
                "card_type": "CAM", 
                "col": card_column, 
                "record_id" : selected_comp,    
                "title" : card_name,    
            },  
            data = {    
                'card_id' : 0,  
                'opr_type' : 'card_opr',    
                'opr' : 'add',  
                'card' : card_data  
            }   
            bmsSocket.send(JSON.stringify(data));   
            $('#exampleModal').modal('hide');   
        }else{  
            alert("Please select devices.");    
            return false;   
        }
    }else if(selected_card_type == 'WHT'){
        var card_name = $('#wht_card_name').val();
        var card_column = $('#card_column').val();
        var selected_comp = "";

        if(card_name == ''){    
            alert("Please Enter card title.");  
            return false;   
        }

        card_data = {
            "card_type": "WHT",
            "col": card_column,
            "record_id" : selected_comp,
            "title" : card_name,
        },
        data = {
            'card_id' : 0,
            'opr_type' : 'card_opr',
            'opr' : 'add',
            'card' : card_data
        }
        bmsSocket.send(JSON.stringify(data));
        $('#exampleModal').modal('hide');
    }else if(selected_card_type == 'M_L'){
        var card_name = $('#m_l_card_name').val();
        var card_column = $('#card_column').val();


        if(card_name == ''){    
            alert("Please Enter card title.");  
            return false;   
        }

        var selected_comp = [];
        $('select[name="m_card_ac[]"]').each(function(){
            var text = $(this).children("option").filter(":selected").text();
            var value = $(this).val();
            // selected_comp[text] = value;
            if(value > 0){    
                selected_comp.push(value);  
            }
        });
        selected_comp = selected_comp.join(',');

        if(selected_comp != ''){    
            card_data = {   
                "card_type": "M_L", 
                "col": card_column, 
                "record_id" : selected_comp,    
                "title" : card_name,    
            },  
            data = {    
                'card_id' : 0,  
                'opr_type' : 'card_opr',    
                'opr' : 'add',  
                'card' : card_data  
            }   
            bmsSocket.send(JSON.stringify(data));   
            $('#exampleModal').modal('hide');   
        }else{  
            alert("Please select devices.");    
            return false;   
        }
    }
    
});

//multiple AC Row Added
function add_row(type){
    html = '';
    var count = $(".main_div .row").length;
    count = count + 1;
    var subarea = $("#subarea").find("option:selected").val();
    var department = $("#department").find("option:selected").val();
    var floor = $("#floor").find("option:selected").val();

    html = '<div class="row" id="row_'+count+'">'+
                '<div class="col-12 col-xl-10 device_ddl">';
                if(floor > 0 && department > 0 && subarea > 0){
                     // alert("floordepartmentsubarea");
                    html +='<select name="m_card_ac[]" style="width:100%;">'+
                            '<option>Select Device</option>';
                    for (var i = 0; i < site_config.areas.length; i++) {  
                        if(site_config.areas[i].id == floor){
                            for(var j = 0; j < site_config.areas[i].departments.length;j++){
                                if(site_config.areas[i].departments[j].id == department){
                                    for(var k = 0; k < site_config.areas[i].departments[j].sub_area.length;k++){
                                        if(site_config.areas[i].departments[j].sub_area[k].id == subarea){
                                            for (var m = 0; m < site_config.areas[i].departments[j].sub_area[k].components.length; m++) { 
                                                if(site_config.areas[i].departments[j].sub_area[k].components[m].device_type == type){
                                                    html += '<option value="'+ site_config.areas[j].departments[j].sub_area[k].components[m].device_id +'" data-floor-id="'+site_config.areas[i].id+'" data-department="'+ site_config.areas[i].departments[j].id+'" data-subarea="'+site_config.areas[i].departments[j].sub_area[k].id+'">'+ site_config.areas[i].departments[j].sub_area[k].components[m].device_name +'</option>';
                                                }
                                            }   
                                        } 
                                    }
                                }
                            } 
                        }                 
                    }
                    html +='</select>';
                }else if(floor > 0 && department > 0){
                    // alert("floordepartment");
                    html +='<select name="m_card_ac[]" style="width:100%;">'+
                            '<option>Select Device</option>';
                    for (var i = 0; i < site_config.areas.length; i++) {  
                        if(site_config.areas[i].id == floor){
                            for(var j = 0; j < site_config.areas[i].departments.length;j++){
                                if(site_config.areas[i].departments[j].id == department){
                                    for(var k = 0; k < site_config.areas[i].departments[j].sub_area.length;k++){
                                        for (var m = 0; m < site_config.areas[i].departments[j].sub_area[k].components.length; m++) { 
                                            if(site_config.areas[i].departments[j].sub_area[k].components[m].device_type == type){
                                                html += '<option value="'+ site_config.areas[j].departments[j].sub_area[k].components[m].device_id +'" data-floor-id="'+site_config.areas[i].id+'" data-department="'+ site_config.areas[i].departments[j].id+'" data-subarea="'+site_config.areas[i].departments[j].sub_area[k].id+'">'+ site_config.areas[i].departments[j].sub_area[k].components[m].device_name +'</option>';
                                            }
                                        }   
                                    }
                                }
                            } 
                        }                 
                    }
                    html +='</select>';
                }else if(floor > 0){
                    // alert("floor");
                    html +='<select name="m_card_ac[]" style="width:100%;">'+
                            '<option>Select Device</option>';
                    for (var i = 0; i < site_config.areas.length; i++) {  
                        if(site_config.areas[i].id == floor){
                            for(var j = 0; j < site_config.areas[i].departments.length;j++){
                                for(var k = 0; k < site_config.areas[i].departments[j].sub_area.length;k++){
                                    for (var m = 0; m < site_config.areas[i].departments[j].sub_area[k].components.length; m++) { 
                                        if(site_config.areas[i].departments[j].sub_area[k].components[m].device_type == type){
                                            html += '<option value="'+ site_config.areas[j].departments[j].sub_area[k].components[m].device_id +'" data-floor-id="'+site_config.areas[i].id+'" data-department="'+ site_config.areas[i].departments[j].id+'" data-subarea="'+site_config.areas[i].departments[j].sub_area[k].id+'">'+ site_config.areas[i].departments[j].sub_area[k].components[m].device_name +'</option>';
                                        }
                                    }   
                                }
                            } 
                        }                 
                    }
                    html +='</select>';
   
                }else{
                    html +='<select name="m_card_ac[]" style="width:100%;">'+
                        '<option>Select Device</option>';
                        for (var i = 0; i < site_config.devices.length; i++) {                        
                            // console.log(site_config.devices[i].device_name);
                            if(site_config.devices[i].device_type == type){
                                html += '<option value= '+ site_config.devices[i].record_id +'>'+ site_config.devices[i].device_name +'</option>';
                            }
                        }
                    html +='</select>';
                }
                html +='</div>'+     
                '<div class="col-12 col-xl-1 " style="padding:10px;">'+
                    '<i class="fas fa-times fa-lg" style="font-weight:unset;" onclick="delete_row('+count+');"></i>'+
                '</div>'+
            '</div>';
    $(".main_div .add_row").before(html);
}
//multiple AC Row delete
function delete_row(count){
    $("#row_"+count).remove();
}

function floor_wise_dept(type){
    var html = '';
    var floor = $("#floor").find("option:selected").val();
    html ='<p>Select Department</p>'+
            '<select id="department" onchange="dept_wise_subarea(\''+type+'\');subarea_wise_device(\''+type+'\');">'+
                '<option>Select Department</option>';
    for (var i = 0; i < site_config.areas.length; i++) { 
        if(site_config.areas[i].id == floor){
            for(var j = 0; j < site_config.areas[i].departments.length;j++){
                html += '<option value="'+ site_config.areas[i].departments[j].id +'" data-floor-id="'+site_config.areas[i].id+'">'+ site_config.areas[i].departments[j].name +'</option>';
            }    
        }                  
    }
    html +='</select>';
    $("#department_div").html(html);
    
}

function dept_wise_subarea(type){
    var html = '';
    var department = $("#department").find("option:selected").val();
    var floor = $("#department").find("option:selected").data("floor-id");

    html ='<p>Select Area</p>'+
            '<select id="subarea" onchange="subarea_wise_device(\''+type+'\');subarea_wise_device(\''+type+'\');">'+
            '<option>Select Subarea</option>';
    for (var i = 0; i < site_config.areas.length; i++) {  
        if(site_config.areas[i].id == floor){
            for(var j = 0; j < site_config.areas[i].departments.length;j++){
                if(site_config.areas[i].departments[j].id == department){
                    for(var k = 0; k < site_config.areas[i].departments[j].sub_area.length;k++){
                        html += '<option value="'+ site_config.areas[j].departments[j].sub_area[k].id +'" data-floor-id="'+site_config.areas[i].id+'" data-department="'+ site_config.areas[j].departments[j].id+'">'+ site_config.areas[i].departments[j].sub_area[k].name +'</option>';
                    }    
                }
            } 
        }                 
    }
    html +='</select>';
    $("#subarea_div").html(html);
    
}

function subarea_wise_device(type){
    var html = '';
    var subarea = $("#subarea").find("option:selected").val();
    var department = $("#department").find("option:selected").val();
    var floor = $("#floor").find("option:selected").val();
    // alert("function call");
    
    if(floor > 0 && department > 0 && subarea > 0){
         // alert("floordepartmentsubarea");
        html ='<select name="m_card_ac[]" style="width:100%;">'+
                '<option>Select Device</option>';
        for (var i = 0; i < site_config.areas.length; i++) {  
            if(site_config.areas[i].id == floor){
                for(var j = 0; j < site_config.areas[i].departments.length;j++){
                    if(site_config.areas[i].departments[j].id == department){
                        for(var k = 0; k < site_config.areas[i].departments[j].sub_area.length;k++){
                            if(site_config.areas[i].departments[j].sub_area[k].id == subarea){
                                for (var m = 0; m < site_config.areas[i].departments[j].sub_area[k].components.length; m++) { 
                                    if(site_config.areas[i].departments[j].sub_area[k].components[m].device_type == type){
                                        html += '<option value="'+ site_config.areas[j].departments[j].sub_area[k].components[m].device_id +'" data-floor-id="'+site_config.areas[i].id+'" data-department="'+ site_config.areas[i].departments[j].id+'" data-subarea="'+site_config.areas[i].departments[j].sub_area[k].id+'">'+ site_config.areas[i].departments[j].sub_area[k].components[m].device_name +'</option>';
                                    }
                                }   
                            } 
                        }
                    }
                } 
            }                 
        }
        html +='</select>';
    }else if(floor > 0 && department > 0){
        // alert("floordepartment");
        html ='<select name="m_card_ac[]" style="width:100%;">'+
                '<option>Select Device</option>';
        for (var i = 0; i < site_config.areas.length; i++) {  
            if(site_config.areas[i].id == floor){
                for(var j = 0; j < site_config.areas[i].departments.length;j++){
                    if(site_config.areas[i].departments[j].id == department){
                        for(var k = 0; k < site_config.areas[i].departments[j].sub_area.length;k++){
                            for (var m = 0; m < site_config.areas[i].departments[j].sub_area[k].components.length; m++) { 
                                if(site_config.areas[i].departments[j].sub_area[k].components[m].device_type == type){
                                    html += '<option value="'+ site_config.areas[j].departments[j].sub_area[k].components[m].device_id +'" data-floor-id="'+site_config.areas[i].id+'" data-department="'+ site_config.areas[i].departments[j].id+'" data-subarea="'+site_config.areas[i].departments[j].sub_area[k].id+'">'+ site_config.areas[i].departments[j].sub_area[k].components[m].device_name +'</option>';
                                }
                            }   
                        }
                    }
                } 
            }                 
        }
        html +='</select>';
    }else if(floor > 0){
        // alert("floor");
        html ='<select name="m_card_ac[]" style="width:100%;">'+
                '<option>Select Device</option>';
        for (var i = 0; i < site_config.areas.length; i++) {  
            if(site_config.areas[i].id == floor){
                for(var j = 0; j < site_config.areas[i].departments.length;j++){
                    for(var k = 0; k < site_config.areas[i].departments[j].sub_area.length;k++){
                        for (var m = 0; m < site_config.areas[i].departments[j].sub_area[k].components.length; m++) { 
                            if(site_config.areas[i].departments[j].sub_area[k].components[m].device_type == type){
                                html += '<option value="'+ site_config.areas[j].departments[j].sub_area[k].components[m].device_id +'" data-floor-id="'+site_config.areas[i].id+'" data-department="'+ site_config.areas[i].departments[j].id+'" data-subarea="'+site_config.areas[i].departments[j].sub_area[k].id+'">'+ site_config.areas[i].departments[j].sub_area[k].components[m].device_name +'</option>';
                            }
                        }   
                    }
                } 
            }                 
        }
        html +='</select>';
    }
    $(".device_ddl").html(html);
}

function renderCardEditor(selected_card_type, site_config){
    // console.log(site_config.devices);
    html = '';
    if(selected_card_type == 'S_AC'){
        // alert('S_AC');
        // alert(site_config);
        html += '<div class="col-12 col-xl-6">'+
            '<div class="card" style="border: 1px solid #ddd;padding: 2%;background:#f7f8fa;">'+
                '<h6>Cards Details</h6>'+
                '<div class="col-12">'+
                    '<input type="text" id="s_ac_card_name" class="device_name" placeholder="Card Title">'+
                '</div>'+
                '<div class="col-12">'+
                    '<p>Device</p>'+
                    '<select id="s_ac" >';
                    for (var i = 0; i < site_config.devices.length; i++) {                        
                        // console.log(site_config.devices[i].device_name);
                        if(site_config.devices[i].device_type == 'AC'){
                            html += '<option value= '+ site_config.devices[i].record_id +'>'+ site_config.devices[i].device_name +'</option>';
                        }
                    }
                   
                    html += '</select>'+
                '</div>'+
                '<div class="col-12">'+
                    '<p>Select Column</p>'+
                    '<select id="card_column" >'+
                    '<option value="1">Column 1</option>'+
                    '<option value="2">Column 2</option>'+
                    '<option value="3">Column 3</option>'+
                    '<option value="4">Column 4</option>'+
                    '</select>'+
                '</div>'+
            '</div>'+
        '</div>';
        html += '<div class="col-12 col-xl-6">'+
            '<div class="card" style="border: 1px solid #ddd;padding: 2%;background:#f7f8fa;">'+
                '<h6>Cards Preview</h6>'+
                '<div class="card">'+
                    '<div class="card-block px-3">' +
                        '<i class="fas fa-edit"></i><span>Control Room</span>'+
                        '<div class="switch-wrapper line-switch">'+
                            '<input type="checkbox" id="switchBox2"class="switch-input" checked>'+
                            '<label for="switchBox2" class="switch-label"></label>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>';
        $('.card_types_modal').append(html);
    }else if(selected_card_type == 'M_AC'){
        html += '<div class="col-12 col-xl-6">'+
            '<div class="card" style="border: 1px solid #ddd;padding: 2%;background:#f7f8fa;">'+
                '<h6>Cards Details</h6>'+
                '<div class="col-12 col-xl-12">'+
                    '<input type="text" id="m_ac_card_name" class="device_name" placeholder="Card Title" style="width: 100%;">'+
                '</div>'+
                '<div class="col-12 col-xl-12">'+
                    '<div class="row">'+
                        '<div class="col-12 col-xl-4">'+
                            '<p>Select Floor</p>'+
                            '<select id="floor" onchange="floor_wise_dept(\'AC\');subarea_wise_device(\'AC\');">'+
                                '<option>Select Floor</option>';
                                for (var i = 0; i < site_config.areas.length; i++) {                        
                                    html += '<option value="'+ site_config.areas[i].id +'">'+ site_config.areas[i].name +'</option>';
                                }
                            html +='</select>'+
                        '</div>'+
                        '<div class="col-12 col-xl-4" id="department_div">'+
                            '<p>Select Department</p>'+
                            '<select id="department" onchange="dept_wise_subarea(\'AC\');subarea_wise_device(\'AC\');">'+
                                '<option>Select Department</option>';
                                for (var i = 0; i < site_config.areas.length; i++) {  
                                    for(var j = 0; j < site_config.areas[i].departments.length;j++){
                                        html += '<option value="'+ site_config.areas[i].departments[j].id +'" data-floor-id="'+site_config.areas[i].id+'">'+ site_config.areas[i].departments[j].name +'</option>';
                                    }                      
                                }
                            html +='</select>'+
                        '</div>'+
                        '<div class="col-12 col-xl-4" id="subarea_div">'+
                            '<p>Select Area</p>'+
                            '<select id="subarea" onchange="subarea_wise_device(\'AC\');">'+
                                '<option>Select Subarea</option>';
                                for (var i = 0; i < site_config.areas.length; i++) {  
                                    for(var j = 0; j < site_config.areas[i].departments.length;j++){
                                        for(var k = 0; k < site_config.areas[i].departments[j].sub_area.length;k++){
                                            html += '<option value="'+ site_config.areas[i].departments[j].sub_area[k].id +'">'+ site_config.areas[i].departments[j].sub_area[k].name +'</option>';
                                        }
                                    }                      
                                }
                            html +='</select>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
                '<h6>Devices (Required)</h6>'+
                '<div class="col-12 col-xl-12 main_div">'+
                    
                    '<div class="row add_row" id="row_1">'+
                        '<div class="col-12 col-xl-10 device_ddl" >'+
                            '<select name="m_card_ac[]" style="width:100%;">'+
                                '<option>Select Device</option>';
                                for (var i = 0; i < site_config.devices.length; i++) {                        
                                    // console.log(site_config.devices[i].device_name);
                                    if(site_config.devices[i].device_type == 'AC'){
                                        html += '<option value= '+ site_config.devices[i].record_id +'>'+ site_config.devices[i].device_name +'</option>';
                                    }
                                }
                            html +='</select>'+
                        '</div>'+     
                        '<div class="col-12 col-xl-1 " style="padding:10px;">'+
                            '<i class="fa fa-plus fa-lg" style="font-weight:unset;" onclick="add_row(\'AC\');"></i>'+
                        '</div>'+
                    '</div>'+ 
                    
                '</div>'+ 
                '<div class="col-12">'+
                    '<p>Select Column</p>'+
                    '<select id="card_column" >'+
                    '<option value="1">Column 1</option>'+
                    '<option value="2">Column 2</option>'+
                    '<option value="3">Column 3</option>'+
                    '<option value="4">Column 4</option>'+
                    '</select>'+
                '</div>'+   
            '</div>'+
        '</div>';
        html += '<div class="col-12 col-xl-6">'+
            '<div class="card" style="border: 1px solid #ddd;padding: 2%;background:#f7f8fa;">'+
                '<h6>Cards Preview</h6>'+
                '<div class="card" style="padding: 2%;margin: 5%;border: 1px solid #ddd;">'+
                    '<div class="card-block px-3">' +
                        '<i class="fas fa-edit"></i><span>Control Room</span>'+
                        '<div class="switch-wrapper line-switch">'+
                            '<input type="checkbox" id="switchBox2"class="switch-input" checked>'+
                            '<label for="switchBox2" class="switch-label"></label>'+
                        '</div>'+
                    '</div>'+
                    '<div class="card-block px-3">' +
                        '<i class="fas fa-edit"></i><span>Control Room</span>'+
                        '<div class="switch-wrapper line-switch">'+
                            '<input type="checkbox" id="switchBox2"class="switch-input" checked>'+
                            '<label for="switchBox2" class="switch-label"></label>'+
                        '</div>'+
                    '</div>'+
                    '<div class="card-block px-3">' +
                        '<i class="fas fa-edit"></i><span>Control Room</span>'+
                        '<div class="switch-wrapper line-switch">'+
                            '<input type="checkbox" id="switchBox2"class="switch-input" checked>'+
                            '<label for="switchBox2" class="switch-label"></label>'+
                        '</div>'+
                    '</div>'+
                    '<div class="card-block px-3">' +
                        '<i class="fas fa-edit"></i><span>Control Room</span>'+
                        '<div class="switch-wrapper line-switch">'+
                            '<input type="checkbox" id="switchBox2"class="switch-input" checked>'+
                            '<label for="switchBox2" class="switch-label"></label>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>';
        $('.card_types_modal').append(html);
    }else if(selected_card_type == 'CAM'){
        html += '<div class="col-12 col-xl-6">'+
            '<div class="card" style="border: 1px solid #ddd;padding: 2%;background:#f7f8fa;">'+
                '<h6>Cards Details</h6>'+
                '<div class="col-12">'+
                    '<input type="text" id="cam_card_name" class="device_name" placeholder="Card Title">'+
                '</div>'+
                '<div class="col-12">'+
                    '<p>Device</p>'+
                    '<select id="cam_device" >';
                    for (var i = 0; i < site_config.devices.length; i++) {                        
                        // console.log(site_config.devices[i].device_name);
                        if(site_config.devices[i].device_type == 'CAM'){
                            html += '<option value= '+ site_config.devices[i].record_id +'>'+ site_config.devices[i].device_name +'</option>';
                        }
                    }
                   
                    html += '</select>'+
                '</div>'+
                '<div class="col-12">'+
                    '<p>Select Column</p>'+
                    '<select id="card_column" >'+
                    '<option value="1">Column 1</option>'+
                    '<option value="2">Column 2</option>'+
                    '<option value="3">Column 3</option>'+
                    '<option value="4">Column 4</option>'+
                    '</select>'+
                '</div>'+
            '</div>'+
        '</div>';
        html += '<div class="col-12 col-xl-6">'+
            '<div class="card" style="border: 1px solid #ddd;padding: 2%;background:#f7f8fa;">'+
                '<h6>Cards Preview</h6>'+
                '<div class="card">'+
                    '<div class="card-block px-3">' +
                        '<i class="fas fa-edit"></i><span>Control Room</span>'+
                        '<div class="switch-wrapper line-switch">'+
                            '<input type="checkbox" id="switchBox2"class="switch-input" checked>'+
                            '<label for="switchBox2" class="switch-label"></label>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>';
        $('.card_types_modal').append(html);
    }else if(selected_card_type == 'WHT'){
        html += '<div class="col-12 col-xl-6">'+
            '<div class="card" style="border: 1px solid #ddd;padding: 2%;background:#f7f8fa;">'+
                '<h6>Cards Details</h6>'+
                '<div class="col-12">'+
                    '<input type="text" id="wht_card_name" class="device_name" placeholder="Card Title">'+
                '</div>'+
                '<div class="col-12">'+
                    '<p>Select Column</p>'+
                    '<select id="card_column" >'+
                    '<option value="1">Column 1</option>'+
                    '<option value="2">Column 2</option>'+
                    '<option value="3">Column 3</option>'+
                    '<option value="4">Column 4</option>'+
                    '</select>'+
                '</div>'+
            '</div>'+
        '</div>';
        html += '<div class="col-12 col-xl-6">'+
            '<div class="card" style="border: 1px solid #ddd;padding: 2%;background:#f7f8fa;">'+
                '<h6>Cards Preview</h6>'+
                '<div class="card">'+
                    '<div class="card-block px-3">' +
                        '<i class="fas fa-edit"></i><span>Control Room</span>'+
                        '<div class="switch-wrapper line-switch">'+
                            '<input type="checkbox" id="switchBox2"class="switch-input" checked>'+
                            '<label for="switchBox2" class="switch-label"></label>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>';
        $('.card_types_modal').append(html);
    }else if(selected_card_type == 'M_L'){
        html += '<div class="col-12 col-xl-6">'+
            '<div class="card" style="border: 1px solid #ddd;padding: 2%;background:#f7f8fa;">'+
                '<h6>Cards Details</h6>'+
                '<div class="col-12 col-xl-12">'+
                    '<input type="text" id="m_l_card_name" class="device_name" placeholder="Card Title" style="width: 100%;">'+
                '</div>'+
                '<div class="col-12 col-xl-12">'+
                    '<div class="row">'+
                        '<div class="col-12 col-xl-4">'+
                            '<p>Select Floor</p>'+
                            '<select id="floor" onchange="floor_wise_dept(\'M_L\');subarea_wise_device(\'M_L\');">'+
                                '<option>Select Floor</option>';
                                for (var i = 0; i < site_config.areas.length; i++) {                        
                                    html += '<option value="'+ site_config.areas[i].id +'">'+ site_config.areas[i].name +'</option>';
                                }
                            html +='</select>'+
                        '</div>'+
                        '<div class="col-12 col-xl-4" id="department_div">'+
                            '<p>Select Department</p>'+
                            '<select id="department" onchange="dept_wise_subarea(\'M_L\');subarea_wise_device(\'M_L\');">'+
                                '<option>Select Department</option>';
                                for (var i = 0; i < site_config.areas.length; i++) {  
                                    for(var j = 0; j < site_config.areas[i].departments.length;j++){
                                        html += '<option value="'+ site_config.areas[i].departments[j].id +'" data-floor-id="'+site_config.areas[i].id+'">'+ site_config.areas[i].departments[j].name +'</option>';
                                    }                      
                                }
                            html +='</select>'+
                        '</div>'+
                        '<div class="col-12 col-xl-4" id="subarea_div">'+
                            '<p>Select Area</p>'+
                            '<select id="subarea" onchange="subarea_wise_device(\'M_L\');">'+
                                '<option>Select Subarea</option>';
                                for (var i = 0; i < site_config.areas.length; i++) {  
                                    for(var j = 0; j < site_config.areas[i].departments.length;j++){
                                        for(var k = 0; k < site_config.areas[i].departments[j].sub_area.length;k++){
                                            html += '<option value="'+ site_config.areas[i].departments[j].sub_area[k].id +'">'+ site_config.areas[i].departments[j].sub_area[k].name +'</option>';
                                        }
                                    }                      
                                }
                            html +='</select>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
                '<h6>Devices (Required)</h6>'+
                '<div class="col-12 col-xl-12 main_div">'+
                    
                    '<div class="row add_row" id="row_1">'+
                        '<div class="col-12 col-xl-10 device_ddl" >'+
                            '<select name="m_card_ac[]" style="width:100%;">'+
                                '<option>Select Device</option>';
                                for (var i = 0; i < site_config.devices.length; i++) {                        
                                    // console.log(site_config.devices[i].device_name);
                                    if(site_config.devices[i].device_type == 'M_L'){
                                        html += '<option value= '+ site_config.devices[i].record_id +'>'+ site_config.devices[i].device_name +'</option>';
                                    }
                                }
                            html +='</select>'+
                        '</div>'+     
                        '<div class="col-12 col-xl-1 " style="padding:10px;">'+
                            '<i class="fa fa-plus fa-lg" style="font-weight:unset;" onclick="add_row(\'M_L\');"></i>'+
                        '</div>'+
                    '</div>'+ 
                    
                '</div>'+ 
                '<div class="col-12">'+
                    '<p>Select Column</p>'+
                    '<select id="card_column" >'+
                    '<option value="1">Column 1</option>'+
                    '<option value="2">Column 2</option>'+
                    '<option value="3">Column 3</option>'+
                    '<option value="4">Column 4</option>'+
                    '</select>'+
                '</div>'+   
            '</div>'+
        '</div>';
        html += '<div class="col-12 col-xl-6">'+
            '<div class="card" style="border: 1px solid #ddd;padding: 2%;background:#f7f8fa;">'+
                '<h6>Cards Preview</h6>'+
                '<div class="card" style="padding: 2%;margin: 5%;border: 1px solid #ddd;">'+
                    '<div class="card-block px-3">' +
                        '<i class="fas fa-edit"></i><span>Control Room</span>'+
                        '<div class="switch-wrapper line-switch">'+
                            '<input type="checkbox" id="switchBox2"class="switch-input" checked>'+
                            '<label for="switchBox2" class="switch-label"></label>'+
                        '</div>'+
                    '</div>'+
                    '<div class="card-block px-3">' +
                        '<i class="fas fa-edit"></i><span>Control Room</span>'+
                        '<div class="switch-wrapper line-switch">'+
                            '<input type="checkbox" id="switchBox2"class="switch-input" checked>'+
                            '<label for="switchBox2" class="switch-label"></label>'+
                        '</div>'+
                    '</div>'+
                    '<div class="card-block px-3">' +
                        '<i class="fas fa-edit"></i><span>Control Room</span>'+
                        '<div class="switch-wrapper line-switch">'+
                            '<input type="checkbox" id="switchBox2"class="switch-input" checked>'+
                            '<label for="switchBox2" class="switch-label"></label>'+
                        '</div>'+
                    '</div>'+
                    '<div class="card-block px-3">' +
                        '<i class="fas fa-edit"></i><span>Control Room</span>'+
                        '<div class="switch-wrapper line-switch">'+
                            '<input type="checkbox" id="switchBox2"class="switch-input" checked>'+
                            '<label for="switchBox2" class="switch-label"></label>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>';
        $('.card_types_modal').append(html);
    }
}


// card types renderes
function renderCardTypes(card_types){
    html = ''
    for (var i = 0; i < card_types.length; i++) {
        html += '<div class="col-12 col-xl-4 col-sm-12 col-md-6">';
        html += '<label>';
        html += '<input type="radio" name="card_type" value='+ card_types[i].code +' class="card-input-element" />';
        html += '<div class="common-control-wrap card panel panel-default card-input">';
        html += '<div class="left-title panel-heading">'+ card_types[i].title +'</div>';
        html += '<div class="panel-body">' + card_types[i].Descriptions;
        html += '</div>';
        html += '</div>';
        html += '</label>';
        html += '</div>';
    }
    $('.card_types_modal').append(html);
}
//start multi ac Events
function multi_ac_enabledisable(record_id){
    var image = "";
    if($("#mac_switchBox_"+record_id).is(':checked')){
        image = "air-conditioner.svg";
    }else{
        image = "air-conditioner_disable.svg";
    }
    $("#m_ac_"+record_id).attr("src","../static/image/"+image);
    
}

function multi_ac_rang(record_id){
    console.log("rang"+record_id);
}

function multi_ac_mode(type,status){
    console.log("type_mode"+type);
    console.log("status_mode"+status);
}

function multi_ac_fan(type,status){
    console.log("type_fan"+type);
    console.log("status_fan"+status);
}

function multi_ac_swing(type,status){
    console.log("type_swing"+type);
    console.log("status_swing"+status);
}
//end multi ac Events
//start camera event
function cam_enabledisable(record_id){
    var image = "";
    if($("#cam_switchBox_"+record_id).is(':checked')){
        image = "cameras-img_blue.svg";
    }else{
       image = "cameras-img.svg"; 
    }
    $("#cam_"+record_id).attr("src","../static/image/"+image);
    
}
//end camera event
//start single ac Events
function s_ac_mode(type,status){
    console.log("s_type_mode"+type);
    console.log("s_status_mode"+status);
}
function s_ac_fan(type,status){
    console.log("s_type_fan"+type);
    console.log("s_status_fan"+status);
}
function s_ac_swing(type,status){
    console.log("s_type_swing"+type);
    console.log("s_status_swing"+status);
}
//end single ac Events
//start multi light ac Events
function m_l_enabledisable(record_id){
    var image = "";
    if($("#m_l_switchBox_"+record_id).is(':checked')){
        image = "lightbulb-on.svg";
    }else{
        image = "lights-img.svg"; 
    }
    $("#m_l_"+record_id).attr("src","../static/image/"+image);
}
//end multi light Events
function s_ac_status_mode(type,status){
    console.log("s_type_swing"+type);
    console.log("s_status_swing"+status);
}

// Dashboard card renderes
function renderCards(card_config){
    // console.log(card_config);
    for (var i = 0; i < card_config.length; i++) {

        let html = '';
        if(card_config[i].card_type != "AREA"){
            html += '<div class="card">';
                html += '<div class="card-block px-3">';
                    html += '<h4 class="card-title">' + card_config[i].title + ' </h4>';
                    var s_flag = 0;
                    if(card_config[i].card_type == 'S_AC'){
                        s_flag = 1;
                        for (var j = 0; j < card_config[i].record_id.length; j++){
                            
                            html += '<div class="row px-2">'+
                                '<div class="slider" id="s_ac_red_'+card_config[i].record_id[j].record_id+'"></div>'+
                            '</div>'+
                            '<div class="row px-2">'+
                                '<div class="col-md-4 "><strong>Mode</strong></div>'+
                                '<div class="col-md-8 px-0 s_ac_icon">'+
                                    '<ul>'+
                                        '<li>';
                                            if(card_config[i].record_id[j].mode == "A"){
                                                html +='<a href="javascript:void(0);" onclick="s_ac_mode(\'A\',\'E\')"><img src="../static/image/ac_auto_blue.svg" class="large-image"></a><p style="color:#413A88;">Auto</p>';
                                                
                                            }else{
                                                html +='<a href="javascript:void(0);" onclick="s_ac_mode(\'A\',\'D\')"><img src="../static/image/ac_auto.svg" class="large-image"></a><p>Auto</p>';
                                            }
                                        html +='</li>'+
                                        '<li>';
                                            if(card_config[i].record_id[j].mode == "C"){
                                                html +='<a href="javascript:void(0);" onclick="s_ac_mode(\'C\',\'E\')"><img src="../static/image/ac_mode_cool_blue.svg" class="large-image"></a><p style="color:#413A88;">Cool</p>';
                                            }else{
                                                 html +='<a href="javascript:void(0);" onclick="s_ac_mode(\'C\',\'D\')"><img src="../static/image/ac_mode_cool.svg" class="large-image"></a><p>Cool</p>';
                                            }
                                        html +='</li>'+
                                        '<li>';
                                            if(card_config[i].record_id[j].mode == "H"){
                                                html +='<a href="javascript:void(0);" onclick="s_ac_mode(\'H\',\'E\')"><img src="../static/image/ac_mode_heat_blue.svg" class="large-image"></a><p style="color:#413A88;">Heat</p>';
                                            }else{
                                                 html +='<a href="javascript:void(0);" onclick="s_ac_mode(\'H\',\'D\')"><img src="../static/image/ac_mode_heat.svg" class="large-image"></a><p>Heat</p>';
                                            }
                                         html +='</li>'+
                                        '<li>';
                                            if(card_config[i].record_id[j].mode == "D"){
                                                html +='<a href="javascript:void(0);" onclick="s_ac_mode(\'D\',\'E\')"><img src="../static/image/ac_mode_dry_blue.svg" class="large-image"></a><p style="color:#413A88;">Dry</p>';
                                            }else{
                                                 html +='<a href="javascript:void(0);" onclick="s_ac_mode(\'D\',\'D\')"><img src="../static/image/ac_mode_dry.svg" class="large-image"></a><p>Dry</p>';
                                            }
                                        html +='</li>'+
                                    '</ul>'+
                                '</div>'+
                            '</div>'+
                            '<div class="row px-2">'+
                                '<div class="col-md-4 "><strong>Fan</strong></div>'+
                                '<div class="col-md-8 px-0 s_ac_icon">'+
                                    '<ul>'+
                                        '<li>';
                                            if(card_config[i].record_id[j].fspeed == "A"){
                                                html +='<a href="javascript:void(0);" onclick="s_ac_fan(\'A\',\'E\')"><img src="../static/image/ac_auto_blue.svg" class="large-image"></a><p style="color:#413A88;">Auto</p>';
                                            }else{
                                                 html +='<a href="javascript:void(0);" onclick="s_ac_fan(\'A\',\'D\')"><img src="../static/image/ac_auto.svg" class="large-image"></a><p>Auto</p>';
                                            }
                                        html +='</li>'+
                                        '<li>';
                                            if(card_config[i].record_id[j].fspeed == "L"){
                                                html +='<a href="javascript:void(0);" onclick="s_ac_fan(\'L\',\'E\')"><img src="../static/image/ac_fan_low_blue.svg" class="large-image"></a><p style="color:#413A88;">Low</p>';
                                            }else{
                                                 html +='<a href="javascript:void(0);" onclick="s_ac_fan(\'L\',\'D\')"><img src="../static/image/ac_fan_low.svg" class="large-image"></a><p>Low</p>';
                                            }
                                        html +='</li>'+
                                        '<li>';
                                            if(card_config[i].record_id[j].fspeed == "M"){
                                                html +='<a href="javascript:void(0);" onclick="s_ac_fan(\'M\',\'E\')"><img src="../static/image/ac_fan_med_blue.svg" class="large-image"></a><p style="color:#413A88;">Medium</p>';
                                            }else{
                                                 html +='<a href="javascript:void(0);" onclick="s_ac_fan(\'M\',\'D\')"><img src="../static/image/ac_fan_med.svg" class="large-image"></a><p>Medium</p>';
                                            }
                                            html +='</li>'+
                                        '<li>';
                                            if(card_config[i].record_id[j].fspeed == "H"){
                                                html +='<a href="javascript:void(0);" onclick="s_ac_fan(\'H\',\'E\')"><img src="../static/image/ac_fan_high_blue.svg" class="large-image"></a><p style="color:#413A88;">High</p>';
                                            }else{
                                                 html +='<a href="javascript:void(0);" onclick="s_ac_fan(\'H\',\'D\')"><img src="../static/image/ac_fan_high.svg" class="large-image"></a><p>High</p>';
                                            }
                                        html +='</li>'+
                                    '</ul>'+
                                '</div>'+
                            '</div>'+
                            '<div class="row px-2">'+
                                '<div class="col-md-4 "><strong>Swing</strong></div>'+
                                '<div class="col-md-8 px-0 s_ac_icon">'+
                                    '<ul>'+
                                        '<li>';
                                            if(card_config[i].record_id[j].swing == "A"){
                                                html +='<a href="javascript:void(0);" onclick="s_ac_swing(\'A\',\'E\')"><img src="../static/image/ac_auto_blue.svg" class="large-image"></a><p style="color:#413A88;">Auto</p>';
                                            }else{
                                                 html +='<a href="javascript:void(0);" onclick="s_ac_swing(\'A\',\'D\')"><img src="../static/image/ac_auto.svg" class="large-image"></a><p>Auto</p>';
                                            }
                                        html +='</li>'+
                                        '<li>';
                                            if(card_config[i].record_id[j].swing == "3"){
                                                html +='<a href="javascript:void(0);" onclick="s_ac_swing(\'3\',\'E\')"><img src="../static/image/ac_swing_30_blue.svg" class="large-image"></a><p style="color:#413A88;">30</p>';
                                            }else{
                                                 html +='<a href="javascript:void(0);" onclick="s_ac_swing(\'3\',\'D\')"><img src="../static/image/ac_swing_30.svg" class="large-image"></a><p>30</p>';
                                            }
                                        html +='</li>'+
                                        '<li>';
                                            if(card_config[i].record_id[j].swing == "4"){
                                                html +='<a href="javascript:void(0);" onclick="s_ac_swing(\'4\',\'E\')"><img src="../static/image/ac_swing_45_blue.svg" class="large-image"></a><p style="color:#413A88;">45</p>';
                                            }else{
                                                 html +='<a href="javascript:void(0);" onclick="s_ac_swing(\'4\',\'D\')"><img src="../static/image/ac_swing_45.svg" class="large-image"></a><p>45</p>';
                                            }
                                        html +='</li>'+
                                        '<li>';
                                            if(card_config[i].record_id[j].swing == "6"){
                                                html +='<a href="javascript:void(0);" onclick="s_ac_swing(\'6\',\'E\')"><img src="../static/image/ac_swing_60_blue.svg" class="large-image"></a><p style="color:#413A88;">60</p>';
                                            }else{
                                                 html +='<a href="javascript:void(0);" onclick="s_ac_swing(\'6\',\'D\')"><img src="../static/image/ac_swing_60.svg" class="large-image"></a><p>60</p>';
                                            }
                                           
                                        html +='</li>'+
                                    '</ul>'+
                                '</div>'+
                            '</div>';
                            
                        }
                    }

                    if(card_config[i].card_type == 'M_AC'){
                        // var record_id = card_config[i].record_id.split(',');
                        for (var j = 0; j < card_config[i].record_id.length; j++){  
                            var chk="";
                            var image="";
                            
                            if(card_config[i].record_id[j].device_status == "true"){
                                chk="checked";
                                image = "air-conditioner.svg";
                            }else{
                                image = "air-conditioner_disable.svg";
                            }

                            // console.log(card_config[i].id);                     
                            html += '<div class="row px-3 card_row">'+
                                '<ul>'+
                                    '<li>';
                                        html +='<img src="../static/image/'+image+'" id="m_ac_'+card_config[i].record_id[j].record_id+'_'+card_config[i].id+'" />';
                                    html +='</li>'+
                                    '<li>'+
                                        '<strong>'+ card_config[i].record_id[j].device_name +'</strong>'+
                                    '</li>'+
                                    '<li>'+
                                        '<div class="switch-wrapper line-switch">'+
                                            '<input type="checkbox" onclick="multi_ac_enabledisable(\''+card_config[i].record_id[j].record_id+'_'+card_config[i].id+'\')" id="mac_switchBox_'+card_config[i].record_id[j].record_id+'_'+card_config[i].id+'" class="switch-input" '+chk+'>'+
                                            '<label for="mac_switchBox_'+card_config[i].record_id[j].record_id+'_'+card_config[i].id+'" class="switch-label"></label>'+
                                        '</div>'+
                                    '</li>'+
                                '</ul>'+
                            '</div>';
                            html += '<div class="row px-3 ">'+
                                '<div class="col-xl-6 px-0 ac_card_popup" >'+
                                    '<ul>'+
                                        '<li>'+
                                            '<img src="../static/image/mode.svg">'+
                                            '<span id="mode" class="large multi_ac_popup">'+
                                                '<ul>'+
                                                    '<li>';
                                                        if(card_config[i].record_id[j].mode == "A"){
                                                            html +='<a href="javascript:void(0);" onclick="multi_ac_mode(\'A\',\'E\')"><img src="../static/image/ac_auto_blue.svg" class="large-image"></a>';
                                                        }else{
                                                             html +='<a href="javascript:void(0);" onclick="multi_ac_mode(\'A\',\'D\')"><img src="../static/image/ac_auto.svg" class="large-image"></a>';
                                                        }
                                                    html +='</li>'+
                                                    '<li>';
                                                        if(card_config[i].record_id[j].mode == "C"){
                                                            html +='<a href="javascript:void(0);" onclick="multi_ac_mode(\'C\',\'E\')"><img src="../static/image/ac_mode_cool_blue.svg" class="large-image"></a>';
                                                        }else{
                                                             html +='<a href="javascript:void(0);" onclick="multi_ac_mode(\'C\',\'D\')"><img src="../static/image/ac_mode_cool.svg" class="large-image"></a>';
                                                        }
                                                    html +='</li>'+
                                                    '<li>';
                                                        if(card_config[i].record_id[j].mode == "H"){
                                                            html +='<a href="javascript:void(0);" onclick="multi_ac_mode(\'H\',\'E\')"><img src="../static/image/ac_mode_heat_blue.svg" class="large-image"></a>';
                                                        }else{
                                                             html +='<a href="javascript:void(0);" onclick="multi_ac_mode(\'H\',\'D\')"><img src="../static/image/ac_mode_heat.svg" class="large-image"></a>';
                                                        }
                                                    html +='</li>'+
                                                    '<li>';
                                                        if(card_config[i].record_id[j].mode == "D"){
                                                            html +='<a href="javascript:void(0);" onclick="multi_ac_mode(\'D\',\'E\')"><img src="../static/image/ac_mode_dry_blue.svg" class="large-image"></a>';
                                                        }else{
                                                             html +='<a href="javascript:void(0);" onclick="multi_ac_mode(\'D\',\'D\')"><img src="../static/image/ac_mode_dry.svg" class="large-image"></a>';
                                                        }
                                                    html +='</li>'+
                                                '</ul>';
                                            html +='</span>'+
                                        '</li>'+
                                        '<li>'+
                                            '<img src="../static/image/radiation.svg">'+
                                            '<span id="fan" class="large multi_ac_popup">'+
                                                '<ul>'+
                                                    '<li>';
                                                        if(card_config[i].record_id[j].mode == "A"){
                                                            html +='<a href="javascript:void(0);" onclick="multi_ac_fan(\'A\',\'E\')"><img src="../static/image/ac_auto_blue.svg" class="large-image"></a>';
                                                        }else{
                                                             html +='<a href="javascript:void(0);" onclick="multi_ac_fan(\'A\',\'D\')"><img src="../static/image/ac_auto.svg" class="large-image"></a>';
                                                        }
                                                    html +='</li>'+
                                                    '<li>';
                                                        if(card_config[i].record_id[j].mode == "C"){
                                                            html +='<a href="javascript:void(0);" onclick="multi_ac_fan(\'C\',\'E\')"><img src="../static/image/ac_fan_low_blue.svg" class="large-image"></a>';
                                                        }else{
                                                             html +='<a href="javascript:void(0);" onclick="multi_ac_fan(\'C\',\'D\')"><img src="../static/image/ac_fan_low.svg" class="large-image"></a>';
                                                        }
                                                    html +='</li>'+
                                                    '<li>';
                                                        if(card_config[i].record_id[j].mode == "H"){
                                                            html +='<a href="javascript:void(0);" onclick="multi_ac_fan(\'H\',\'E\')"><img src="../static/image/ac_fan_med_blue.svg" class="large-image"></a>';
                                                        }else{
                                                             html +='<a href="javascript:void(0);" onclick="multi_ac_fan(\'H\',\'D\')"><img src="../static/image/ac_fan_med.svg" class="large-image"></a>';
                                                        }
                                                    html +='</li>'+
                                                    '<li>';
                                                        if(card_config[i].record_id[j].mode == "D"){
                                                            html +='<a href="javascript:void(0);" onclick="multi_ac_fan(\'D\',\'E\')"><img src="../static/image/ac_fan_high_blue.svg" class="large-image"></a>';
                                                        }else{
                                                             html +='<a href="javascript:void(0);" onclick="multi_ac_fan(\'D\',\'D\')"><img src="../static/image/ac_fan_high.svg" class="large-image"></a>';
                                                        }
                                                    html +='</li>'+
                                                '</ul>';
                                            html +='</span>'+
                                        '</li>'+
                                        '<li>'+
                                            '<img src="../static/image/swing.svg">'+
                                            '<span id="swing" class="large multi_ac_popup">'+
                                                '<ul>'+
                                                    '<li>';
                                                        if(card_config[i].record_id[j].mode == "A"){
                                                            html +='<a href="javascript:void(0);" onclick="multi_ac_swing(\'A\',\'E\')"><img src="../static/image/ac_auto_blue.svg" class="large-image"></a>';
                                                        }else{
                                                             html +='<a href="javascript:void(0);" onclick="multi_ac_swing(\'A\',\'D\')"><img src="../static/image/ac_auto.svg" class="large-image"></a>';
                                                        }
                                                    html +='</li>'+
                                                    '<li>';
                                                        if(card_config[i].record_id[j].mode == "3"){
                                                            html +='<a href="javascript:void(0);" onclick="multi_ac_swing(\'3\',\'E\')"><img src="../static/image/ac_swing_30_blue.svg" class="large-image"></a>';
                                                        }else{
                                                             html +='<a href="javascript:void(0);" onclick="multi_ac_swing(\'3\',\'D\')"><img src="../static/image/ac_swing_30.svg" class="large-image"></a>';
                                                        }
                                                    html +='</li>'+
                                                    '<li>';
                                                        if(card_config[i].record_id[j].mode == "4"){
                                                            html +='<a href="javascript:void(0);" onclick="multi_ac_swing(\'4\',\'E\')"><img src="../static/image/ac_swing_45_blue.svg" class="large-image"></a>';
                                                        }else{
                                                             html +='<a href="javascript:void(0);" onclick="multi_ac_swing(\'4\',\'D\')"><img src="../static/image/ac_swing_45.svg" class="large-image"></a>';
                                                        }
                                                    html +='</li>'+
                                                    '<li>';
                                                        if(card_config[i].record_id[j].mode == "6"){
                                                            html +='<a href="javascript:void(0);" onclick="multi_ac_swing(\'6\',\'E\')"><img src="../static/image/ac_swing_60_blue.svg" class="large-image"></a>';
                                                        }else{
                                                             html +='<a href="javascript:void(0);" onclick="multi_ac_swing(\'6\',\'D\')"><img src="../static/image/ac_swing_60.svg" class="large-image"></a>';
                                                        }
                                                    html +='</li>'+
                                                '</ul>';
                                            html +='</span>'+
                                        '</li>'+
                                    '</ul>'+
                                '</div>'+
                                '<div class="col-xl-6 px-0" style="margin-top:3%;">'+
                                    '<input type="range" onchange="multi_ac_rang('+card_config[i].record_id[j].record_id+')" id="mac_range_'+card_config[i].record_id[j].record_id+'_'+card_config[i].id+'" class="form-range" min="0" max="5" step="0.5">'+
                                '</div>'+
                            '</div>';
                            
                        }
                    }

                     // if(card_config[i].card_type == 'CAM'){  
                    //     for (var j = 0; j < card_config[i].record_id.length; j++){   
                    //         html += '<div class="row px-3 camera_card_row">'+    
                    //             '<ul>'+  
                    //                 '<li>'+  
                    //                     '<img src="../static/image/cameras-img_blue.svg" />'+    
                    //                 '</li>'+ 
                    //                 '<li>'+      
                    //                     '<strong>'+ card_config[i].record_id[j].device_name +'</strong>'+    
                    //                 '</li>'+ 
                    //                 '<li>'+  
                    //                     '<div class="switch-wrapper line-switch">'+  
                    //                         '<input type="checkbox" id="cam_switchBox_'+card_config[i].record_id[j].record_id+'" class="switch-input" checked="">'+  
                    //                         '<label for="cam_switchBox_'+card_config[i].record_id[j].record_id+'" class="switch-label"></label>'+    
                    //                     '</div>'+    
                    //                 '</li>'+ 
                    //             '</ul>'+ 
                    //         '</div>';    
                    //     }    
                    // }    
                    var cam_flag = 0;   
                    if(card_config[i].card_type == 'CAM'){  
                        cam_flag = 1;   
                        for (var j = 0; j < card_config[i].record_id.length; j++){  
                            html += '<video style="width: 100%;" id="video'+ card_config[i].record_id[j].record_id+card_config[i].id+'" loop="true" autoplay="autoplay" controls muted type="application/x-mpegURL"></video>';  
                        }   
                    }

                    var flag = 0;
                    if(card_config[i].card_type == 'WHT'){
                        html += '<div class="row px-3">'+
                                '<div style="width:60%">'+
                                    '<i class="fa fa-cloud"></i>'+
                                '</div>'+
                                '<div style="width:40%">'+
                                    '<p style="margin:0px;">35&#8451;</p>'+
                                '</div>'+
                            '</div>';
                        html += '<div class="row px-3 wheather">'+
                                '<div style="width:14%"><p>Mon</p><i class="fa fa-cloud"></i><p class="wheather_row">20&#8451;</p><p class="wheather_sub_row">20&#8451;</p></div>'+
                                '<div style="width:14%"><p>Tue</p><i class="fa fa-cloud"></i><p class="wheather_row">20&#8451;</p><p class="wheather_sub_row">20&#8451;</p></div>'+
                                '<div style="width:14%"><p>Wed</p><i class="fa fa-cloud"></i><p class="wheather_row">20&#8451;</p><p class="wheather_sub_row">20&#8451;</p></div>'+
                                '<div style="width:14%"><p>Thur</p><i class="fa fa-cloud"></i><p class="wheather_row">20&#8451;</p><p class="wheather_sub_row">20&#8451;</p></div>'+
                                '<div style="width:14%"><p>Fri</p><i class="fa fa-cloud"></i><p class="wheather_row">20&#8451;</p><p class="wheather_sub_row">20&#8451;</p></div>'+
                                '<div style="width:14%"><p>Sat</p><i class="fa fa-cloud"></i><p class="wheather_row">20&#8451;</p><p class="wheather_sub_row">20&#8451;</p></div>'+
                                '<div style="width:14%"><p>Sun</p><i class="fa fa-cloud"></i><p class="wheather_row">20&#8451;</p><p class="wheather_sub_row">20&#8451;</p></div>'+
                            '</div>';
                        flag = 1;
                    }

                    if(card_config[i].card_type == 'M_L'){
                        s_flag = 1;
                        // console.log(card_config[i].record_id.length);
                        for (var j = 0; j < card_config[i].record_id.length; j++){
                            var chk="";
                            var image="";
                            
                            if(card_config[i].record_id[j].device_status == "true"){
                                chk="checked";
                                image = "lightbulb-on.svg";
                            }else{
                                image = "lights-img.svg";
                            }
                           
                            html += '<div class="row px-3">'+
                                '<div class="col-md-8 px-0 light-title">'+
                                    '<img src="../static/image/'+image+'" id="m_l_'+card_config[i].record_id[j].record_id+'_'+card_config[i].id+'" />&nbsp;&nbsp;'+
                                    '<strong>'+ card_config[i].record_id[j].device_name +'</strong>'+
                                '</div>';
                                html +='<div class="col-md-4 px-0">'+
                                    '<div class="switch-wrapper line-switch">'+
                                        '<input type="checkbox" id="m_l_switchBox_'+card_config[i].record_id[j].record_id+'_'+card_config[i].id+'" onclick="m_l_enabledisable(\''+card_config[i].record_id[j].record_id+'_'+card_config[i].id+'\')" class="switch-input" '+chk+'>'+
                                        '<label for="m_l_switchBox_'+card_config[i].record_id[j].record_id+'_'+card_config[i].id+'" class="switch-label"></label>'+
                                    '</div>'+
                                '</div>';
                            html +='</div>';

                            html +='<div class="row px-3">'+
                                '<input type="range" class="form-range" min="0" max="2" step="0.4" style="width: 50%;"><lable>20%</lable>'+
                            '</div>';
                        }
                    }

                    var new_flag = 0;
                    if(card_config[i].card_type == 'S_AC_STATUS'){
                        new_flag = 1;
                        for (var j = 0; j < card_config[i].record_id.length; j++){
                            html += '<div class="row px-2">'+
                                '<div class="slider" id="s_ac_status_red_'+card_config[i].record_id[j].record_id+'"></div>'+
                            '</div>'+
                            '<div class="row px-4 single_ac_status">'+
                                '<div class="col-md-3">'+
                                    '<a href="javascript:void(0);" onclick="s_ac_status_mode(\'A\',\'D\')"><img src="../static/image/ac_single_circle.svg" class="large-image"></a>'+
                                '</div>'+
                                '<div class="col-md-3">'+
                                    '<a href="javascript:void(0);" onclick="s_ac_status_mode(\'C\',\'D\')"><i class="fa fa-thermometer-half" style="color:#939393;"></i></a>'+
                                '</div>'+
                                '<div class="col-md-3">'+   
                                    '<a href="javascript:void(0);" onclick="s_ac_status_mode(\'H\',\'D\')"><img src="../static/image/ac_mode_dry.svg" class="large-image"></a>'+
                                '</div>'+
                                '<div class="col-md-3">'+
                                    '<a href="javascript:void(0);" onclick="s_ac_status_mode(\'D\',\'D\')"><i class="fa fa-power-off" style="color:#939393;"></i></a>'+
                                '</div>'+
                            '</div>';
                        }
                    }

                    html += '<div class="bottom-icon">';
                    if(card_config[i].col != 'main'){
                        html += '<button class="btn btn-link card_move_up" data-card_id='+ card_config[i].id +' data-col='+ card_config[i].col +' data-pos='+ card_config[i].position +'>'+
                                '<i class="fas fa-arrow-up"></i>'+
                            '</button>';
                        html += '<button class="btn btn-link card_move_down" data-card_id='+ card_config[i].id +' data-col='+ card_config[i].col +' data-pos='+ card_config[i].position +'>'+
                                '<i class="fas fa-arrow-down"></i>'+
                            '</button>';
                        html += '<div class="card_action_popup">'+
                                '<i class="fa fa-ellipsis-v" style="color: #007bff;"></i>'+
                                '<span id="mode" class="large" style="text-align: center;">'+
                                    '<button class="btn btn-link " data-card_id='+ card_config[i].id +' data-col='+ card_config[i].col +' data-pos='+ card_config[i].position +'>Edit</button>'+
                                    '<button class="btn btn-link card_del" data-card_id='+ card_config[i].id +' data-col='+ card_config[i].col +' data-pos='+ card_config[i].position +'>Delete</button>'+
                                '</span>'+
                            '</div>';
                    }
                    html += '</div>'+
                '</div>'+
            '</dv>';
        }
        if(card_config[i].card_type == "AREA"){
            html += '<div class="card area_card p-0" style="background-image:url(../static/image/meeting_room.jpg)">';
                html += '<div class="card-block p-3" >';
                    html += '<h6 style="color:white;">pool cabin</h6>'+
                        '<div class="row px-3">'+
                            '<div class="col-md-8 px-0">'+
                                '<div class="row px-2 card_row area_card_leftpenal">'+
                                    '<ul>'+
                                        '<li><img  src="../static/image/air-conditioner.svg"></li>'+
                                        '<li ><strong>18&#8451;</strong>&nbsp;&nbsp;Cabin AC</li>'+
                                    '</ul>'+
                                '</div>'+
                                '<div class="row px-2 card_row area_card_leftpenal">'+
                                    '<ul>'+
                                        '<li><img src="../static/image/air-conditioner.svg"></li>'+
                                        '<li ><strong>18&#8451;</strong>&nbsp;&nbsp;Pool1 AC</li>'+
                                    '</ul>'+
                                '</div>'+
                                '<div class="row px-2 card_row area_card_leftpenal">'+
                                    '<ul>'+
                                        '<li><img src="../static/image/air-conditioner_disable.svg"></li>'+
                                        '<li ><strong>18&#8451;</strong>&nbsp;&nbsp;Pool2 AC</li>'+
                                    '</ul>'+
                                '</div>'+
                            '</div>'+
                            '<div class="col-md-4 px-0">'+
                                '<div class="row px-2 card_row area_card_rightpenal">'+
                                    '<ul>'+
                                        '<li><img src="../static/image/volume-img.svg"></li>'+
                                        '<li >Cabin</li>'+
                                    '</ul>'+
                                '</div>'+
                                '<div class="row px-2 card_row area_card_rightpenal">'+
                                    '<ul>'+
                                        '<li><img src="../static/image/volume-img.svg"></li>'+
                                        '<li >Pool1</li>'+
                                    '</ul>'+
                                '</div>'+
                                '<div class="row px-2 card_row area_card_rightpenal">'+
                                    '<ul>'+
                                        '<li><img src="../static/image/volume-img.svg"></li>'+
                                        '<li >Pool2</li>'+
                                    '</ul>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                '</div>';
                html += '<div class="bottom-icon px-3">';
                    html += '<button class="btn btn-link card_move_up" data-card_id='+ card_config[i].id +' data-col='+ card_config[i].col +' data-pos='+ card_config[i].position +'>'+
                                '<i class="fas fa-arrow-up"></i>'+
                            '</button>';
                    html += '<button class="btn btn-link card_move_down" data-card_id='+ card_config[i].id +' data-col='+ card_config[i].col +' data-pos='+ card_config[i].position +'>'+
                            '<i class="fas fa-arrow-down"></i>'+
                        '</button>';
                    html += '<div class="card_action_popup">'+
                            '<i class="fa fa-ellipsis-v" style="color: #007bff;"></i>'+
                            '<span id="mode" class="large" style="text-align: center;">'+
                                '<button class="btn btn-link " data-card_id='+ card_config[i].id +' data-col='+ card_config[i].col +' data-pos='+ card_config[i].position +'>Edit</button>'+
                                '<button class="btn btn-link card_del" data-card_id='+ card_config[i].id +' data-col='+ card_config[i].col +' data-pos='+ card_config[i].position +'>Delete</button>'+
                            '</span>'+
                        '</div>';
                html += '</div>'+
            '</dv>';
            
               
        }
        if(card_config[i].col == 1){
            $('#col_1').append(html);
        }else if(card_config[i].col == 2){
            $('#col_2').append(html);
        }else if(card_config[i].col == 3){
            $('#col_3').append(html);
        }else if(card_config[i].col == 4){
            $('#col_4').append(html);
        }else if(card_config[i].col == 'main'){
            $('#col_main').append(html);
        }
        if(s_flag){
            if(card_config[i].card_type == 'S_AC'){
                for (var j = 0; j < card_config[i].record_id.length; j++){
                    var refreshSliderSize = function () {
                        var radius = this.control.parent().width() / 2;
                        var width = 14;
                        // here you can restrict the radius and width
                        // based on your application UI structure
                        if (radius > 200) radius = 200;
                        if (radius > 120) width = 22;
                        else if (radius > 70) width = 18;
                        this.option({ "radius": radius, "width": width });
                    }

                    $(".slider").roundSlider({
                        sliderType: "min-range",
                        circleShape: "pie",
                        startAngle: 315,
                        min: 18,
                        max: 33,
                        svgMode: true,
                        lineCap: "round",
                        create: function () {
                            var that = this;
                            refreshSliderSize.call(that);
                            $(window).on("resize", function () {
                                refreshSliderSize.call(that);
                            });
                        },
                        drag: function (event, ui) {
                            console.log(this.getValue());
                        },
                        slide: function(event, ui) { 
                          alert(ui.value);
                        }
                    });
                    
                    $("#s_ac_red_"+card_config[i].record_id[j].record_id).roundSlider({ value: card_config[i].record_id[j].rm_temp, rangeColor: "#dd4d61" });
                }
            }
        }

        if(cam_flag){  
            if(card_config[i].card_type == 'CAM'){  
                for (var j = 0; j < card_config[i].record_id.length; j++){  
                    // if (Hls.isSupported()) {    
                    //     var video_id = parseInt(card_config[i].record_id[j].record_id); 
                    //     var video = document.getElementById("video"+video_id+card_config[i].id);    
                    //     var player = new Hls(); 
                    //     player.attachMedia(video);  
                    //     player.controls = false;    
                    //     player.on(Hls.Events.MEDIA_ATTACHED, function() {   
                    //       player.loadSource('http://' + window.location.host + '/static/cam_files/playlist_cam_'+video_id+'.m3u8'); 
                    //       player.on(Hls.Events.MANIFEST_PARSED, playVideo, function() { 
                    //         player.play();  
                    //       });   
                    //     });         
                    // } else {    
                    //     console.error('Hls.js is not supported in this browser');   
                    // }   
                }   
            }   
        }

        if(new_flag){
            if(card_config[i].card_type == 'S_AC_STATUS'){
                for (var j = 0; j < card_config[i].record_id.length; j++){
                    var refreshSliderSize = function () {
                        var radius = this.control.parent().width() / 2;
                        var width = 14;
                        // here you can restrict the radius and width
                        // based on your application UI structure
                        if (radius > 200) radius = 200;
                        if (radius > 120) width = 22;
                        else if (radius > 70) width = 18;
                        this.option({ "radius": radius, "width": width });
                    }

                    $(".slider").roundSlider({
                        sliderType: "min-range",
                        circleShape: "pie",
                        startAngle: 315,
                        min: 18,
                        max: 33,
                        svgMode: true,
                        lineCap: "round",
                        create: function () {
                            var that = this;
                            refreshSliderSize.call(that);
                            $(window).on("resize", function () {
                                refreshSliderSize.call(that);
                            });
                        },
                        drag: function (event, ui) {
                            console.log(this.getValue());
                        },
                        slide: function(event, ui) { 
                          alert(ui.value);
                        }
                    });
                    $("#s_ac_status_red_"+card_config[i].record_id[j].record_id).roundSlider({ value: 29, rangeColor: "#dd4d61" });
                }
            }
        }
        if(flag){
            $.getJSON("https://api.openweathermap.org/data/2.5/onecall?lat=21.1702&lon=72.8311&exclude=current&appid=68044e8c5cb66252acfbefe5951e2b4a", function(data) {
                console.log(data.daily);
                // console.log(data.daily[0].sunset);
                // console.log(data.daily[0].wind_speed);
                $(".weather-wrapper .weather-place").text("");
                $(".weather-wrapper .weather-wind-speed").text(data.daily[0].wind_speed);
                $(".weather-wrapper .weather-sunrise").text(data.daily[0].sunrise);
                $(".weather-wrapper .weather-sunset").text(data.daily[0].sunset);
            });
        }
    }
}



// $(document).on('change', 'input[type="checkbox"]', function(e){
//     record_id = $(this).data('record_id');
//     var o;
//     var deviceId = $(this).data('device_id');
//     var channelId = $(this).data('channel_id');
//     console.log(record_id);

//     if ($(this).is(':checked')) {
//         console.log('true');
//         o = 'true';
//     }else{
//         console.log('false');
//         o = 'false';
//     }

//     data = {
//         'record_id': record_id,
//         'device_id': deviceId,
//         'channel_id': channelId,
//         'device_status': o,
//     };

//     console.log(data);
//     bmsSocket.send(JSON.stringify(data));
//     console.log('sending');
// });



// var connectionString = 'ws://' + window.location.host + '/ws/';
// var controlSocket = new WebSocket(connectionString);


// function control() {
    
//     controlSocket.onopen = function open() {
//         console.log('WebSockets connection created.');
//     };
    
//     controlSocket.onerror = function (event) {
//         console.log("Error");
//     }
    
//     controlSocket.onclose = function (e) {
//         console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
//         setTimeout(function () {
//             connect();
//         }, 3000);
//     };

//     controlSocket.onmessage = function (e) {
//         let data = JSON.parse(e.data);
//         console.log(data);
//         var str = JSON.stringify(data, null, 2);
//         var obj = JSON.parse(str);
//         var res=obj.payload.response.devices;
        
//         var len=res.length;
//         var html="<table>";
//         for(var a=0;a<len;a++){
//             html += "<tr>";
//             var chk="";
//             if(res[a].device_status == "true"){
//                 chk="checked";
//             }
//             html += "<td>"+res[a].record_id+"</td>";
//             html += "<td>"+res[a].device_name+"</td>";
//             html += "<td><input data-record_id="+res[a].record_id +" data-device_id="+res[a].device_id +" data-channel_id="+res[a].channel_id +" type='checkbox' "+ chk +" class='device_active' name="+res[a].device_name+"></td>";          
//             html += "</tr>";
//         }
//         html +="</table>";
//         $(".live_data").html(html);
//     };

//     if (controlSocket.readyState == WebSocket.OPEN) {
//         controlSocket.onopen();
//     }
// }

// control();

// $(document).on('change', 'input[type="checkbox"]', function(e){
//     record_id = $(this).data('record_id');
//     var o;
//     var deviceId = $(this).data('device_id');
//     var channelId = $(this).data('channel_id');
//     console.log(record_id);

//     if ($(this).is(':checked')) {
//         console.log('true');
//         o = 'true';
//     }else{
//         console.log('false');
//         o = 'false';
//     }

//     data = {
//         'record_id': record_id,
//         'device_id': deviceId,
//         'channel_id': channelId,
//         'device_status': o,
//     };

//     console.log(data);
//     controlSocket.send(JSON.stringify(data));
//     console.log('sending');

// });
