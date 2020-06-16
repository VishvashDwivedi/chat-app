const socket = io();

// Elements 
const $messageForm = document.querySelector("form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationButton = document.querySelector(".button");
const $messages = document.querySelector("#messages");
const messagetemplate = document.querySelector("#message-template").innerHTML;
const loctemp = document.querySelector("#loc-temp").innerHTML;
// const sidebar = document.querySelector("#sidebar");
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;



// Query
const { username , room } = Qs.parse(location.search, {  ignoreQueryPrefix:true  })




const autoScroll = function(){

    const $newmsg = $messages.lastElementChild;

    const newmsgstyles = getComputedStyle($newmsg);
    console.log(newmsgstyles.marginBottom);
    const newmsgmargin = parseInt(newmsgstyles.marginBottom);
    const newmsgheight = $newmsg.offsetHeight + newmsgmargin;

    const visibleheight = $messages.offsetHeight;
    const containerheight = $messages.scrollHeight;

    const scrolloffSet = $messages.scrollTop + visibleheight;

    if((containerheight - newmsgheight) <= scrolloffSet){
        $messages.scrollTop = $messages.scrollHeight;
    }
}


socket.on("message", (val) => { 

    const html = Mustache.render(messagetemplate,{
        username:val.username,
        message:val.text,
        createdAt:moment(val.createdAt).format("h:mm: a")
    });
    $messages.insertAdjacentHTML("beforeend",html);
    autoScroll();
});


$messageForm.addEventListener("submit", (e) => {

    e.preventDefault();
    $messageFormButton.setAttribute("disabled","disabled");
    
    const inp = e.target.elements.message.value;

    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();

    socket.emit("sendmessage",inp, (error) => {
        
        if(error)
            return console.log(error);

        console.log("Message Delivered !");
    });

});


$sendLocationButton.addEventListener("click", () => {

    if(! navigator.geolocation)
        alert("Does not exist !");

    $sendLocationButton.setAttribute("disabled","disabled");
    
    navigator.geolocation.getCurrentPosition((position) => {

        socket.emit("get_location", {
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
            }, () =>{

                    $sendLocationButton.removeAttribute("disabled");
                    console.log("Location shared !")   
                });
    
    });

});


socket.on("locationmessage", (val) => {

    const html = Mustache.render(loctemp,{
        username:val.username,
        url:val.url,
        createdAt:moment(val.createdAt).format("h:m:s a")
    });

    $messages.insertAdjacentHTML("beforeend",html);
    autoScroll();
});


socket.emit("join", { username , room }, (error) => {

    if(error)
    {
        alert("User is in use !");
        location.href="/";
    }

});


socket.on("roomData", ({  room,users  }) => {

    console.log(room,users);
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    });

    console.log(html);
    document.querySelector("#sidebar").innerHTML= html;

});













// socket.on("countUpdated", (count) => {
//     console.log("The count has been updated to",count);
// });


// function fun(){
    
//     console.log("Clicked");
//     socket.emit("increment");

// };