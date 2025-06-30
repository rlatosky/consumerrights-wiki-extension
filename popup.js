
function crwpagetext(input) {
    if (input == null) {
        return null;
    }
    const length = 5000;
    fetch(`https://corsproxy.io/?https://consumerrights.wiki/api.php?action=parse&prop=wikitext&section=1&page=${input}&format=json`)
    .then((response) => response.json())
    .then(data => {
        if (data.parse == null) {
            return null;
        } else {
            console.log(`Information found using keywords() "${input}":`);
            const wikitext = data.parse.wikitext['*'].length > length
                             ? data.parse.wikitext['*'].slice(0, length).toString() + '...' : data.parse.wikitext['*'];
            document.getElementById("incfound").innerText = `Information Found! (${input})`;
            document.getElementById("incfound").style.display = "block";
            if (wikitext == null) {
                return null;
            } else {
                document.getElementById("quickviewtab").innerText = wikitext;
                document.getElementById("quickviewtab").style.display = "block";
                return;
            }
        }
    })
    .catch(error => {
        console.error(`Error fetching wiki content using keyword(s) "${input}":`, error);
        document.getElementById('quickviewtab').innerText = 'Failed to load content.';
        return null;
    });
}

function crwgetpgtitle(input) {
    if (input == null) {
        return null;
    }
    fetch(`https://corsproxy.io/?https://consumerrights.wiki/api.php?action=opensearch&search=${input}&format=json`)
    .then((response) => response.json())
    .then(data => {
        if (data == null) {
            return null;
        } else {
            const pageTitle = data?.[1]?.[0]; // API returns the page title
            //console.error(`Error fetching wiki content using keyword(s) "${pageTitle}":`, error);
            document.getElementById("quickviewtab").style.display = "block";
            if (pageTitle != null) {
                crwpagetext(pageTitle);
            }
            return;
        }
    })
    .catch(error => {
        console.error(`Error searching the wiki:`, error);
        document.getElementById('quickviewtab').innerText = 'Failed to load content.';
        return null;
    });
}

browser.tabs.query({active: true, currentWindow: true})
.then(tabs => {

    for (const tab of tabs) {
        //      console.log(tab.title);
        //      console.log(tab.url);
        var hostname = new URL(tab.url).hostname;
        var pathname = new URL(tab.url).pathname;

        //      console.log(pathname);
        const crwiki = "https://consumerrights.wiki/index.php?search=";
        const crwiki_options = "&title=Special%3ASearch&profile=advanced&fulltext=1&ns0=1&ns14=1";
        var regex_two = /(\..*){2,}/; // Check if website contains two dots
        var regex_one = /(\..*){1,}/; // Check if website contains one dot
        //      console.log(regex_one.test(hostname));
        //      console.log(regex_two.test(hostname));
        //      console.log(hostname.includes("www."));
        if (regex_two.test(hostname)) {
            document.getElementById("activetab").style.display = "block";
            document.getElementById("error").style.display = "none";
            hostname = hostname.split('.')[1];
            document.getElementById("search").innerText = hostname;
            document.getElementById("search").href = crwiki.concat(hostname).concat(crwiki_options);
        } else if (regex_one.test(hostname)) {
            document.getElementById("activetab").style.display = "block";
            document.getElementById("error").style.display = "none";
            hostname = hostname.split('.')[0];
            document.getElementById("search").innerText = hostname;
            document.getElementById("search").href = crwiki.concat(hostname).concat(crwiki_options);
        } else {
            document.getElementById("activetab").style.display = "none";
            document.getElementById("error").style.display = "block";
        }
        document.getElementById("incfound").style.display = "none";

        queries = [ tab.title.split(/\s+/)[0],
                    tab.title.split(' | ')[0],
                    tab.title.split(' | ')[1],
                    tab.title.split(' - ')[0],
                    hostname,
                    hostname.toUpperCase()
                    ];

        for (const query of queries) {
            let result = crwgetpgtitle(query);
            if (result == null) {
                continue;
            } else {
                break;
            }
        }

    }
});
