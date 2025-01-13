import mongoose  from "mongoose";
const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            validate: {
                validator: mongoose.Types.ObjectId.isValid,
                message: (props) => `${props.value} is not a valid ObjectId`,
            },
        },        
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required: true,
        },
        text:{
            type: String,
        },
        image:{
            type: String,
        },
        file:{
            type: String,
        },
    },
    {timestamps: true}
);
const Message = mongoose.model("Message", messageSchema);

export default Message;