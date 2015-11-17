


var map;
var infoWindow;
var service;

var markersArray = [];
var options = ['Click to return stores within current region',];


 var image1 = 'http://s11.postimg.org/6a92y8vin/supermarket.png?noCache=1438349739';
 var image2 = 'http://s3.postimg.org/n3d2jgb27/supermarket_2.png?noCache=1438350061';

function searchAll() {
  performSearch(image1,image2)
}

function initialize() {
    map = new google.maps.Map(document.getElementById('map-canvas'), {
        center: new google.maps.LatLng(36.83786, -76.08993),
        zoom: 12,
     noClear: true
   });
    data = {
      "type": "FeatureCollection",
      "features": [{
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [-0.120850, 51.508742]
        },
        "properties": {}
      }]
    },
          ctrl = document.getElementById('datactrl'),
            fx = {
      'data-save': {
        click: function() {
          //use this method to store the data somewhere,
          //e.g. send it to a server
          map.data.toGeoJson(function(json) {
            data = json;
          });

        }
      },
      'data-show': {
        click: function() {

          alert('you may send this JSON-string to a server and store it there:\n\n' +
            JSON.stringify(data))
        }
      },

      'data-load': {
        click: function() {
          //use this method to load the data from somwhere
          //e.g. from a server via loadGeoJson

          map.data.forEach(function(f) {
            map.data.remove(f);
          });
          map.data.addGeoJson(data)
        },
        init: true
      },
      'data-clear': {
        click: function() {
          //use this method to clear the data
          //when you also want to remove the data on the server 
          //send a geoJSON with empty features-array to the server

          map.data.forEach(function(f) {
            map.data.remove(f);
          });
          data = {
            type: "FeatureCollection",
            features: []
          };


        }
      }
    };
     
  for (var id in fx) {
    var o = ctrl.querySelector('input[id=' + id + ']');
    google.maps.event.addDomListener(o, 'click', fx[id].click);
    if (fx[id].init) {
      google.maps.event.trigger(o, 'click');
    }
  }

  map.controls[google.maps.ControlPosition.TOP_CENTER].push(ctrl);


  function placeMarker(location) {
    var feature = new google.maps.Data.Feature({
      geometry: location
    });
    map.data.add(feature);
  }
  google.maps.event.addListener(map, 'dblclick', function(event) {
    placeMarker(event.latLng);
  });



            

    infoWindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);
  var myLatlng = new google.maps.LatLng(42.494718,-92.346826);
  


    google.maps.event.addListenerOnce(map, 'bounds_changed', searchAll);
}

function performSearch(dgIcon,walmartIcon) {
   
    var clickedOptions = [];
    for (var i =0; i < options.length; i++){
        if (document.getElementById(options[i]).checked) {
            clickedOptions.push(options[i]);
        }
    }
   
            var request = {
   bounds: map.getBounds(),
    keyword: 'Dollar General', 
             
  };
  service.radarSearch(request, function (results,status) {
    drawResults(results,status,dgIcon)
  });

  
  var request2 = {
   bounds: map.getBounds(),
    keyword: 'Walmart', 
             
  };
  service.radarSearch(request2, function (results, status){
    drawResults(results,status,walmartIcon)
  })
        
}



function drawResults(results, status, icon) {
    if (status != google.maps.places.PlacesServiceStatus.OK) {
        alert(status);
        return;
    }
    for (var i = 0, result; result = results[i]; i++) {
        createMarker(result,icon);

    }
}


// function dg(results, status) {
//     if (status != google.maps.places.PlacesServiceStatus.OK) {
//         alert(status);
//         return;
//     }
//     for (var i = 0, result; result = results[i]; i++) {
//         createMarker(result,image1);

//     }
// }


// function walmart(results2, status) {
//     if (status != google.maps.places.PlacesServiceStatus.OK) {
//         alert(status);
//         return;
//     }
//     for (var i = 0, outcome; outcome = results2[i]; i++) {
//         createMarker(outcome,image2);

//     }
// }


function createMarker(place, icon) {

    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        icon:icon
  
    });

    markersArray.push(marker);
    
    google.maps.event.addListener(marker, 'click', function () {
        service.getDetails(place, function (result, status) {
            if (status != google.maps.places.PlacesServiceStatus.OK) {
                alert(status);
                return;
            }
            infoWindow.setContent(result.name);
            infoWindow.open(map, marker);
        });
    });
      google.maps.event.addListener(marker, 'rightclick', function(event) {
        marker.setMap(null);
    });

}




// function createMarker2(place) {

//     var marker = new google.maps.Marker({
//         map: map,
//         position: place.geometry.location,
//         icon:image2
  
//     });


//     markersArray.push(marker);
    
//     google.maps.event.addListener(marker, 'click', function () {
//         service.getDetails(place, function (result, status) {
//             if (status != google.maps.places.PlacesServiceStatus.OK) {
//                 alert(status);
//                 return;
//             }
//             infoWindow.setContent(result.name);
//             infoWindow.open(map, marker);
//         });
//     });
// }





for (var i =0; i < options.length; i++){
    document.getElementById('options').innerHTML += '<input type="submit" id="'+options[i]+'" onclick="searchAll();"> <br>'
}




































google.maps.event.addDomListener(window, 'load', initialize);
