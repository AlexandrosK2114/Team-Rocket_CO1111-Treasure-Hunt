var showPosts=false;

function togglePosts(){

    let p=document.getElementById("toggleIcon");
    if(showPosts){
        document.getElementById("socialMediaPosts").style.display="block";
        p.innerHTML="<span class='material-icons' onClick='togglePosts()'>arrow_drop_down_circle</span>"
        showPosts = false;
    } else {
        document.getElementById("socialMediaPosts").style.display="none";
        p.innerHTML="<span class='material-icons' onClick='togglePosts()'>adjust</span>"
        showPosts=true;
    }

}