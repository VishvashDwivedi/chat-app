const generatemsg = function(username,text){

    return {
        username,
        text,
        createdAt: new Date().getTime()
    }

}

const generatelocationmsg = function(username,url){
    return {
        username,
        url,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generatemsg,
    generatelocationmsg
}