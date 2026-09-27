const RentPayment = require("../../models/RentPayment");

exports.getMyRent = async (req, res) => {
  try {
    const userId = req.user.id;

    const tenant =
      await require("../../models/Tenant").findOne({
        userId,
      });

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant profile not found",
      });
    }

    const rents = await RentPayment.find({
      tenantId: tenant._id,
    })
      .sort({
        billingMonth: -1,
      })
      .lean();

    const totalDue = rents
      .filter((rent) => rent.status === "due")
      .reduce(
        (sum, rent) => sum + rent.amount,
        0
      );

    const totalPaid = rents
      .filter((rent) => rent.status === "paid")
      .reduce(
        (sum, rent) => sum + rent.amount,
        0
      );

    return res.status(200).json({
      success: true,
      message: "My rent fetched successfully",

      summary: {
        totalDue,
        totalPaid,
      },

      rents,
    });
  } catch (error) {
    console.error(
      "GET MY RENT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch rent",
      error: error.message,
    });
  }
};