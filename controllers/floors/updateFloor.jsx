
const mongoose = require("mongoose");

const Floor = require("../../models/Floor");
const Complex = require("../../models/Complex");

exports.updateFloor = async (req, res) => {
    try {
        // Logged-in owner
        const ownerUserId = req.user.id;

        const { id } = req.params;

        const {
            name,
            sortOrder
        } = req.body;

        // =====================================================
        // VALIDATE FLOOR ID
        // =====================================================

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid floor ID"
            });
        }

        // =====================================================
        // FIND FLOOR
        // =====================================================

        const floor = await Floor.findById(id);

        if (!floor) {
            return res.status(404).json({
                success: false,
                message: "Floor not found"
            });
        }

        // =====================================================
        // CHECK COMPLEX OWNERSHIP
        // =====================================================

        const complex = await Complex.findOne({
            _id: floor.complexId,
            ownerUserId,
            isActive: true
        });

        if (!complex) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to update this floor"
            });
        }

        // =====================================================
        // UPDATE NAME
        // =====================================================

        if (name !== undefined) {
            if (!name.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Floor name cannot be empty"
                });
            }

            // Check duplicate name
            const existingFloor = await Floor.findOne({
                complexId: floor.complexId,
                name: name.trim(),
                _id: { $ne: floor._id }
            });

            if (existingFloor) {
                return res.status(409).json({
                    success: false,
                    message: "A floor with this name already exists"
                });
            }

            floor.name = name.trim();
        }

        // =====================================================
        // UPDATE SORT ORDER
        // =====================================================

        if (sortOrder !== undefined) {
            const parsedSortOrder = Number(sortOrder);

            if (!Number.isInteger(parsedSortOrder)) {
                return res.status(400).json({
                    success: false,
                    message: "Sort order must be a valid number"
                });
            }

            floor.sortOrder = parsedSortOrder;
        }

        // =====================================================
        // SAVE
        // =====================================================

        await floor.save();

        // =====================================================
        // RESPONSE
        // =====================================================

        return res.status(200).json({
            success: true,
            message: "Floor updated successfully",
            floor
        });

    } catch (error) {
        console.error("UPDATE FLOOR ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update floor",
            error: error.message
        });
    }
};

