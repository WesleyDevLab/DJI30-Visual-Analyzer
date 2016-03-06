

var List = React.createClass({
    displayName: "List",

    handleClick: function (event, item) {
        var quoteCode = item.replace(/[^A-Za-z]/g, "");
        this.props.addSelected(quoteCode);
        //console.log(quoteCode);
    },

    render: function () {
        return React.createElement(
            "ul",
            null,
            this.props.items.map(function (item) {
                return React.createElement(
                    "li",
                    { key: item, onClick: this.handleClick },
                    item
                );
            }, this)
        );
    }
});

var Selected = React.createClass({
    displayName: "Selected",

    handleClick: function (event, item) {
        var quoteCode = item.replace(/[^A-Za-z]/g, "");
        this.props.deleteSelected(quoteCode);
        //console.log(quoteCode);
    },
    render: function () {
        return React.createElement(
            "ul",
            null,
            this.props.items.map(function (item) {
                return React.createElement(
                    "li",
                    { key: item, onClick: this.handleClick },
                    item,
                    " ✖"
                );
            }, this)
        );
    }
});

var FilteredList = React.createClass({
    displayName: "FilteredList",

    filterList: function (event) {
        var updatedList = this.state.initialItems;
        updatedList = updatedList.filter(function (item) {
            return item.search(event.target.value.toUpperCase()) !== -1;
        });

        this.setState({ searchKeyword: event.target.value.toUpperCase() });
        this.setState({ items: updatedList });
    },

    getInitialState: function () {
        return {
            initialItems: ["AA", "AXP", "BA", "C", "CAT", "DD", "DIS", "EK", "GE", "GM", "HD", "HON", "HPQ", "IBM", "INTC", "IP", "JNJ", "JPM", "KO", "MCD", "MMM", "MO", "MRK", "MSFT", "PG", "SBC", "T", "UTX", "WMT", "XOM", "DJI"],
            items: [],
            selectedItems: [],
            searchKeyword: ""
        };
    },

    componentWillMount: function () {
        this.setState({ items: this.state.initialItems });
    },

    addSelected: function (item) {
        var updatedListSI = this.state.selectedItems;
        var updatedListII = this.state.initialItems;
        var updatedListI = this.state.items;

        if (updatedListSI.indexOf(item) == -1) {
            updatedListSI.push(item);
            updatedListII.splice(updatedListII.indexOf(item), 1);
            updatedListI.splice(updatedListI.indexOf(item), 1);
        }
        //console.log(this.state.selectedItems)

        this.setState({ selectedItems: updatedListSI.sort() });
        this.setState({ initialItems: updatedListII.sort() });
        this.setState({ items: updatedListI.sort() });
    },

    deleteSelected: function (item) {
        var updatedListSI = this.state.selectedItems;
        var updatedListII = this.state.initialItems;
        var updatedListI = this.state.items;

        updatedListII.push(item);
        updatedListSI.splice(updatedListSI.indexOf(item), 1);
        if (item.search(this.state.searchKeyword) != -1) {
            updatedListI.push(item);
        }
        this.setState({ selectedItems: updatedListSI.sort() });
        this.setState({ initialItems: updatedListII.sort() });
        this.setState({ items: updatedListI.sort() });
    },
    handleKeyPress: function (event) {
        console.log("enter pressed");
    },

    render: function () {
        return React.createElement(
            "div",
            null,
            React.createElement(
                "div",
                { className: "filter-list" },
                React.createElement("input", { type: "text", placeholder: "Search", onKeyPress: this.handleKeyPress, onChange: this.filterList }),
                React.createElement(
                    "div",
                    { className: "selected-list" },
                    React.createElement(Selected, { deleteSelected: this.deleteSelected, items: this.state.selectedItems })
                ),
                React.createElement(List, { addSelected: this.addSelected, items: this.state.items })
            )
        );
    }
});

ReactDOM.render(React.createElement(FilteredList, null), document.getElementById('search-box'));