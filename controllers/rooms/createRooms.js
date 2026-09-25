const mongoose = require("mongoose");

const Room = require("../../models/Room");
const Floor = require("../../models/Floor");
const Complex = require("../../models/Complex");

// =====================================================
// CREATE ROOM
// =====================================================

exports.createRoom = async (req, res) => {
  try {
    const ownerUserId = req.user.id;

    // Complex ID comes from URL
    const { complexId } = req.params;

    const {
      floorId,
      number,
      type,
      areaSqft,
      monthlyRent,
      securityDeposit,
      electricityMeterNumber,
      waterMeterNumber,
      status,
    } = req.body;

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
    // VALIDATE FLOOR ID
    // =================================================

    if (!floorId) {
      return res.status(400).json({
        success: false,
        message: "Floor ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(floorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid floor ID",
      });
    }

    // =================================================
    // VALIDATE ROOM NUMBER
    // =================================================

    if (!number || !number.trim()) {
      return res.status(400).json({
        success: false,
        message: "Room number is required",
      });
    }

    // =================================================
    // VALIDATE MONTHLY RENT
    // =================================================

    if (
      monthlyRent === undefined ||
      monthlyRent === null ||
      monthlyRent === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Monthly rent is required",
      });
    }

    // =================================================
    // CHECK COMPLEX OWNERSHIP
    // =================================================

    const complex = await Complex.findOne({
      _id: complexId,
      ownerUserId,
      isActive: true,
    });

    if (!complex) {
      return res.status(404).json({
        success: false,
        message:
          "Complex not found or you do not have access",
      });
    }

    // =================================================
    // CHECK FLOOR BELONGS TO COMPLEX
    // =================================================

    const floor = await Floor.findOne({
      _id: floorId,
      complexId,
    });

    if (!floor) {
      return res.status(404).json({
        success: false,
        message:
          "Floor not found in this complex",
      });
    }

    // =================================================
    // CREATE ROOM
    // =================================================

    const room = await Room.create({
      complexId,
      floorId,
      number: number.trim(),
      type: type?.trim() || "",
      areaSqft:
        areaSqft !== undefined &&
        areaSqft !== ""
          ? Number(areaSqft)
          : undefined,
      monthlyRent: Number(monthlyRent),
      securityDeposit:
        securityDeposit !== undefined &&
        securityDeposit !== ""
          ? Number(securityDeposit)
          : 0,
      electricityMeterNumber:
        electricityMeterNumber?.trim() || "",
      waterMeterNumber:
        waterMeterNumber?.trim() || "",
      status: status || "vacant",
    });

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(201).json({
      success: true,
      message: "Room created successfully",
      room,
    });

  } catch (error) {
    console.error(
      "CREATE ROOM ERROR:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "A room with this number already exists on this floor",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create room",
      error: error.message,
    });
  }
};