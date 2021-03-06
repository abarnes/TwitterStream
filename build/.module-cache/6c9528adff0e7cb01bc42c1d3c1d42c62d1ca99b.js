var streaming = false;
var oReq;

var TweetRow = React.createClass({displayName: "TweetRow",
    render: function() {
        return (
            React.createElement("tr", null, 
                React.createElement("td", null, this.props.user.screen_name), 
                React.createElement("td", null, this.props.user.name), 
                React.createElement("td", null, this.props.user.url), 
                React.createElement("td", null, this.props.user.followers_count), 
                React.createElement("td", null, this.props.user.friends_count), 
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
            //console.log(tweet);
            rows.push(React.createElement(TweetRow, {text: tweet.text, user: tweet.user, created_at: tweet.created_at, key: tweet.name}));
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
    handleChange: function() {
        this.props.onUserInput(
            this.refs.filterTextInput.getDOMNode().value
        );
    },
    handleStart: function() {
        this.props.onStartStop();
    },
    render: function() {
        return (
            React.createElement("div", {id: "topbar"}, 
                React.createElement("form", null, 
                    React.createElement("input", {type: "text", ref: "filterTextInput", value: this.props.filterText, onChange: this.handleChange})
                ), 

                    React.createElement("a", {href: "javascript:void(0);", onClick: this.handleStart, id: "stream-control", className: "standardbutton"}, "Start Stream"), 

                    React.createElement("div", {id: "topbar-right"}, 
                        React.createElement("h3", null, "Status: ", React.createElement("span", null, "Idle")), 
                        React.createElement("p", {id: "timer"}, "00:00:00")
                    )
            )
        );
    }
});

var TweetStream = React.createClass({displayName: "TweetStream",
    getInitialState: function() {
        return {
            filterText: 'shopify,ecwid,bigcommerce,volusion,vendevor,ecommerce',
            tweets: []
        };
    },
    handleUserInput: function(filterText) {
        this.setState({
            filterText: filterText
        });
    },
    handleStartStop: function() {
        if (!streaming) {
            var rct = this;
            oReq = new XMLHttpRequest();
            oReq.onreadystatechange = function()
            {
                if ( oReq.readyState > 2)
                {
                    if (oReq.responseText.substr(0,5)!="ERROR") {
                        var text = eval('([' + oReq.responseText.substr(0,oReq.responseText.length-1) + '])');
                        rct.setState({
                            tweets:text
                        });
                    } else {
                        alert(oReq.responseText);
                    }
                }
            }
            oReq.open("POST", "../php/stream.php", true);
            oReq.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            oReq.send("keywords="+encodeURIComponent(rct.state.filterText));
        } else {
            oReq.abort();
        }
    },
    render: function() {
        return (
            React.createElement("div", null, 
                React.createElement(SearchBar, {filterText: this.state.filterText, onUserInput: this.handleUserInput, onStartStop: this.handleStartStop}), 
                React.createElement(TweetTable, {tweets: this.state.tweets})
            )
        );
    }
});

React.render(React.createElement(TweetStream, null), document.getElementById('root'));