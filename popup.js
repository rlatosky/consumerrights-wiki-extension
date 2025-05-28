
browser.tabs.query({active: true, currentWindow: true})
  .then(tabs => {
    for (const tab of tabs) {
      console.log(tab.title);
      console.log(tab.url);
      var hostname = new URL(tab.url).hostname;
      var pathname = new URL(tab.url).pathname;
      console.log(pathname);
      const crwiki = "https://consumerrights.wiki/index.php?search=";
      const crwiki_options = "&title=Special%3ASearch&profile=advanced&fulltext=1&ns0=1&ns14=1"
      var regex_two = /(\..*){2,}/; // Check if website contains two dots
      var regex_one = /(\..*){1,}/; // Check if website contains two dots
      console.log(regex_two.test(hostname));
      console.log(hostname.includes("www."));
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

    }
  });
