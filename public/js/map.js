
    mapboxgl.accessToken =mapToken;

    const map = new mapboxgl.Map({
    container: "map",// container ID
    // style:"mapbox://styles/mapbox/streets-v12",
    center: listing.geometry.coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
    });

    //console.log(coordinates);

    const marker1 = new mapboxgl.Marker({color:"black"})
    .setLngLat(listing.geometry.coordinates) //listing.geometry.coordinates
    .setPopup(new mapboxgl.Popup({offset:25})
    .setHTML(`<h4>${listing.title}</h1><p>Exact Location provided after booking</p>`))
    .addTo(map);