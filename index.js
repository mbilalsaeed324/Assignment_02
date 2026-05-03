import express from "express";
import { AppDataSource } from "./src/config/data-source.js";
import User from "./src/entities/User.js";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "test") {
    dotenv.config();
}

const app = express();
app.use(express.json());

app.post("/users", async (req, res) => {
    try {
        const { name, email } = req.body;
        
        const userRepository = AppDataSource.getRepository(User);
        const newUser = userRepository.create({ name, email });
        const savedUser = await userRepository.save(newUser);

        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// Start the server ONLY if not in test environment
if (process.env.NODE_ENV?.trim() !== "test") {
    AppDataSource.initialize()
        .then(() => {
            const PORT = process.env.PORT || 3000;
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        })
        .catch((error) => console.log("Database connection failed:", error));
}

export default app;