mapboxgl.accessToken = token;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
  });
  map.addControl(new mapboxgl.NavigationControl());
  const marker1 = new mapboxgl.Marker()
        .setLngLat(campground.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({offset:25})
          .setHTML(`<h6>${campground.title}</h6><p>${campground.location}</p>`)
        )
        .addTo(map);