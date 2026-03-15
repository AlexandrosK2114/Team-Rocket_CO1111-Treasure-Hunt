let testPairs=[
    {n:1,expected:1},
    {n:3,expected:3},
    {n:5,expected:5},
    {n:7,expected:7},
    {n:10,expected:10},
];

/*function takeInput(){
    let n=document.getElementById("input").value;
    listHunts(n,true);
}*/

function listHunts(n,ex,buildList){

    if(n<0){
        alert("Invalid Number");
        return;
    }

    let URL="https://codecyprus.org/th/test-api/list?number-of-ths="+String(n);
    let cal;

    fetch(URL)
        .then(response => response.json()) // Parse JSON text to JavaScript object
        .then(object => {

            if(object.status==="OK"){

                let arr=object.treasureHunts;
                cal=arr.length;

                /*if(buildList){

                    let list=document.getElementById("huntList");
                    let listItems=""
                    for(let i=0; i<cal; i++)
                        listItems+="<li>"+arr[i].name+"</li>";
                    list.innerHTML=listItems;
                }*/

                let row="<tr>\n" +
                    "<td>" +n+  "</td>" +
                    "<td>" +ex+ "</td>" +
                    "<td>" +cal+ "</td>" +
                    "<td><img src='" + (ex===cal ? 'correct.png' : 'wrong.png') + "' alt='Success or failed icon'/></td>\n"+
                    "<td><ol>";

                for(let i=0; i<cal; i++){
                    row+="<li>"+arr[i].name+"</li>";
                }

                row+="</ol></td></tr>"

                document.getElementById("unitTest").innerHTML+=row;
            }
            else alert("ERROR");
        })
}

function test(){

    let row="";

    for(i in testPairs){
        let pair=testPairs[i];
        let h=pair.n;
        let ex=pair.expected;
        listHunts(h,ex,false);


    }
}
test();