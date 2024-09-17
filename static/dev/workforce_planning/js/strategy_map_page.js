/**
 * @FileDescription:This Js contains Map display and Popup show with Informations
 * @CreatedDate:22Mar18
 * @Modifieddate:22Mar18
 **/
var map;
var geo_popup;
var org_unit_id = '';

var map_info_click = true; // Click Based show Info Use True this Variable
var map_info_move = false;    // Move Based show Info Use True this Variable

/*
 * Map Responsive Zoom Fit and Map Generate
 */
var pngLayerSource ,pngLayer;
function getWidth(extent) {
	return extent[2] - extent[0];
}

function styleFunction(feature) {
	return [
	        new ol.style.Style({
	        	geometry: function(feature) {
	        		var geometry = feature.getGeometry();
	        		if (geometry.getType() == 'MultiPolygon') {
	        			// Only render label for the widest polygon of a multipolygon
	        			var polygons = geometry.getPolygons();
	        			var widest = 0;
	        			for (var i = 0, ii = polygons.length; i < ii; ++i) {
	        				var polygon = polygons[i];
	        				var width = getWidth(polygon.getExtent());
	        				if (width > widest) {
	        					widest = width;
	        					geometry = polygon;
	        				}
	        			}
	        		}
	        		return geometry;
	        	},
	        	fill: new ol.style.Fill({
	        		color: '#4fa6d3',
	        		opacity:0.5
	        	}),
	        	stroke: new ol.style.Stroke({
	        		color: '#252626',
	        		width: 1.25
	        	}),
	        	text: new ol.style.Text({
	        		font: '10px Calibri,sans-serif',
	        		overflow: true,
	        		fill: new ol.style.Fill({ color: '#000' }),
	        		stroke: new ol.style.Stroke({
	        			color: '#fff', width: 2
	        		}),
	        		// get the text from the feature - `this` is ol.Feature
	        		text: map.getView().getZoom() > 2 ? feature.get('Province'): '',
	        				zIndex:1
	        	}),
	        	zIndex:1
	        })
	        ];
}

function map_dashbaord(){


	pngLayerSource = new ol.source.Vector({
		features: (new ol.format.GeoJSON()).readFeatures(png_admin_boundary,
				{
			featureProjection: 'EPSG:3857'
				}),
				wrapX: false
	});
	pngLayer = new ol.layer.Vector({
		source: pngLayerSource,
		name:'suburb_boundry',
		style:styleFunction
	});
	map = new ol.Map({
		target: 'strategy_step5_tab_map',
		layers: [
		         pngLayer
		         ],
		         view: new ol.View({
		        	 //center:ol.proj.transform([ 147.215980,-9.430203], 'EPSG:4326','EPSG:3857'),
		        	 zoom: 4,
		        	 maxZoom: 19,
		        	 minZoom:7
		         })
	});
	var zoomExtentValue = "[137,-11,160,-1]"
		zoomExtentValue = new Function("return (" + zoomExtentValue + ")")();
	var pngZoomToExtent = new ol.proj.transformExtent(zoomExtentValue,  'EPSG:4326','EPSG:3857');
	map.getView()
	.setCenter(pngZoomToExtent);
	map.getView()
	.fit(pngZoomToExtent, map.getSize());
	mapDensityData();
}


var lookup = {
		"1": [new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: "#46C7FA"
			}),
			fill: new ol.style.Fill({
				color: "#46C7FA"
			})
		})],
		"2": [new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: "#E81D1A"
			}),
			fill: new ol.style.Fill({
				color:  "#E81D1A"
			})
		})],
		"3": [new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: "#E8FF1A"
			}),
			fill: new ol.style.Fill({
				color: "#E8FF1A"
			})
		})],
		"4": [new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: "#E9FD1A"
			}),
			fill: new ol.style.Fill({
				color: "#E9FD1A"
			})
		})],
		"5": [new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: "#F81D1A"
			}),
			fill: new ol.style.Fill({
				color: "#F81D1A"
			})
		})]
};

function getColor(d) {
	/*return d > 1000 ? '#800026' :
        d > 500  ? '#BD0026' :
            d > 200  ? '#E31A1C' :
                d > 100  ? '#FC4E2A' :
                    d > 50   ? '#FD8D3C' :
                        d > 20   ? '#FEB24C' :
                            d > 10   ? '#FED976' :
                                '#FFEDA0';*/

	return d > 30 ? '#800026' :
		d > 25  ? '#BD0026' :
			d > 20  ? '#E31A1C' :
				d > 15  ? '#FC4E2A' :
					d > 10   ? '#FD8D3C' :
						d > 5   ? '#FEB24C' :
							d > 1   ? '#FED976' :
								'#FFEDA0';
}

/**
 * function to verify the style for the feature
 */
function classificationStyle(feature,res) {
	var currVal = parseFloat(feature.get('request_count'));
	if(currVal != 'NaN' && currVal != null && currVal != undefined && currVal >= 0){
		var return_style = [new ol.style.Style({
			geometry: function(feature) {
				var geometry = feature.getGeometry();
				if (geometry.getType() == 'MultiPolygon') {
					// Only render label for the widest polygon of a multipolygon
					var polygons = geometry.getPolygons();
					var widest = 0;
					for (var i = 0, ii = polygons.length; i < ii; ++i) {
						var polygon = polygons[i];
						var width = getWidth(polygon.getExtent());
						if (width > widest) {
							widest = width;
							geometry = polygon;
						}
					}
				}
				return geometry;
			},
			stroke: new ol.style.Stroke({
				color:  getColor(parseInt(currVal)),
			}),
			fill: new ol.style.Fill({
				color:  getColor(parseInt(currVal)),
				opacity:0.5
			}),
			text: new ol.style.Text({
				font: '12px Calibri,sans-serif',
				overflow: true,
				fill: new ol.style.Fill({ color: '#000' }),
				stroke: new ol.style.Stroke({
					color: '#fff', width: 2
				}),
				offsetX:10,
				offsetY:12,
				// get the text from the feature - `this` is ol.Feature
				text: 'Request ('+feature.get('request_count')+')',
				zIndex:1
			}),
			opacity:0.5,
			zIndex:0.5
		})]
	}else{
		//return false;
	}
	return return_style;
}

function mapDensityData(){
	try{
		$.ajax({
			url : "/wfp_system_step5_map_details/",
			type : "POST",
			timeout : 10000,
		}).done( function(json_data){
			var json_data = JSON.parse(json_data);
			var data_length = json_data.org_value_map.length ;
			for(var i=0; i<data_length; i++){
				var latitute = json_data.org_value_map[i].latitude;
				var longitude = json_data.org_value_map[i].longitude;
				var chorpleth_value = json_data.org_value_map[i].resreq_total_count;
				//var break_count = true;
				pngLayer.getSource().forEachFeature(function(feature){
					var featureProperties = feature.getProperties();
					//if(break_count == true){
					var coordinate_data = ol.proj.transform([longitude,latitute],'EPSG:4326','EPSG:3857');
					if(featureProperties['geometry'].intersectsCoordinate(coordinate_data)){
						feature.set('request_count',chorpleth_value);
					}else{

					}

				})
			}
			classification_vector_source = new ol.source.Vector({
				features:  pngLayer.getSource().getFeatures(),
				featureProjection: 'EPSG:3857'
			});
			classification_layer = new ol.layer.Vector({
				source: classification_vector_source,
				style: classificationStyle
			});
			map.addLayer(classification_layer)
		});
	}catch(e){
		console.log(e);
	}
}