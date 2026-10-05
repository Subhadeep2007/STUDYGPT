import "dotenv/config";

import app from "./app.js";
import connectDatabase from "./src/config/db.js";

const PORT = process.env.PORT || 8080;

const startServer = async() => {
    try {
        await connectDatabase();

        app.listen(PORT, () => {
            console.log(
                `StudyGPT server running on port ${PORT}`
            );
        });
    } catch (error) {
        console.error(
            "Server failed to start:",
            error.message
        );

        process.exit(1);
    }
};

startServer();