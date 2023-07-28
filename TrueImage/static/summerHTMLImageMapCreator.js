/*
 * Summer html image map creator
 * http://github.com/summerstyle/summer
 *
 * Copyright 2016 Vera Lobacheva (http://iamvera.com)
 * Released under the MIT license
 */
var ploy_points = ""
window.counter = 0
var po = 1;
var numberdots = 0
var m_device = []
var allareas = []
var type = ''
var aid = 0
var device_name = ''
var type_of_shape = ''
var recto_x;
var recto_y;
var recto_w;
var recto_h;
var recto_mx;
var recto_my;
var Circle_height;
var Circle_width;
var Circle_cx;
var Circle_cy;
var Circle_r;
var Circle_mx;
var Circle_my;
var device_app_type;
var status_of_device;
var Ellipse_cx;
var Ellipse_cy;
var Ellipse_rx;
var Ellipse_ry;
var Ellipse_mx;
var Ellipse_my;
$('#shapeType').on('change', function () {
    type = $(this).val();
    $("#dots_col").show();
    $("#isInteractive_col").show();
    document.getElementById("isInteractive").checked = true;
    // var d_type = $('#devicelist option:checked').attr('app-type');
    // // alert(d_type)
    // if(d_type == "STB"){
    //     $("#dots_col").hide();
    // }

});


