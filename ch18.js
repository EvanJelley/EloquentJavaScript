fetch("https://www.wikipedia.org/").then(response => {
    console.log(response.url);
    console.log(response.type);
    console.log(response.status);
    console.log(response.headers.get("Content-Type"));
    response.text().then(text => console.log(text));
})


// Exercise 1
fetch("https://eloquentjavascript.net/author", {headers: {Accept: "text/plain"}}).then(response => {
    console.log(response.status);
    console.log(response.headers.get("Content-Type"));
    response.text().then(text => console.log(text));
});

fetch("https://eloquentjavascript.net/author", {headers: {Accept: "text/html"}}).then(response => {
    console.log(response.status);
    console.log(response.headers.get("Content-Type"));
    response.text().then(text => console.log(text));
});

fetch("https://eloquentjavascript.net/author", {headers: {Accept: "application/json"}}).then(response => {
    console.log(response.status);
    console.log(response.headers.get("Content-Type"));
    response.text().then(text => console.log(text));
});


fetch("https://eloquentjavascript.net/author", {headers: {Accept: "application/rainbows+unicorns"}}).then(response => {
    console.log(response.status);
    console.log(response.headers.get("Content-Type"));
    response.text().then(text => console.log(text));
})