
//------------------------------------------------------------------------------
// search.js
//------------------------------------------------------------------------------

var search_form = document.getElementById("search");
var search_button = document.querySelector("#search button");
var sitemap = {};
var excludes = [];

if (search_button) {
    setupEvent();

// Load sitemap
    var request = new XMLHttpRequest();

    request.addEventListener("load", function() {
        sitemap = JSON.parse(this.responseText);
        //console.log(sitemap);
    });

    request.open("GET", "/js/json-ld.json");
    request.send();
}

/**
 */
function setupEvent() {
    var text = document.querySelector("#search input[name='q']");

    //search_button.addEventListener("click", function(ev) {
    text.addEventListener("input", function(ev) {
        ev.preventDefault();

        if (Object.keys(sitemap).length == 0) {
            console.log("nothing in sitemap yet...");
        }

        var matches = [];
        var str;

        if (str = text.value.trim()) {
            str = str.toLowerCase();

// Scan sitemap for matches
            for (var path in sitemap) {
                var page = sitemap[path];
                page.path = path;

                if (excludes.includes(path)) {
                    continue;
                }

                if (path.indexOf(str) !== -1) {
                    matches.push(page);
                } else if (page.hasOwnProperty("name")
                    && page.name.toLowerCase().indexOf(str) !== -1
                ) {
                    matches.push(page);
                } else if (page.hasOwnProperty("abstract")
                    && page.abstract.toLowerCase().indexOf(str) !== -1
                ) {
                    matches.push(page);
                } else if (page.hasOwnProperty("itemReviewed")
                    && page.itemReviewed.hasOwnProperty("reviewBody")
                    && page.itemReviewed.reviewBody.toLowerCase().indexOf(str)
                        !== -1
                ) {
                    matches.push(page);
                }
            }
        }

// Add results to page
        if (1 || matches.length) {
            //console.log(str);
            insertResults(matches, str);
        }

        ev.preventDefault();
    });
}

/**
 */
function insertResults(results, original_query) {
    //console.log(results);

    var results_el = document.getElementById("results"),
        result;

    if (results_el) {
        while (results_el.hasChildNodes()) {
            results_el.removeChild(results_el.firstChild);
        }
    } else {
        results_el = document.createElement("section");
        //var heading = document.createElement("h2");
        //heading.appendChild(document.createTextNode("Results"));
        //results_el.appendChild(heading);
        results_el.setAttribute("id", "results");
        search_form.parentNode.insertBefore(results_el, search_form.nextSibling);
    }

    if (results.length) {
        var heading = document.createElement("h2");
        heading.appendChild(document.createTextNode("Results"));
        results_el.appendChild(heading);
    }

    for (var i = 0; i < results.length; i++) {
        //var li = document.createElement("li");
        result = results[i];

        var title = result.name;

        if (result["@type"] == "Review"
            && result.hasOwnProperty("itemReviewed")
        ) {
            title = result.itemReviewed.name;
        }

        var pattern = new RegExp("(" + original_query + ")", "i");
        var article = document.createElement("article");
        var a = document.createElement("a");
        a.setAttribute("href", result.path);

        //a.appendChild(document.createTextNode(title));
        a.innerHTML = title.replace(pattern, "<mark>$1</mark>");

        article.appendChild(a);

        if (result["@type"] == "Review"
            && result.hasOwnProperty("itemReviewed")
        ) {
            var p = document.createElement("p");
            var str = results[i].itemReviewed.reviewBody;
            //p.appendChild(document.createTextNode(str));
            p.innerHTML = str.replace(pattern, "<mark>$1</mark>");
            article.appendChild(p);
        } else if (result["@type"] == "WebPage"
            && result.hasOwnProperty("abstract")
        ) {
            var p = document.createElement("p");
            var str = results[i].abstract;
            //p.appendChild(document.createTextNode(str));
            p.innerHTML = str.replace(pattern, "<mark>$1</mark>");

            article.appendChild(p);
        }

        if (results[i].hasOwnProperty("datePublished")) {
            var small = document.createElement("small");
            small.appendChild(document.createTextNode(results[i].datePublished));
            article.appendChild(small);
        }

        results_el.appendChild(article);
    }
}
