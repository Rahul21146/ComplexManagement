const mongoose = require("mongoose");

const RentPayment = require("../../models/RentPayment");
const Tenant = require("../../models/Tenant");
const Complex = require("../../models/Complex");

exports.markRentAsPaid = async (req, res) => {
  try {
    const { rentId } = req.params;
    const { method } = req.body;

    const ownerUserId = req.user.id;

    // ================================================
    // VALIDATE ID
    // ================================================

    if (!mongoose.Types.ObjectId.isValid(rentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid rent ID",
      });
    }

    // ================================================
    // GET RENT
    // ================================================

    const rent = await RentPayment.findById(
      rentId
    );

    if (!rent) {
      return res.status(404).json({
        success: false,
        message: "Rent record not found",
      });
    }

    // ================================================
    // GET TENANT
    // ================================================

    const tenant = await Tenant.findById(
      rent.tenantId
    );

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
    }

    // ================================================
    // CHECK OWNER
    // ================================================

    const complex = await Complex.findOne({
      _id: tenant.complexId,
      ownerUserId,
      isActive: true,
    });

    if (!complex) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this rent",
      });
    }

    // ================================================
    // ALREADY PAID
    // ================================================

    if (rent.status === "paid") {
      return res.status(400).json({
        success: false,
        message: "Rent is already marked as paid",
      });
    }

    // ================================================
    // UPDATE
    // ================================================

    rent.status = "paid";
    rent.paidOn = new Date();
    rent.method = method || "Other";

    await rent.save();

    // ================================================
    // RESPONSE
    // ================================================

    return res.status(200).json({
      success: true,
      message: "Rent marked as paid",
      rent,
    });
  } catch (error) {
    console.error(
      "MARK RENT PAID ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to mark rent as paid",
      error: error.message,
    });
  }
};