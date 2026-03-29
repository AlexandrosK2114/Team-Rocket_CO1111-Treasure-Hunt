//This JavaScript file is used to toggle the social media posts on and off
var showPosts=false;

//Function executed when the toggle is pressed
function togglePosts(){

    let p=document.getElementById("toggleIcon");
    //List the social media posts and change the button icon to a downwards arrow
    if(showPosts){
        document.getElementById("socialMediaPosts").style.display="block";
        p.innerHTML="<span class='material-icons' onClick='togglePosts()'>arrow_drop_down_circle</span>"
        showPosts = false;
    }
    //Delist the posts and change the icon back to a press indicator
    else {
        document.getElementById("socialMediaPosts").style.display="none";
        p.innerHTML="<span class='material-icons' onClick='togglePosts()'>touch_app</span>"
        showPosts=true;
    }

}