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

        this.setState({searchKeyword: event.target.value.toUpperCase()});
        this.setState({items: updatedList});
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
                "XOM",
                "DJI"
            ],
            items: [],
            selectedItems: [],
            searchKeyword: ""
        }
    },

    componentWillMount: function(){
        this.setState({items: this.state.initialItems});
    },

    addSelected: function(item){
        var updatedListSI = this.state.selectedItems;
        var updatedListII = this.state.initialItems;
        var updatedListI = this.state.items;

        if (updatedListSI.indexOf(item) == -1){
            updatedListSI.push(item);
            updatedListII.splice(updatedListII.indexOf(item),1);
            updatedListI.splice(updatedListI.indexOf(item),1);
        }
        //console.log(this.state.selectedItems)

        this.setState({selectedItems: updatedListSI.sort()} ) ;
        this.setState({initialItems: updatedListII.sort()} ) ;
        this.setState({items: updatedListI.sort()} ) ;
    },

    deleteSelected: function(item){
        var updatedListSI = this.state.selectedItems;
        var updatedListII = this.state.initialItems;
        var updatedListI = this.state.items;

        updatedListII.push(item);
        updatedListSI.splice(updatedListSI.indexOf(item),1);
        if(item.search(this.state.searchKeyword) != -1){
            updatedListI.push(item);
        }
        this.setState({selectedItems: updatedListSI.sort()});
        this.setState({initialItems: updatedListII.sort()} ) ;
        this.setState({items: updatedListI.sort()} ) ;
    },

    handleKeyPress: function(event){
        //todo
        console.log("Key pressed");
    },

    render: function(){
        return (
            <div>
                <div className="filter-list">
                    <input type="text" placeholder="Search" onKeyPress={this.handleKeyPress} onChange={this.filterList}/>
                    <div className="selected-list">
                        <Selected deleteSelected = {this.deleteSelected}items = {this.state.selectedItems}/>
                    </div>
                    <List addSelected = {this.addSelected} items={this.state.items}/>
                </div>
            </div>
        );
    }
});


ReactDOM.render(<FilteredList/>, document.getElementById('search-box'));
