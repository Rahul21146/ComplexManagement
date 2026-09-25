const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const User = require("../../models/User");
const Tenant = require("../../models/Tenant");
const Complex = require("../../models/Complex");
const Floor = require("../../models/Floor");
const Room = require("../../models/Room");

const { sendEmail } = require("../../config/mailer");

// =====================================================
// GENERATE TEMPORARY PASSWORD
// =====================================================

const generateTemporaryPassword = () => {
  const number = crypto.randomInt(
    10000000,
    100000000
  );

  return `KD@${number}`;
};

// =====================================================
// CREATE TENANT
// =====================================================

exports.createTenant = async (req, res) => {
  try {
    // =================================================
    // GET OWNER ID
    // =================================================

    const ownerUserId = req.user.id;

    // =================================================
    // GET COMPLEX + FLOOR FROM PARAMS
    // =================================================

    const {
      complexId,
      floorId,
    } = req.params;

    // =================================================
    // GET DATA FROM BODY
    // =================================================

    const {
      roomId,
      fullName,
      phone,
      email,
      gender,
      moveInDate,
      emergencyContactName,
      emergencyContactPhone,
      idProofType,
      idProofNumber,
      agreementOnFile,
    } = req.body;

    // =================================================
    // VALIDATE COMPLEX ID
    // =================================================

    if (
      !complexId ||
      !mongoose.Types.ObjectId.isValid(complexId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid complex ID",
      });
    }

    // =================================================
    // VALIDATE FLOOR ID
    // =================================================

    if (
      !floorId ||
      !mongoose.Types.ObjectId.isValid(floorId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid floor ID",
      });
    }

    // =================================================
    // VALIDATE ROOM ID
    // =================================================

    if (
      !roomId ||
      !mongoose.Types.ObjectId.isValid(roomId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Room ID is required",
      });
    }

    // =================================================
    // VALIDATE TENANT DETAILS
    // =================================================

    if (!fullName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Full name is required",
      });
    }

    if (!phone?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    if (!email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // =================================================
    // NORMALIZE EMAIL
    // =================================================

    const normalizedEmail =
      email.trim().toLowerCase();

    // =================================================
    // CHECK COMPLEX
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
    // CHECK FLOOR
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
    // CHECK ROOM
    // =================================================

    const room = await Room.findOne({
      _id: roomId,
      complexId,
      floorId,
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message:
          "Room not found on this floor",
      });
    }

    // =================================================
    // CHECK ROOM STATUS
    // =================================================

    if (room.status === "occupied") {
      return res.status(409).json({
        success: false,
        message:
          "This room is already occupied",
      });
    }

    // =================================================
    // CHECK TENANT ALREADY ASSIGNED TO ROOM
    // =================================================

    const existingTenant = await Tenant.findOne({
      roomId: room._id,
    });

    if (existingTenant) {
      return res.status(409).json({
        success: false,
        message:
          "A tenant is already assigned to this room",
      });
    }

    // =================================================
    // CHECK USER EMAIL
    // =================================================

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "A user with this email already exists",
      });
    }

    // =================================================
    // GENERATE PASSWORD
    // =================================================

    const temporaryPassword =
      generateTemporaryPassword();

    // =================================================
    // HASH PASSWORD
    // =================================================

    const passwordHash =
      await bcrypt.hash(
        temporaryPassword,
        10
      );

    // =================================================
    // CREATE USER
    // =================================================

    const user = await User.create({
      role: "tenant",
      name: fullName.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      passwordHash,
    });

    // =================================================
    // CREATE TENANT
    // =================================================

    const tenant = await Tenant.create({
      userId: user._id,

      complexId,

      roomId: room._id,

      moveInDate:
        moveInDate || null,

      fullName:
        fullName.trim(),

      phone:
        phone.trim(),

      email:
        normalizedEmail,

      gender:
        gender || null,

      emergencyContactName:
        emergencyContactName?.trim() || "",

      emergencyContactPhone:
        emergencyContactPhone?.trim() || "",

      idProofType:
        idProofType || null,

      idProofNumber:
        idProofNumber?.trim() || "",

      agreementOnFile:
        Boolean(agreementOnFile),
    });

    // =================================================
    // UPDATE ROOM
    // =================================================

    room.status = "occupied";

    await room.save();

    // =================================================
    // SEND LOGIN EMAIL
    // =================================================

    let emailSent = false;

    try {
      await sendEmail(
        normalizedEmail,

        "KD Complex - Tenant Login Credentials",

        `
        <html>
          <body style="font-family: Arial, sans-serif;">

            <h2>Welcome to KD Complex</h2>

            <p>
              Hello
              <strong>${fullName}</strong>,
            </p>

            <p>
              Your tenant account has been created
              successfully.
            </p>

            <p>
              <strong>Complex:</strong>
              ${complex.name}
            </p>

            <p>
              <strong>Floor:</strong>
              ${floor.name}
            </p>

            <p>
              <strong>Room:</strong>
              ${room.number}
            </p>

            <hr />

            <h3>Login Credentials</h3>

            <p>
              <strong>User ID:</strong>
              ${normalizedEmail}
            </p>

            <p>
              <strong>Temporary Password:</strong>
              ${temporaryPassword}
            </p>

            <p>
              Please change your password
              after your first login.
            </p>

            <p>
              Regards,<br />
              KD Complex Management
            </p>

          </body>
        </html>
        `
      );

      emailSent = true;

    } catch (emailError) {
      console.error(
        "EMAIL ERROR:",
        emailError.message
      );
    }

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(201).json({
      success: true,

      message: emailSent
        ? "Tenant added successfully and login credentials sent"
        : "Tenant added successfully, but email could not be sent",

      emailSent,

      tenant: {
        _id: tenant._id,
        userId: tenant.userId,
        complexId: tenant.complexId,
        roomId: tenant.roomId,
        fullName: tenant.fullName,
        phone: tenant.phone,
        email: tenant.email,
        moveInDate: tenant.moveInDate,
      },
    });

  } catch (error) {

    console.error(
      "CREATE TENANT ERROR:",
      error
    );

    // =================================================
    // DUPLICATE
    // =================================================

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "User or tenant already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to add tenant",
      error:
        error.message,
    });
  }
};