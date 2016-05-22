// Read parameters and feed them to /data
var spl = document.location.pathname.split("/");
var url;
if (spl[1] === "year"){
    url = "/data?startyear=" + spl[2];
    if (spl.length > 2){
	url += "&endyear=" + spl[3];
    }
} else {
    url = "/data"
}
// Request data from db
$.ajax({
           type: "GET",
           contentType: "application/json; charset=utf-8",
           url: url,
           dataType: 'json',
           success: function (data) {
               draw(data);
           },
           error: function (result) {
               error();
           }
       });
// Create multiple dom elements containing films in film_array to be displayed
function display_films(film_array) {
    var i, film;
    // Remove anything that was here before
    $("#films").html("");
    for (i = 0; i < film_array.length; i = i + 1){
	film = film_array[i];
	$("#films").append("<div class='film' style='margin: auto; float:none;'>\
<div id='poster'>\
    <img src='"+ film.Poster +"'></img>\
    </div>\
    <div id='info'>\
    <div id='title'>\
      <a href='http://imdb.com/title/"+film.ImdbID+"'>"+ film.Title+"</a>\
    </div>\
    <div id='released'>\
     "+ film.Released+"\
    </div>\
    <div id='rating'>\
     "+ film.ImdbRating +"/10\
    </div>\
    <div class='names'>\
      "+film.Director+"\
    </div>\
    <div class='names'>\
     "+ film.Actors +"\
    </div>\
    \
    <div id='plot'>\
      "+ film.Plot +"\
    </div>\
    </div>");
    }
}
function draw(data) {
    var i = -1;
    function getdata(){
	i = i + 1;
	return data[i];
    }
    var n = 4, // number of layers
    m = 12, // number of samples per layer
    stack = d3.layout.stack(),
    layers = stack(d3.range(n).map(function() { return getdata(); })),
    yGroupMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y; }); }),
    yStackMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); });
    var margin = {top: 40, right: 10, bottom: 20, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
	.domain(d3.range(1, m+1))
	.rangeRoundBands([0, width], .08);

    var y = d3.scale.linear()
	.domain([0, yStackMax])
	.range([height, 0]);
 
    var color = d3.scale.linear()
	.domain([0, n - 1])
	.range(["#aad", "#556"]);

    var xAxis = d3.svg.axis()
	.scale(x)
	.tickSize(0)
	.tickPadding(6)
	.orient("bottom");
   var yAxis = d3.svg.axis()
	.scale(y)
	.tickSize(0)
	.orient("left");

    // We select our specific container
    var svg = d3.select("#svgcontainer").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var layer = svg.selectAll(".layer")
	.data(layers)
	.enter().append("g")
	.attr("class", "layer")
	.style("fill", function(d, i) { return color(i); });

    var rect = layer.selectAll("rect")
	.data(function(d) { return d; })
	.enter().append("rect")
	.attr("x", function(d) { return x(d.x); })
	.attr("y", height)
	.attr("width", x.rangeBand())
	.attr("height", 0)
    //When clicking on a rect, we should display the films corresponding to the week
	.on("click", function(e) {
	    display_films(e.films)
	})

    svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")")
	.call(xAxis);
    var yax = svg.append("g")
	.attr("class", "y axis")
	.attr("transform", "translate(0, 0)")
	.call(yAxis);
 
    d3.selectAll("input").on("change", change);

    var timeout = setTimeout(function() {
	d3.select("input[value=\"grouped\"]").property("checked", true).each(change);
    }, 2000);

    // Swap from grouped to stacked with inputs
    function change() {
	clearTimeout(timeout);
	if (this.value === "grouped") transitionGrouped();
	else transitionStacked();
    }

    function transitionGrouped() {
	y.domain([0, yGroupMax]);

	rect.transition()
	    .duration(500)
	    .delay(function(d, i) { return i * 10; })
	    .attr("x", function(d, i, j) { return x(d.x) + x.rangeBand() / n * j; })
	    .attr("width", x.rangeBand() / n)
	    .transition()
	    .attr("y", function(d) { return y(d.y); })
	    .attr("height", function(d) { return height - y(d.y); });
	// Let's also update the Axis
	yAxis = d3.svg.axis()
	    .scale(y)
	    .tickSize(0)
	    .orient("left");
	yax.call(yAxis);
    }

    function transitionStacked() {
	y.domain([0, yStackMax]);

	rect.transition()
	    .duration(500)
	    .delay(function(d, i) { return i * 10; })
	    .attr("y", function(d) { return y(d.y0 + d.y); })
	    .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
	    .transition()
	    .attr("x", function(d) { return x(d.x); })
	    .attr("width", x.rangeBand());

	// Let's also update the Axis
	yAxis = d3.svg.axis()
	    .scale(y)
	    .tickSize(0)
	    .orient("left");
	yax.call(yAxis);
    }
}
 
function error() {
    console.log("error")
}

// Set the text input values to match the params
// When the button is clicked, redirect to the same page with different params
$(document).ready(function(){
    $("#startyear").val(spl[2]);
    $("#endyear").val(spl[3]);
    $('#go').click(function(e) {  
        var startyear = $("#startyear").val();
        var endyear = $("#endyear").val();
        window.location.href ="/year/"+startyear+"/"+endyear;

    });
});