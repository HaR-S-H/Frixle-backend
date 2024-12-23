import mongoose from "mongoose";

// Connect to MongoDB
const connectedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("MONGODB is connected");        
    } catch (error) {
        console.log('MONGODB connection error');
        
    }
}
export default connectedDB;