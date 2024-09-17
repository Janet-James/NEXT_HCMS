/* NEXT UX3.0 | Lib.js ( Header hide and show)
// Version     -  0.2 
// Updated On  -  05 FEB 2018
// ----------------------------------------*/


$(document).ready(function () {
    // Left and Right Menu Tooltip
    $('[data-toggle="tooltip"]').tooltip();

    // Top menu hide 
    setTimeout(function () {
        $(".page-header.navbar").css({
            'visibility': 'hidden',
            'opacity': '0',
            'transition': 'visibility 0s 2s, opacity 2s linear'
        });
    }, 2000);
    setTimeout(function () {
		
		//if ($(window).width() > 768) {
		
		$("body").removeClass("page-header-fixed").addClass("page-header");
		
        $("#nav_div").removeClass("navbar-fixed-top").addClass("navbar-fixed-bottom");
		
		//}
		
    }, 3000);
    setTimeout(function () {
        $(".page-header.navbar").css({
            'visibility': 'visible',
            'opacity': '1',
            'transition': 'opacity 2s linear'
        });
    }, 3000);

    // Footer Dock Menu 
    $('#dock-container').hide();
    $('#menu_up').mouseover(function () {
        $('#dock-container').show();
    });
    $("#dock-container").mouseleave(function () {
        $(this).hide();
    });

    // Screen saver
    idleTimer = null;
    idleState = false;
    idleWait = 30000;
    $('*').bind('mousemove keydown scroll', function () {
        clearTimeout(idleTimer);
        if (idleState == true) {
            // Reactivated event
            // alert("Welcome Back.");
            console.log("Welcome Back.");
        }
        idleState = false;
        idleTimer = setTimeout(function () {
            // Idle Event
            console.log("You've been idle for " + idleWait / 1000 + " seconds.");
            idleState = true;
        }, idleWait);
    });
    $("body").trigger("mousemove");
});

