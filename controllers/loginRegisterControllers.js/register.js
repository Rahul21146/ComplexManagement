const User = require("./../../models/User");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
    try {

        console.log("Request body:", req.body); // Log the request body for debugging
        const {
            role,
            email,
            phone,
            password,
            name
        } = req.body;

        // 1. Validate required fields
        if (!role || !email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        // 3. Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists with this email"
            });
        }

        // 4. Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // 5. Create user
        const user = await User.create({
            role,
            email,
            phone,
            passwordHash,
            name
        });

        // 6. Response
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Registration failed",
            error: error.message
        });
    }
};


