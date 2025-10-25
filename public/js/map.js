
  let mapToken="pk.eyJ1IjoibWFuaXNoYS0yMDA1IiwiYSI6ImNtaDF5NzI1djA4MzYyaXM5cGY2ZWF5aXcifQ.Of9VMTKYC9ce1I-NNabpfw";
  console.log(mapToken);
    mapboxgl.accessToken =mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center:listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });
  
    const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h5>${listing.title}</h5><p>After booking you'll find your exact location</p>`);

    const marker = new mapboxgl.Marker({
    color: "red",
    draggable: true
    })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(popup)
    .addTo(map);

      
        
    


