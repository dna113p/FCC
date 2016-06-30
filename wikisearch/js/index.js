$(window).ready(function() {
  $('#search').on('submit', function(event) {
    $('#results-container').hide("fast");
    initSearch($('#search-input').val());
    return false;
  });
});

function initSearch(terms) {
  $.ajax({
    url: '//en.wikipedia.org/w/api.php',
    data: {
      action: 'query',
      list: 'search',
      srsearch: terms,
      format: 'json'
    },
    dataType: 'jsonp',
    success: function(x) {
      displayResults(x.query.search);
    }
  });
}

function displayResults(items) {
  var html = "";
  items.forEach(function(item) {
    html += wikiListItem(item.title, item.snippet);
  });
  $('#results-container').html(html);
  $('#results-container').show("slow");
  $('#app-container').css('top', "1%");
}

function wikiListItem(title, snippet) {
  var url = "http://en.wikipedia.org/wiki/" + title.split(' ').join('_');

  return (
    "<a href='" + url + "' target='_none'>" +
      "<div class='result'>" +
      "<h6 class='blue-grey-text text-darken-4 li-header'>" + title + "</h6>" +
      "<h6 class='blue-grey-text text-darken-4'>" + snippet + "</h6>" +
      "</div>" +
      "</a>"
  );
}
