var Quote;
var Author;

$(document).ready(function() {

  // Ajax request for a quote
  getQuote();

  // Add functionality to the refresh quote button
  $("#refresh").on('click', function() {
    $('#yoda-img').addClass('hide');
    $('#refresh>i').addClass('spinner');
    getQuote();
  });

  // Add functionality to the Yoda button
  $("#yoda").on('click', function() {
    $('#yoda>i').addClass('spinner');
    //Ajax request to turn quote into a yoda quote
    yodaQuote(Quote);
  });

});

function setQuote(quote) {
  Quote = quote;
  $("#quote").html(Quote);
}

function setAuthor(author) {
  Author = "- " + author;
  $("#author").html(Author);
}

//Return a random famous quote
function getQuote() {
  $.ajax({
    headers: {
      "X-Mashape-Key": "yXti5hGnllmshv5ml6Nzj2bXBGN9p1It0icjsn5FFZhmASj5qR",
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    url: 'https://andruxnet-random-famous-quotes.p.mashape.com/?cat=movies',
    success: function(response) {
      var r = JSON.parse(response);
      setQuote(r.quote);
      setAuthor(r.author);
      $('#refresh>i').removeClass('spinner');
      setTwitter();
    }
  });
}

//Return a yoda-ized version of quote
function yodaQuote(quote) {
  $.ajax({
    headers: {
      "X-Mashape-Key": "yXti5hGnllmshv5ml6Nzj2bXBGN9p1It0icjsn5FFZhmASj5qR",
      Accept: "text/plain"
    },
    url: 'https://yoda.p.mashape.com/yoda?sentence=' + quote,
    success: function(response) {
      setQuote(response);
      setAuthor("Yoda");
      $('#yoda-img').removeClass('hide');
      $('#yoda>i').removeClass('spinner');
      setTwitter("yoda");

    }
  });
}

//Set the URL for the #tweet button the current quote data
function setTwitter(text) {
  $('#twitter').attr('href', 'https://twitter.com/intent/tweet?hashtags=' +text+ '&related=freecodecamp&text=' + encodeURIComponent('"' + Quote + '" ' + Author));
  $('#twitter').on('click', function() {
    openURL('https://twitter.com/intent/tweet?hashtags=' +text+ '&related=freecodecamp&text=' + encodeURIComponent('"' + Quote + '" ' + Author));
  });
}
