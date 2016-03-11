var Calendar = require('react-input-calendar');
var ReactDOM = require('react-dom');
var React = require('react');
var $ = require("jquery");
var d3 = require("d3");
var ParallelCoordinates = require('./parallel-coordinates');


var List = React.createClass({
    handleClick: function (event, item) {
        var quoteCode = item.replace(/[^A-Za-z]/g, "");
        this.props.addSelected(quoteCode);
        this.props.addRenderData(quoteCode);
    },

    render: function () {
        return (
            <ul>
                {
                    this.props.items.map(function (item) {
                        return <li key={item} onClick={this.handleClick}>{item}</li>
                    }, this)
                }
            </ul>
        )
    }
});

var Selected = React.createClass({
        handleClick: function (event, item) {
            var quoteCode = item.replace(/[^A-Za-z]/g, "");
            this.props.deleteSelected(quoteCode);
        },

        render: function () {
            return (
                <ul>
                    {
                        this.props.items.map(function (item) {
                            return <li key={item} onClick={this.handleClick}>{item} ✖</li>
                        }, this)
                    }
                </ul>
            )
        }
    }
);

var DataListRender = React.createClass({
    render: function () {
        return (
            <table>
                <thead>
                <tr>
                    <th>COMPANY</th>
                    <th>DATE</th>
                    <th>OPEN</th>
                    <th>CLOSE</th>
                    <th>HIGH</th>
                    <th>LOW</th>
                    <th>VOLUME</th>
                    <th>AMOUNT</th>
                </tr>
                </thead>
                <tbody>
                {
                    this.props.itemsToRender.map(function (item) {
                        if (this.props.allData && this.props.allData.hasOwnProperty(item)) {
                            return this.props.allData[item].hasOwnProperty('0') ? (
                                <tr key={item}>
                                    <td>{item}</td>
                                    <td>{this.props.allData[item][0]["DATE"]}</td>
                                    <td>{this.props.allData[item][0]["OPEN"]}</td>
                                    <td>{this.props.allData[item][0]["CLOSE"]}</td>
                                    <td>{this.props.allData[item][0]["HIGH"]}</td>
                                    <td>{this.props.allData[item][0]["LOW"]}</td>
                                    <td>{this.props.allData[item][0]["VOLUME"]}</td>
                                    <td>{this.props.allData[item][0]["AMOUNT"]}</td>
                                </tr>) : (
                                <tr key={item}>
                                    <td>{item}</td>
                                    <td>{this.props.date}</td>
                                    <td> - </td>
                                    <td> - </td>
                                    <td> - </td>
                                    <td> - </td>
                                    <td> - </td>
                                    <td> - </td>
                                </tr>
                            )
                        }
                    }, this)
                }
                </tbody>
            </table>
        )
    }
});

var FilteredList = React.createClass({
    filterList: function (event) {
        var updatedList = this.state.initialItems;
        updatedList = updatedList.filter(function (item) {
            return item.search(event.target.value.toUpperCase()) !== -1;
        });

        this.setState({searchKeyword: event.target.value.toUpperCase(), items: updatedList});
    },

    getInitialState: function () {
        return {
            initialItems: [
                "AA",
                "AXP",
                "BA",
                "C",
                "CAT",
                "DD",
                "DIS",
                "DJI",
                "EK",
                "GE",
                "GM",
                "HD",
                "HON",
                "HPQ",
                "IBM",
                "INTC",
                "IP",
                "JNJ",
                "JPM",
                "KO",
                "MCD",
                "MMM",
                "MO",
                "MRK",
                "MSFT",
                "PG",
                "SBC",
                "T",
                "UTX",
                "WMT",
                "XOM"
            ],
            items: [],
            selectedItems: [],
            searchKeyword: "",
            startDate: "2015-03-03",
            renderData: null // cache
        }
    },

    componentWillMount: function () {
        this.setState({items: this.state.initialItems});
    },

    addSelected: function (item) {
        var updatedListSI = this.state.selectedItems;
        var updatedListI = this.state.items;

        if (updatedListSI.indexOf(item) == -1) {
            updatedListSI.push(item);
            if (updatedListI.indexOf(item) != -1) {
                updatedListI.splice(updatedListI.indexOf(item), 1);
            }

        }

        this.setState({selectedItems: updatedListSI.sort(), items: updatedListI.sort()});
    },

    deleteSelected: function (item) {
        var updatedListSI = this.state.selectedItems;
        var updatedListI = this.state.items;

        updatedListSI.splice(updatedListSI.indexOf(item), 1);
        if (item.search(this.state.searchKeyword) != -1) {
            updatedListI.push(item);
        }

        this.setState({
            selectedItems: updatedListSI.sort(),
            items: updatedListI.sort()
        });
    },

    handleKeyPress: function (event) {
        //todo
        if (event.key == "Enter") {
            this.state.items.forEach(function (item) {
                console.log(item);
            });
        }
    },

    addRenderData: function (item) {
        //if already stored in cache
        if (this.state.renderData && this.state.renderData[item]) {
            return;
        }

        //or get data
        $.ajax({
            url: '/api',
            method: 'GET',
            data: {
                startDate: this.state.startDate,
                code: item
            },
            success: function (res) {
                var r = this.state.renderData ? this.state.renderData : {};
                r[item] = res[0]['DATA'];
                this.setState({renderData: r});

            }.bind(this)
        });
    },

    //date changed, refresh cache
    onDateChange: function (item) {
        this.setState({startDate: item});

        $.ajax({
            url: '/api',
            method: 'GET',
            data: {
                startDate: item,
                code: this.state.selectedItems.toString()
            },
            success: function (res) {
                var r = this.state.renderData ? this.state.renderData : {};
                res.forEach(function (i) {
                    r[i['CODE']] = i['DATA']
                });
                this.setState({renderData: r});
            }.bind(this)
        });
    },
    render: function () {
        return (
            <div>
                <div className="filter-list">
                    <input type="text" placeholder="Search" onKeyPress={this.handleKeyPress}
                           onChange={this.filterList}/>
                    <Calendar onChange={this.onDateChange} computableFormat="YYYY-MM-DD" date={this.state.startDate}
                              format="YYYY-MM-DD"/>
                    <div className="lists">
                        <div className="selected-list">
                            <Selected deleteSelected={this.deleteSelected} items={this.state.selectedItems}/>
                        </div>
                        <List addRenderData={this.addRenderData} addSelected={this.addSelected}
                              items={this.state.items}/>
                    </div>
                </div>
                <div className="data-list">
                    <DataListRender date={this.state.startDate} itemsToRender={this.state.selectedItems} allData={this.state.renderData}/>
                    <small className="notice">Market closed on weekends and holidays</small>
                </div>
                <ParallelCoordinates itemsToRender={this.state.selectedItems} allData={this.state.renderData}/>
            </div>
        );
    }
});


ReactDOM.render(<FilteredList/>, document.getElementById('app'));
