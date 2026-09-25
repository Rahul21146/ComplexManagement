const mongoose = require("mongoose");

const Complex = require("../../models/Complex");
const Floor = require("../../models/Floor");
const Room = require("../../models/Room");

exports.getVacantRoomsByFloor = async (req, res) => {
  try {
    const { complexId, floorId } = req.params;
    const ownerUserId = req.user.id;

    // -----------------------------------
    // VALIDATE IDS
    // -----------------------------------

    if (!mongoose.Types.ObjectId.isValid(complexId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complex ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(floorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid floor ID",
      });
    }

    // -----------------------------------
    // CHECK COMPLEX
    // -----------------------------------

    const complex = await Complex.findOne({
      _id: complexId,
      ownerUserId,
      isActive: true,
    }).select("_id name");

    if (!complex) {
      return res.status(404).json({
        success: false,
        message: "Complex not found or access denied",
      });
    }

    // -----------------------------------
    // CHECK FLOOR
    // -----------------------------------

    const floor = await Floor.findOne({
      _id: floorId,
      complexId,
    }).select("_id name sortOrder");

    if (!floor) {
      return res.status(404).json({
        success: false,
        message: "Floor not found in this complex",
      });
    }

    // -----------------------------------
    // GET VACANT ROOMS
    // -----------------------------------

    const rooms = await Room.find({
      complexId,
      floorId,
      status: "vacant",
    })
      .select(`
        _id
        number
        type
        areaSqft
        monthlyRent
        securityDeposit
        status
        electricityMeterNumber
        waterMeterNumber
      `)
      .sort({ number: 1 })
      .lean();

    // -----------------------------------
    // RESPONSE
    // -----------------------------------

    return res.status(200).json({
      success: true,
      message: "Vacant rooms fetched successfully",
      complex: {
        _id: complex._id,
        name: complex.name,
      },
      floor: {
        _id: floor._id,
        name: floor.name,
        sortOrder: floor.sortOrder,
      },
      count: rooms.length,
      rooms,
    });

  } catch (error) {
    console.error("GET VACANT ROOMS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch vacant rooms",
      error: error.message,
    });
  }
};