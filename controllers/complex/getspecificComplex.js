
const mongoose = require("mongoose");

const Complex = require("../../models/Complex");
const Floor = require("../../models/Floor");
const Room = require("../../models/Room");

exports.getSpecificComplex = async (req, res) => {
    try {
        // =====================================================
        // GET LOGGED-IN OWNER
        // =====================================================

        const ownerUserId = req.user.id;

        // =====================================================
        // GET COMPLEX ID FROM URL
        // =====================================================

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
        // FIND COMPLEX
        // =====================================================

        const complex = await Complex.findOne({
            _id: complexId,
            ownerUserId,
            isActive: true
        }).lean();

        // =====================================================
        // COMPLEX NOT FOUND
        // =====================================================

        if (!complex) {
            return res.status(404).json({
                success: false,
                message: "Complex not found or you do not have access"
            });
        }

        // =====================================================
        // GET FLOORS
        // =====================================================

        const floors = await Floor.find({
            complexId: complex._id
        })
            .select("_id name sortOrder")
            .sort({ sortOrder: 1 })
            .lean();

        // =====================================================
        // FLOOR IDs
        // =====================================================

        const floorIds = floors.map(
            (floor) => floor._id
        );

        // =====================================================
        // ROOM COUNTS
        // =====================================================

        let totalRooms = 0;
        let occupiedRooms = 0;
        let vacantRooms = 0;

        if (floorIds.length > 0) {

            totalRooms = await Room.countDocuments({
                floorId: { $in: floorIds }
            });

            occupiedRooms =
                await Room.countDocuments({
                    floorId: { $in: floorIds },
                    status: "occupied"
                });

            vacantRooms =
                await Room.countDocuments({
                    floorId: { $in: floorIds },
                    status: "vacant"
                });
        }

        // =====================================================
        // RESPONSE
        // =====================================================

        return res.status(200).json({
            success: true,

            complex: {
                ...complex,

                floors: floors.length,
                rooms: totalRooms,
                occupied: occupiedRooms,
                vacant: vacantRooms,

                floorList: floors
            }
        });

    } catch (error) {
        console.error(
            "GET SPECIFIC COMPLEX ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch complex",
            error: error.message
        });
    }
};

