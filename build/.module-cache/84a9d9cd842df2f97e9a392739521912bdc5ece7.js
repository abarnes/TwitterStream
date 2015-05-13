var TweetRow = React.createClass({displayName: "TweetRow",
    render: function() {
        return (
            React.createElement("tr", null, 
                React.createElement("td", null, this.props.screen_name), 
                React.createElement("td", null, this.props.name), 
                React.createElement("td", null, this.props.user.url), 
                React.createElement("td", null, this.props.user.followers), 
                React.createElement("td", null, this.props.user.friends), 
                React.createElement("td", null, this.props.text), 
                React.createElement("td", null), 
                React.createElement("td", null, this.props.created_at)
            )
        );
    }
});

var TweetTable = React.createClass({displayName: "TweetTable",
    render: function() {
        var rows = [];
        this.props.tweets.forEach(function(tweet) {
            rows.push(React.createElement(TweetRow, {text: tweet.text, user: tweet.user, created_at: tweet.created_at}));
        });
        return (
            React.createElement("table", null, 
                React.createElement("thead", null, 
                    React.createElement("tr", null, 
                        React.createElement("th", null, "Screen Name"), 
                        React.createElement("th", null, "Name"), 
                        React.createElement("th", null, "URL"), 
                        React.createElement("th", null, "Followers"), 
                        React.createElement("th", null, "Friends"), 
                        React.createElement("th", null, "Tweet"), 
                        React.createElement("th", null, "Action"), 
                        React.createElement("th", null, "Time (EST)")
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
    {text: 'Sporting Goods', created_at:'July 6 2014 4:35 pm',user: {screen_name:'tim56',name:'tim',url:'http://google.com',followers_count:14,friends_count:34}},
    {text: 'Sporting Goods', created_at:'July 6 2014 4:35 pm',user: {screen_name:'tim56',name:'tim',url:'http://google.com',followers_count:14,friends_count:34}},
    {text: 'Sporting Goods', created_at:'July 6 2014 4:35 pm',user: {screen_name:'tim56',name:'tim',url:'http://google.com',followers_count:14,friends_count:34}},
    {text: 'Sporting Goods', created_at:'July 6 2014 4:35 pm',user: {screen_name:'tim56',name:'tim',url:'http://google.com',followers_count:14,friends_count:34}},
    {text: 'Sporting Goods', created_at:'July 6 2014 4:35 pm',user: {screen_name:'tim56',name:'tim',url:'http://google.com',followers_count:14,friends_count:34}},
    {text: 'Sporting Goods', created_at:'July 6 2014 4:35 pm',user: {screen_name:'tim56',name:'tim',url:'http://google.com',followers_count:14,friends_count:34}}
];

React.render(React.createElement(TweetStream, {tweets: PRODUCTS}), document.getElementById('root'));