/**
 * @FileDescription:This Js contains Map display and Popup show with Informations
 * @CreatedDate:22Mar18
 * @Modifieddate:22Mar18
 **/
var map;
var geo_popup;

var map_info_click = true; // Click Based show Info Use True this Variable
var map_info_move = false;	// Move Based show Info Use True this Variable

/*
 * Map Responsive Zoom Fit and Map Generate 
 */
function map_dashbaord(gis_org_val,gis_org_unit_val){
	try{
		var org_id = gis_org_val;
		var org_unit_id = gis_org_unit_val;
		map = new ol.Map({
			target: document.getElementById('map'),
			layers: [
			         new ol.layer.Tile({
			        	 // source: new ol.source.OSM({wrapX: false	})
			        	 source: new ol.source.XYZ({url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}' , wrapX:false})    
			         })
			         ],
			         view: new ol.View({
			        	 center: ol.proj.transform([144.5,-6],'EPSG:4326','EPSG:3857'),
			        	 zoom: 5.5
			         })});  
		/**
		 * Popup Display Add Function Declared
		 * */
		geo_popup = new ol.Overlay.Popup();
		map.addOverlay(geo_popup);

		/**
		 * Click on Map Get Marker Feature
		 * */
		map.on('click', function(evt) {

			var pixel = map.getEventPixel(evt.originalEvent);
			var hit = map.hasFeatureAtPixel(pixel);
			map.getTarget().style.cursor = hit ? 'pointer' : '';
			if(map_info_click)
				displayInformation(evt)
		});

		/**
		 * Move Cursor on Map Get Marker Feature
		 * */
		map.on('pointermove', function(e) {
			if (e.dragging) { geo_popup.hide(); return; }

			var pixel = map.getEventPixel(e.originalEvent);
			var hit = map.hasFeatureAtPixel(pixel);

			map.getTarget().style.cursor = hit ? 'pointer' : '';

			if(map_info_move)
				displayInformation(e)
		});
		dashbaordMarkerAdd(org_id,org_unit_id);
	}catch(e){
		console.log(e)
	}
}
/*
 *Resize map Responsive Calculation
 */
window.onresize = function(){
	var worldextent = [-16241339.77003425,-7905423.21336607,17650227.075386617,14167144.570487712]	 
	setTimeout( function() { map.updateSize();
	map.setSize([window.innerWidth,window.innerHeight])
	map.render();
	map.getView().fit(worldextent, {constrainResolution:false},map.getSize());
	}, 200);
}

/**
 *@FunctionDescription: this function to Dynamically add Marker from Json data
 * 
 **/
function dashbaordMarkerAdd(org_id,org_unit_id){
	try{
		$.ajax({
			url : "/ti_reports_map/",
			type : "POST",
			timeout : 10000,
			data : 
				{
					'org_id':org_id,
					'org_unit_id':org_unit_id,
				},
		}).done( function(json_data){
			var json_data = JSON.parse(json_data);
			if (json_data.data.length != 0){
				var information_keys = [],key_Value =[];
				var geom_feature_collection = '';
				var data_length = json_data.data.length ;
				var information_array_key = json_data.data[0].information[0];
				for (var key in information_array_key) {
					if (information_array_key.hasOwnProperty(key)) {
						information_keys.push(key);	
					}
				}	
				geom_feature_collection +=    '{"type": "FeatureCollection","features": [';
				for (var k = 0; k <data_length ; k++) {
					var data_id = json_data.data[k].id;
					var latitude=json_data.data[k].coordinate[0].latitude;
					var longtitude=json_data.data[k].coordinate[0].longitude;
					var feature_information = '',feature_info;
					var information_keys_length = information_keys.length;
					/**
					 *Multi Level Child Sub Information Get fromn if value more than 1
					 *If Multiel child is Not there Use Else Part
					 **/
					if(information_keys_length >1){
						for(var m=0 ; m<information_keys_length; m++){
							feature_info = json_data.data[k].information[0][information_keys[m]]
							if(m==0)
								feature_information += JSON.stringify(feature_info[0]).split('}')[0];
							else
								feature_information += ","+(JSON.stringify(feature_info[0]).split('{')[1]).split('}')[0];
						}
						feature_information += "}";
					}else{
						feature_information = JSON.stringify(feature_information);			/*Not for Single data Is Coded*/
					}
					feature_info = JSON.parse(feature_information)			
					key_Value.push(feature_info);			
					var coordinates_data = [longtitude,latitude]
					geom_feature_collection += '{"type": "Feature","properties": '+feature_information+',"geometry": {"type": "Point","coordinates":['+coordinates_data+']}}';
					if(k<data_length-1){
						geom_feature_collection += ','
					}else{
						geom_feature_collection += ']}'
					}
				}			

				/**
				 *This Source add Marker when read as Json Data 
				 **/
				var vectorSource = new ol.source.Vector({
					features: (new ol.format.GeoJSON()).readFeatures(geom_feature_collection,{
						featureProjection: 'EPSG:3857'
					})
				});
				vectorLayer = new ol.layer.Vector({
					source: vectorSource,
					style: new ol.style.Style({
						image: new ol.style.Icon({
							anchor: [0.5, 20],
							anchorXUnits: 'fraction',
							anchorYUnits: 'pixels',
							opacity: 0.75,
							src: '/static/dev/hcms_talent_inventory/images/select_marker.png'
						})
					})
				});
				map.addLayer(vectorLayer);
			}
		});
	}catch(e){
		console.log(e);
	}
}

/**
 * @FunctionDescription:This function show popup when feature data Hit
 * @Paramtype:Object
 * @ParamData:{evt} - this evt is used to get Information from Features
 * */

function displayInformation(evt){
	var feature = map.forEachFeatureAtPixel(evt.pixel,
			function(feature, layer) {
		return feature;
	});
	if (feature) {
		var coordinate = feature.getGeometry().getCoordinates()
		var address_details = "";
		var featureProperties = feature.getProperties();
		var output_html_string = '<table class="information-table"><tbody>';
		output_html_string +='<b><caption>Information</caption></b>';
		for (var key in featureProperties) {
			if (key != "geometry") {
				addresskey = toTitleCase(key);
				output_html_string += "<tr><td text-align=left width='130'>" + addresskey + "</td>" + "<td text-align=left>" +featureProperties[key]+"</td></tr>"
			}
		}
		output_html_string += '</tbody></table>';
		var content = document.createElement("p");
		content.innerHTML = output_html_string;
		geo_popup.show(coordinate, content,'HCMS Info');
	} else {
		geo_popup.hide();
	}
}

/**
 * Title Case Of Information Details  of First string
 * */
function toTitleCase(str) {
	return str.replace(/\w\S*/g, function(txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}