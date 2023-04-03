const generateMessage=({message,Username})=>{
    return{
        message,
        Username,
        createdAt:new Date().getTime()
    }
}

const generateLocationMessage=({url,Username})=>{
    return{
        url,
        Username,
        createdAt:new Date().getTime()
    }
}

module.exports={
    generateMessage,
    generateLocationMessage
}