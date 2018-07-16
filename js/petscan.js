/*$('#action-button').click(function() {
    $.ajax({
        url: 'https://api.joind.in/v2.1/talks/10889',
        data: {
            format: 'json'
        },
        error: function() {
            $('#info').html('<p>An error has occurred</p>');
        },
        dataType: 'jsonp',
        success: function(data) {
            var $title = $('<h1>').text(data.talks[0].talk_title);
            var $description = $('<p>').text(data.talks[0].talk_description);
            $('#info')
                .append($title)
                .append($description);
        },
        type: 'GET'
    });
});*/

function escapeHtml(text) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;',
        ' ': '&nbsp;',
        'À': '&Agrave;',
        'Á': '&Aacute;',
        'Â': '&Acirc;',
        'Ã': '&Atilde',
        'Å': '&Aring;',
        'Æ': '&AElig;',
        //...TODO: complete this list
        'ã': '&atilde;',
        'ç': '&ccedil;',
        'ú': '&uacute;'
    };

    return text.replace(/[&<>"'=\/` ÀÁÂÃÅÆãçú]/g, function(m) { return map[m]; });
}

function syntaxHighlight(json) {
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function showResults(language, displayOption, listOfResults) {
    var pages = listOfResults.query.pages;
    console.log(pages);
    if(true) {

        for (var key in pages) {
            var source = "https://" + language + ".wikipedia.org/?curid=" + key;
            var imageString = '';

            if(pages[key].original != null) {
                imageString = '        <img class="card-img-top img-fluid" src="' + pages[key].original.source +
                    '" alt="Main image">\n'
            }


            var code = '<div class="card">\n' + imageString +
                '        <div class="card-block">\n' +
                '            <h4 class="card-title">' + pages[key].title +
                '</h4>\n' +
                '            <p class="card-text"></p>\n' +
                '        </div>\n' +
                '        <div class="card-footer">\n' +
                '            <small class="text-muted">Source: <a href="' + source + '" target="_blank">' + source +
            '</a></small>\n' +
                '        </div>\n' +
                '    </div>';

            var htmlObject = $(code);

            var element = document.getElementById("cardsBox");
            element.insertAdjacentHTML( 'beforeend', code );
            console.log("Key: " + key);
            console.log("Value: " + pages[key]);


        }
    }
}

function queryEachPage(list, displayOption, language, titles, mainImages) {
    var cycles = Math.ceil(list.length/20);

    var elem = document.getElementById("content-box");
    elem.parentNode.removeChild(elem);
    elem = document.getElementById("restricting-box");
    elem.parentNode.removeChild(elem);

    for(i = 0; i < cycles; i++) {
        var concatList = "";
        var lesserNumber = 0;

        if(i < Math.floor(list.length/20)) {
            lesserNumber = 20;
        }
        else {
            lesserNumber = list.length%20;
        }

        for (j = 0; j < lesserNumber; j++) {
            if(j !== 0) {
                concatList += "|";
            }
            concatList += list[i*20+j];
        }

        var images = '';
        if(mainImages) {
            images = 'prop=pageimages&piprop=original&pilicense=any&';
        }

        $.ajax({
            url: 'https://' + language +
            '.wikipedia.org/w/api.php?action=query&format=json&origin=*&redirects=1&' + images +
            'pageids=' + concatList,
            error: function() {
                document.getElementById("errorAlert").style.visibility = "visible";
            },
            success: function(data) {
                //fullinfo.push(data);
                showResults(language, displayOption, data);
                //$('#info')
                //    .append(syntaxHighlight(JSON.stringify(data)))
            },
            type: 'GET'
        });
    }

    //$.when($, fullinfo).done(function(){
    //});

}

$(':submit').click(function(event){
    var currentForm = $('form')[0];
    event.preventDefault(); //Stop default form submission
    var formData = new FormData(currentForm);

    //window.alert(formData.get("category"));

    var language = formData.get('language');
    //var category = escapeHtml(formData.get('category'));
    var category = formData.get('category');
    var depth = '0';
    var combination = 'union';
    var editedAfter = '';
    var format = 'json';

    $.ajax({
        url: 'https://petscan.wmflabs.org/?language=' + language +
                '&project=wikipedia&depth=' + depth +
                '&categories=' + category +
                '&combination=' + combination +
                '&negcats=&ns%5B0%5D=1&larger=&smaller=&minlinks=&maxlinks=&before=&after=' + editedAfter +
                '&max_age=&show_redirects=both&edits%5Bbots%5D=both&edits%5Banons%5D=both&edits%5Bflagged%5D=both&templates_yes=&templates_any=&templates_no=&outlinks_yes=&outlinks_any=&outlinks_no=&links_to_all=&links_to_any=&links_to_no=&sparql=&manual_list=&manual_list_wiki=&pagepile=&wikidata_source_sites=&subpage_filter=either&common_wiki=auto&source_combination=&wikidata_item=no&wikidata_label_language=&wikidata_prop_item_use=&wpiu=any&sitelinks_yes=&sitelinks_any=&sitelinks_no=&min_sitelink_count=&max_sitelink_count=&labels_yes=&cb_labels_yes_l=1&langs_labels_yes=&labels_any=&cb_labels_any_l=1&langs_labels_any=&labels_no=&cb_labels_no_l=1&langs_labels_no=&format=' + format +
                '&output_compatability=catscan&sortby=none&sortorder=ascending&regexp_filter=&min_redlink_count=1&doit=Do%20it%21&interface_language=en&active_tab=tab_output',
        error: function() {
            document.getElementById("errorAlert").style.visibility = "visible";
        },
        success: function(data) {
            var str = JSON.stringify(data, undefined, 4);
            var result = [], m, rx = /"id": (.*?),/g;
            while ((m=rx.exec(str)) !== null) {
                result.push(m[1]);
            }
            queryEachPage(result, 'onpage', language, true, true);
            /*
            $('#info')
                .append(syntaxHighlight(str))
            */
        },
        type: 'GET'
    });
});
