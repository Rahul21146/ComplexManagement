
const mongoose = require("mongoose");

const Floor = require("../../models/Floor");
const Complex = require("../../models/Complex");

exports.createFloor = async (req, res) => {
    try {
        // Logged-in owner
        const ownerUserId = req.user.id;

        const {
            complexId,
            name,
            sortOrder
        } = req.body;

        // =====================================================
        // VALIDATION
        // =====================================================

        if (!complexId) {
            return res.status(400).json({
                success: false,
                message: "Complex ID is required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(complexId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid complex ID"
            });
        }

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Floor name is required"
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
        // CHECK DUPLICATE FLOOR NAME
        // =====================================================

        const existingFloor = await Floor.findOne({
            complexId,
            name: name.trim()
        });

        if (existingFloor) {
            return res.status(409).json({
                success: false,
                message: "A floor with this name already exists"
            });
        }

        // =====================================================
        // CREATE FLOOR
        // =====================================================

        const floor = await Floor.create({
            complexId,
            name: name.trim(),
            sortOrder:
                sortOrder !== undefined
                    ? Number(sortOrder)
                    : 0
        });

        // =====================================================
        // RESPONSE
        // =====================================================

        return res.status(201).json({
            success: true,
            message: "Floor created successfully",
            floor
        });

    } catch (error) {
        console.error("CREATE FLOOR ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create floor",
            error: error.message
        });
    }
};

