var TweetRow = React.createClass({displayName: "TweetRow",
    render: function() {
        return (
            React.createElement("tr", null, 
                React.createElement("td", null, name), 
                React.createElement("td", null, this.props.product.price)
            )
        );
    }
});

var TweetTable = React.createClass({displayName: "TweetTable",
    render: function() {
        var rows = [];
        rows.push(React.createElement(TweetRow, {text: text, user: user}));

        return (
            React.createElement("table", null, 
                React.createElement("thead", null, 
                    React.createElement("tr", null, 
                        React.createElement("th", null, "Name"), 
                        React.createElement("th", null, "Price")
                    )
                ), 
                React.createElement("tbody", null, rows)
            )
        );
    }
});

var SearchBar = React.createClass({displayName: "SearchBar",
    render: function() {
        return (
            React.createElement("div", {id: "topbar"}, 
                React.createElement("input", {type: "text", value: "shopify,ecwid,bigcommerce,volusion,vendevor,ecommerce", id: "keywords"}), 

                    React.createElement("a", {href: "javascript:void(0);", onclick: "start_stream()", id: "stream-control", class: "standardbutton"}, "Start Stream"), 

                    React.createElement("div", {id: "topbar-right"}, 
                        React.createElement("h3", null, "Status: ", React.createElement("span", null, "Idle")), 
                        React.createElement("p", {id: "timer"}, "00:00:00")
                    )
            )
        );
    }
});

var TweetStream = React.createClass({displayName: "TweetStream",
    render: function() {
        return (
            React.createElement("div", null, 
                React.createElement(SearchBar, null), 
                React.createElement(TweetTable, {tweets: this.props.tweets})
            )
            );
    }
});


var PRODUCTS = [
    {text: 'Sporting Goods', user: {screen_name:'tim56',name:'tim',url:'http://google.com',followers_count:14,friends_count:34}},
    {text: 'Sporting Goods', user: {screen_name:'tim56',name:'tim',url:'http://google.com',followers_count:14,friends_count:34}},
    {text: 'Sporting Goods', user: {screen_name:'tim56',name:'tim',url:'http://google.com',followers_count:14,friends_count:34}},
    {text: 'Sporting Goods', user: {screen_name:'tim56',name:'tim',url:'http://google.com',followers_count:14,friends_count:34}},
    {text: 'Sporting Goods', user: {screen_name:'tim56',name:'tim',url:'http://google.com',followers_count:14,friends_count:34}},
    {text: 'Sporting Goods', user: {screen_name:'tim56',name:'tim',url:'http://google.com',followers_count:14,friends_count:34}}
];

React.render(React.createElement(TweetStream, {tweets: PRODUCTS}), document.body);