const mongoose = require("mongoose");

const Complex = require("../../models/Complex");
const RentPayment = require("../../models/RentPayment");

exports.getRentByComplex = async (req, res) => {
  try {
    const { complexId } = req.params;
    const { month } = req.query;

    const ownerUserId = req.user.id;

    // ================================================
    // VALIDATE COMPLEX ID
    // ================================================

    if (!mongoose.Types.ObjectId.isValid(complexId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complex ID",
      });
    }

    // ================================================
    // CHECK COMPLEX OWNERSHIP
    // ================================================

    const complex = await Complex.findOne({
      _id: complexId,
      ownerUserId,
      isActive: true,
    }).lean();

    if (!complex) {
      return res.status(404).json({
        success: false,
        message: "Complex not found or access denied",
      });
    }

    // ================================================
    // MONTH
    // ================================================

    let billingMonth;

    if (month) {
      const [year, monthNumber] = month.split("-");

      billingMonth = new Date(
        Number(year),
        Number(monthNumber) - 1,
        1
      );
    } else {
      const now = new Date();

      billingMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );
    }

    // ================================================
    // GET RENT PAYMENTS
    // ================================================

    const rents = await RentPayment.find({
      billingMonth,
    })
      .populate({
        path: "tenantId",
        match: {
          complexId,
        },
        select:
          "_id fullName phone email roomId moveInDate",
        populate: {
          path: "roomId",
          select:
            "_id number type monthlyRent status floorId",
          populate: {
            path: "floorId",
            select: "_id name sortOrder",
          },
        },
      })
      .sort({
        status: 1,
        createdAt: -1,
      })
      .lean();

    // Remove records where tenant doesn't belong to this complex
    const filteredRents = rents.filter(
      (rent) => rent.tenantId
    );

    // ================================================
    // SUMMARY
    // ================================================

    const totalAmount = filteredRents.reduce(
      (sum, rent) => sum + rent.amount,
      0
    );

    const paidAmount = filteredRents
      .filter((rent) => rent.status === "paid")
      .reduce((sum, rent) => sum + rent.amount, 0);

    const dueAmount = filteredRents
      .filter((rent) => rent.status === "due")
      .reduce((sum, rent) => sum + rent.amount, 0);

    // ================================================
    // RESPONSE
    // ================================================

    return res.status(200).json({
      success: true,
      message: "Rent fetched successfully",

      billingMonth,

      summary: {
        totalRent: totalAmount,
        paidRent: paidAmount,
        dueRent: dueAmount,
        totalRecords: filteredRents.length,
      },

      rents: filteredRents,
    });
  } catch (error) {
    console.error(
      "GET RENT BY COMPLEX ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch rent",
      error: error.message,
    });
  }
};