var React = require('react');
var d3 = require('d3');

var ParallelCoordinates = React.createClass({
    getDefaultProps: function () {
        return {
            itemsToRender: [],
            allData: {},
            width: 960,
            height: 400
        }
    },

    getInitialState: function () {
        return {
            data: [],
            x: 0,
            y: 0,
            dimensions: []
        }
    },

    componentWillReceiveProps: function (newProps) {
        var updateData = [];

        if (!newProps.itemsToRender.length || !newProps.allData) {
            this.setState({data: []});
        }

        else {
            newProps.itemsToRender.map(function (item) {
                if (newProps.allData
                    && newProps.allData.hasOwnProperty(item)
                    && newProps.allData[item].hasOwnProperty('0')) {
                    var render_item = newProps.allData[item][0];
                    render_item['CODE'] = item;
                    updateData.push(render_item);
                    this.setState({data: updateData});
                }
            }, this);

            var y = {};

            var dimensions = d3.keys(updateData[0]).filter(function (d) {
                return d != "CODE" && d != "DATE" && (y[d] = d3.scale.linear()
                        .domain(d3.extent(updateData, function (p) {
                            return +p[d];
                        }))
                        .range([this.props.height, 0]));
            }, this);

            var x = this.state.x;
            x.domain(dimensions);

            this.setState({
                x: x,
                y: y,
                dimensions: dimensions
            })
        }

    },

    componentWillMount: function () {
        var x = d3.scale.ordinal().rangePoints([0, this.props.width], 1);

        this.setState({
            x: x
        })
    },

    path: function (d) {
        var line = d3.svg.line();
        var that = this;
        return line(this.state.dimensions.map(function (p) {
            return [that.state.x(p), that.state.y[p](d[p])];
        }));
    },

    brush: function () {
        var actives = this.state.dimensions.filter(function (p) {
            return !this.state.y[p].brush.empty();
        }, this);

        var extents = actives.map(function (p) {
            return this.state.y[p].brush.extent();
        }, this);

        d3.select("#foreground")
            .selectAll("path")
            .data(this.state.data)
            .style("display", function (d) {
                return actives.every(function (p, i) {
                    return extents[i][0] <= d[p] && d[p] <= extents[i][1];
                }) ? null : "none";
            });

    },

    render: function () {
        d3.select('#paraco').remove();

        var axis = d3.svg.axis().orient("left");

        var svg = d3.select("#paraco-parent").append("svg")
            .attr("width", this.props.width)
            .attr("height", this.props.height)
            .attr("id", "paraco")
            .append("g");

        var background = svg.append("g")
            .attr("class", "background")
            .selectAll("path")
            .data(this.state.data)
            .enter().append("path")
            .attr("d", this.path);

        // Add blue foreground lines for focus.
        var foreground = svg.append("g")
            .attr("class", "foreground")
            .attr("id", "foreground")
            .selectAll("path")
            .data(this.state.data)
            .enter().append("path")
            .attr("d", this.path);

        var x = this.state.x;
        var y = this.state.y;

        var g = svg.selectAll(".dimension")
            .data(this.state.dimensions)
            .enter().append("g")
            .attr("class", "dimension")
            .attr("transform", function (d) {
                return "translate(" + x(d) + ")";
            });

        g.append("g")
            .attr("class", "axis")
            .each(function (d) {
                d3.select(this).call(axis.scale(y[d]));
            })
            .append("text")
            .style("text-anchor", "middle")
            .attr("y", -9)
            .text(function (d) {
                return d;
            });

        var that = this;

        g.append("g")
            .attr("class", "brush")
            .each(function (d) {
                d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brush", that.brush));
            })
            .selectAll("rect")
            .attr("x", -8)
            .attr("width", 16);

        return (
            <div id="paraco-parent" className="para-co">
                <h4>Parallel Coordinates</h4>
            </div>
        );
    }
});

module.exports = ParallelCoordinates;