const Complex = require("../../models/Complex");

exports.createComplex = async (req, res) => {
    try {
        const {
            name,
            type,
            description,
            address,
            city,
            state,
            pinCode,
            country,
            contactNumber,
            contactEmail,
            emergencyContact
        } = req.body;

        if (!name || !address || !city || !state || !pinCode) {
            return res.status(400).json({
                success: false,
                message: "Name, address, city, state and pinCode are required"
            });
        }

        // Get owner from logged-in user
        const ownerUserId = req.user.id;

        const complex = await Complex.create({
            ownerUserId,
            name,
            type,
            description,
            address,
            city,
            state,
            pinCode,
            country,
            contactNumber,
            contactEmail,
            emergencyContact
        });

        return res.status(201).json({
            success: true,
            message: "Complex created successfully",
            complex
        });

    } catch (error) {
        console.log("CREATE COMPLEX ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create complex",
            error: error.message
        });
    }
};