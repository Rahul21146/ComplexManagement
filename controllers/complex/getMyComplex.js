const Complex = require("../../models/Complex");

exports.getMyComplexes = async (req, res) => {
    try {
        const ownerUserId = req.user.id;

        const complexes = await Complex.find({
            ownerUserId,
            isActive: true
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: complexes.length,
            complexes
        });

    } catch (error) {
        console.log("GET COMPLEX ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch complexes",
            error: error.message
        });
    }
};