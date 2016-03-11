var React = require('react');
var d3 = require('d3');
var $ = require('jquery');

var LineChart = React.createClass({
    getDefaultProps: function () {
        return {
            initialItems: [],
            itemsToRender: [],
            allData: {},
            width: 960,
            height: 400
        }
    },

    getInitialState: function () {
        return {
            data: null,
            x: 0,
            y: 0,
            dimension: "OPEN",
            renderData: []
        }
    },

    componentWillMount: function(){
        this.props.initialItems.map(
            function(item){
                $.ajax({
                    url: '/api',
                    method: 'GET',
                    data: {
                        startDate: "2015-03-01",
                        endDate: "2016-03-01",
                        code: item
                    },
                    success: function (res) {
                        var r = this.state.data ? this.state.data : {};
                        r[item] = res[0]['DATA'];
                        this.setState({data: r});

                    }.bind(this)
                });
            }, this);
    },

    render: function(){
        if(this.state.data && Object.keys(this.state.data).length == this.props.initialItems.length) {

            var data = this.state.data["AA"];

            var parseDate = d3.time.format("%Y-%m-%d").parse;

            var x = d3.time.scale()
                .range([0, this.props.width]);

            var y = d3.scale.linear()
                .range([this.props.height, 0]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            var line = d3.svg.line()
                .x(function (d) {
                    return x(d["DATE"]);
                })
                .y(function (d) {
                    return y(d["CLOSE"]);
                });

            var svg = d3.select("#line-chart-parent").append("svg")
                .attr("width", this.props.width)
                .attr("height", this.props.height)
                .attr("id", "linech")
                .append("g");

            data.forEach(function (d) {
                d["DATE"] = parseDate(d["DATE"]);
            });

            x.domain(d3.extent(data, function (d) {
                return d["DATE"];
            }));
            y.domain(d3.extent(data, function (d) {
                return d["CLOSE"];
            }));

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + this.props.height + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Price ($)");

            svg.append("path")
                .datum(data)
                .attr("class", "line-chart-line")
                .attr("d", line);
        }
        return(
            <div id="line-chart-parent" className="line-chart">
                <h4>Line Chart</h4>
                <h5>{"AA"} {"2015-03-01"} {"2016-03-01"}</h5>
            </div>
        )
    }
});

module.exports = LineChart;