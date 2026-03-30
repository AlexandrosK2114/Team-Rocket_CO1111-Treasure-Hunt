let testPairs=[
    {n:1,expected:1},
    {n:3,expected:3},
    {n:5,expected:5},
    {n:7,expected:7},
    {n:10,expected:10},
];

function test(){

    for(i in testPairs){
        let pair=testPairs[i];
        let input=pair.n;
        let ex=pair.expected;
        listHunts(input,false,ex);


    }
}

function listHunts(Input,userInput,expected){

    if(Input<0){
        alert("Invalid Number");
        return;
    }

    let URL="https://codecyprus.org/th/test-api/list?number-of-ths="+String(Input);

    let retrievedHunts

    fetch(URL)
        .then(response => response.json()) // Parse JSON text to JavaScript object
        .then(object => {

            if(object.status==="OK"){

                let arr=object.treasureHunts;
                retrievedHunts=arr.length;

                if(userInput){

                    let list=document.getElementById("huntList");
                    let listItems=""
                    for(let i=0; i<retrievedHunts; i++)
                        listItems+="<li>"+arr[i].name+"</li>";
                    list.innerHTML=listItems;
                }

                else {
                    let row = "<tr>\n" +
                        "<td>" + Input + "</td>" +
                        "<td>" + expected + "</td>" +
                        "<td>" + retrievedHunts + "</td>" +
                        "<td><img src='" + (expected === retrievedHunts ? "✅" : "❌") + "' alt='Success or failed icon'/></td>\n" +
                        "<td><ol>";

                    for (let i = 0; i < retrievedHunts; i++) {
                        row += "<li>" + arr[i].name + "</li>";
                    }

                    row += "</ol></td></tr>"

                    document.getElementById("unitTest").innerHTML += row;
                }
            }
            else alert("ERROR");
        })
}

test();