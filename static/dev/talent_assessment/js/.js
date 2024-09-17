$(document).ready(function(){
    setInterval(function(){ $('a[title="GetOrgChart jquery plugin"]').hide(); });
});
    var peopleElement = document.getElementById("people");
    var orgChart = new getOrgChart(peopleElement, {
        primaryFields: ["name", "title", "phone", "mail"],
        photoFields: ["image"],
        dataSource: [
            { id: 1, parentId: null, name: "Bernard", title: "CEO", phone: "678-772-470", mail: "lemmons@next.com", adress: "Atlanta, GA 30303", },
            { id: 2, parentId: 1, name: "Ginu", title: "Team Manager", phone: "937-912-4971", mail: "anderson@next.com", },
            { id: 3, parentId: 1, name: "Selva Leela", title: "Team Manager", phone: "314-722-6164", mail: "thornton@next.com",},
            { id: 4, parentId: 1, name: "karthika", title: "Team Lead", phone: "330-263-6439", mail: "shetler@next.com", },
            { id: 5, parentId: 2, name: "Prabu", title: "UI Designer", phone: "408-460-0589", },
            { id: 6, parentId: 2, name: "Sasi Kumar", title: "UI Designer", phone: "801-920-9842", mail: "JasonWGoodman@next.com", },
            { id: 7, parentId: 2, name: "Kuppuraj", title: "UI Designer", phone: "Conservation scientist", mail: "hodges@next.com", },
            { id: 8, parentId: 6, name: "Jahir", title: "Budget manager", phone: "989-474-8325", mail: "hunter@next", },
            { id: 9, parentId: 7, name: "Riley Bray", title: "Structural metal fabricator", phone: "479-359-2159", },
            { id: 10, parentId: 7, name: "Callum Whitehouse", title: "Radar controller", phone: "847-474-8775", }
    ]
});
    
//  Select Month Value  
$('select_date').on('change', function() {
//        alert( $(this).find(":selected").val() );
        alert("call")
        select_date = $("#select_date").val();
        console.log("sssssssssssssssssss",select_date)
        $.ajax({
			type:"POST",
			url: "/cascade_objective_select/",
			data:{'select_date':select_date},
			success: function (json_data) {
				data=JSON.parse(json_data);
			}
		})
        
   });
