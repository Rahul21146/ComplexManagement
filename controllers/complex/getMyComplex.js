const Complex = require("../../models/Complex");
const Floor = require("../../models/Floor");
const Room = require("../../models/Room");

exports.getMyComplexes = async (req, res) => {
    try {
        // Logged-in owner ID comes from auth middleware
        const ownerUserId = req.user.id;

        // Get all active complexes belonging to this owner
        const complexes = await Complex.find({
            ownerUserId,
            isActive: true
        })
            .sort({ createdAt: -1 })
            .lean();

        // Add floor and room information
        const complexesWithDetails = await Promise.all(
            complexes.map(async (complex) => {

                // ------------------------------------------------
                // 1. Get floors of this complex
                // ------------------------------------------------

                const floors = await Floor.find({
                    complexId: complex._id
                })
                    .select("_id name sortOrder")
                    .sort({ sortOrder: 1 })
                    .lean();

                // Get only floor IDs
                const floorIds = floors.map((floor) => floor._id);

                // ------------------------------------------------
                // 2. Get rooms belonging to those floors
                // ------------------------------------------------

                const totalRooms = await Room.countDocuments({
                    floorId: { $in: floorIds }
                });

                // ------------------------------------------------
                // 3. Count occupied rooms
                // ------------------------------------------------

                const occupiedRooms = await Room.countDocuments({
                    floorId: { $in: floorIds },
                    status: "occupied"
                });

                // ------------------------------------------------
                // 4. Count vacant rooms
                // ------------------------------------------------

                const vacantRooms = await Room.countDocuments({
                    floorId: { $in: floorIds },
                    status: "vacant"
                });

                // ------------------------------------------------
                // Return complex + calculated information
                // ------------------------------------------------

                return {
                    ...complex,

                    floors: floors.length,
                    rooms: totalRooms,
                    occupied: occupiedRooms,
                    vacant: vacantRooms
                };
            })
        );

        return res.status(200).json({
            success: true,
            count: complexesWithDetails.length,
            complexes: complexesWithDetails
        });

    } catch (error) {
        console.error("GET COMPLEX ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch complexes",
            error: error.message
        });
    }
};