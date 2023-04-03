const users = [];

//add User

const addUser = ({ id, Username, room }) => {
    //Clean the data
    Username = Username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    //Validate the data

    if (!Username || !room) {
        return {
            error: 'Username and room are required'
        }
    }

    //Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.Username === Username;
    })

    //Validate Username

    if (existingUser) {
        return {
            error: 'Username is in use'
        }

    }

    //Store User

    const user = { id, Username, room };
    users.push(user);
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id == id;
    })

    if (index != -1) {
        return users.splice(index, 1)[0];
    }
}

const getUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id;
    })
    return users[index];
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}


// addUser({
//     id: 22,
//     Username: 'Kinshuk',
//     room: 'h-16'
// })

// console.log(getUser(22))

// getUsersInRoom('h-16')


// const res=addUser({
//     id:22,
//     Username:'Kinshuk',
//     room:'h-16'
// })

// console.log(res)

// console.log(users)
// removeUser(22);
// console.log(users)