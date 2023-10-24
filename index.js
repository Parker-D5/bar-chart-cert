import "./index.scss";
import * as d3 from "/node_modules/d3";

function DrawBar(dataset) {
  const margin = {
      top: 25,
      right: 50,
      bottom: 25,
      left: 50,
    },
    width = 900,
    height = 460;

  var overlay = d3
    .select(".graph")
    .append("div")
    .attr("class", "overlay")
    .style("opacity", 0);

  var tooltip = d3
    .select(".graph")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

  console.log(dataset);

  const svgHeight = height - margin.top - margin.bottom,
    svgWidth = width - margin.left - margin.right,
    barWidth = width / 325;

  var minDate = dataset[0][0].substr(0, 4);
  console.log(minDate);
  var maxDate = dataset[dataset.length - 1][0].substr(0, 4);
  console.log(maxDate);

  console.log(dataset);

  const years = dataset.map((data) => data[0].substr(0, 4));
  const gdp = dataset.map((data) => data[1]);
  console.log(years);
  console.log(gdp);

  const gdpMax = d3.max(gdp);
  const gdpMin = d3.min(gdp);

  const yearsDate = dataset.map((data) => new Date(data[0]));
  var xMax = new Date(d3.max(yearsDate));
  xMax.setMonth(xMax.getMonth() + 3);

  const yScale = d3
    .scaleLinear()
    .domain([0, gdpMax])
    .range([svgHeight, margin.bottom]);
  const xScale = d3
    .scaleTime()
    .domain([d3.min(yearsDate), xMax])
    .range([margin.left, width - margin.right]);

  var canvas = d3
    .select(".graph")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  canvas
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + svgHeight + ")")
    .call(d3.axisBottom(xScale));
  canvas
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + margin.left + ",0)")
    .call(
      d3
        .axisLeft(yScale)
        .tickFormat(function (d) {
          return "$" + d;
        })
        .ticks(10)
    );

  var bars = canvas
    .append("g")
    .selectAll("rect")
    .data(dataset)
    .join("rect")
    .style("fill", "#1295db")
    .attr("class", "bar")
    .attr("x", (d, i) => xScale(yearsDate[i]))
    .attr("y", (d) => yScale(d[1]))
    .attr("data-date", (d, i) => dataset[i][0])
    .attr("data-gdp", (d, i) => dataset[i][1])
    .attr("height", (d) => svgHeight - yScale(d[1]))
    .attr("width", barWidth)
    .attr("index", (d, i) => i)
    .on("mouseover", function (event, d) {
      var i = this.getAttribute("index");
      
     
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(
          years[i] +
            "<br>" +
            "$" +
            gdp[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, "$1,") +
            " Billion"
        )
        .attr("data-date", dataset[i][0])
        .attr("id", "tooltip")
        .style("left", event.clientX + "px")
        .style("top", event.clientY + "px")
        .style("transform", "translateX(10px)");
    })
    .on("mouseout", function () {
      tooltip.transition().duration(200).style("opacity", 0);
      overlay.transition().duration(200).style("opacity", 0);
    });
}

const req = new XMLHttpRequest();
req.open(
  "GET",
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json",
  true
);
req.send();
req.onload = function () {
  const json = JSON.parse(req.responseText);
  var dataset = json.data;
  DrawBar(dataset);
  //document.getElementsByClassName('message')[0].innerHTML = JSON.stringify(dataset);
};
