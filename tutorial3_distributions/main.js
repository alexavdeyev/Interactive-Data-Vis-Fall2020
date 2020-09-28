//CONSTANTS AND GLOBALS
const width = window.innerWidth * 0.6,
  height = window.innerHeight * 0.6,
  margin = { top: 20, bottom: 50, left: 60, right: 40 },
  radius = 8,
  time = 100;
/* * 
 * These variables allow us to access anything we manipulate in
 * Init() but need access to in Draw().
 * All these variables are empty before we assign something to them.
 * */
let svg, xScale, yScale;

//APPLICATION STATE
let state = { data: [], SelectedSex: "All" };

//LOADING DATA
d3.json("data/FirstYearGPA.json", d3.autoType).then(raw_data => {
  console.log("raw_data", raw_data)
  state.data = raw_data
  init()
});
/* *
 * INITIALIZING FUNCTION
 * this will be run "one time" when the data finishes loading in
 * */
function init() {
// SCALES
  xScale = d3.scaleLinear()
    .domain(d3.extent(state.data, d => d.GPA))
    .range([margin.left, width - margin.right])
    .nice();

  yScale = d3.scaleLinear()
    .domain(d3.extent(state.data, d => d.HSGPA))
    .range([height - margin.bottom, margin.top])
    .nice();

// AXES
  const xAxis = d3.axisBottom(xScale), yAxis = d3.axisLeft(yScale);
/* *
 * UI ELEMENT SETUP
 * Add dropdown (HTML selection) for interaction
 * HTML select reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
 * */
  const selectElement = d3.select("#dropdown").on("change", function() {
    console.log("New selection is ", this.value)
    //`this` === the selectElement
    // this.value holds the dropdown value a user just selected
    state.SelectedSex = this.value
    draw() // re-draw the graph based on this new selection
  });

  // Add in dropdown options from the unique values in the data
  selectElement
    .selectAll("option")
    .data(["All", "Male", "Female"]) // unique data values-- (hint: to do this programmatically take a look `Sets`)
    .join("option")
    .attr("value", d => d)
    .text(d => d);

  // create an svg element in our main `d3-container` element
  svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // add the xAxis
  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("x", width-margin.right)
    .attr("y", -6)
    .text("GPA");

  // add the yAxis
  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x",-margin.top)
    .attr("y",margin.top)
    .text("High School GPA");

  // tooltips
  div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  draw() // calls the draw function
}

/* *
 * DRAW FUNCTION
 * We call this everytime there is an update to the data/state
 * */

 function draw() {
// filter the data for the selectedSex
let filteredData = state.data;
// if there is a selectedSex, filter the data before mapping it to our elements
  if (state.SelectedSex !== "All") {
    filteredData = state.data.filter(d => d.SEX === state.SelectedSex)
  };

const dot = svg
  .selectAll(".dot")
  .data(filteredData, d => d.NAME) // use `d.name` as the `key` to match between HTML and data elements
  .join(
    enter => // enter selections -- all data elements that don't have a `.dot` element attached to them yet
      enter.append("circle")
        .attr("class", "dot") // Note: this is important so we can identify it in future updates
        .attr("opacity", 0.5)
        .attr("fill", d => {
          if (d.SEX === "Male") return "blue"
            else if (d.SEX === "Female") return "red"
          })
        .attr("r", 0)
        .attr("cy", height / 2 - margin.bottom)
        .attr("cx", width / 2 - margin.left) 

        // initial value - to be transitioned
        
          .on('mouseover', function (d) {
            d3.select(this).transition()
            .duration(time)
              .attr("r", 12)
              .style("stroke","black")
              .style("stroke-width","3");
            div.transition()
              .duration(time)
              .style("opacity", .8);
            div.html("GPA " + d.GPA + "<hr/>" + "HSGPA " + d.HSGPA)
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 28) + "px");
            })
            
          .on('mouseout', function () {
            d3.select(this).transition()
              .duration(time)
                .attr("r", radius)
                .style("stroke","none");
            div.transition()
              .duration(time)
              .style("opacity", 0)
            })

        .call(enter =>
          enter
            .transition() // initialize transition
              .duration(time*5)
              .delay((d, i) => i * 5)
              .attr("r", radius)
              .attr("cy", d => yScale(d.HSGPA))
              .attr("cx", d => xScale(d.GPA))
              ),
      update =>
        update.call(update =>
          // update selections -- all data elements that match with a `.dot` element
          update
            .transition().duration(time)
        ),
      exit =>
        exit.call(exit =>
          // exit selections -- all the `.dot` element that no longer match to HTML elements
          exit
            .transition().duration(time)
            .attr("r",0)
            .attr("opacity", 0)
            .remove()
        )
    );
}