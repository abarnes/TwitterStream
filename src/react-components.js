var streaming = false;
var oReq;

var TweetRow = React.createClass({
    render: function() {
        return (
            <tr>
                <td>{this.props.user.screen_name}</td>
                <td>{this.props.user.name}</td>
                <td>{this.props.user.url}</td>
                <td>{this.props.user.followers_count}</td>
                <td>{this.props.user.friends_count}</td>
                <td>{this.props.text}</td>
                <td></td>
                <td>{this.props.created_at}</td>
            </tr>
        );
    }
});

var TweetTable = React.createClass({
    render: function() {
        var rows = [];
        this.props.tweets.forEach(function(tweet) {
            //console.log(tweet);
            rows.push(<TweetRow text={tweet.text} user={tweet.user} created_at={tweet.created_at} key={tweet.name} />);
        });
        return (
            <table>
                <thead>
                    <tr>
                        <th>Screen Name</th>
                        <th>Name</th>
                        <th>URL</th>
                        <th>Followers</th>
                        <th>Friends</th>
                        <th>Tweet</th>
                        <th>Action</th>
                        <th>Time (EST)</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        );
    }
});

var SearchBar = React.createClass({
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
            <div id="topbar">
                <form>
                    <input type="text" ref="filterTextInput" value={this.props.filterText} onChange={this.handleChange} />
                </form>

                    <a href="javascript:void(0);" onClick={this.handleStart} id="stream-control" className="standardbutton">Start Stream</a>

                    <div id="topbar-right">
                        <h3>Status: <span>Idle</span></h3>
                        <p id="timer">00:00:00</p>
                    </div>
            </div>
        );
    }
});

var TweetStream = React.createClass({
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
            console.log('Starting Stream');

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
            console.log('Stopping Stream');
            oReq.abort();
        }
    },
    render: function() {
        return (
            <div>
                <SearchBar filterText={this.state.filterText} onUserInput={this.handleUserInput} onStartStop={this.handleStartStop} />
                <TweetTable tweets={this.state.tweets} />
            </div>
        );
    }
});

React.render(<TweetStream />, document.getElementById('root'));