// Chart 3d to flat changes
function chart_changes(design_act_name) {
    if (design_act_name == "3d") {
        var chart = AmCharts.makeChart("Donutchart", {
            "type": "pie",
            "theme": "light",
            "fontFamily": "Open Sans, sans-serif",
            "fontSize": 14,
            "color": "#000",
            "labelTickAlpha": 1,
            "labelTickColor": "#f8cf01",
            "legend": {
                "enabled": false,
                "position": "top",
                "align": "right",
                "valueText": "",
                "color": "#000",
            },
            "numberFormatter": {
                precision: -0,
                decimalSeparator: '.',
                thousandsSeparator: ','
            },
            "axisColor": "#000",
            //"labelsEnabled": true,
            //"labelRadius": -530,
            //"labelText": "[[percents]]",
            "outlineColor": "",
            "dataProvider": [{
                "country": "Section 1",
                "value": 20,
                "color": "#f77575"
            }, {
                "country": "Section 2",
                "value": 60,
                "color": "#afd3f5"
            }, {
                "country": "Section 3",
                "value": 60,
                "color": "#5c5c64"
            }, {
                "country": "Section 4",
                "value": 20,
                "color": "#b4f2a5"
            }, {
                "country": "Section 5",
                "value": 30,
                "color": "#f8b871"
            }, {
                "country": "Section 6",
                "value": 60,
                "color": "#9094ed"
            }, {
                "country": "Section 7",
                "value": 20,
                "color": "#f16389"
            }, {
                "country": "Section 8",
                "value": 20,
                "color": "#e8da60"
            }, {
                "country": "Section 9",
                "value": 20,
                "color": "#35abab"
            }],
            "valueField": "value",
            "titleField": "country",
            "colorField": "color",
            // "labelColorField": "color",
            "outlineAlpha": 0.4,
            "labelRadius": 15,
            "depth3D": 15,
            "innerRadius": "30%",
            "angle": 20,
            "export": {
                "enabled": false
            },
        });
        var chart = AmCharts.makeChart("StackedColumn", {
            "theme": "light",
            "fontFamily": "Open Sans, sans-serif",
            "fontSize": 14,
            "type": "serial",
            "dataProvider": [{
                "country": "Section 1",
                "year2004": 3.5,
                "year2005": 4.2
            }, {
                "country": "Section 2",
                "year2004": 1.7,
                "year2005": 3.1
            }, {
                "country": "Section 3",
                "year2004": 2.8,
                "year2005": 2.9
            }, {
                "country": "Section 4",
                "year2004": 2.6,
                "year2005": 2.3
            }, {
                "country": "Section 5",
                "year2004": 1.4,
                "year2005": 2.1
            }, {
                "country": "Section 6",
                "year2004": 2.6,
                "year2005": 4.9
            }, {
                "country": "Section 7",
                "year2004": 6.4,
                "year2005": 7.2
            }, {
                "country": "Section 8",
                "year2004": 8,
                "year2005": 7.1
            }, {
                "country": "China",
                "year2004": 9.9,
                "year2005": 10.1
            }],
            "valueAxes": [{
                "stackType": "3d",
                "unit": "%",
                "color": "#000",
                "position": "left",
                //"title": "GDP growth rate",
            }],
            "startDuration": 1,
            "graphs": [{
                "balloonText": "GDP grow in [[category]] (2004): <b>[[value]]</b>",
                "fillAlphas": 1,
                "fillColors": "#676fd2",
                "lineAlpha": 0.2,
                "title": "2004",
                "type": "column",

                "valueField": "year2004"
            }, {
                "balloonText": "GDP grow in [[category]] (2005): <b>[[value]]</b>",
                "fillAlphas": 1,
                "fillColors": "#f9d004",
                "lineAlpha": 0.2,
                "title": "2005",
                "type": "column",
                "valueField": "year2005"
            }],
            "plotAreaFillAlphas": 0.1,
            "depth3D": 60,
            "angle": 30,
            "categoryField": "country",
            "categoryAxis": {
                "gridPosition": "start",
                "color": "#000"

            },
            "export": {
                "enabled": false,
            }
        });
        jQuery('.chart-input').off().on('input change', function () {
            var property = jQuery(this).data('property');
            var target = chart;
            chart.startDuration = 0;

            if (property == 'topRadius') {
                target = chart.graphs[0];
                if (this.value == 0) {
                    this.value = undefined;
                }
            }

            target[property] = this.value;
            chart.validateNow();
        });
    } else if (design_act_name == "flat") {
        var chart = AmCharts.makeChart("Donutchart", {
            "type": "pie",
            "theme": "light",
            "fontFamily": "Open Sans, sans-serif",
            "fontSize": 14,
            "color": "#000",
            "labelTickAlpha": 1,
            "labelTickColor": "#f8cf01",
            "legend": {
                "enabled": false,
                "position": "top",
                "align": "right",
                "valueText": "",
                "color": "#000",
            },
            "numberFormatter": {
                precision: -0,
                decimalSeparator: '.',
                thousandsSeparator: ','
            },
            "axisColor": "#000",
            //"labelsEnabled": true,
            //"labelRadius": -530,
            //"labelText": "[[percents]]",
            "outlineColor": "",
            "dataProvider": [{
                "country": "Section 1",
                "value": 20,
                "color": "#f77575"
            }, {
                "country": "Section 2",
                "value": 60,
                "color": "#afd3f5"
            }, {
                "country": "Section 3",
                "value": 60,
                "color": "#5c5c64"
            }, {
                "country": "Section 4",
                "value": 20,
                "color": "#b4f2a5"
            }, {
                "country": "Section 5",
                "value": 30,
                "color": "#f8b871"
            }, {
                "country": "Section 6",
                "value": 60,
                "color": "#9094ed"
            }, {
                "country": "Section 7",
                "value": 20,
                "color": "#f16389"
            }, {
                "country": "Section 8",
                "value": 20,
                "color": "#e8da60"
            }, {
                "country": "Section 9",
                "value": 20,
                "color": "#35abab"
            }],
            "valueField": "value",
            "titleField": "country",
            "colorField": "color",
            // "labelColorField": "color",
            "outlineAlpha": 0.4,
            "labelRadius": 15,
            "innerRadius": "30%",
            "angle": 20,
            "export": {
                "enabled": false
            },
        });
        var chart = AmCharts.makeChart("StackedColumn", {
            "theme": "light",
            "fontFamily": "Open Sans, sans-serif",
            "fontSize": 14,
            "type": "serial",
            "dataProvider": [{
                "country": "Section 1",
                "year2004": 3.5,
                "year2005": 4.2
            }, {
                "country": "Section 2",
                "year2004": 1.7,
                "year2005": 3.1
            }, {
                "country": "Section 3",
                "year2004": 2.8,
                "year2005": 2.9
            }, {
                "country": "Section 4",
                "year2004": 2.6,
                "year2005": 2.3
            }, {
                "country": "Section 5",
                "year2004": 1.4,
                "year2005": 2.1
            }, {
                "country": "Section 6",
                "year2004": 2.6,
                "year2005": 4.9
            }, {
                "country": "Section 7",
                "year2004": 6.4,
                "year2005": 7.2
            }, {
                "country": "Section 8",
                "year2004": 8,
                "year2005": 7.1
            }, {
                "country": "China",
                "year2004": 9.9,
                "year2005": 10.1
            }],
            "valueAxes": [{
                "stackType": "3d",
                "unit": "%",
                "color": "#000",
                "position": "left",
                //"title": "GDP growth rate",
            }],
            "startDuration": 1,
            "graphs": [{
                "balloonText": "GDP grow in [[category]] (2004): <b>[[value]]</b>",
                "fillAlphas": 1,
                "fillColors": "#676fd2",
                "lineAlpha": 0.2,
                "title": "2004",
                "type": "column",

                "valueField": "year2004"
            }, {
                "balloonText": "GDP grow in [[category]] (2005): <b>[[value]]</b>",
                "fillAlphas": 1,
                "fillColors": "#f9d004",
                "lineAlpha": 0.2,
                "title": "2005",
                "type": "column",
                "valueField": "year2005"
            }],
            "plotAreaFillAlphas": 0.1,
            // "depth3D": 60,
            "angle": 30,
            "categoryField": "country",
            "categoryAxis": {
                "gridPosition": "start",
                "color": "#000"

            },
            "export": {
                "enabled": false,
            }
        });
        jQuery('.chart-input').off().on('input change', function () {
            var property = jQuery(this).data('property');
            var target = chart;
            chart.startDuration = 0;

            if (property == 'topRadius') {
                target = chart.graphs[0];
                if (this.value == 0) {
                    this.value = undefined;
                }
            }

            target[property] = this.value;
            chart.validateNow();
        });
    } else if (design_act_name == "3dwithoutanimate") {
        var chart = AmCharts.makeChart("Donutchart", {
            "type": "pie",
            "startDuration": 0,
            "theme": "light",
            "fontFamily": "Open Sans, sans-serif",
            "fontSize": 14,
            "color": "#000",
            "labelTickAlpha": 1,
            "labelTickColor": "#f8cf01",
            "legend": {
                "enabled": false,
                "position": "top",
                "align": "right",
                "valueText": "",
                "color": "#000",
            },
            "numberFormatter": {
                precision: -0,
                decimalSeparator: '.',
                thousandsSeparator: ','
            },
            "axisColor": "#000",
            //"labelsEnabled": true,
            //"labelRadius": -530,
            //"labelText": "[[percents]]",
            "outlineColor": "",
            "dataProvider": [{
                "country": "Section 1",
                "value": 20,
                "color": "#f77575"
            }, {
                "country": "Section 2",
                "value": 60,
                "color": "#afd3f5"
            }, {
                "country": "Section 3",
                "value": 60,
                "color": "#5c5c64"
            }, {
                "country": "Section 4",
                "value": 20,
                "color": "#b4f2a5"
            }, {
                "country": "Section 5",
                "value": 30,
                "color": "#f8b871"
            }, {
                "country": "Section 6",
                "value": 60,
                "color": "#9094ed"
            }, {
                "country": "Section 7",
                "value": 20,
                "color": "#f16389"
            }, {
                "country": "Section 8",
                "value": 20,
                "color": "#e8da60"
            }, {
                "country": "Section 9",
                "value": 20,
                "color": "#35abab"
            }],
            "valueField": "value",
            "titleField": "country",
            "colorField": "color",
            // "labelColorField": "color",
            "outlineAlpha": 0.4,
            "labelRadius": 15,
            "depth3D": 15,
            "innerRadius": "30%",
            "angle": 20,
            "export": {
                "enabled": false
            },
        });
    } else {
        var chart = AmCharts.makeChart("Donutchart", {
            "type": "pie",
            "startDuration": 0,
            "theme": "light",
            "fontFamily": "Open Sans, sans-serif",
            "fontSize": 14,
            "color": "#000",
            "labelTickAlpha": 1,
            "labelTickColor": "#f8cf01",
            "legend": {
                "enabled": false,
                "position": "top",
                "align": "right",
                "valueText": "",
                "color": "#000",
            },
            "numberFormatter": {
                precision: -0,
                decimalSeparator: '.',
                thousandsSeparator: ','
            },
            "axisColor": "#000",
            //"labelsEnabled": true,
            //"labelRadius": -530,
            //"labelText": "[[percents]]",
            "outlineColor": "",
            "dataProvider": [{
                "country": "Section 1",
                "value": 20,
                "color": "#f77575"
            }, {
                "country": "Section 2",
                "value": 60,
                "color": "#afd3f5"
            }, {
                "country": "Section 3",
                "value": 60,
                "color": "#5c5c64"
            }, {
                "country": "Section 4",
                "value": 20,
                "color": "#b4f2a5"
            }, {
                "country": "Section 5",
                "value": 30,
                "color": "#f8b871"
            }, {
                "country": "Section 6",
                "value": 60,
                "color": "#9094ed"
            }, {
                "country": "Section 7",
                "value": 20,
                "color": "#f16389"
            }, {
                "country": "Section 8",
                "value": 20,
                "color": "#e8da60"
            }, {
                "country": "Section 9",
                "value": 20,
                "color": "#35abab"
            }],
            "valueField": "value",
            "titleField": "country",
            "colorField": "color",
            // "labelColorField": "color",
            "outlineAlpha": 0.4,
            "labelRadius": 15,
            "innerRadius": "30%",
            "angle": 20,
            "export": {
                "enabled": false
            },
        });
    }
}
