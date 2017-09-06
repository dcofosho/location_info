
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');
    var street = $('#street').val();
    var city = $('#city').val();
    var address= street + ', ' + city;
    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");
    // load streetview
    var streetviewURL = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address;
    $body.append('<img class="bgimg" src="' + streetviewURL + '">');
    // NYT Ajax request
    var nytURL = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q='+ city + '&sort=newest&api-key=a82c8a555ee9494fa331aa759b3f1f1b';
    $.getJSON(nytURL, function(data){
        $nytHeaderElem.text('New York Times Articles About ' + city);
        articles = data.response.docs;
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">'+
                '<a href="'+article.web_url+'">'+article.headline.main+
                '</a>'+
                '<p>' + article.snippet + '</p>' +
                '</li>');
        }
    }).error(function(e){
        $nytHeaderElem.text('No articles available right now');
    });
    //Wiki Ajax request
    var wikiURL = 'http://en.wikipedia.org/w/api.php?action=opensearch&search='+city+'&format=json&callback=wikiCallback';
    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000);
    $.ajax({
        url: wikiURL,
        dataType: "jsonp",
        //jsonp: "callback"
        success: function(response){
            var articleList = response[1];
            for (var i = 0; i<articleList.length; i++){
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="'+url+'">'+articleStr+'</li>');
            };
            clearTimeout(wikiRequestTimeout);
        }
    });
    return false;
};

$('#form-container').submit(loadData);
