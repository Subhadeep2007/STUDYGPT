import mongoose from "mongoose";

const connectDatabase = async() => {
    try {
        await mongoose.connect(
            process.env.ATLASDB_URL
        );

        console.log(
            "MongoDB connected successfully"
        );
    } catch (error) {
        console.error(
            "MongoDB connection failed:",
            error.message
        );

        throw error;
    }
};

export default connectDatabase;