var summerHtmlImageMapCreator = (function () {
    'use strict';

    /* Utilities */
    var utils = {
        /**
         * Returns offset from html page top-left corner for some element
         *
         * @param node {HTMLElement} - html element
         * @returns {Object} - object with offsets, e.g. {x: 100, y: 200}
         */
        getOffset: function (node) {
            var boxCoords = node.getBoundingClientRect();

            return {
                x: Math.round(boxCoords.left + window.pageXOffset),
                y: Math.round(boxCoords.top + window.pageYOffset)
            };
        },

        /**
         * Returns correct coordinates (incl. offsets)
         *
         * @param x {number} - x-coordinate
         * @param y {number} - y-coordinate
         * @returns {Object} - object with recalculated coordinates, e.g. {x: 100, y: 200}
         */
        getRightCoords: function (x, y) {
            // alert(x)
            return {
                x: x - app.getOffset('x'),
                y: y - app.getOffset('y')
            };
        },

        /**
         * TODO: will use same method of app.js
         * @deprecated
         */
        id: function (str) {
            return document.getElementById(str);
        },

        /**
         * TODO: will use same method of app.js
         * @deprecated
         */
        hide: function (node) {
            node.style.display = 'none';

            return this;
        },

        /**
         * TODO: will use same method of app.js
         * @deprecated
         */
        show: function (node) {
            node.style.display = 'block';

            return this;
        },

        /**
         * Escape < and > (for code output)
         *
         * @param str {string} - a string with < and >
         * @returns {string} - a string with escaped < and >
         */
        encode: function (str) {
            return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        },

        /**
         * TODO: will use same method of app.js
         * @deprecated
         */
        foreach: function (arr, func) {
            for (var i = 0, count = arr.length; i < count; i++) {
                func(arr[i], i);
            }
        },

        /**
         * TODO: will use same method of app.js
         * @deprecated
         */
        foreachReverse: function (arr, func) {
            for (var i = arr.length - 1; i >= 0; i--) {
                func(arr[i], i);
            }
        },

        /**
         * Display debug info to some block
         */
        debug: (function () {
            var output = document.getElementById('debug');

            return function () {
                output.innerHTML = [].join.call(arguments, ' ');
            };
        })(),

        /**
         * TODO: will use same method of app.js
         * @deprecated
         */
        stopEvent: function (e) {
            e.stopPropagation();
            e.preventDefault();

            return this;
        },

        /**
         * TODO: will use same method of app.js
         * @deprecated
         */
        extend: function (obj, options) {
            var target = {};

            for (var name in obj) {
                if (obj.hasOwnProperty(name)) {
                    target[name] = options[name] ? options[name] : obj[name];
                }
            }

            return target;
        },

        inherits: (function () {
            var F = function () { };

            return function (Child, Parent) {
                F.prototype = Parent.prototype;
                Child.prototype = new F();
                Child.prototype.constructor = Child;
            };
        })()
    };

    var all_d = []

    /* Main module - will be main module in app.js-based application */
    var app = (function () {
        var domElements = {
            wrapper: utils.id('wrapper'),
            svg: utils.id('svg'),
            img: utils.id('img'),
            container: utils.id('image'),
            map: null
        },
            state = {
                offset: {
                    x: 0,
                    y: 0
                },
                appMode: null, // drawing || editing || preview
                currentType: null,
                editType: null,
                newArea: null,
                selectedArea: null,
                areas: [],
                events: [],
                isDraw: false,
                image: {
                    src: null,
                    filename: null,
                    width: 0,
                    height: 0
                }
            },
            KEYS = {
                F1: 112,
                ESC: 27,
                TOP: 38,
                BOTTOM: 40,
                LEFT: 37,
                RIGHT: 39,
                DELETE: 46,
                I: 73,
                S: 83,
                C: 67
            };

        function recalcOffsetValues() {
            state.offset = utils.getOffset(domElements.container);
        }

        /* Get offset value */
        window.addEventListener('resize', recalcOffsetValues, false);

        /* Disable selection */
        domElements.container.addEventListener('mousedown', function (e) { e.preventDefault(); }, false);

        /* Disable image dragging */
        domElements.img.addEventListener('dragstart', function (e) {
            e.preventDefault();
        }, false);

        /* Display cursor coordinates info */
        var cursor_position_info = (function () {
            var coords_info = utils.id('coords');

            return {
                set: function (coords) {
                    coords_info.innerHTML = 'x: ' + coords.x + ', ' + 'y: ' + coords.y;
                },
                empty: function () {
                    coords_info.innerHTML = '';
                }
            };
        })();

        domElements.container.addEventListener('mousemove', function (e) {
            cursor_position_info.set(utils.getRightCoords(e.pageX, e.pageY));
        }, false);

        domElements.container.addEventListener('mouseleave', function () {
            cursor_position_info.empty();
        }, false);

        /* Add mousedown event for svg */
        function onSvgMousedown(e) {
            if (state.appMode === 'editing') {
                if (e.target.parentNode.tagName === 'g') {
                    info.unload();
                    state.selectedArea = e.target.parentNode.obj;

                    app.deselectAll();
                    // console.log(state.selectedArea)
                    state.selectedArea.select();
                    state.selectedArea.editingStartPoint = {
                        x: e.pageX,
                        y: e.pageY
                    };

                    if (e.target.classList.contains('helper')) {
                        var helper = e.target;
                        state.editType = helper.action;

                        if (helper.n >= 0) { // if typeof selected_area == polygon
                            state.selectedArea.selected_point = helper.n;
                        }

                        app.addEvent(app.domElements.container,
                            'mousemove',
                            state.selectedArea.onProcessEditing.bind(state.selectedArea))
                            .addEvent(app.domElements.container,
                                'mouseup',
                                state.selectedArea.onStopEditing.bind(state.selectedArea));
                    } else if (e.target.tagName === 'rect' || e.target.tagName === 'circle' || e.target.tagName === 'ellipse' || e.target.tagName === 'polygon') {
                        state.editType = 'move';
                        app.addEvent(app.domElements.container,
                            'mousemove',
                            state.selectedArea.onProcessEditing.bind(state.selectedArea))
                            .addEvent(app.domElements.container,
                                'mouseup',
                                state.selectedArea.onStopEditing.bind(state.selectedArea));
                    }
                } else {
                    app.deselectAll();
                    info.unload();
                }
            }
        }

        domElements.container.addEventListener('mousedown', onSvgMousedown, false);
        /* Add click event for svg */

        var cou = 1;
        function onSvgClick(e) {
            
            // console.log(m_device)
            var mydevice = $("#devicelist").val();
            var className = $('.ctrl').hasClass("selected");
            var aid = $('#devicelist option:checked').attr('device-id');
            var device = $('#devicelist').val();
            // console.log(m_device.includes(device))
            if (window.counter == 0) {
                if (className == true) {
                    if (state.appMode === 'drawing' && !state.isDraw && state.currentType) {
                       
                        if (m_device.includes(aid) == false) {
                            // console.log(c)
                            cou = 0;
                            // if (state.appMode === 'drawing' && state.currentType == "rectangle" || state.currentType == "circle") {
                            code.hide();
                            app.setIsDraw(true);
                            // console.log(window.counter)
                            state.newArea = Area.CONSTRUCTORS[state.currentType].createAndStartDrawing(
                                utils.getRightCoords(e.pageX, e.pageY)
                            );
                        } else {
                            alert("This selected device image map area already cropped click add and please select new device.!")
                        }
                    }

                }

            }

        }

        domElements.container.addEventListener('click', onSvgClick, false);


        /* Add keydown event for document */
        function onDocumentKeyDown(e) {
            var ctrlDown = e.ctrlKey || e.metaKey; // PC || Mac

            switch (e.keyCode) {
                case KEYS.F1:
                    help.show();
                    e.preventDefault();

                    break;

                case KEYS.ESC:
                    help.hide();
                    if (state.isDraw) {
                        state.isDraw = false;
                        state.newArea.remove();
                        state.areas.pop();
                        app.removeAllEvents();
                    } else if (state.appMode === 'editing') {
                        state.selectedArea.redraw();
                        app.removeAllEvents();
                    }

                    break;

                case KEYS.TOP:
                    if (state.appMode === 'editing' && state.selectedArea) {
                        state.selectedArea.move(0, -1);
                        e.preventDefault();
                    }

                    break;

                case KEYS.BOTTOM:
                    if (state.appMode === 'editing' && state.selectedArea) {
                        state.selectedArea.move(0, 1);
                        e.preventDefault();
                    }
                    break;

                case KEYS.LEFT:
                    if (state.appMode === 'editing' && state.selectedArea) {
                        state.selectedArea.move(-1, 0);
                        e.preventDefault();
                    }

                    break;

                case KEYS.RIGHT:
                    if (state.appMode === 'editing' && state.selectedArea) {
                        state.selectedArea.move(1, 0);
                        e.preventDefault();
                    }

                    break;

                case KEYS.DELETE:
                    if (state.appMode === 'editing' && state.selectedArea) {
                        window.counter = 0;
                        po = 1;
                        var index = m_device.indexOf(state.selectedArea._attributes.d_id)
                        if (m_device.includes(state.selectedArea._attributes.d_id) == true) {
                            delete m_device[index]
                        }
                        var addarea = allareas[allareas.length - 1]
                        if (addarea != null) {
                            for (var i = 0; i < addarea.length; i++) {
                                if (addarea[i]["record_id"] == state.selectedArea._attributes.d_id) {
                                    delete addarea[i]
                                }
                            }

                            var filtered = addarea.filter(function (el) {
                                return el != null;
                            });
                            allareas[allareas.length - 1] = []
                            for (var k = 0; k < filtered.length; k++) {
                                allareas[allareas.length - 1].push(filtered[k])
                            }
                        }
                        app.removeObject(state.selectedArea);
                        state.selectedArea = null;
                        info.unload();
                    }

                    break;

                case KEYS.I:
                    if (state.appMode === 'editing' && state.selectedArea) {
                        var coordsForAttributesForm = state.selectedArea.getCoordsForDisplayingInfo();

                    }

                    break;

                case KEYS.S:
                    if (ctrlDown) {
                        app.saveInLocalStorage();
                    }

                    break;

                case KEYS.C:
                    if (state.appMode === 'editing' && state.selectedArea && ctrlDown) {
                        state.selectedArea = Area.copy(state.selectedArea);
                    }

                    break;
            }
        }

        document.addEventListener('keydown', onDocumentKeyDown, false);
        // Will moved from the main module
        var areasIO = {
            toJSON: function () {
                var obj = {
                    areas: [],
                    img: state.image.src
                };

                utils.foreach(state.areas, function (x) {
                    obj.areas.push(x.toJSON());
                });

                return JSON.stringify(obj);
            },
            fromJSON: function (str) {
                var obj = JSON.parse(str);

                app.loadImage(obj.img);

                utils.foreach(obj.areas, function (areaParams) {
                    Area.fromJSON(areaParams);
                });
            }
        };


        // var my_rect = []
        // var co = 1;
        $(document).ready(function () {
            $.ajax({
                url: '/imageMap/getSubArea/',
                dataType: 'json',
                type: 'GET',
                success: function (data) {
                    window.mysubdata = data;
                }
            });
        });

        $("#add_area").click(function () {
            $("#device_col").show();
            $("#shape_col").show();
            // $("#isInteractive_col").show();
            // $("#save").show();
            $("#cancel_col").show();
            $("#add_col").hide();
            $("#save_col").show();
            $('#shapeType option').each(function () {
                $('select').find('option[value="' + $(this).val() + '"]').prop('disabled', true);
            });
        });
        window.cancel_area = []

        $('#subarea').on('change', function () {
            m_device = []
            allareas[allareas.length - 1] = [];
        });

        var len = 0;
        $('#devicelist').on('change', function () {
            len = 0
            $('#shapeType option').each(function () {
                if ($(this).val() != "") {
                    $('select').find('option[value="' + $(this).val() + '"]').prop('disabled', false);
                }
            });
            window.counter = 0
            $('#devicelist option').each(function () {
                len++;
            });
            // console.log(len-1)
        });
        // var deviceids = [];
        // Will moved from the main module
        var localStorageWrapper = (function () {
            var KEY_NAME = 'SummerHTMLImageMapCreator';

            return {
                save: function () {

                    var device = $("#devicelist").val();
                    var aid = $('#devicelist option:checked').attr('device-id');

                    $('#devicelist option').each(function () {
                        $('select').find('option[value="' + $(this).val() + '"]').prop('disabled', false);
                    });
                    var pos = '';

                    var c = 0;
                    if (all_d.includes(aid) == true) {
                        c = 1;
                    }
                    if (c != 1) {
                        all_d.push(aid)
                    }
                    $("a.myClass").addClass("disabled");
                    $("li.ctrl").removeClass("selected");
                    $(".drag").draggable({ disabled: true });


                    // console.log(cancel_area);
                    var result = areasIO.toJSON();
                    var rj = JSON.parse(result);
                    // console.log(rj)
                    allareas.push(rj["areas"])
                    allareas[allareas.length - 1] = []
                    for (var j = 0; j < rj["areas"].length; j++) {
                        if (cancel_area.includes(rj["areas"][j]["record_id"]) == false) {
                            allareas[allareas.length - 1].push(rj["areas"][j])
                        }
                    }
                    // console.log(allareas[allareas.length - 1])
                    // m_device.push(device)
                    var s_floor = $("#floor").val();
                    var s_dept = $('#departments').val();

                    for (var k = 0; k < remove_device.length; k++) {
                        $('#devicelist option[device-id="' + remove_device[k] + '"]').prop('disabled', false);
                    }
                    $('#subarea option[value=""]').prop('disabled', true);
                    $('#devicelist option[value=""]').prop('disabled', true);

                    $('#devicelist').val("");
                    window.counter = 0;
                    po = 1;
                    cou = 1;


                    if (allareas[allareas.length - 1] == null) {
                        allareas[allareas.length - 1] = []
                    }
                    $('.existing_device').map(function () {
                        var cls = $(this).attr("d-class");
                        var data = ''
                        if (cls == "existing_poly") {
                            var point = $(this).attr('points');
                            var myponit = []
                            var parray = point.split(' ')
                            // console.log(parray)
                            var plen = (parray.length);
                            for (var i = 0; i < plen; i++) {
                                var dict = {
                                    "x": parray[i],
                                    "y": parray[i + 1]
                                }
                                myponit.push(dict)
                                i = i + 1
                            }
                            data = {
                                "type": "polygon",
                                "coords": {
                                    "points": myponit,
                                    "isOpened": false
                                },
                                "devices": {
                                    "d_id": $(this).attr('d-id'),
                                    "device_status": $(this).attr('device_status'),
                                    "device_name": $(this).attr('device_name')
                                    // "sub_rect": []
                                }
                            }
                            // console.log(data)
                        }
                        if (cls == "existing_rect") {
                            data = {
                                "type": "rectangle",
                                "coords": {
                                    "x": Math.floor(Number($(this).attr('x'))),
                                    "y": Math.floor(Number($(this).attr('y'))),
                                    "width": Math.floor(Number($(this).attr('width'))),
                                    "height": Math.floor(Number($(this).attr('height')))
                                },
                                "devices": {
                                    "d_id": $(this).attr('d-id'),
                                    "device_status": $(this).attr('device_status'),
                                    "device_name": $(this).attr('device_name')
                                    // "sub_rect": []
                                }
                            }
                        }
                        allareas[allareas.length - 1].push(data)
                        // return data
                    }).get();
                    var id_f = $('#floor option:checked').attr('f-id');
                    var id_d = $('#departments option:checked').attr('a-id');
                    var id_s = $('#subarea option:checked').attr('sub-id');
                    var sub = [];
                    if (deviceids.length != 0) {
                        for (var j = 0; j < deviceids.length; j++) {
                            $('#devicelist select').find('option[value="' + $("#card_" + deviceids[j]).attr("d-name") + '"]').prop('disabled', true);
                            var pos = $("#card_" + deviceids[j]).find("p.position");
                            var position = pos.text();
                            var axis = position.split((/([!,?,.,(,)])/));
                            if (Number(axis[2] != null && Number(axis[4]) != null)) {
                                dict = {
                                    "record_id": Number($("#card_" + deviceids[j]).attr("d-id")),
                                    "device_name": $("#card_" + deviceids[j]).attr("d-name"),
                                    "device_type": $("#card_" + deviceids[j]).attr("a-type"),
                                    "device_status": $("#card_" + deviceids[j]).attr("d-status"),
                                    "x_axis": Number(axis[2]),
                                    "y_axis": Number(axis[4])
                                }

                                sub.push(dict);
                            }
                        }

                        window.c = 0;


                        if (window.counter == 0) {

                            var image = document.getElementById('img');
                            // alert(img_width)
                            var dict = {
                                "floor_id": Number(id_f),
                                "departments_id": Number(id_d),
                                "subarea_id": Number(id_s),
                                "img_width": image.width,
                                "img_height": image.height,
                                "areas": allareas[allareas.length - 1]
                                // "icons": sub
                            }
                            // console.log(allareas)
                            var data = {
                                'opr': 'add',
                                'opr_type': 'imageMap',
                                'data': dict
                            }
                            // bmsSocket.send(JSON.stringify(data));

                            var movetostatus = '';
                            if ($('#scales').is(":checked")) {
                                movetostatus = true;
                            }
                            else {
                                movetostatus = false;
                            }

                            var isInteractiveStatus = '';
                            if ($('#isInteractive').is(":checked")) {
                                isInteractiveStatus = true;
                            }
                            else {
                                isInteractiveStatus = false;
                            }
                            var obj;    
                            // alert(device_app_type)                        
                            if(status_of_device == null || status_of_device == "undefined" || status_of_device == false){
                                status_of_device = "false"                                
                            }
                            // if(device_app_type=="C"){
                            //     movetostatus = true
                            // }
                            // console.log(status_of_device)
                            if (type_of_shape == "polygon") {
                                obj = {
                                    "img_path": document.getElementById("img").src,
                                    "img_width": image.width,
                                    "img_height": image.height,
                                    "points": ploy_points,
                                    "arae_name": $("#subarea").val(),
                                    "record_id": aid,
                                    "floor_id": Number(id_f),
                                    "departments_id": Number(id_d),
                                    "subarea_id": Number(id_s),
                                    "device_name": device_name,
                                    "moveto": movetostatus,
                                    "shape_type": type_of_shape,
                                    "device_status":status_of_device,
                                    "app_type":device_app_type,
                                    "isInteractive":isInteractiveStatus
                                }

                            }
                            if (type_of_shape == "rectangle") {
                                // console.log(recto_mx,recto_my)
                                obj = {
                                    "img_path": document.getElementById("img").src,
                                    "img_width": image.width,
                                    "img_height": image.height,
                                    "rect_height": recto_h,
                                    "rect_width": recto_w,
                                    "rect_x": recto_x,
                                    "rect_y": recto_y,
                                    "rect_mx":recto_mx,
                                    "rect_my":recto_my,
                                    "shape_type": type_of_shape,
                                    "arae_name": $("#subarea").val(),
                                    "record_id": aid,
                                    "floor_id": Number(id_f),
                                    "departments_id": Number(id_d),
                                    "subarea_id": Number(id_s),
                                    "moveto": movetostatus,
                                    "device_name": device_name,
                                    "device_status":status_of_device,
                                    "app_type":device_app_type,
                                    "isInteractive":isInteractiveStatus
                                }
                            }
                            if (type_of_shape == "circle") {
                                obj = {
                                    "img_path": document.getElementById("img").src,
                                    "img_width": image.width,
                                    "img_height": image.height,
                                    "circle_r": Circle_r,
                                    "circle_cx": Circle_cx,
                                    "circle_cy": Circle_cy,
                                    "circle_mx": Circle_mx,
                                    "circle_my": Circle_my,
                                    "shape_type": type_of_shape,
                                    "arae_name": $("#subarea").val(),
                                    "record_id": aid,
                                    "floor_id": Number(id_f),
                                    "departments_id": Number(id_d),
                                    "subarea_id": Number(id_s),
                                    "moveto": movetostatus,
                                    "device_name": device_name,
                                    "device_status":status_of_device,
                                    "app_type":device_app_type,
                                    "isInteractive":isInteractiveStatus
                                }
                            }
                            if (type_of_shape == "ellipse") {
                                obj = {
                                    "img_path": document.getElementById("img").src,
                                    "img_width": image.width,
                                    "img_height": image.height,
                                    "Ellipse_cx":Ellipse_cx,
                                    "Ellipse_cy":Ellipse_cy,
                                    "Ellipse_rx":Ellipse_rx,
                                    "Ellipse_ry":Ellipse_ry,
                                    "Ellipse_mx":Ellipse_mx,
                                    "Ellipse_my":Ellipse_my,
                                    "shape_type": type_of_shape,
                                    "arae_name": $("#subarea").val(),
                                    "record_id": aid,
                                    "floor_id": Number(id_f),
                                    "departments_id": Number(id_d),
                                    "subarea_id": Number(id_s),
                                    "moveto": movetostatus,
                                    "device_name": device_name,
                                    "device_status":status_of_device,
                                    "app_type":device_app_type,
                                    "isInteractive":isInteractiveStatus
                                }
                            }
                            // console.log(obj)
                            var poly_obj_send = {
                                'opr': 'shape',
                                'opr_type': 'imageMap',
                                'data': obj
                            }
                            // console.log(poly_obj)
                            bmsSocket.send(JSON.stringify(poly_obj_send));
                            type_of_shape = '';
                            device_name = '';
                            ploy_points = "";
                            recto_h = '';
                            recto_w = '';
                            recto_y = '';
                            recto_x = '';
                            Circle_cy = '';
                            Circle_cx = '';
                            Circle_r = '';
                            device_app_type = '';
                            status_of_device = '';
                            isInteractiveStatus = ''
                            recto_mx = '';
                            recto_my = '';
                            Circle_mx = '';
                            Circle_my = '';
                            Ellipse_cx = '';
                            Ellipse_cy = '';
                            Ellipse_rx = '';
                            Ellipse_ry = '';
                            Ellipse_mx = '';
                            Ellipse_my = '';
                            aid = 0;
                            document.getElementById('icons').innerHTML = "";
                            $("#list_devices").hide();
                            all_d = [];
                            remove_device = [];
                            $("a.myClass").addClass("disabled");
                            $("li.ctrl").removeClass("selected");
                            if (allareas[allareas.length - 1].length == 0) {
                                alert("Remove all devices cropped image map area successfully..!");
                            } else {
                                alert("Cropped image map area inserted successfully..!");
                            }
                            allareas[allareas.length - 1] = [];
                            cancel_area = [];
                            $("#device_col").hide();
                            $("#shape_col").hide();
                            $("#isInteractive_col").hide()
                            // $("#save").show();
                            $("#cancel_col").hide();
                            $("#add_col").show();
                            $("#save_col").hide();
                            $("#dots_col").hide()
                            // $("#devicelist").SELECTED = true;
                            document.getElementById('shapeType').value = '';
                            window.counter = 1;
                            location.reload()
                        } else {
                            alert("Please first add cropped image map area.!");
                        }
                    }
                    else {
                        alert("Please add device with it's clickable area.!");
                    }
                },
                restore: function () {
                    areasIO.fromJSON(window.localStorage.getItem(KEY_NAME));
                }
            };
        })();

        return {
            domElements: domElements,
            saveInLocalStorage: localStorageWrapper.save,
            loadFromLocalStorage: localStorageWrapper.restore,
            hide: function () {
                utils.hide(domElements.container);
                return this;
            },
            show: function () {
                utils.show(domElements.container);
                return this;
            },
            recalcOffsetValues: function () {
                recalcOffsetValues();
                return this;
            },
            setDimensions: function (width, height) {
                domElements.svg.setAttribute('width', width);
                domElements.svg.setAttribute('height', height);
                domElements.container.style.width = width + 'px';
                domElements.container.style.height = height + 'px';
                return this;
            },
            loadImage: function (url) {
                get_image.showLoadIndicator();
                domElements.img.src = url;
                state.image.src = url;

                domElements.img.onload = function () {
                    get_image.hideLoadIndicator().hide();
                    app.show()
                        .setDimensions(domElements.img.width, domElements.img.height)
                        .recalcOffsetValues();
                };
                return this;
            },
            preview: (function () {
                domElements.img.setAttribute('usemap', '#map');
                domElements.map = document.createElement('map');
                domElements.map.setAttribute('name', 'map');
                domElements.container.appendChild(domElements.map);

                return function () {
                    info.unload();
                    app.setShape(null);
                    utils.hide(domElements.svg);
                    domElements.map.innerHTML = app.getHTMLCode();
                    code.print();
                    return this;
                };
            })(),
            hidePreview: function () {
                utils.show(domElements.svg);
                domElements.map.innerHTML = '';
                return this;
            },
            addNodeToSvg: function (node) {
                domElements.svg.appendChild(node);
                return this;
            },
            removeNodeFromSvg: function (node) {
                domElements.svg.removeChild(node);
                return this;
            },
            getOffset: function (arg) {
                switch (arg) {
                    case 'x':
                    case 'y':
                        return state.offset[arg];
                }
            },
            clear: function () {
                //remove all areas
                state.areas.length = 0;
                while (domElements.svg.childNodes[0]) {
                    domElements.svg.removeChild(domElements.svg.childNodes[0]);
                }
                code.hide();
                info.unload();
                return this;
            },
            removeObject: function (obj) {
                utils.foreach(state.areas, function (x, i) {
                    if (x === obj) {
                        state.areas.splice(i, 1);
                    }
                });
                obj.remove();
                return this;
            },
            deselectAll: function () {
                utils.foreach(state.areas, function (x) {
                    x.deselect();
                });
                return this;
            },
            getIsDraw: function () {
                return state.isDraw;
            },
            setIsDraw: function (arg) {
                state.isDraw = arg;
                return this;
            },
            setMode: function (arg) {
                state.appMode = arg;
                return this;
            },
            getMode: function () {
                return state.appMode;
            },
            setShape: function (arg) {
                state.currentType = arg;
                return this;
            },
            getShape: function () {
                return state.currentType;
            },
            addObject: function (object) {
                state.areas.push(object);
                return this;
            },
            getNewArea: function () {
                return state.newArea;
            },
            resetNewArea: function () {
                state.newArea = null;
                return this;
            },
            getSelectedArea: function () {
                return state.selectedArea;
            },
            setSelectedArea: function (obj) {
                state.selectedArea = obj;
                return this;
            },
            getEditType: function () {
                return state.editType;
            },
            setFilename: function (str) {
                state.image.filename = str;
                return this;
            },
            setEditClass: function () {
                domElements.container.classList.remove('draw');
                domElements.container.classList.add('edit');

                return this;
            },
            setDrawClass: function () {
                domElements.container.classList.remove('edit');
                domElements.container.classList.add('draw');

                return this;
            },
            setDefaultClass: function () {
                domElements.container.classList.remove('edit');
                domElements.container.classList.remove('draw');

                return this;
            },
            addEvent: function (target, eventType, func) {
                state.events.push(new AppEvent(target, eventType, func));
                return this;
            },
            removeAllEvents: function () {
                utils.foreach(state.events, function (x) {
                    x.remove();
                });
                state.events.length = 0;
                return this;
            },
            getHTMLCode: function (arg) {
                var html_code = '';
                if (arg) {
                    if (!state.areas.length) {
                        return '0 objects';
                    }
                    html_code += utils.encode('<img src="' + state.image.filename + '" alt="" usemap="#map" />') +
                        '<br />' + utils.encode('<map name="map">') + '<br />';
                    utils.foreachReverse(state.areas, function (x) {
                        html_code += '&nbsp;&nbsp;&nbsp;&nbsp;' + utils.encode(x.toHTMLMapElementString()) + '<br />';
                    });
                    html_code += utils.encode('</map>');
                } else {
                    utils.foreachReverse(state.areas, function (x) {
                        html_code += x.toHTMLMapElementString();
                    });
                }
                return html_code;
            }
        };
    })();


    /**
     * The constructor for dom events (for simple deleting of event)
     * 
     * @constructor
     * @param {DOMElement} target - DOM-element
     * @param {String} eventType - e.g. 'click' or 'mousemove'
     * @param {Function} func - handler for this event
     */
    function AppEvent(target, eventType, func) {
        this.target = target;
        this.eventType = eventType;
        this.func = func;

        target.addEventListener(eventType, func, false);
    }

    /**
     * Remove this event listener from target
     */
    AppEvent.prototype.remove = function () {
        this.target.removeEventListener(this.eventType, this.func, false);
    };


    /**
     * The constructor of helpers points
     * Helper is small svg-rectangle with some actions
     * 
     * @constructor
     * @param node {DOMElement} - a node for inserting helper
     * @param x {number} - x-coordinate of helper
     * @param y {number} - y-coordinate of helper
     * @param action {string} - an action by click of this helper (e.g. 'move')
     */

    function Helper(node, x, y, action) {
        this._el = document.createElementNS(Area.SVG_NS, 'rect');
        // console.log(this._el)
        this._el.classList.add(Helper.CLASS_NAME);
        this._el.setAttribute('height', Helper.SIZE);
        this._el.setAttribute('width', Helper.SIZE);
        this._el.setAttribute('x', x + Helper.OFFSET);
        this._el.setAttribute('y', y + Helper.OFFSET);
        node.appendChild(this._el);
        this._el.action = action; // TODO: move 'action' from dom el to data-attr
        this._el.classList.add(Helper.ACTIONS_TO_CURSORS[action]);

        // console.log(this._el);F
        // all_rect.push(rect_dict)
    }
    // console.log(this._el)
    Helper.SIZE = 5;
    Helper.OFFSET = -Math.ceil(Helper.SIZE / 2);
    Helper.CLASS_NAME = 'helper';
    Helper.ACTIONS_TO_CURSORS = {
        'move': 'move',
        'editLeft': 'e-resize',
        'editRight': 'w-resize',
        'editTop': 'n-resize',
        'editBottom': 's-resize',
        'editTopLeft': 'nw-resize',
        'editTopRight': 'ne-resize',
        'editBottomLeft': 'sw-resize',
        'editBottomRight': 'se-resize',
        'movePoint': 'pointer'
    };

    /**
     * Set coordinates for this helper
     * 
     * @param x {number} - x-coordinate
     * @param y {number} - y-coordinate
     * @returns {Helper}
     */
    Helper.prototype.setCoords = function (x, y) {
        this._el.setAttribute('x', x + Helper.OFFSET);
        this._el.setAttribute('y', y + Helper.OFFSET);
        // console.log(x + Helper.OFFSET)
        return this;
    };

    /**
     * Set id of this helper in list of parent's helpers
     * 
     * @param id {number} 
     * @returns {Helper}
     */
    Helper.prototype.setId = function (id) {
        // TODO: move n-field from DOM-element to data-attribute
        this._el.n = id;
        // console.log(this._el,"1")
        return this;
    };

    /**
     * The abstract constructor for area
     *
     * @constructor
     * @abstract
     * @param type {string} - type of area ('rectangle', 'circle' or 'polygon')
     * @param coords {Object} - coordinates of area (e.g. x, y, width, height)
     * @param attributes {Object} [attributes=undefined] - attributes for area (e.g. href, title)
     */

    function Area(type, coords, attributes) {
        if (this.constructor === Area) {
            throw new Error('This is abstract class');
        }

        this._type = type;

        /**
         * @namespace
         * @property href {string} - href-attribute of area
         * @property alt {string} - alt-attribute of area
         * @property title {string} - title-attribute of area
         */

        //  alert(d_status[0])
        aid = $('#devicelist option:checked').attr('device-id');
        var d_status = $('#devicelist option:checked').attr('device-status');
        var d_name = $('#devicelist').val();
        this._attributes = {
            d_id: aid,
            device_status: d_status,
            device_name: d_name
            // sub_rect: all_rect
            // href: '',
            // alt: '',
            // title: ''
        };
        // all_rect = []
        if (attributes) {
            this.setInfoAttributes(attributes);
        }

        this._coords = coords;
        // the g-element, it contains this area and helpers elements
        this._groupEl = document.createElementNS(Area.SVG_NS, 'g');
        app.addNodeToSvg(this._groupEl);

        // TODO: remove this field from DOM-element
        // Link to parent object
        this._groupEl.obj = this;

        // svg-dom-element of area
        this._el = null;

        // Object with all helpers of area
        this._helpers = {};

        // Add this new area to list of all areas 
        app.addObject(this);
    }
    Area.SVG_NS = 'http://www.w3.org/2000/svg'; // TODO: move to main editor constructor
    Area.CLASS_NAMES = {
        SELECTED: 'selected',
        WITH_HREF: 'with_href'
    };
    Area.CONSTRUCTORS = {
        rectangle: Rectangle,
        circle: Circle,
		ellipse: Ellipse,
        polygon: Polygon
    };
    Area.REGEXP = {
        AREA: /<area(?=.*? shape="(rect|circle|ellipse|poly)")(?=.*? coords="([\d ,]+?)")[\s\S]*?>/gmi,
        HREF: / href="([\S\s]+?)"/,
        ALT: / alt="([\S\s]+?)"/,
        TITLE: / title="([\S\s]+?)"/,
        DELIMETER: / ?, ?/
    };
    Area.HTML_NAMES_TO_AREA_NAMES = {
        rect: 'rectangle',
        circle: 'circle',
		ellipse: 'ellipse',
        poly: 'polygon'
    };
    Area.ATTRIBUTES_NAMES = ['HREF', 'ALT', 'TITLE'];

    /**
     * This method should be implemented for child-classes 
     * 
     * @throws {AbstractMethodCall}
     */
    Area.prototype.ABSTRACT_METHOD = function () {
        throw new Error('This is abstract method');
    };

    /**
     * All these methods are abstract 
     * 
     * @throws {AbstractMethodCall}
     */
    Area.prototype.setSVGCoords =
        Area.prototype.setCoords =
        Area.prototype.dynamicDraw =
        Area.prototype.onProcessDrawing =
        Area.prototype.onStopDrawing =
        Area.prototype.edit =
        Area.prototype.dynamicEdit =
        Area.prototype.onProcessEditing =
        Area.prototype.onStopEditing =
        Area.prototype.toString =
        Area.prototype.toHTMLMapElementString =
        Area.prototype.getCoordsForDisplayingInfo =
        Area.prototype.ABSTRACT_METHOD;

    /**
     * Redraw this area with own or custom coordinates
     * 
     * @param coords {Object} [coords=undefined]
     * @returns {Area} - this area
     */
    Area.prototype.redraw = function (coords) {
        this.setSVGCoords(coords ? coords : this._coords);

        return this;
    };

    /**
     * Remove this area from DOM-tree
     */
    Area.prototype.remove = function () {
        app.removeNodeFromSvg(this._groupEl);
    };

    /**
     * Move this area by dx, dy 
     * 
     * @returns {Area} - this area
     */
    Area.prototype.move = function (dx, dy) {
        this.setCoords(this.edit('move', dx, dy)).redraw();
        return this;
    };

    /**
     * Add class name for selected areas to this area
     * 
     * @returns {Area} - this area
     */
    Area.prototype.select = function () {
        this._el.classList.add(Area.CLASS_NAMES.SELECTED);
        // console.info(this.toString() + ' is selected now');

        return this;
    };

    /**
     * Remove class name for selected areas from this area
     * 
     * @returns {Area} - this area
     */
    Area.prototype.deselect = function () {
        this._el.classList.remove(Area.CLASS_NAMES.SELECTED);

        return this;
    };

    /**
     * Set style of element with href attribute for this area
     * 
     * @returns {Area} - this area
     */
    Area.prototype.setStyleOfElementWithHref = function () {
        this._el.classList.add(Area.CLASS_NAMES.WITH_HREF);

        return this;
    };

    /**
     * Unset style of element with href attribute for this area
     * 
     * @returns {Area} - this area
     */
    Area.prototype.unsetStyleOfElementWithHref = function () {
        this._el.classList.remove(Area.CLASS_NAMES.WITH_HREF);

        return this;
    };

    /**
     * Set attributes (href, alt and title) for this area
     * 
     * @param attributes {Object} - Object with attributes for area
     */
    Area.prototype.setInfoAttributes = function (attributes) {
        this._attributes.href = attributes.href;
        this._attributes.alt = attributes.alt;
        this._attributes.title = attributes.title;
    };

    /**
     * Returns json-representation of this area
     * 
     * @returns {Object}
     */
    Area.prototype.toJSON = function () {
        /**
         * @namespace
         * @property type {string} - type of this area (e.g. 'rectangle', 'circle')
         * @property coords {Object} - coordinates of this area (e.g. 'x', 'width') 
         * @property attributes {Object} - attributes of this area (e.g. 'href', 'title')
         */
        return {
            type: this._type,
            coords: this._coords,
            devices: this._attributes
        };
    };

    /**
     * Returns new area object created with params from json-object
     * 
     * @static
     * @param params {Object} - params of area, incl. type, coords and attributes
     * @returns {Rectangle|Circle|Polygon}
     */
    Area.fromJSON = function (params) {
        var AreaConstructor = Area.CONSTRUCTORS[params.type];

        if (!AreaConstructor) {
            throw new Error('This area type is not valid');
        }

        if (!AreaConstructor.testCoords(params.coords)) {
            throw new Error('This coords is not valid for ' + params.type);
        }

        app.setIsDraw(true);

        var area = new AreaConstructor(params.coords, params.attributes);

        app.setIsDraw(false)
            .resetNewArea();

        return area;
    };

    /**
     * Creates new areas from html-string with <area /> elements
     * 
     * @param htmlStr {string}
     * @returns {Array} - array with areas
     */
    Area.createAreasFromHTMLOfMap = function (htmlStr) {
        if (!htmlStr) {
            return false;
        }

        while (true) {
            var findedResult = Area.REGEXP.AREA.exec(htmlStr); // <area shape="$1" coords="$2" ... />
            if (!findedResult) {
                break;
            }

            var htmlAreaFinded = findedResult[0], // <area shape="..." coords="..." ... />
                type = findedResult[1], // $1
                coords = findedResult[2].split(Area.REGEXP.DELIMETER), // $2
                attributes = {};

            Area.ATTRIBUTES_NAMES.forEach(function (item, i) {
                var result = Area.REGEXP[item].exec(htmlAreaFinded);

                if (result) {
                    attributes[name] = result[1];
                }
            });

            coords = coords.map(function (item) {
                return Number(item);
            });

            type = Area.HTML_NAMES_TO_AREA_NAMES[type];

            Area.fromJSON({
                type: type,
                coords: Area.CONSTRUCTORS[type].getCoordsFromHTMLArray(coords),
                attributes: attributes
            });

        }

        return Boolean(htmlAreaFinded);
    };

    /**
     * Returns copy of original area, selected and moved by (10,10) from it
     * 
     * @param originalArea {Area}
     * @returns {Area} - a copy of original area
     */
    Area.copy = function (originalArea) {
        return Area.fromJSON(originalArea.toJSON()).move(10, 10).select();
    };

    /* ---------- Constructors for real areas ---------- */

    /**
     * The constructor for rectangles
     * 
     * (x, y) -----
     * |          | height
     * ------------
     *     width
     *
     * @constructor
     * @param coords {Object} - object with parameters of new area (x, y, width, height)
     *                          if some parameter is undefined, it will set 0
     * @param attributes {Object} [attributes=undefined] - attributes for area (e.g. href, title) 
     */

    function Rectangle(coords, attributes) {
        // var className = $('.ctrl').hasClass("selected")
        // var device = $('#devicelist').val();
        // if (className == true) {
        Area.call(this, 'rectangle', coords, attributes);
        /**
         * @namespace
         * @property {number} x - Distance from the left edge of the image to the left side of the rectangle
         * @property {number} y - Distance from the top edge of the image to the top side of the rectangle
         * @property {number} width - Width of rectangle
         * @property {number} height - Height of rectangle
         */
        this._coords = {
            x: coords.x || 0,
            y: coords.y || 0,
            width: coords.width || 0,
            height: coords.height || 0
        };

        this._el = document.createElementNS(Area.SVG_NS, 'rect');
        this._groupEl.appendChild(this._el);

        var x = coords.x - this._coords.width / 2,
            y = coords.y - this._coords.height / 2;
        // alert(x)
        this._helpers = {
            center: new Helper(this._groupEl, x, y, 'move'),
            top: new Helper(this._groupEl, x, y, 'editTop'),
            bottom: new Helper(this._groupEl, x, y, 'editBottom'),
            left: new Helper(this._groupEl, x, y, 'editLeft'),
            right: new Helper(this._groupEl, x, y, 'editRight'),
            topLeft: new Helper(this._groupEl, x, y, 'editTopLeft'),
            topRight: new Helper(this._groupEl, x, y, 'editTopRight'),
            bottomLeft: new Helper(this._groupEl, x, y, 'editBottomLeft'),
            bottomRight: new Helper(this._groupEl, x, y, 'editBottomRight')
        };
        // console.log(this._el)
        this.redraw();
        // } else if (className == false && device == null) {
        //     alert("Please select create image map area button and Device type.!")
        // } else {
        //     alert("Please select create image map area button.!")
        // }
        // console.log(this._el)
    }

    utils.inherits(Rectangle, Area);

    /**
     * Set attributes for svg-elements of area by new parameters
     * 
     * -----top------
     * |            |
     * ---center_y---
     * |            |
     * ----bottom----
     * 
     * @param coords {Object} - Object with coords of this area (x, y, width, height)
     * @returns {Rectangle} - this rectangle
     */
    Rectangle.prototype.setSVGCoords = function (coords) {
        this._el.setAttribute('x', coords.x);
        this._el.setAttribute('y', coords.y);
        this._el.setAttribute('width', coords.width);
        this._el.setAttribute('height', coords.height);

        var top = coords.y,
            center_y = coords.y + coords.height / 2,
            bottom = coords.y + coords.height,
            left = coords.x,
            center_x = coords.x + coords.width / 2,
            right = coords.x + coords.width;

        this._helpers.center.setCoords(center_x, center_y);
        this._helpers.top.setCoords(center_x, top);
        this._helpers.bottom.setCoords(center_x, bottom);
        this._helpers.left.setCoords(left, center_y);
        this._helpers.right.setCoords(right, center_y);
        this._helpers.topLeft.setCoords(left, top);
        this._helpers.topRight.setCoords(right, top);
        this._helpers.bottomLeft.setCoords(left, bottom);
        this._helpers.bottomRight.setCoords(right, bottom);

        return this;
    };
    // console.log(Rectangle)
    /**
     * Set coords for this area
     * 
     * @param coords {coords}
     * @returns {Rectangle} - this rectangle
     */
    Rectangle.prototype.setCoords = function (coords) {
        this._coords.x = coords.x;
        this._coords.y = coords.y;
        this._coords.width = coords.width;
        this._coords.height = coords.height;

        return this;
    };

    /**
     * Calculates new coordinates in process of drawing
     * 
     * @param x {number} - x-coordinate of cursor
     * @param y {number} - y-coordinate of cursor
     * @param isSquare {boolean}
     * @returns {Object} - calculated coords of this area
     */
    Rectangle.prototype.dynamicDraw = function (x, y, isSquare) {
        var newCoords = {
            x: this._coords.x,
            y: this._coords.y,
            width: x - this._coords.x,
            height: y - this._coords.y
        };

        if (isSquare) {
            newCoords = Rectangle.getSquareCoords(newCoords);
        }

        newCoords = Rectangle.getNormalizedCoords(newCoords);

        this.redraw(newCoords);

        return newCoords;
    };

    /**
     * Handler for drawing process (by mousemove)
     * It includes only redrawing area by new coords 
     * (this coords doesn't save as own area coords)
     * 
     * @params e {MouseEvent} - mousemove event
     */
    Rectangle.prototype.onProcessDrawing = function (e) {
        var coords = utils.getRightCoords(e.pageX, e.pageY);

        this.dynamicDraw(coords.x, coords.y, e.shiftKey);
    };

    /**
     * Handler for drawing stoping (by second click on drawing canvas)
     * It includes redrawing area by new coords 
     * and saving this coords as own area coords
     * 
     * @params e {MouseEvent} - click event
     */
    Rectangle.prototype.onStopDrawing = function (e) {
        var coords = utils.getRightCoords(e.pageX, e.pageY);
        const mytext = document.createElementNS("http://www.w3.org/2000/svg", "text");
        this._groupEl.appendChild(mytext)
        var x = this._groupEl.childNodes[1].getAttribute('x')
        var y = this._groupEl.childNodes[1].getAttribute('y')
        recto_mx = this._groupEl.childNodes[0].getAttribute('x');
        recto_my = this._groupEl.childNodes[0].getAttribute('y');
        recto_x = x;
        recto_y = y;
        recto_w = this._groupEl.childNodes[0].getAttribute('width')
        recto_h = this._groupEl.childNodes[0].getAttribute('height')
        type_of_shape = "rectangle"
        var d_name = $('#devicelist').val();
        status_of_device = $('#devicelist option:checked').attr('device-status');
        var d_type = $('#devicelist option:checked').attr('app-type');
        device_app_type = d_type
        if(d_type == "STB"){
            device_app_type = "STB";
        }
        device_name = d_name
        var rid = $('#devicelist option:checked').attr('device-id');
        mytext.setAttribute('x', x);
        mytext.setAttribute('y', y - 10);
        mytext.innerHTML = d_name;
        m_device.push(rid);


        app.setShape(null)
            .setMode('editing')
            .setEditClass();
        e.preventDefault();
        window.counter = 1;
        // alert("hii")
        this.setCoords(this.dynamicDraw(coords.x, coords.y, e.shiftKey)).deselect();

        app.removeAllEvents()
            .setIsDraw(false)
            .resetNewArea();
    };

    /**
     * Changes area parameters by editing type and offsets
     * 
     * @param {string} editingType - A type of editing (e.g. 'move')
     * @returns {Object} - Object with changed parameters of area 
     */
    Rectangle.prototype.edit = function (editingType, dx, dy) {
        var tempParams = Object.create(this._coords);

        switch (editingType) {
            case 'move':
                tempParams.x += dx;
                tempParams.y += dy;
                break;

            case 'editLeft':
                tempParams.x += dx;
                tempParams.width -= dx;
                break;

            case 'editRight':
                tempParams.width += dx;
                break;

            case 'editTop':
                tempParams.y += dy;
                tempParams.height -= dy;
                break;

            case 'editBottom':
                tempParams.height += dy;
                break;

            case 'editTopLeft':
                tempParams.x += dx;
                tempParams.y += dy;
                tempParams.width -= dx;
                tempParams.height -= dy;
                break;

            case 'editTopRight':
                tempParams.y += dy;
                tempParams.width += dx;
                tempParams.height -= dy;
                break;

            case 'editBottomLeft':
                tempParams.x += dx;
                tempParams.width -= dx;
                tempParams.height += dy;
                break;

            case 'editBottomRight':
                tempParams.width += dx;
                tempParams.height += dy;
                break;
        }
        var x = this._groupEl.childNodes[1].getAttribute('x')
        var y = this._groupEl.childNodes[1].getAttribute('y')
        recto_mx = this._groupEl.childNodes[0].getAttribute('x');
        recto_my = this._groupEl.childNodes[0].getAttribute('y');
        recto_x = x;
        recto_y = y;
        recto_w = this._groupEl.childNodes[0].getAttribute('width')
        recto_h = this._groupEl.childNodes[0].getAttribute('height')
        return tempParams;
    };

    /**
     * Calculates new coordinates in process of editing
     * 
     * @param coords {Object} - area coords 
     * @param saveProportions {boolean}
     * @returns {Object} - new coordinates of area
     */
    Rectangle.prototype.dynamicEdit = function (coords, saveProportions) {
        coords = Rectangle.getNormalizedCoords(coords);

        if (saveProportions) {
            coords = Rectangle.getSavedProportionsCoords(coords);
        }

        this.redraw(coords);

        return coords;
    };

    /**
     * Handler for editing process (by mousemove)
     * It includes only redrawing area by new coords 
     * (this coords doesn't save as own area coords)
     * 
     * @params e {MouseEvent} - mousemove event
     */
    Rectangle.prototype.onProcessEditing = function (e) {
        $("#save_col").show();
        return this.dynamicEdit(
            this.edit(
                app.getEditType(),
                e.pageX - this.editingStartPoint.x,
                e.pageY - this.editingStartPoint.y
            ),
            e.shiftKey
        );
    };

    /**
     * Handler for editing stoping (by mouseup)
     * It includes redrawing area by new coords 
     * and saving this coords as own area coords
     * 
     * @params e {MouseEvent} - mouseup event
     */
    Rectangle.prototype.onStopEditing = function (e) {
        this.setCoords(this.onProcessEditing(e));
        app.removeAllEvents();
    };

    /**
     * Returns string-representation of this rectangle
     * 
     * @returns {string}
     */
    Rectangle.prototype.toString = function () {
        return 'Rectangle {x: ' + this._coords.x +
            ', y: ' + this._coords.y +
            ', width: ' + this._coords.width +
            ', height: ' + this._coords.height + '}';
    }

    /**
     * Returns html-string of area html element with params of this rectangle
     * 
     * @returns {string}
     */
    Rectangle.prototype.toHTMLMapElementString = function () {
        var x2 = this._coords.x + this._coords.width,
            y2 = this._coords.y + this._coords.height;

        return '<area shape="rect" coords="' // TODO: use template engine
            + this._coords.x + ', '
            + this._coords.y + ', '
            + x2 + ', '
            + y2
            + '"'
            + (this._attributes.href ? ' href="' + this._attributes.href + '"' : '')
            + (this._attributes.alt ? ' alt="' + this._attributes.alt + '"' : '')
            + (this._attributes.title ? ' title="' + this._attributes.title + '"' : '')
            + ' />';
    };

    /**
     * Returns coords for area attributes form
     * 
     * @returns {Object} - object width coordinates of point
     */
    Rectangle.prototype.getCoordsForDisplayingInfo = function () {
        return {
            x: this._coords.x,
            y: this._coords.y
        };
    };

    /**
     * Returns true if coords is valid for rectangles and false otherwise
     *
     * @static
     * @param coords {Object} - object with coords for new rectangle
     * @return {boolean}
     */
    Rectangle.testCoords = function (coords) {
        return coords.x && coords.y && coords.width && coords.height;
    };

    /**
     * Returns true if html coords array is valid for rectangles and false otherwise
     *
     * @static
     * @param coords {Array} - coords for new rectangle as array
     * @return {boolean}
     */
    Rectangle.testHTMLCoords = function (coords) {
        return coords.length === 4;
    };

    /**
     * Return rectangle coords object from html array
     * 
     * @param htmlCoordsArray {Array}
     * @returns {Object}
     */
    Rectangle.getCoordsFromHTMLArray = function (htmlCoordsArray) {
        if (!Rectangle.testHTMLCoords(htmlCoordsArray)) {
            throw new Error('This html-coordinates is not valid for rectangle');
        }

        return {
            x: htmlCoordsArray[0],
            y: htmlCoordsArray[1],
            width: htmlCoordsArray[2] - htmlCoordsArray[0],
            height: htmlCoordsArray[3] - htmlCoordsArray[1]
        };
    };

    /**
     * Fixes coords if width or/and height are negative
     * 
     * @static
     * @param coords {Object} - Coordinates of this area 
     * @returns {Object} - Normalized coordinates of area
     */
    Rectangle.getNormalizedCoords = function (coords) {
        if (coords.width < 0) {
            coords.x += coords.width;
            coords.width = Math.abs(coords.width);
        }

        if (coords.height < 0) {
            coords.y += coords.height;
            coords.height = Math.abs(coords.height);
        }

        return coords;
    };

    /**
     * Returns coords with equivivalent width and height
     * 
     * @static
     * @param coords {Object} - Coordinates of this area 
     * @returns {Object} - Coordinates of area with equivivalent width and height
     */
    Rectangle.getSquareCoords = function (coords) {
        var width = Math.abs(coords.width),
            height = Math.abs(coords.height);

        if (width > height) {
            coords.width = coords.width > 0 ? height : -height;
        } else {
            coords.height = coords.height > 0 ? width : -width;
        }

        return coords;
    };

    /**
     * Returns coords with saved proportions of original area
     * 
     * @static
     * @param coords {Object} - Coordinates of this area 
     * @param originalCoords {Object} - Coordinates of the original area
     * @returns {Object} - Coordinates of area with saved proportions of original area
     */
    Rectangle.getSavedProportionsCoords = function (coords, originalCoords) {
        var originalProportions = coords.width / coords.height,
            currentProportions = originalCoords.width / originalCoords.height;

        if (currentProportions > originalProportions) {
            coords.width = Math.round(coords.height * originalProportions);
        } else {
            coords.height = Math.round(coords.width / originalProportions);
        }

        return coords;
    };

    /**
     * Creates new rectangle and adds drawing handlers for DOM-elements
     * 
     * @static
     * @param firstPointCoords {Object}
     * @returns {Rectangle}
     */
    Rectangle.createAndStartDrawing = function (firstPointCoords) {
        var newArea = new Rectangle({
            x: firstPointCoords.x,
            y: firstPointCoords.y,
            width: 0,
            height: 0
        });

        app.addEvent(app.domElements.container, 'mousemove', newArea.onProcessDrawing.bind(newArea))
            .addEvent(app.domElements.container, 'click', newArea.onStopDrawing.bind(newArea));

        return newArea;
    };


    /**
     * The constructor for circles
     *
     *     ------
     *  /         \
     * |  (x, y)<->| radius
     *  \         /
     *    ------
     *
     * @constructor
     * @param coords {Object} - object with parameters of new area (cx, cy, radius)
     *                          if some parameter is undefined, it will set 0
     * @param attributes {Object} [attributes=undefined] - attributes for area (e.g. href, title) 
     */
    function Circle(coords, attributes) {
        Area.call(this, 'circle', coords, attributes);

        /**
         * @namespace
         * @property {number} cx - Distance from the left edge of the image to the center of the circle
         * @property {number} cy - Distance from the top edge of the image to the center of the circle
         * @property {number} radius - Radius of the circle
         */
        this._coords = {
            cx: coords.cx || 0,
            cy: coords.cy || 0,
            radius: coords.radius || 0
        };

        this._el = document.createElementNS(Area.SVG_NS, 'circle');
        this._groupEl.appendChild(this._el);

        this.helpers = {
            center: new Helper(this._groupEl, coords.cx, coords.cy, 'move'),
            top: new Helper(this._groupEl, coords.cx, coords.cy, 'editTop'),
            bottom: new Helper(this._groupEl, coords.cx, coords.cy, 'editBottom'),
            left: new Helper(this._groupEl, coords.cx, coords.cy, 'editLeft'),
            right: new Helper(this._groupEl, coords.cx, coords.cy, 'editRight')
        };

        this.redraw();
    }
    utils.inherits(Circle, Area);

    /**
     * Set attributes for svg-elements of area by new parameters
     * 
     * @param coords {Object} - Object with coords of this area (cx, cy, radius)
     * @returns {Circle} - this area
     */
    Circle.prototype.setSVGCoords = function (coords) {
        this._el.setAttribute('cx', coords.cx);
        this._el.setAttribute('cy', coords.cy);
        this._el.setAttribute('r', coords.radius);

        this.helpers.center.setCoords(coords.cx, coords.cy);
        this.helpers.top.setCoords(coords.cx, coords.cy - coords.radius);
        this.helpers.right.setCoords(coords.cx + coords.radius, coords.cy);
        this.helpers.bottom.setCoords(coords.cx, coords.cy + coords.radius);
        this.helpers.left.setCoords(coords.cx - coords.radius, coords.cy);

        return this;
    };

    /**
     * Set coords for this area
     * 
     * @param coords {Object} - coordinates for thia area
     * @returns {Circle} - this area
     */
    Circle.prototype.setCoords = function (coords) {
        this._coords.cx = coords.cx;
        this._coords.cy = coords.cy;
        this._coords.radius = coords.radius;

        return this;
    };

    /**
     * Calculates new coordinates in process of drawing
     * (for circle normalizeCoords() don't needed because 
     * radius are always positive)
     * 
     * @param x {number} - x-coordinate
     * @param y {number} - y-coordinate
     * @returns {Object} - calculated coordinates
     */
    Circle.prototype.dynamicDraw = function (x, y) {
        var radius = Math.round(
            Math.sqrt(
                Math.pow(this._coords.cx - x, 2) +
                Math.pow(this._coords.cy - y, 2)
            )
        ),
            newCoords = {
                cx: this._coords.cx,
                cy: this._coords.cy,
                radius: radius
            };

        this.redraw(newCoords);

        return newCoords;
    };

    /**
     * Handler for drawing process (by mousemove)
     * It includes only redrawing area by new coords 
     * (this coords doesn't save as own area coords)
     * 
     * @params e {MouseEvent} - mousemove event
     */
    Circle.prototype.onProcessDrawing = function (e) {
        var coords = utils.getRightCoords(e.pageX, e.pageY);

        this.dynamicDraw(coords.x, coords.y);
    };

    /**
     * Handler for drawing stoping (by second click)
     * It includes redrawing area by new coords 
     * and saving this coords as own area coords
     * 
     * @params e {MouseEvent} - click event
     */
    Circle.prototype.onStopDrawing = function (e) {
        var coords = utils.getRightCoords(e.pageX, e.pageY);
        
        Circle_cx = this._groupEl.childNodes[1].getAttribute('x');
        Circle_cy = this._groupEl.childNodes[1].getAttribute('y');
        Circle_r = this._groupEl.childNodes[0].getAttribute('r');
        Circle_mx = this._groupEl.childNodes[0].getAttribute('cx');
        Circle_my = this._groupEl.childNodes[0].getAttribute('cy');
        // console.log(Circle_cx, Circle_cy, Circle_r)
        status_of_device = $('#devicelist option:checked').attr('device-status');
        var d_type = $('#devicelist option:checked').attr('app-type');
        device_app_type = d_type
        var d_name = $('#devicelist').val();
        device_name = d_name
        type_of_shape = "circle"
        app.setShape(null)
            .setMode('editing')
            .setEditClass();
        e.preventDefault();
        window.counter = 1;
        this.setCoords(this.dynamicDraw(coords.x, coords.y)).deselect();

        app.removeAllEvents()
            .setIsDraw(false)
            .resetNewArea();
    };

    /**
     * Changes area parameters by editing type and offsets
     * 
     * @param {string} editingType - A type of editing
     * @returns {Object} - Object with changed parameters of area 
     */
    Circle.prototype.edit = function (editingType, dx, dy) {
        var tempParams = Object.create(this._coords);

        switch (editingType) {
            case 'move':
                tempParams.cx += dx;
                tempParams.cy += dy;
                break;

            case 'editTop':
                tempParams.radius -= dy;
                break;

            case 'editBottom':
                tempParams.radius += dy;
                break;

            case 'editLeft':
                tempParams.radius -= dx;
                break;

            case 'editRight':
                tempParams.radius += dx;
                break;
        }
        Circle_cx = this._groupEl.childNodes[1].getAttribute('x');
        Circle_cy = this._groupEl.childNodes[1].getAttribute('y');
        Circle_r = this._groupEl.childNodes[0].getAttribute('r');
        Circle_mx = this._groupEl.childNodes[0].getAttribute('cx');
        Circle_my = this._groupEl.childNodes[0].getAttribute('cy');
        return tempParams;
    };

    /**
     * Calculates new coordinates in process of editing
     * 
     * @param tempCoords {Object} - area coords 
     * @returns {Object} - calculated coordinates
     */
    Circle.prototype.dynamicEdit = function (tempCoords) {
        if (tempCoords.radius < 0) {
            tempCoords.radius = Math.abs(tempCoords.radius);
        }

        this.setSVGCoords(tempCoords);

        return tempCoords;
    };

    /**
     * Handler for editing process (by mousemove)
     * It includes only redrawing area by new coords 
     * (this coords doesn't save as own area coords)
     * 
     * @params e {MouseEvent} - mousemove event
     */
    Circle.prototype.onProcessEditing = function (e) {
        var editType = app.getEditType();

        return this.dynamicEdit(
            this.edit(editType, e.pageX - this.editingStartPoint.x, e.pageY - this.editingStartPoint.y)
        );
    };

    /**
     * Handler for editing stoping (by mouseup)
     * It includes redrawing area by new coords 
     * and saving this coords as own area coords
     * 
     * @params e {MouseEvent} - mouseup event
     */
    Circle.prototype.onStopEditing = function (e) {
        var editType = app.getEditType();

        this.setCoords(this.onProcessEditing(e));

        app.removeAllEvents();
    };

    /**
     * Returns string-representation of circle
     * 
     * @returns {string}
     */
    Circle.prototype.toString = function () {
        return 'Circle {cx: ' + this._coords.cx +
            ', cy: ' + this._coords.cy +
            ', radius: ' + this._coords.radius + '}';
    }

    /**
     * Returns html-string of area html element with params of this circle
     * 
     * @returns {string}
     */
    Circle.prototype.toHTMLMapElementString = function () {
        return '<area shape="circle" coords="'
            + this._coords.cx + ', '
            + this._coords.cy + ', '
            + this._coords.radius
            + '"'
            + (this._attributes.href ? ' href="' + this._attributes.href + '"' : '')
            + (this._attributes.alt ? ' alt="' + this._attributes.alt + '"' : '')
            + (this._attributes.title ? ' title="' + this._attributes.title + '"' : '')
            + ' />';
    };

    /**
     * Returns coords for area attributes form
     * 
     * @returns {Object} - coordinates of point
     */
    Circle.prototype.getCoordsForDisplayingInfo = function () {
        return {
            x: this._coords.cx,
            y: this._coords.cy
        };
    };

    /**
     * Returns true if coords is valid for circles and false otherwise
     *
     * @static
     * @param coords {Object} - object width coords for new circle
     * @return {boolean}
     */
    Circle.testCoords = function (coords) {
        return coords.cx && coords.cy && coords.radius;
    };

    /**
     * Returns true if html coords array is valid for circles and false otherwise
     *
     * @static
     * @param coords {Array} - coords for new circle as array
     * @return {boolean}
     */
    Circle.testHTMLCoords = function (coords) {
        return coords.length === 3;
    };

    /**
     * Returns circle coords object from html array
     * 
     * @param htmlCoordsArray {Array}
     * @returns {Object}
     */
    Circle.getCoordsFromHTMLArray = function (htmlCoordsArray) {
        if (!Circle.testHTMLCoords(htmlCoordsArray)) {
            throw new Error('This html-coordinates is not valid for circle');
        }

        return {
            cx: htmlCoordsArray[0],
            cy: htmlCoordsArray[1],
            radius: htmlCoordsArray[2]
        };
    };

    /**
     * Creates new circle and adds drawing handlers for DOM-elements
     *
     * @static
     * @param firstPointCoords {Object} 
     * @returns {Circle}
     */
    Circle.createAndStartDrawing = function (firstPointCoords) {
        var newArea = new Circle({
            cx: firstPointCoords.x,
            cy: firstPointCoords.y,
            radius: 0
        });

        app.addEvent(app.domElements.container, 'mousemove', newArea.onProcessDrawing.bind(newArea))
            .addEvent(app.domElements.container, 'click', newArea.onStopDrawing.bind(newArea));

        return newArea;
    };



	/**
     * The constructor for ellipses
     *
     *     ------
     *  /         \
     * |  (x, y)<->| radius
     *  \         /
     *    ------
     *
     * @constructor
     * @param coords {Object} - object with parameters of new area (cx, cy, radius)
     *                          if some parameter is undefined, it will set 0
     * @param attributes {Object} [attributes=undefined] - attributes for area (e.g. href, title) 
     */
    function Ellipse(coords, attributes) {
        Area.call(this, 'ellipse', coords, attributes);

        /**
         * @namespace
         * @property {number} cx - Distance from the left edge of the image to the center of the ellipse
         * @property {number} cy - Distance from the top edge of the image to the center of the ellipse
         * @property {number} radius - Radius of the ellipse
         */
        // console.log(coords)
        this._coords = {
            cx: coords.cx || 0,
            cy: coords.cy || 0,
			radiusX: coords.radiusX || 0,
            radiusY: coords.radiusY || 0
        };

        this._el = document.createElementNS(Area.SVG_NS, 'ellipse');
        this._groupEl.appendChild(this._el);

        this.helpers = {
            center: new Helper(this._groupEl, coords.cx, coords.cy, 'move'),
            top: new Helper(this._groupEl, coords.cy, coords.cy, 'editTop'),
            bottom: new Helper(this._groupEl, coords.cy, coords.cy, 'editBottom'),
            left: new Helper(this._groupEl, coords.cx, coords.cx, 'editLeft'),
            right: new Helper(this._groupEl, coords.cx, coords.cx, 'editRight')
        };

        this.redraw();
    }
    utils.inherits(Ellipse, Area);

    /**
     * Set attributes for svg-elements of area by new parameters
     * 
     * @param coords {Object} - Object with coords of this area (cx, cy, radius)
     * @returns {Ellipse} - this area
     */
    Ellipse.prototype.setSVGCoords = function (coords) {
        // console.log(coords)
        this._el.setAttribute('cx', coords.cx);
        this._el.setAttribute('cy', coords.cy);
        this._el.setAttribute('rx', coords.radiusX);
		this._el.setAttribute('ry', coords.radiusY);
        
        this.helpers.center.setCoords(coords.cx, coords.cy);
        this.helpers.top.setCoords(coords.cx, coords.cy - coords.radiusY);
        this.helpers.right.setCoords(coords.cx + coords.radiusX, coords.cy);
        this.helpers.bottom.setCoords(coords.cx, coords.cy + coords.radiusY);
        this.helpers.left.setCoords(coords.cx - coords.radiusX, coords.cy);

        return this;
    };

    /**
     * Set coords for this area
     * 
     * @param coords {Object} - coordinates for thia area
     * @returns {Ellipse} - this area
     */
    Ellipse.prototype.setCoords = function (coords) {
        this._coords.cx = coords.cx;
        this._coords.cy = coords.cy;
        this._coords.radiusX = coords.radiusX;
		this._coords.radiusY = coords.radiusY;

        return this;
    };

    /**
     * Calculates new coordinates in process of drawing
     * (for ellipse normalizeCoords() don't needed because 
     * radius are always positive)
     * 
     * @param x {number} - x-coordinate
     * @param y {number} - y-coordinate
     * @returns {Object} - calculated coordinates
     */
    Ellipse.prototype.dynamicDraw = function (x1, y1) {	
        var x0 = this._coords.cx,
			y0 = this._coords.cy,
			dx,
			dy,
			radiusX,radiusY,
			newCoords;	
        
        x1 = x1 ? x1 : x0;
		y1 = y1 ? y1 : y0;

        dx = Math.abs(x0-x1);
        dy = Math.abs(y0-y1);
        
        radiusX = Math.round(dx);
		radiusY = Math.round(dy);

        newCoords = {
            cx : x0,
            cy : y0,
            radiusX : radiusX,
			radiusY : radiusY
        };

        this.redraw(newCoords);

        return newCoords;
    };

    /**
     * Handler for drawing process (by mousemove)
     * It includes only redrawing area by new coords 
     * (this coords doesn't save as own area coords)
     * 
     * @params e {MouseEvent} - mousemove event
     */
    Ellipse.prototype.onProcessDrawing = function (e) {
        var coords = utils.getRightCoords(e.pageX, e.pageY);

        this.dynamicDraw(coords.x, coords.y);
    };

    /**
     * Handler for drawing stoping (by second click)
     * It includes redrawing area by new coords 
     * and saving this coords as own area coords
     * 
     * @params e {MouseEvent} - click event
     */
    Ellipse.prototype.onStopDrawing = function (e) {
        var coords = utils.getRightCoords(e.pageX, e.pageY);
        
        Ellipse_cx = this._groupEl.childNodes[1].getAttribute('x');
        Ellipse_cy = this._groupEl.childNodes[1].getAttribute('y');
        Ellipse_rx = this._groupEl.childNodes[0].getAttribute('rx');
        Ellipse_ry = this._groupEl.childNodes[0].getAttribute('ry');
        Ellipse_mx = this._groupEl.childNodes[0].getAttribute('cx');
        Ellipse_my = this._groupEl.childNodes[0].getAttribute('cy');

        status_of_device = $('#devicelist option:checked').attr('device-status');
        var d_type = $('#devicelist option:checked').attr('app-type');
        device_app_type = d_type
        var d_name = $('#devicelist').val();
        device_name = d_name
        type_of_shape = "ellipse"

        app.setShape(null)
            .setMode('editing')
            .setEditClass();
        e.preventDefault();
        window.counter = 1;
        this.setCoords(this.dynamicDraw(coords.x, coords.y)).deselect();

        app.removeAllEvents()
            .setIsDraw(false)
            .resetNewArea();
    };

    /**
     * Changes area parameters by editing type and offsets
     * 
     * @param {string} editingType - A type of editing
     * @returns {Object} - Object with changed parameters of area 
     */
    Ellipse.prototype.edit = function (editingType, dx, dy) {
        var tempParams = Object.create(this._coords);

        switch (editingType) {
            case 'move':
                tempParams.cx += dx;
                tempParams.cy += dy;
                break;

            case 'editTop':
                tempParams.radiusY -= dy;
                break;

            case 'editBottom':
                tempParams.radiusY += dy;
                break;

            case 'editLeft':
                tempParams.radiusX -= dx;
                break;

            case 'editRight':
                tempParams.radiusX += dx;
                break;
        }
        Ellipse_cx = this._groupEl.childNodes[1].getAttribute('x');
        Ellipse_cy = this._groupEl.childNodes[1].getAttribute('y');
        Ellipse_rx = this._groupEl.childNodes[0].getAttribute('rx');
        Ellipse_ry = this._groupEl.childNodes[0].getAttribute('ry');
        Ellipse_mx = this._groupEl.childNodes[0].getAttribute('cx');
        Ellipse_my = this._groupEl.childNodes[0].getAttribute('cy');
        return tempParams;
    };

    /**
     * Calculates new coordinates in process of editing
     * 
     * @param tempCoords {Object} - area coords 
     * @returns {Object} - calculated coordinates
     */
    Ellipse.prototype.dynamicEdit = function (tempCoords) {
        if (tempCoords.radiusX < 0) {
            tempCoords.radiusX = Math.abs(tempCoords.radiusX);
        }
        if (tempCoords.radiusY < 0) {
            tempCoords.radiusY = Math.abs(tempCoords.radiusY);
        }
        this.setSVGCoords(tempCoords);

        return tempCoords;
    };

    /**
     * Handler for editing process (by mousemove)
     * It includes only redrawing area by new coords 
     * (this coords doesn't save as own area coords)
     * 
     * @params e {MouseEvent} - mousemove event
     */
    Ellipse.prototype.onProcessEditing = function (e) {
        var editType = app.getEditType();

        return this.dynamicEdit(
            this.edit(editType, e.pageX - this.editingStartPoint.x, e.pageY - this.editingStartPoint.y)
        );
    };

    /**
     * Handler for editing stoping (by mouseup)
     * It includes redrawing area by new coords 
     * and saving this coords as own area coords
     * 
     * @params e {MouseEvent} - mouseup event
     */
    Ellipse.prototype.onStopEditing = function (e) {
        var editType = app.getEditType();

        this.setCoords(this.onProcessEditing(e));

        app.removeAllEvents();
    };

    /**
     * Returns string-representation of ellipse
     * 
     * @returns {string}
     */
    Ellipse.prototype.toString = function () {
        return 'Ellipse {cx: ' + this._coords.cx +
            ', cy: ' + this._coords.cy +
            ', rx: ' + this._coords.radiusX + ', ry: ' + this._coords.radiusY + '}';
    }

    /**
     * Returns html-string of area html element with params of this ellipse
     * 
     * @returns {string}
     */
    Ellipse.prototype.toHTMLMapElementString = function () {
        return '<area shape="ellipse" coords="'
            + this._coords.cx + ', '
            + this._coords.cy + ', '
            + this._coords.radiusX+ ', '
			+ this._coords.radiusY
            + '"'
            + (this._attributes.href ? ' href="' + this._attributes.href + '"' : '')
            + (this._attributes.alt ? ' alt="' + this._attributes.alt + '"' : '')
            + (this._attributes.title ? ' title="' + this._attributes.title + '"' : '')
            + ' />';
    };

    /**
     * Returns coords for area attributes form
     * 
     * @returns {Object} - coordinates of point
     */
    Ellipse.prototype.getCoordsForDisplayingInfo = function () {
        return {
            x: this._coords.cx,
            y: this._coords.cy
        };
    };

    /**
     * Returns true if coords is valid for ellipses and false otherwise
     *
     * @static
     * @param coords {Object} - object width coords for new ellipse
     * @return {boolean}
     */
    Ellipse.testCoords = function (coords) {
        return coords.cx && coords.cy && coords.radiusX && coords.radiusY;
    };

    /**
     * Returns true if html coords array is valid for ellipses and false otherwise
     *
     * @static
     * @param coords {Array} - coords for new ellipse as array
     * @return {boolean}
     */
    Ellipse.testHTMLCoords = function (coords) {
        return coords.length === 4;
    };

    /**
     * Returns ellipse coords object from html array
     * 
     * @param htmlCoordsArray {Array}
     * @returns {Object}
     */
    Ellipse.getCoordsFromHTMLArray = function (htmlCoordsArray) {
        if (!Ellipse.testHTMLCoords(htmlCoordsArray)) {
            throw new Error('This html-coordinates is not valid for ellipse');
        }
        console.log(htmlCoordsArray)
        return {
            cx: htmlCoordsArray[0],
            cy: htmlCoordsArray[1],
            radiusX: htmlCoordsArray[2],
			radiusY: htmlCoordsArray[3]
        };
    };

    /**
     * Creates new ellipse and adds drawing handlers for DOM-elements
     *
     * @static
     * @param firstPointCoords {Object} 
     * @returns {Ellipse}
     */
    Ellipse.createAndStartDrawing = function (firstPointCoords) {
        var newArea = new Ellipse({
            cx: firstPointCoords.x,
            cy: firstPointCoords.y,
            radiusX: 0,
			radiusY: 0
        });

        app.addEvent(app.domElements.container, 'mousemove', newArea.onProcessDrawing.bind(newArea))
            .addEvent(app.domElements.container, 'click', newArea.onStopDrawing.bind(newArea));

        return newArea;
    };



    /**
     * The constructor for polygons
     *  
     *        {x0, y0}  
     *           /\
     *          /  \
     *         /    \   
     * {x1, y1} ----- {x2, y2}
     *
     * @constructor
     * @param coords {Object} - object with parameters of new area ('points' is list of points)
     *                          if 'points' is empty, it will set to [(0,0)]
     * @param coords.isOpened {boolean} - if polygon is opened (polyline instead polygon)
     * @param attributes {Object} [attributes=undefined] - attributes for area (e.g. href, title)
     */
    function Polygon(coords, attributes) {
        Area.call(this, 'polygon', coords, attributes);

        /**
         * @namespace
         * @property {Array} points - Array with coordinates of polygon points
         */
        this._coords = {
            points: coords.points || [{ x: 0, y: 0 }],
            isOpened: coords.isOpened || false
        };

        this._el = document.createElementNS(
            Area.SVG_NS,
            this._coords.isOpened ? 'polyline' : 'polygon'
        );
        this._groupEl.appendChild(this._el);

        this._helpers = {
            points: []
        };

        for (var i = 0, c = this._coords.points.length; i < c; i++) {
            this._helpers.points.push(
                (new Helper(
                    this._groupEl,
                    this._coords.points[i].x,
                    this._coords.points[i].y,
                    'movePoint')
                ).setId(i)
            );
        }

        this._selectedPoint = -1;

        this.redraw();
    }
    utils.inherits(Polygon, Area);

    /**
     * Closes path of the polygon (replaces polyline with polygon)
     */
    Polygon.prototype.close = function () {
        var polyline = this._el;
        this._el = document.createElementNS(Area.SVG_NS, 'polygon');
        this._groupEl.replaceChild(this._el, polyline);

        this._coords.isOpened = false;
        this.redraw().deselect();
    };

    /**
     * Set attributes for svg-elements of area by new parameters
     * 
     * @param coords {Object} - Object with coords of this area, with field 'points'
     * @returns {Polygon} - this area
     */
    Polygon.prototype.setSVGCoords = function (coords) {
        var polygonPointsAttrValue = coords.points.reduce(function (previousValue, currentItem) {
            return previousValue + currentItem.x + ' ' + currentItem.y + ' ';
        }, '');

        this._el.setAttribute('points', polygonPointsAttrValue);
        utils.foreach(this._helpers.points, function (helper, i) {
            helper.setCoords(coords.points[i].x, coords.points[i].y);
        });

        return this;
    };

    /**
     * Set coords for this area
     * 
     * @param coords {coords}
     * @returns {Polygon} - this area
     */
    Polygon.prototype.setCoords = function (coords) {
        this._coords.points = coords.points;

        return this;
    };

    /**
     * Adds new point to polygon (and new helper too)
     * 
     * @param x {number} - x-coordinate of new point
     * @param y {number} - y-coordinate of new point
     * @returns {Polygon} - this area
     */
    Polygon.prototype.addPoint = function (x, y) {
        if (!this._coords.isOpened) {
            throw new Error('This polygon is closed!');
        }

        var helper = new Helper(this._groupEl, x, y, 'movePoint');
        helper.setId(this._helpers.points.length);

        this._helpers.points.push(helper);
        this._coords.points.push({
            x: x,
            y: y
        });
        this.redraw();

        return this;
    };

    /**
     * Calculates new coordinates in process of drawing
     * 
     * @param x {number}
     * @param y {number}
     * @param isRightAngle {boolean}
     * @returns {Object} - calculated coordinates
     */
    Polygon.prototype.dynamicDraw = function (x, y, isRightAngle) {
        var temp_coords = {
            points: [].concat(this._coords.points)
        };

        if (isRightAngle) {
            var rightPointCoords = Polygon.getRightAngleLineLastPointCoords(
                this._coords, { x: x, y: y }
            );
            x = rightPointCoords.x;
            y = rightPointCoords.y;
        }

        temp_coords.points.push({ x: x, y: y });

        this.redraw(temp_coords);

        return temp_coords;
    };

    /**
     * Handler for drawing process (by mousemove)
     * It includes only redrawing area by new coords 
     * (this coordinates doesn't save as own area coords)
     * 
     * @params e {MouseEvent} - mousemove event
     */
    Polygon.prototype.onProcessDrawing = function (e) {
        var coords = utils.getRightCoords(e.pageX, e.pageY);

        this.dynamicDraw(coords.x, coords.y, e.shiftKey);
    };

    /**
     * Handler for polygon pointer adding (by click on drawing canvas)
     * It includes redrawing area with this new point 
     * and saving this point to list of polygon points
     * 
     * @params e {MouseEvent} - click event
     */

    Polygon.prototype.onAddPointDrawing = function (e) {
        // if(numberdots != 0){
        // if (po != numberdots) {
        var newPointCoords = utils.getRightCoords(e.pageX, e.pageY);

        if (e.shiftKey) {
            newPointCoords = Polygon.getRightAngleLineLastPointCoords(this._coords, newPointCoords);
        }
        this.addPoint(newPointCoords.x, newPointCoords.y);

        po++;


    };

    /**
     * Handler for drawing stoping (by click on first helper or press ENTER key)
     * It includes redrawing area by new coords, closing this polygon 
     * and saving this coords as own area coords
     * 
     * @params e {KeyboardEvent|MouseEvent} - click or keydown event
     */
    Polygon.prototype.onStopDrawing = function (e) {
        if (e.type == 'click' || (e.type == 'keydown' && e.keyCode == 13)) {
            if (Polygon.testCoords(this._coords)) {
                this.close();
                ploy_points = this._groupEl.childNodes[0].getAttribute('points')
                type_of_shape = "polygon"

                const mytext = document.createElementNS("http://www.w3.org/2000/svg", "text");
                this._groupEl.appendChild(mytext)
                var x = this._groupEl.childNodes[1].getAttribute('x')
                var y = this._groupEl.childNodes[1].getAttribute('y')
                // console.log(x,y)
                var d_name = $('#devicelist').val();
                device_name = d_name
                var pid = $('#devicelist option:checked').attr('device-id');
                status_of_device = $('#devicelist option:checked').attr('device-status');
                var d_type = $('#devicelist option:checked').attr('app-type');
                device_app_type = d_type
                if(d_type == "STB"){
                    device_app_type = "STB";
                }
                // console.log(rid)
                app.setShape(null)
                    .setMode('editing')
                    .setEditClass();
                e.preventDefault();
                mytext.setAttribute('x', x);
                mytext.setAttribute('y', y - 10)
                mytext.innerHTML = d_name
                window.counter = 1;
                m_device.push(pid)
                app.removeAllEvents()
                    .setIsDraw(false)
                    .resetNewArea();
            }
        }
        // } else {
        //     alert("This polygon can draw "+numberdots+" points and you have drawn only less than "+numberdots+".")
        // }
        e.stopPropagation();
    };

    /**
     * Changes area parameters by editing type and offsets
     * 
     * @param {string} editingType - A type of editing
     * @returns {Object} - Object with changed parameters of area 
     */
    Polygon.prototype.edit = function (editingType, dx, dy) {
        var tempParams = Object.create(this._coords);
        
        switch (editingType) {
            case 'move':
                for (var i = 0, c = tempParams.points.length; i < c; i++) {
                    tempParams.points[i].x += dx;
                    tempParams.points[i].y += dy;
                }
                break;

            case 'movePoint':
                tempParams.points[this.selected_point].x += dx;
                tempParams.points[this.selected_point].y += dy;
                break;
        }
        ploy_points = this._groupEl.childNodes[0].getAttribute('points')
        return tempParams;
    };

    /**
     * Handler for editing process (by mousemove)
     * It includes only redrawing area by new coords
     * (this coords doesn't save as area coords)
     * 
     * @params e {MouseEvent} - mousemove event
     */
    Polygon.prototype.onProcessEditing = function (e) {
        var editType = app.getEditType();
        $("#save_col").show();
        this.redraw(
            this.edit(
                editType,
                e.pageX - this.editingStartPoint.x,
                e.pageY - this.editingStartPoint.y
            )
        );

        this.editingStartPoint.x = e.pageX;
        this.editingStartPoint.y = e.pageY;
    };

    /**
     * Handler for editing stoping (by mouseup on drawing canvas)
     * It includes redrawing area by new coords and saving this new coords
     * as own area coords
     * 
     * @params e {MouseEvent} - click or keydown event
     */
    Polygon.prototype.onStopEditing = function (e) {
        var editType = app.getEditType();

        this.setCoords(
            this.edit(
                editType,
                e.pageX - this.editingStartPoint.x,
                e.pageY - this.editingStartPoint.y
            )
        ).redraw();

        app.removeAllEvents();
    };

    /**
     * Returns string-representation of polygon
     * 
     * @returns {string}
     */
    Polygon.prototype.toString = function () {
        return 'Polygon {points: [' +
            this._coords.points.map(function (item) {
                return '[' + item.x + ', ' + item.y + ']'
            }).join(', ') + ']}';
    }

    /**
     * Returns html-string of area html element with params of this polygon
     * 
     * @returns {string}
     */
    Polygon.prototype.toHTMLMapElementString = function () {
        var str = this._coords.points.map(function (item) {
            return item.x + ', ' + item.y;
        }).join(', ');

        return '<area shape="poly" coords="'
            + str
            + '"'
            + (this._attributes.href ? ' href="' + this._attributes.href + '"' : '')
            + (this._attributes.alt ? ' alt="' + this._attributes.alt + '"' : '')
            + (this._attributes.title ? ' title="' + this._attributes.title + '"' : '')
            + ' />';
    };

    /**
     * Returns coords for area attributes form
     * 
     * @returns {Object} - coordinates of point
     */
    Polygon.prototype.getCoordsForDisplayingInfo = function () {
        return {
            x: this._coords.points[0].x,
            y: this._coords.points[0].y
        };
    };

    /**
     * Returns true if coords is valid for polygons and false otherwise
     *
     * @static
     * @param coords {Object} - object with coords for new polygon
     * @returns {boolean}
     */
    Polygon.testCoords = function (coords) {
        return coords.points.length >= 3;
    };

    /**
     * Returns true if html coords array is valid for polygons and false otherwise
     *
     * @static
     * @param coords {Array} - coords for new polygon as array [x1, y1, x2, y2, x3, y3, ...]
     * @returns {boolean}
     */
    Polygon.testHTMLCoords = function (coords) {
        return coords.length >= 6 && coords.length % 2 === 0;
    };

    /**
     * Returns polygon coords object from html array
     * 
     * @param htmlCoordsArray {Array}
     * @returns {Object} - object with calculated points
     */
    Polygon.getCoordsFromHTMLArray = function (htmlCoordsArray) {
        if (!Polygon.testHTMLCoords(htmlCoordsArray)) {
            throw new Error('This html-coordinates is not valid for polygon');
        }

        var points = [];
        for (var i = 0, c = htmlCoordsArray.length / 2; i < c; i++) {
            points.push({
                x: htmlCoordsArray[2 * i],
                y: htmlCoordsArray[2 * i + 1]
            });
        }

        return {
            points: points
        };
    };

    /**
     * Returns coords of new point with right angle (or 45 deg) for last line
     * This method recalculates coordinates of new point for 
     * last line with (0 | 45 | 90 | 135 | 180 | 225 | 270 | 315) deg
     * For example,
     * for (0 < deg < 23) -> 0 deg
     * for (23 < deg < 67) -> 45 deg
     * for (67 < deg < 90) -> 90 deg etc.
     * 
     *         0
     *    315\ | /45
     *        \|/
     * 270 --------- 90
     *        /|\
     *    225/ | \135
     *        180
     * 
     * @static
     * @param originalCoords {Object} - Coordinates of this area (without new point)
     * @param newPointCoords {Object} - Coordinates of new point
     * @returns {Object} - Right coordinates for last point
     */
    Polygon.getRightAngleLineLastPointCoords = function (originalCoords, newPointCoords) {
        var TANGENS = {
            DEG_22: 0.414,
            DEG_67: 2.414
        },
            lastPointIndex = originalCoords.points.length - 1,
            lastPoint = originalCoords.points[lastPointIndex],
            dx = newPointCoords.x - lastPoint.x,
            dy = -(newPointCoords.y - lastPoint.y),
            tan = dy / dx,
            x = newPointCoords.x,
            y = newPointCoords.y;

        if (dx > 0 && dy > 0) {
            if (tan > TANGENS.DEG_67) {
                x = lastPoint.x;
            } else if (tan < TANGENS.DEG_22) {
                y = lastPoint.y;
            } else {
                Math.abs(dx) > Math.abs(dy) ?
                    (x = lastPoint.x + dy) : (y = lastPoint.y - dx);
            }
        } else if (dx < 0 && dy > 0) {
            if (tan < -TANGENS.DEG_67) {
                x = lastPoint.x;
            } else if (tan > -TANGENS.DEG_22) {
                y = lastPoint.y;
            } else {
                Math.abs(dx) > Math.abs(dy) ?
                    (x = lastPoint.x - dy) : (y = lastPoint.y + dx);
            }
        } else if (dx < 0 && dy < 0) {
            if (tan > TANGENS.DEG_67) {
                x = lastPoint.x;
            } else if (tan < TANGENS.DEG_22) {
                y = lastPoint.y;
            } else {
                Math.abs(dx) > Math.abs(dy) ?
                    (x = lastPoint.x + dy) : (y = lastPoint.y - dx);
            }
        } else if (dx > 0 && dy < 0) {
            if (tan < -TANGENS.DEG_67) {
                x = lastPoint.x;
            } else if (tan > -TANGENS.DEG_22) {
                y = lastPoint.y;
            } else {
                Math.abs(dx) > Math.abs(dy) ?
                    (x = lastPoint.x - dy) : (y = lastPoint.y + dx);
            }
        }

        return {
            x: x,
            y: y
        };
    };

    /**
     * Creates new polygon and add drawing handlers for DOM-elements
     *
     * @static
     * @param firstPointCoords {Object} - coords for first point of polyline
     * @returns {Polygon} - created polygon
     */
    Polygon.createAndStartDrawing = function (firstPointCoords) {

        var newArea = new Polygon({
            points: [firstPointCoords],
            isOpened: true
        });

        app.addEvent(app.domElements.container, 'mousemove', newArea.onProcessDrawing.bind(newArea))
            .addEvent(app.domElements.container, 'click', newArea.onAddPointDrawing.bind(newArea))
            .addEvent(document, 'keydown', newArea.onStopDrawing.bind(newArea))
            .addEvent(newArea._helpers.points[0]._el, 'click', newArea.onStopDrawing.bind(newArea));

        return newArea;
    };

    /* TODO: this modules will use app.js */
    /* Help block */
    var help = (function () {
        var block = utils.id('help'),
            overlay = utils.id('overlay'),
            close_button = block.querySelector('.close_button');

        function hide() {
            utils.hide(block);
            utils.hide(overlay);
        }

        function show() {
            utils.show(block);
            utils.show(overlay);
        }

        overlay.addEventListener('click', hide, false);

        close_button.addEventListener('click', hide, false);

        return {
            show: show,
            hide: hide
        };
    })();

    /* For html code of created map */
    var code = (function () {
        var block = utils.id('code'),
            content = utils.id('code_content'),
            close_button = block.querySelector('.close_button');

        close_button.addEventListener('click', function (e) {
            utils.hide(block);
            e.preventDefault();
        }, false);

        return {
            print: function () {
                content.innerHTML = app.getHTMLCode(true);
                utils.show(block);
            },
            hide: function () {
                utils.hide(block);
            }
        };
    })();


    /* Edit selected area info */
    var info = (function () {
        var form = utils.id('edit_details'),
            header = form.querySelector('h5'),
            href_attr = utils.id('href_attr'),
            alt_attr = utils.id('alt_attr'),
            title_attr = utils.id('title_attr'),
            save_button = utils.id('save_details'),
            close_button = form.querySelector('.close_button'),
            sections = form.querySelectorAll('p'),
            obj,
            x,
            y,
            temp_x,
            temp_y;

        function changedReset() {
            form.classList.remove('changed');
            utils.foreach(sections, function (x) {
                x.classList.remove('changed');
            });
        }

        function save(e) {
            obj.setInfoAttributes({
                href: href_attr.value,
                alt: alt_attr.value,
                title: title_attr.value,
            });

            obj[obj.href ? 'setStyleOfElementWithHref' : 'unsetStyleOfElementWithHref']();

            changedReset();
            unload();

            e.preventDefault();
        }

        function unload() {
            obj = null;
            changedReset();
            utils.hide(form);
        }

        function setCoords(x, y) {
            form.style.left = (x + 5) + 'px';
            form.style.top = (y + 5) + 'px';
        }

        function moveEditBlock(e) {
            setCoords(x + e.pageX - temp_x, y + e.pageY - temp_y);
        }

        function stopMoveEditBlock(e) {
            x = x + e.pageX - temp_x;
            y = y + e.pageY - temp_y;
            setCoords(x, y);

            app.removeAllEvents();
        }

        function change() {
            form.classList.add('changed');
            this.parentNode.classList.add('changed');
        }

        save_button.addEventListener('click', save, false);

        href_attr.addEventListener('keydown', function (e) { e.stopPropagation(); }, false);
        alt_attr.addEventListener('keydown', function (e) { e.stopPropagation(); }, false);
        title_attr.addEventListener('keydown', function (e) { e.stopPropagation(); }, false);

        href_attr.addEventListener('change', change, false);
        alt_attr.addEventListener('change', change, false);
        title_attr.addEventListener('change', change, false);

        close_button.addEventListener('click', unload, false);

        header.addEventListener('mousedown', function (e) {
            temp_x = e.pageX,
                temp_y = e.pageY;

            app.addEvent(document, 'mousemove', moveEditBlock);
            app.addEvent(header, 'mouseup', stopMoveEditBlock);

            e.preventDefault();
        }, false);

        return {
            load: function (object, new_x, new_y) {
                obj = object;
                href_attr.value = object.href ? object.href : '';
                alt_attr.value = object.alt ? object.alt : '';
                title_attr.value = object.title ? object.title : '';
                utils.show(form);
                if (new_x && new_y) {
                    x = new_x;
                    y = new_y;
                    setCoords(x, y);
                }
            },
            unload: unload
        };
    })();


    /* Load areas from html code */
    var from_html_form = (function () {
        var form = utils.id('from_html_wrapper'),
            code_input = utils.id('code_input'),
            load_button = utils.id('load_code_button'),
            close_button = form.querySelector('.close_button');

        function load(e) {
            if (Area.createAreasFromHTMLOfMap(code_input.value)) {
                hide();
            }

            e.preventDefault();
        }

        function hide() {
            utils.hide(form);
        }

        load_button.addEventListener('click', load, false);

        close_button.addEventListener('click', hide, false);

        return {
            show: function () {
                code_input.value = '';
                utils.show(form);
            },
            hide: hide
        };
    })();


    /* Get image form */
    var get_image = (function () {
        var block = utils.id('get_image_wrapper'),
            close_button = block.querySelector('.close_button'),
            loading_indicator = utils.id('loading'),
            button = utils.id('button'),
            filename = null,
            last_changed = null;

        // Drag'n'drop - the first way to loading an image
        var drag_n_drop = (function () {
            var dropzone = utils.id('dropzone'),
                dropzone_clear_button = dropzone.querySelector('.clear_button'),
                sm_img = utils.id('sm_img');

            function testFile(type) {
                switch (type) {
                    case 'image/jpeg':
                    case 'image/gif':
                    case 'image/png':
                        return true;
                }
                return false;
            }

            dropzone.addEventListener('dragover', function (e) {
                utils.stopEvent(e);
            }, false);

            dropzone.addEventListener('dragleave', function (e) {
                utils.stopEvent(e);
            }, false);

            dropzone.addEventListener('drop', function (e) {
                utils.stopEvent(e);

                var reader = new FileReader(),
                    file = e.dataTransfer.files[0];

                if (testFile(file.type)) {
                    dropzone.classList.remove('error');

                    reader.readAsDataURL(file);

                    reader.onload = function (e) {
                        sm_img.src = e.target.result;
                        sm_img.style.display = 'inline-block';
                        filename = file.name;
                        utils.show(dropzone_clear_button);
                        last_changed = drag_n_drop;
                    };
                } else {
                    clearDropzone();
                    dropzone.classList.add('error');
                }

            }, false);

            function clearDropzone() {
                sm_img.src = '';

                utils.hide(sm_img)
                    .hide(dropzone_clear_button);

                dropzone.classList.remove('error');

                last_changed = url_input;
            }

            dropzone_clear_button.addEventListener('click', clearDropzone, false);

            return {
                clear: clearDropzone,
                init: function () {
                    dropzone.draggable = true;
                    this.clear();
                    utils.hide(sm_img)
                        .hide(dropzone_clear_button);
                },
                test: function () {
                    return Boolean(sm_img.src);
                },
                getImage: function () {
                    return sm_img.src;
                }
            };
        })();

        /* Set a url - the second way to loading an image */
        var url_input = (function () {
            var url = utils.id('url'),
                url_clear_button = url.parentNode.querySelector('.clear_button');

            function testUrl(str) {
                var url_str = str.trim(),
                    temp_array = url_str.split('.'),
                    ext;

                if (temp_array.length > 1) {
                    ext = temp_array[temp_array.length - 1].toLowerCase();
                    switch (ext) {
                        case 'jpg':
                        case 'jpeg':
                        case 'gif':
                        case 'png':
                            return true;
                    }
                }

                return false;
            }

            function onUrlChange() {
                setTimeout(function () {
                    if (url.value.length) {
                        utils.show(url_clear_button);
                        last_changed = url_input;
                    } else {
                        utils.hide(url_clear_button);
                        last_changed = drag_n_drop;
                    }
                }, 0);
            }

            url.addEventListener('keypress', onUrlChange, false);
            url.addEventListener('change', onUrlChange, false);
            url.addEventListener('paste', onUrlChange, false);

            function clearUrl() {
                url.value = '';
                utils.hide(url_clear_button);
                url.classList.remove('error');
                last_changed = url_input;
            }

            url_clear_button.addEventListener('click', clearUrl, false);

            return {
                clear: clearUrl,
                init: function () {
                    this.clear();
                    utils.hide(url_clear_button);
                },
                test: function () {
                    if (testUrl(url.value)) {
                        url.classList.remove('error');
                        return true;
                    } else {
                        url.classList.add('error');
                    }
                    return false;
                },
                getImage: function () {
                    var tmp_arr = url.value.split('/');
                    filename = tmp_arr[tmp_arr.length - 1];

                    return url.value.trim();
                }
            };
        })();


        /* Block init */
        function init() {
            utils.hide(loading_indicator);
            drag_n_drop.init();
            url_input.init();
        }
        init();

        /* Block clear */
        function clear() {
            drag_n_drop.clear();
            url_input.clear();
            last_changed = null;
        }

        /* Selected image loading */
        function onButtonClick(e) {
            // document.getElementById("button").hide();
            app.loadImage("")

        }
        $(document).ready(function () {
            onButtonClick();
        });
        // button.addEventListener('click', onButtonClick, false);

        close_button.addEventListener('click', hide, false);

        function show() {
            clear();
            utils.show(block);
        }

        function hide() {
            utils.hide(block);
        }

        /* Returned object */
        return {
            show: function () {
                app.hide();
                show();

                return this;
            },
            hide: function () {
                app.show();
                hide();

                return this;
            },
            showLoadIndicator: function () {
                utils.show(loading_indicator);

                return this;
            },
            hideLoadIndicator: function () {
                utils.hide(loading_indicator);

                return this;
            }
        };
    })();
    get_image.show();
    /* Buttons and actions */
    var buttons = (function () {
        var all = utils.id('nav').getElementsByTagName('li'),
            save = utils.id('save'),
            load = utils.id('load'),
            rectangle = utils.id('rectangle'),
            circle = utils.id('circle'),
            polygon = utils.id('polygon'),
            typeShape = utils.id('shapeType'),
            edit = utils.id('edit'),
            clear = utils.id('clear'),
            from_html = utils.id('from_html'),
            to_html = utils.id('to_html'),
            preview = utils.id('preview'),
            new_image = utils.id('new_image'),
            add_area = utils.id('add_area'),
            my_edit = utils.id('subarea'),
            device_list = utils.id('devicelist'),
            show_help = utils.id('show_help');


        function deselectAll() {
            utils.foreach(all, function (x) {
                x.classList.remove(Area.CLASS_NAMES.SELECTED);
            });
        }

        function selectOne(button) {
            deselectAll();
            // console.log(button)
            button.classList.add(Area.CLASS_NAMES.SELECTED);
        }

        function onSaveButtonClick(e) {
            // Save in localStorage
            app.saveInLocalStorage();

            e.preventDefault();
        }

        function onLoadButtonClick(e) {
            // Load from localStorage
            app.clear()
                .loadFromLocalStorage();

            e.preventDefault();
        }
        function onShapeChangeButtonClick(e) {
            // console.log(this)
            app.setMode('drawing')
                .setDrawClass()
                .setShape(this.value)
                .deselectAll()
                .hidePreview();
            info.unload();
            selectOne(this);

            e.preventDefault();
            // window.counter = 0;
        }
        function onShapeButtonClick(e) {
            // shape = rect || circle || polygon   
            // console.log(this)         
            app.setMode('drawing')
                .setDrawClass()
                .setShape(this.id)
                .deselectAll()
                .hidePreview();
            info.unload();
            selectOne(this);

            e.preventDefault();
        }

        $('#subarea').on('change', function () {
            app.setMode(null)
                .setDefaultClass()
                .setShape(null)
                .clear()
                .hidePreview();
            deselectAll();
        });
        $('#departments').on('change', function () {
            app.setMode(null)
                .setDefaultClass()
                .setShape(null)
                .setIsDraw(false)
                .clear()
                .hide()
                .hidePreview();
            deselectAll();
            get_image.show();
            document.getElementById('icons').innerHTML = "";
            $("#list_devices").hide();
            all_d = []
            window.counter = 0;
        });
        $('#floor').on('change', function () {
            app.setMode(null)
                .setDefaultClass()
                .setShape(null)
                .setIsDraw(false)
                .clear()
                .hide()
                .hidePreview();
            deselectAll();
            get_image.show();
            document.getElementById('icons').innerHTML = "";
            $("#list_devices").hide();
            all_d = []
            window.counter = 0;
        });
        function onClearButtonClick(e) {           // Clear all
            m_device = []
            $('#devicelist option').each(function () {
                $('select').find('option').prop('disabled', false);
            });
            var s_floor = $("#floor").val();
            var s_dept = $('#departments').val();
            for (var i = 0; i < devices_data.length; i++) {
                if (devices_data[i].name == s_floor) {
                    $.each(devices_data[i].departments, function (k, j) {
                        if (j.name == s_dept) {
                            $.each(devices_data[i].departments[k].sub_area, function (index, value) {
                                $.each(value["areas"], function (id, recto) {
                                    remove_device.push(recto['devices']['d_id'])
                                });
                            });
                        }
                    });
                }
            }
            $(".handle").remove();
            window.counter = 0;
            all_d = []
            allareas[allareas.length - 1] = []
            if (confirm('Clear all?')) {
                app.setMode(null)
                    .setDefaultClass()
                    .setShape(null)
                    .clear()
                    .hidePreview();
                deselectAll();
            }
            // console.log(remove_device)
            e.preventDefault();
        }

        function onFromHtmlButtonClick(e) {
            // Load areas from html
            from_html_form.show();

            e.preventDefault();
        }

        function onToHtmlButtonClick(e) {
            // Generate html code only
            info.unload();
            code.print();

            e.preventDefault();
        }

        function onPreviewButtonClick(e) {
            if (app.getMode() === 'preview') {
                app.setMode(null)
                    .hidePreview();
                deselectAll();
            } else {
                app.deselectAll()
                    .setMode('preview')
                    .setDefaultClass()
                    .preview();
                selectOne(this);
            }

            e.preventDefault();
        }

        function onEditButtonClick(e) {
            // console.log(this)
            // console.log(app.getMode())
            if (app.getMode() === 'editing') {
                app.setMode(null)
                    .setDefaultClass()
                    .deselectAll();
                deselectAll();
                utils.show(domElements.svg);
            } else {
                app.setShape(null)
                    .setMode('editing')
                    .setEditClass();
                selectOne(this);
            }
            app.hidePreview();
            e.preventDefault();
        }
        $("#menu-toggle").on("click", function (e) {

            app.setMode(null)
                .setDefaultClass()
                .setShape(null)
                .setIsDraw(false)
                .clear()
                .hide()
                .hidePreview();
            deselectAll();
            get_image.show();

            $("#subarea").val("");
            $("#devicelist").val("");
            $("a.myClass").addClass("disabled")
            $("#devicelist option").each(function () {
                $(this).remove();
            });
            $('#devicelist').html('<option value="" selected disabled>Select Device</option>');
        });
        function onNewImageButtonClick(e) {
            $(".handle").remove();
            // New image - clear all and back to loading image screen       
            if (confirm('Discard all changes?')) {
                app.setMode(null)
                    .setDefaultClass()
                    .setShape(null)
                    .setIsDraw(false)
                    .clear()
                    .hide()
                    .hidePreview();
                deselectAll();
                get_image.show();
            }
            document.getElementById('icons').innerHTML = "";
            $("#subarea").val("");
            $("#devicelist").val("");
            $("a.myClass").addClass("disabled")
            $("#devicelist option").each(function () {
                $(this).remove();
            });
            $('#devicelist').html('<option value="" selected disabled>Select Device</option>');
            e.preventDefault();
        }

        function onShowHelpButtonClick(e) {
            help.show();

            e.preventDefault();
        }


        function onMyEditButtonChange(e) {
            // console.log(e)
            if (app.getMode() === 'editing') {
                app.setMode(null)
                    .setDefaultClass()
                    .deselectAll();
                deselectAll();
                utils.show(domElements.svg);
            } else {
                app.setShape(null)
                    .setMode('editing')
                    .setEditClass();
                selectOne(this);
            }
            app.hidePreview();
            e.preventDefault();
        }

        // onEditButtonClick()

        save.addEventListener('click', onSaveButtonClick, false);
        // load.addEventListener('click', onLoadButtonClick, false);
        // rectangle.addEventListener('click', onShapeButtonClick, false);
        // circle.addEventListener('click', onShapeButtonClick, false);
        // polygon.addEventListener('click', onShapeButtonClick, false);
        typeShape.addEventListener('change', onShapeChangeButtonClick, false);
        // clear.addEventListener('click', onClearButtonClick, false);
        // from_html.addEventListener('click', onFromHtmlButtonClick, false);
        // to_html.addEventListener('click', onToHtmlButtonClick, false);
        // preview.addEventListener('click', onPreviewButtonClick, false);
        // edit.addEventListener('click', onEditButtonClick, false);
        // device_list.addEventListener('change', onEditButtonClick, false);
        // my_edit.addEventListener('change', onMyEditButtonChange, false);
        // new_image.addEventListener('click', onNewImageButtonClick, false);
        // add_area.addEventListener('click', onMyEditButtonChange, false);
        // show_help.addEventListener('click', onShowHelpButtonClick, false);
    })();

})();
