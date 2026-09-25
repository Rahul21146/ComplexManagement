const mongoose = require("mongoose");

const Room = require("../../models/Room");
const Floor = require("../../models/Floor");
const Complex = require("../../models/Complex");

// =====================================================
// UPDATE ROOM
// =====================================================

exports.updateRoom = async (req, res) => {
  try {
    const ownerUserId = req.user.id;

    // Both IDs come from URL
    const {
      complexId,
      id: roomId,
    } = req.params;

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

    if (
      !complexId ||
      !mongoose.Types.ObjectId.isValid(
        complexId
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid complex ID",
      });
    }

    // =================================================
    // VALIDATE ROOM ID
    // =================================================

    if (
      !roomId ||
      !mongoose.Types.ObjectId.isValid(
        roomId
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid room ID",
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
      return res.status(403).json({
        success: false,
        message:
          "You do not have access to this complex",
      });
    }

    // =================================================
    // FIND ROOM
    // =================================================

    const room = await Room.findOne({
      _id: roomId,
      complexId,
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message:
          "Room not found in this complex",
      });
    }

    // =================================================
    // CHECK FLOOR
    // =================================================

    if (floorId !== undefined) {

      if (
        !mongoose.Types.ObjectId.isValid(
          floorId
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid floor ID",
        });
      }

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

      room.floorId = floorId;
    }

    // =================================================
    // UPDATE ROOM NUMBER
    // =================================================

    if (number !== undefined) {

      if (!number.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Room number cannot be empty",
        });
      }

      room.number = number.trim();
    }

    // =================================================
    // UPDATE TYPE
    // =================================================

    if (type !== undefined) {
      room.type =
        type?.trim() || "";
    }

    // =================================================
    // UPDATE AREA
    // =================================================

    if (
      areaSqft !== undefined &&
      areaSqft !== ""
    ) {
      room.areaSqft =
        Number(areaSqft);
    }

    // =================================================
    // UPDATE RENT
    // =================================================

    if (
      monthlyRent !== undefined &&
      monthlyRent !== ""
    ) {
      room.monthlyRent =
        Number(monthlyRent);
    }

    // =================================================
    // UPDATE SECURITY DEPOSIT
    // =================================================

    if (
      securityDeposit !== undefined &&
      securityDeposit !== ""
    ) {
      room.securityDeposit =
        Number(securityDeposit);
    }

    // =================================================
    // UPDATE ELECTRICITY METER
    // =================================================

    if (
      electricityMeterNumber !== undefined
    ) {
      room.electricityMeterNumber =
        electricityMeterNumber?.trim() || "";
    }

    // =================================================
    // UPDATE WATER METER
    // =================================================

    if (
      waterMeterNumber !== undefined
    ) {
      room.waterMeterNumber =
        waterMeterNumber?.trim() || "";
    }

    // =================================================
    // UPDATE STATUS
    // =================================================

    if (status !== undefined) {

      if (
        !["vacant", "occupied"].includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Status must be vacant or occupied",
        });
      }

      room.status = status;
    }

    // =================================================
    // SAVE
    // =================================================

    await room.save();

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,
      message: "Room updated successfully",
      room,
    });

  } catch (error) {

    console.error(
      "UPDATE ROOM ERROR:",
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
      message: "Failed to update room",
      error: error.message,
    });
  }
};