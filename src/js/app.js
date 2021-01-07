class Planner {
  constructor() {
    this.mapKey = `pk.eyJ1IjoiYWRhbS1pc2Fhay1kZXYiLCJhIjoiY2tqbGsybnV6MDVtcTJ1b2Nqa21jdWtkZiJ9.2Q7Tvv9hHx4_U_ySdg8SoA`;
    this.busKey = "qLSqCdwz7CxfqMFBJGt2";
    this.border = `-97.325875,49.766204,-96.953987,49.99275`;
  }

  getLocation(search, element) {
    return fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${search}.json?bbox=${this.border}&limit=10&access_token=${this.mapKey}&types=address,poi,neighborhood`)
    .then(response => response.json())
    .then((data) => {
      console.log(data);
      
      if(data.features.length > 0) {
        for (const spot of data.features) {
          this.insertLocation(element, this.locationDataHandler(spot));
        }
      } else {
        element.insertAdjacentHTML("beforeend", ` <h4>No results found...</h4>`);
      }
    })
  }

  getRoute(startLon, startLat, endLon, endLat) {
    return fetch(`https://api.winnipegtransit.com/v3/trip-planner.json?origin=geo/${startLat},${startLon}&destination=geo/${endLat},${endLon}&api-key=${this.busKey}`)
    .then(response => response.json())
    .then((data) => {
      console.log(data);

      if(data.plans.length > 0) {
        for (const section of route) {
          this.insertSection(element, this.sectionDataHandler());
        }
      } else {
        element.insertAdjacentHTML("beforeend", ` <h4>No plans available</h4>`);
      }
    });
  }

  locationDataHandler(data) {
    const split = data.place_name.split(",");
    const spotData = {
      lon: data.center[0],
      lat: data.center[1],
      name: split[0],
      address: split[1]
    }

    return spotData;
  }

  sectionDataHandler(data) {
    const route = data.plans[0].segments;
    const time = section.duration.total;
    const from =  section.from.stop ? `#${section.from.stop.key} - ${section.from.stop.name}` : `from your starting location`;
    const to = section.to.stop ? `#${section.to.stop.key} - ${section.to.stop.name}` : `your destination`;

    const sectionData = {}
    switch(section.type) {
      case "walk":
        sectionData.icon = "fa-walking";
        sectionData.text = `Walk for ${time} minutes to stop ${to}`
        break;
      case "transfer":
        sectionData.icon = "fa-ticket-alt";
        sectionData.text = `Transfer from stop ${from} to stop ${to}` 
        break;
      case "ride":
        sectionData.icon = "fa-bus";
        sectionData.text = `Ride the Route ${section.route.number} for ${time}`
        break;
    }

    return sectionData;
  }

  insertLocation(element, data){
    element.insertAdjacentHTML("beforeend", 
    `<li data-lon="${data.lon}" data-lat="${data.lat}" class="">
      <div class="name">${data.name}</div>
      <div>${data.address}</div>
    </li>`);
  }

  insertSection(element, data) {
    element.insertAdjacentHTML("beforeend", 
    `<li>
      <i class="fas ${data.icon}" aria-hidden="true"></i>${data.text}
    </li>`);
  }
}

const planner = new Planner();

