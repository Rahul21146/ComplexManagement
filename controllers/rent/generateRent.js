const mongoose = require("mongoose");

const Complex = require("../../models/Complex");
const Tenant = require("../../models/Tenant");
const RentPayment = require("../../models/RentPayment");

exports.generateRentForMonth = async (req, res) => {
  try {
    const { complexId } = req.params;
    const { month } = req.body;

    const ownerUserId = req.user.id;

    // ================================================
    // VALIDATE
    // ================================================

    if (!mongoose.Types.ObjectId.isValid(complexId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complex ID",
      });
    }

    if (!month) {
      return res.status(400).json({
        success: false,
        message: "Billing month is required",
      });
    }

    // ================================================
    // CONVERT MONTH
    // ================================================

    const [year, monthNumber] = month.split("-");

    const billingMonth = new Date(
      Number(year),
      Number(monthNumber) - 1,
      1
    );

    // ================================================
    // CHECK COMPLEX
    // ================================================

    const complex = await Complex.findOne({
      _id: complexId,
      ownerUserId,
      isActive: true,
    });

    if (!complex) {
      return res.status(404).json({
        success: false,
        message: "Complex not found or access denied",
      });
    }

    // ================================================
    // GET TENANTS
    // ================================================

    const tenants = await Tenant.find({
      complexId,
      roomId: {
        $ne: null,
      },
    })
      .populate({
        path: "roomId",
        select: "_id number monthlyRent status",
      })
      .lean();

    if (tenants.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tenants with assigned rooms found",
      });
    }

    // ================================================
    // CREATE RENT
    // ================================================

    let generated = 0;
    let alreadyExists = 0;

    for (const tenant of tenants) {
      if (!tenant.roomId) {
        continue;
      }

      const existingRent =
        await RentPayment.findOne({
          tenantId: tenant._id,
          billingMonth,
        });

      if (existingRent) {
        alreadyExists++;
        continue;
      }

      await RentPayment.create({
        tenantId: tenant._id,
        billingMonth,
        amount: tenant.roomId.monthlyRent,
        status: "due",
      });

      generated++;
    }

    // ================================================
    // RESPONSE
    // ================================================

    return res.status(201).json({
      success: true,
      message: "Rent generated successfully",

      billingMonth,

      summary: {
        totalTenants: tenants.length,
        generated,
        alreadyExists,
      },
    });
  } catch (error) {
    console.error(
      "GENERATE RENT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to generate rent",
      error: error.message,
    });
  }
};