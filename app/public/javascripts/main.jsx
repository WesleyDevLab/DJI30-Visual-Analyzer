var Calendar = require('react-input-calendar');
var ReactDOM =require('react-dom');
var React = require('React');

var List = React.createClass({
    handleClick: function(event, item){
        var quoteCode = item.replace(/[^A-Za-z]/g, "");
        this.props.addSelected(quoteCode);
        //console.log(quoteCode);
    },

    render: function(){
        return (
            <ul>
                {
                    this.props.items.map(function(item) {
                        return <li key={item} onClick={this.handleClick} >{item}</li>
                    },this)
                }
            </ul>
        )
    }
});

var Selected = React.createClass({
        handleClick: function(event, item){
            var quoteCode = item.replace(/[^A-Za-z]/g, "");
            this.props.deleteSelected(quoteCode);
            //console.log(quoteCode);
        },

        render: function(){
            return(
                <ul>
                    {
                        this.props.items.map(function(item) {
                            return <li key={item} onClick={this.handleClick}>{item} ✖</li>
                        },this)
                    }
                </ul>
            )
        }
    }
);

var FilteredList = React.createClass({
    filterList: function(event){
        var updatedList = this.state.initialItems;
        updatedList = updatedList.filter(function(item){
            return item.search(event.target.value.toUpperCase()) !== -1;
        });

        this.setState({searchKeyword: event.target.value.toUpperCase(), items: updatedList});
    },

    getInitialState: function(){
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
            startDate: "2015-03-03"
        }
    },

    componentWillMount: function(){
        this.setState({items: this.state.initialItems});
    },

    addSelected: function(item){
        var updatedListSI = this.state.selectedItems;
        var updatedListI = this.state.items;

        if (updatedListSI.indexOf(item) == -1){
            updatedListSI.push(item);
            if(updatedListI.indexOf(item) != -1){
                updatedListI.splice(updatedListI.indexOf(item),1);
            }

        }

        this.setState({selectedItems: updatedListSI.sort(), items: updatedListI.sort()} ) ;
    },

    deleteSelected: function(item){
        var updatedListSI = this.state.selectedItems;
        var updatedListI = this.state.items;

        updatedListSI.splice(updatedListSI.indexOf(item),1);
        if(item.search(this.state.searchKeyword) != -1){
            updatedListI.push(item);
        }

        this.setState({selectedItems: updatedListSI.sort(), items: updatedListI.sort()});
    },

    handleKeyPress: function(event){
        //todo
        if(event.key == "Enter"){
            this.state.items.forEach(function(item){
                console.log(item);
            });
        }
    },

    render: function(){
        return (
            <div>
                <div className="filter-list">
                    <input type="text" placeholder="Search" onKeyPress={this.handleKeyPress} onChange={this.filterList}/>
                    <Calendar date={'2015-03-03'} format="YYYY-MM-DD" />
                    <div className="lists">
                        <div className="selected-list">
                            <Selected deleteSelected = {this.deleteSelected}items = {this.state.selectedItems}/>
                        </div>
                        <List addSelected = {this.addSelected} items={this.state.items}/>
                    </div>
                </div>
            </div>
        );
    }
});



ReactDOM.render(<FilteredList/>, document.getElementById('search-box'));
