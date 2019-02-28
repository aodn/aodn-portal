
$(document).ready(function() {

    var proxyUrl = 'proxy?url=';

    // todo get them from landing/getFacetsAsJson
    var treeFacets = [
        {
            text: "Physical-Water",
            nodes: [
                {
                    text: "Temperature",
                    nodes: [
                        {
                            text: "Temperature of the water body"
                        },
                        {
                            text: "Skin temperature of the water body"
                        }
                    ]
                },
                {
                    text: "Salinity"
                }
            ]
        },
        {
            text: "Physical-Atmosphere",
            nodes: [
                {
                    text: "Air-Sea fluxes (not on Wikipedia)",
                    nodes: [
                        {
                            text: "Net heat flux"
                        },
                        {
                            text: "Net longwave heat flux"
                        },
                        {
                            text: "Net mass flux"
                        },
                        {
                            text: "Net shortwave heat flux"
                        }
                    ]
                },
                {
                    text: "Humidity"
                }
            ]
        },
        {
            text: "Turbidity"
        },
        {
            text: "Temperature"
        }
    ];


    $('#dataFinderTree').treeview({
        data: treeFacets,
        backColor: '#1d6e9ead',
        onhoverColor: '#0d3a57',
        showBorder: false,
        collapseAll: { silent: true },

        onNodeSelected: function(event, data) {
            updatePageInfo(data.text);
        }
    });
    $('#dataFinderTree').treeview('collapseAll', { silent: true });

    function updatePageInfo(facet) {

        updateGoButton(facet);

        $.ajax({
            type: "GET",
            url:  proxyUrl + encodeURIComponent("https://en.wikipedia.org/w/api.php?action=opensearch&search=" + encodeURIComponent(facet)),
            contentType: "application/json; charset=utf-8",
            async: false,
            dataType: "json",
            success: function (data, textStatus, jqXHR) {
                $.each(data, function (i, item) {
                    if (i == 1) {
                        var searchData = item[0];
                        if (searchData) {
                            WikipediaAPIGetContent(searchData);
                        }
                        else {
                            updateFacetGlossary();
                        }

                    }
                });
            },
            error: function (errorMessage) {
            }
        });
    }

    function updateGoButton(facet) {

        var searchTerm = (facet) ? "search?facet=" + facet : "";
        var facetText = (facet) ?  facet : "Ocean";
        var buttonText = "'" + facetText + "'";

        $('#goButton').text(`Get ${buttonText} Data Now`);
        $('#goButton').attr("href", searchTerm);
    }

    function WikipediaAPIGetContent(searchTerm) {
        $.ajax({
            type: "GET",
            url: proxyUrl + encodeURIComponent("https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + searchTerm ),
            contentType: "application/json; charset=utf-8",
            async: false,
            dataType: "json",
            success: function (data, textStatus, jqXHR) {
                updateFacetGlossary(data, searchTerm);
            },
            error: function () {
                updateFacetGlossary();
            }
        });
    }

    function updateFacetGlossary(data, searchTerm) {
        if (data) {
            var markup = data.parse.text["*"];

            var blurb = $('<div></div>').html(markup);

            blurb.prepend('<h5>Results from Wikipedia</h5>');

            // remove links as they will not work
            blurb.find('a').each(function () {
                $(this).replaceWith($(this).html());
            });

            // remove unwanted items
            blurb.find('sup').remove();
            blurb.find('img').remove();
            blurb.find('table').remove();
            blurb.find('div.thumbcaption').remove();
            blurb.find('div.navigation-not-searchable').remove();
            blurb.find('div.mv-references-wrap').remove();
            blurb.find('.mw-ext-cite-error').remove();

            $('#facetGlossary').html(blurb.find('p'));
            var headerText = '<h4 ><i><b><i class="fa fa-quote-left" aria-hidden="true"></i>' + searchTerm + '<i class="fa fa-quote-right" aria-hidden="true"></i></b> from Wikipedia</i></h4>';
            $('#facetGlossary').prepend(headerText).removeClass("hidden");
        }
        else {
            $('#facetGlossary').html("").addClass("hidden");
        }

    }




});
