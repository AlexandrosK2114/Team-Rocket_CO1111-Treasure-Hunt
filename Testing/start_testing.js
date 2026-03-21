function startTesting(input) {


    let Url="https://codecyprus.org/th/test-api/start?player="+input;

    fetch(Url)
        .then(response => response.json()) // Parse JSON text to JavaScript object
        .then(object => {
            return object;

        })
}

//fixing