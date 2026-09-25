const mongoose = require("mongoose");

const Room = require("../../models/Room");
const Complex = require("../../models/Complex");

// =====================================================
// GET ROOMS BY COMPLEX
// =====================================================

exports.getRoomsByComplex = async (req, res) => {
  try {
    const ownerUserId = req.user.id;

    // Complex ID comes from URL
    const { complexId } = req.params;

    // =================================================
    // VALIDATE COMPLEX ID
    // =================================================

    if (!complexId) {
      return res.status(400).json({
        success: false,
        message: "Complex ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(complexId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complex ID",
      });
    }

    // =================================================
    // CHECK COMPLEX OWNERSHIP
    // =================================================

    const complex = await Complex.findOne({
      _id: complexId,
      ownerUserId,
      isActive: true,
    })
      .select("_id name")
      .lean();

    if (!complex) {
      return res.status(404).json({
        success: false,
        message:
          "Complex not found or you do not have access",
      });
    }

    // =================================================
    // GET ROOMS
    // =================================================

    const rooms = await Room.find({
      complexId,
    })
      .populate({
        path: "floorId",
        select: "_id name sortOrder",
      })
      .sort({
        floorId: 1,
        number: 1,
      })
      .lean();

    // =================================================
    // STATISTICS
    // =================================================

    const totalRooms = rooms.length;

    const occupiedRooms = rooms.filter(
      (room) => room.status === "occupied"
    ).length;

    const vacantRooms = rooms.filter(
      (room) => room.status === "vacant"
    ).length;

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,

      complex: {
        _id: complex._id,
        name: complex.name,
      },

      count: totalRooms,

      statistics: {
        totalRooms,
        occupiedRooms,
        vacantRooms,
      },

      rooms,
    });

  } catch (error) {
    console.error(
      "GET ROOMS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch rooms",
      error: error.message,
    });
  }
};