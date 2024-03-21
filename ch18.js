fetch("https://www.wikipedia.org/").then(response => {
    console.log(response.url);
    console.log(response.type);
    console.log(response.status);
    console.log(response.headers.get("Content-Type"));
    response.text().then(text => console.log(text));
})