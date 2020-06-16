const users = [];

const getcamel = (str) => {

    if(str.includes(" "))        
    {
        var l = str.split(" ");
        l.forEach((obj) => {
            obj[0] = obj[0].toUpperCase();
        });

        return l.join(" ");
    }
    str[0] = str[0].toUpperCase();
    return str;
}

const addUser = ({ id , username , room }) => {

    username = getcamel(username.trim());
    room = getcamel(room.trim());

    if(!username || !room)
        return {    error:"Please enter valid credentials"    }

    const duplicate = users.find((user) => {
        return user.username === username && user.room === room;
    });

    if(duplicate)
        return {  error:"User exists !"  };

    const user = {  id,username,room  };
    users.push(user);
    return { user };

}


const removeUser = (id) => {

    const index = users.findIndex((user) => user.id === id );

    if(index !== -1){
        return users.splice(index, 1)[0];
    }

}


const getUser = (id) => {

    const user = users.find((user) => user.id === id);
    if(!user)   return undefined;

    return user;

}


const getroomUsers = (room) => {

    room = getcamel(room.trim());
    const list = users.filter((user) => {
        return room == user.room;
    });

    return list;

}




// console.log(addUser({  id:1,username:"Shri Ram",room:"Kanpur"  }));
// console.log(addUser({  id:1,username:"Shri Ram",room:"Kanpur"  }));
// console.log(addUser({  id:2,username:"Bajrang Bali",room:"Kanpur"  }));
// console.log(addUser({  id:3,username:"Baba Shiv",room:"Kanpur"  }));
// console.log(addUser({  id:4,username:"Hare Krishna",room:"Mumbai"  }));

// console.log(getUser(3));
// console.log(users);
// console.log(getroomUsers("Kanpur"));

module.exports = {

    addUser,
    removeUser,
    getUser,
    getroomUsers

};

