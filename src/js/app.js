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
      if(data.features.length > 0) {
        for (const spot of data.features) {
          this.checkIfExists(element, this.locationDataHandler(spot));
        }
      } else {
        element.insertAdjacentHTML("beforeend", ` <h4>No results found...</h4>`);
      }
    })
  }

  getRoute(element, startLon, startLat, endLon, endLat) {
    return fetch(`https://api.winnipegtransit.com/v3/trip-planner.json?origin=geo/${startLat},${startLon}&destination=geo/${endLat},${endLon}&api-key=${this.busKey}`)
    .then(response => response.json())
    .then((data) => {
      if(data.plans.length > 0) {
        for (const section of data.plans[0].segments) {
          this.insertSection(element, this.sectionDataHandler(section));
        }
      } else {
        element.insertAdjacentHTML("beforeend", ` <h4>No trip plans available</h4>`);
      }
    })
    .catch(function() {
      element.insertAdjacentHTML("beforeend", ` <h4>No trip plans available</h4>`);
    })
  }

  checkIfExists(element, info){
    return fetch(`https://api.winnipegtransit.com/v3/locations.json?lat=${info.lat}&lon=${info.lon}&api-key=${this.busKey}`)
    .then(response => response.json())
    .then((data) => {
      if (data.locations.length > 0){
        this.insertLocation(element, info);
      }
    })
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
    const time = data.times.durations.total;

    const sectionData = {}
    switch(data.type) {
      case "walk":
        sectionData.icon = "fa-walking";
        sectionData.text = `Walk for ${time} minutes to ${data.to.stop ? `stop #${data.to.stop.key} - ${data.to.stop.name}` : `your destination`}`
        break;
      case "transfer":
        sectionData.icon = "fa-ticket-alt";
        sectionData.text = `Transfer from stop ${data.from.stop ? `#${data.from.stop.key} - ${data.from.stop.name}` : `your starting location`} to stop ${data.to.stop ? `#${data.to.stop.key} - ${data.to.stop.name}` : `your destination`}` 
        break;
      case "ride":
        sectionData.icon = "fa-bus";
        sectionData.text = `Ride the Route ${data.route.number} for ${time} minutes`
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

const origins = document.querySelector(".origins");
const originForm = document.querySelector(".origin-form");
const destinations = document.querySelector(".destinations");
const destinationForm = document.querySelector(".destination-form");
const trip = document.querySelector(".my-trip");
const planTrip = document.querySelector(".plan-trip");

originForm.addEventListener("submit", function(e) {
  e.preventDefault();

  origins.innerHTML = "";
  planner.getLocation(originForm.querySelector("input").value, origins);
});

origins.addEventListener("click", function(e) {
  if(e.target.tagName === "UL") {
    return;
  }

  if (origins.querySelector(".selected")) {
    origins.querySelector(".selected").classList.remove("selected");
  }

  e.target.closest("li").classList.add("selected");
});


destinationForm.addEventListener("submit", function(e) {
  e.preventDefault();

  destinations.innerHTML = "";
  planner.getLocation(destinationForm.querySelector("input").value, destinations);
});

destinations.addEventListener("click", function(e) {
  if(e.target.tagName === "UL") {
    return;
  }

  if (destinations.querySelector(".selected")) {
    destinations.querySelector(".selected").classList.remove("selected");
  }

  e.target.closest("li").classList.add("selected");
});

planTrip.addEventListener("click", function() {
  trip.innerHTML = "";

  if(!origins.querySelector(".selected")) {
    trip.insertAdjacentHTML("beforeend", `No starting point selected...`);
  } else if(!destinations.querySelector(".selected")) {
    trip.insertAdjacentHTML("beforeend", `No destination selected...`);
  } else {
    const start = origins.querySelector(".selected");
    const end = destinations.querySelector(".selected");

    if (start.dataset.lon === end.dataset.lon && start.dataset.lat === end.dataset.lat) {
      trip.insertAdjacentHTML("beforeend",  "<h3>Cannot plan for matching starting location and destination</h3>")
    } else {
      planner.getRoute(trip, start.dataset.lon, start.dataset.lat, end.dataset.lon, end.dataset.lat);
    }
  }
});
