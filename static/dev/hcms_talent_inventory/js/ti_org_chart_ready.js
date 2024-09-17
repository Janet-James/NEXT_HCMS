var i='';
var datascource = [];
$(document).ready(function(){
    $("#ti_rs_sel_org").select2({
        placeholder: "-Select Organization-",
        width: '100%',
    });
    $("#ti_rs_sel_org_unit").select2({
        placeholder: "-Select Org. Unit-",
        width: '100%',
    });
    setInterval(function(){ $('a[title="GetOrgChart jquery plugin"]').hide(); }, 10);
});

//26-JUL-2018 || SMI || Organization - On select function
function get_org_list(org_id){
    $('#ti_rs_sel_org_unit').empty();
    $('#ti_rs_sel_org_unit').empty().append($('<option>',{
        value:'',
        text:'-Select Org. Unit-'
    }));
    $.ajax({
        type: 'POST',
        url: '/ti_org_unit/',
        timeout : 10000,
        data: {
            'org_id': org_id,
        },
        async: false,
    }).done(function(json_data){
        data = JSON.parse(json_data);
        if (data.sel_org_unit != undefined){
            if (data.sel_org_unit.length > 0){
                $('#ti_rs_sel_org_unit').prop("disabled",false);
                for(i=0;i<data.sel_org_unit.length;i++)
                {
                    $('#ti_rs_sel_org_unit').append($('<option>',{
                        value:data.sel_org_unit[i].id,
                        text:data.sel_org_unit[i].orgunit_name
                    }))
                }
            } else {
                $('#ti_rs_sel_org_unit').prop("disabled",true);
            }
        }
    })
}

//Reporting Structure Chart Draw Function
function orgDataParse(data){
    getOrgChart.themes.myCustomTheme = {
            size: [500, 220],
            toolbarHeight: 46,
            textPoints: [{
                x: 10,
                y: 200,
                width: 490
            }, {
                x: 200,
                y: 40,
                width: 300
            }, {
                x: 210,
                y: 65,
                width: 290
            }, {
                x: 210,
                y: 90,
                width: 290
            }, {
                x: 200,
                y: 115,
                width: 300
            }, {
                x: 185,
                y: 140,
                width: 315
            }],
            textPointsNoImage: [{
                x: 10,
                y: 200,
                width: 490
            }, {
                x: 10,
                y: 40,
                width: 490
            }, {
                x: 350,
                y: 200,
                width: 490
            }, {
                x: 10,
                y: 90,
                width: 490
            }, {
                x: 10,
                y: 115,
                width: 490
            }, {
                x: 10,
                y: 140,
                width: 490
            }],
            expandCollapseBtnRadius: 20,
            box: '<rect x="0" y="0" height="220" width="500" rx="10" ry="10" class="get-box" />',
            text: '<text width="[width]" class="get-text get-text-[index]" x="[x]" y="[y]">[text]</text>',
            image: ''
    };
    var orgchart = new getOrgChart(document.getElementById("ti_reporting_struct"), {
        theme: "myCustomTheme",
        linkType: "B",
        enableEdit: false,
        enableDetailsView: false,
        enableSearch: false,
        enableZoom: true,
        enablePrint: false,
        enableGridView: false,
        enableExportToImage: false,
        enableZoomOnNodeDoubleClick: true,
        orientation: getOrgChart.RO_TOP,
        primaryFields: ["type", "title", "count"],
        dataSource: data
    });
    $('.get-oc-tb').show();
}

//27-JUL-2018 || SMI || Org. Unit - On select function
function get_struct_sel(org_unit_id){
    var org_id = $('#ti_rs_sel_org').val();
    $.ajax({
        url : '/ti_report_role_details/',
        type : 'POST',
        timeout : 10000,
        data: {
            'org_id': org_id,
            'org_unit_id': org_unit_id,
        },
    }).done(function(json_data){
        var data = JSON.parse(json_data);
        if(data.length != 0){
            var peopleElement = document.getElementById("ti_reporting_struct");
            var datascource = [];
            for(i=0;i<data.length;i++)
            {
                if(i==0){
                    datascource.push({ id: i+1, parentId: null, title: data[i].role_title, type: data[i].role_type, count: "Planned Count : "+data[i].res_count, })
                } else {
                    datascource.push({ id: i+1, parentId: data[i].role_reports_to_id, title: data[i].role_title, type: data[i].role_type, count: "Planned Count : "+data[i].res_count, })
                }
            }
            orgDataParse(datascource);
        } else {
            $("#ti_reporting_struct").html('<h3 class="no-data">No data available</h3>');
        }
    });
}

