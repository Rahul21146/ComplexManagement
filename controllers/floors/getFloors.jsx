
const mongoose = require("mongoose");

const Floor = require("../../models/Floor");
const Complex = require("../../models/Complex");

exports.getFloorsByComplex = async (req, res) => {
    try {
        // Logged-in owner
        const ownerUserId = req.user.id;

        // Get complex ID from URL
        const { complexId } = req.params;

        // =====================================================
        // VALIDATE COMPLEX ID
        // =====================================================

        if (!mongoose.Types.ObjectId.isValid(complexId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid complex ID"
            });
        }

        // =====================================================
        // CHECK COMPLEX OWNERSHIP
        // =====================================================

        const complex = await Complex.findOne({
            _id: complexId,
            ownerUserId,
            isActive: true
        });

        if (!complex) {
            return res.status(404).json({
                success: false,
                message: "Complex not found or you do not have access"
            });
        }

        // =====================================================
        // GET ALL FLOORS
        // =====================================================

        const floors = await Floor.find({
            complexId
        })
            .sort({
                sortOrder: 1,
                createdAt: 1
            })
            .lean();

        // =====================================================
        // RESPONSE
        // =====================================================

        return res.status(200).json({
            success: true,
            count: floors.length,
            complex: {
                _id: complex._id,
                name: complex.name
            },
            floors
        });

    } catch (error) {
        console.error("GET FLOORS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch floors",
            error: error.message
        });
    }
};

