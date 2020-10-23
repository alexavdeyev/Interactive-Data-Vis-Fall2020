/**
 ** CONSTANTS AND GLOBALS
 **/
const
    width = window.innerWidth * 0.9,
    height = window.innerHeight * 0.7,
    margin = { top: 20, bottom: 50, left: 60, right: 40 };

/**
 ** APPLICATION STATE
 **/
let 
    svg, 
    state = {
        geojson: null, city: null,
        hover: {
            Latitude: null, Longitude: null, State: null, Capital: null, Population: null
        }
    };

/**
 ** LOAD DATA
 ** Using a Promise.all([]), we can load more than one dataset at a time
 **/
Promise.all([
    d3.json("../data/usState.json"),
    d3.csv("../data/us_state_capitals.csv", d3.autoType)])
        .then(([geojson, city]) =>
            {
                state.geojson = geojson
                state.city = city
                init()
            }
);

/**
 ** INITIALIZING FUNCTION
 ** this will be run *one time* when the data finishes loading in
 **/
function init() {
// Create an svg element in our main `d3-container` element

const
    projection = d3.geoAlbersUsa().fitSize([width, height], state.geojson),
    path = d3.geoPath().projection(projection);

    radius = d3.scaleSqrt([0, d3.max(state.city, d => d.population)], [0, 15])
    
svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// + DRAW BASE MAP PATH
svg
    .selectAll(".state")
    .data(state.geojson.features)
    .join("path")
    .attr("d", path)
    .attr("class", "state")
    .attr("fill", "ivory")
    .on("mouseover", d => {
        state.hover["State"] = d.properties.NAME
    })
    .on("mouseout", d => {
        state.hover["State"] = null
    });

// + LABEL THE STATES
svg
    .selectAll("text")
    .data(state.geojson.features)
    .join("svg:text")
    .text(d => d.properties.STUSPS)
    .attr("text-anchor","middle")
    .attr("font-size","8pt")
    .style("font-weight","bold")
    .style("fill","navy")
    .attr("dx", d => path.centroid(d)[0])
    .attr("dy", d => path.centroid(d)[1])

// + ADD EVENT LISTENERS
svg
    .on("mousemove", () => {
    // we can use d3.mouse() to tell us the exact x and y positions of our cursor
    const [mx, my] = d3.mouse(svg.node());
    // projection can be inverted to return [lat, long] from [x, y] in pixels
    const proj = projection.invert([mx, my]);
    state.hover["Longitude"] = d3.format(".2f")(proj[0]);
    state.hover["Latitude"] = d3.format(".2f")(proj[1]);
    draw();
});

svg
    .selectAll(".city")
    .data(state.city)
    .join("circle")
    .attr("r", d => radius(d.population))
    .attr("cx", d => projection([d.X,d.Y])[0])
    .attr("cy", d => projection([d.X,d.Y])[1])
    .on("mouseover", d => {
        state.hover["Capital"] = d.name;
        state.hover["Populations"] = d3.format(",")(d.population)
    })
    .on("mouseout", d => {
        state.hover["Capital"] = null;
        state.hover["Populations"] = null
    }) 
}

function draw() {
  hoverData = Object.entries(state.hover);
  console.log(hoverData);

  hoverContainer = d3.select("#hover-container")
    .selectAll("div.row")
    .data(hoverData)
    .join("div")
    .attr("class", "row")
    .html(
      d => 
      d[1] ? `${d[0]}: ${d[1]}` : null
    );
  
}
