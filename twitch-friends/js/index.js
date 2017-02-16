//A twitch channel object

function TwitchChannel(name, renderCb) {
  this.name = name;
  this.render = renderCb;
  getTwitch("/channels/" + name, this.setLogo.bind(this));
  getTwitch("/streams/" + name, this.setStatus.bind(this));
}

//Set the channels logo from ajax data
TwitchChannel.prototype.setLogo = function(data) {
  this.logo = data.logo;
  this.render();
}

//Set the channels status from ajax data
TwitchChannel.prototype.setStatus = function(data) {
  if (data.stream) {
    this.status = data.stream.game;
    this.text = data.stream.game;
  }
  else if (!data) {
    this.status = "Offline";
    this.text = "Not Found";
  }
  else {
    this.status = "Offline";
    this.text = "Offline";
  }
  this.render();
}

//Return innerHTML for this channel
TwitchChannel.prototype.getListItem = function() {
  var url = "https://www.twitch.tv/" + this.name;
  var mylogo;
  if (this.logo == null) mylogo = "https://static-cdn.jtvnw.net/jtv-static/404_preview-300x300.png";
  else mylogo = this.logo;
  return (
    "<a href='" + url + "'>" +
      "<div class='channel-container " + this.status + "'>" +
      "<img class='circle logo' src='" + mylogo + "'>" +
      "<h5>" + this.name + "</h5>" +
      "<p class=''>" + this.text + "</p>" +
      "</div>" +
      "</a>"
  );
}

//Channel List with twitch channels
function ChannelList(names) {


  //Filter for search
  this.filter = "";

  //Setter for the filter
  this.setFilter = function(filter) {
    this.filter = filter;
    this.renderList();
  }

  //Render the channel list to #channel-list
  this.renderList = function() {
    this.listSort();
    var html = "";
    var filtered = this.channels.filter(function(chan) {
      return chan.name.search(this.filter) !== -1;
    }, this);

    filtered.forEach(function(chan) {
      html += chan.getListItem();
    });

    $('#channel-list').html(html);
  };

  //An array containing twitch channel objects
  this.channels = names.map(function(name) {
    return new TwitchChannel(name, this.renderList.bind(this));
  }, this);

  //Sort the channel list alphebetically and bubble "Online" to the top
  this.listSort = function() {
    this.channels.sort(function(a, b) {
      if (a.status == b.status) {
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        else if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
      }
      else {
        if (a.status == "Offline" && b.status !== "Offline") return 1;
        else if (a.status !== "Offline" && b.status == "Offline") return -1;
      }
    });
  }
}

$(document).ready(function() {
  //Create a channel list
  var channels = new ChannelList(following);

  //Bind the search functionality to filter channels
  $('#search-input').on('input', function() {
    channels.setFilter($('#search-input').val());
  });

  //Render the channel list
  channels.renderList();

});

var following = ["yuuie", "seagull", "comster404", "brunofin", "2GGaming", "Peeve", "VGBootCamp", "freecodecamp", "storbeck", "terakilobyte", "habathcx", "RobotCaleb", "thomasballinger", "noobs2ninjas", "beohoff", "OMGitsfirefoxx", "ESL_SC2"]

//Ajax request for a twitch stream
function getTwitch(url, cb) {
  $.ajax({
    url: "https://api.twitch.tv/kraken" + url,
    headers: {
   'Client-ID': 'tjpfpk6agtqxl69i81hj5ocqgjgc6h'
    },
    data: {
      accept: 'application/vnd.twitchtv.v3+json',
    },
    success: function(x) {
      cb(x);
    },
    error: function(x) {
      cb(false);
    }
  });
}
