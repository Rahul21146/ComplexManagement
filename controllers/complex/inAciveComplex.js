const Complex = require("../../models/Complex");

exports.inactiveComplex = async (req, res) => {
    try {
        const complexId = req.params.id;
        const ownerUserId = req.user.id;

        const complex = await Complex.findOne({
            _id: complexId,
            ownerUserId,
            isActive: true
        });

        if (!complex) {
            return res.status(404).json({
                success: false,
                message: "Active complex not found"
            });
        }

        complex.isActive = false;

        await complex.save();

        return res.status(200).json({
            success: true,
            message: "Complex marked as inactive successfully"
        });

    } catch (error) {
        console.log("INACTIVE COMPLEX ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to deactivate complex",
            error: error.message
        });
    }
};