const Tenant = require("../../models/Tenant");
const MeterReading = require("../../models/MeterReading");

exports.getMyTenantDetails = async (req, res) => {
  try {
    // Logged-in tenant's user ID
    const userId = req.user.id;

    // =================================================
    // GET TENANT
    // =================================================

    const tenant = await Tenant.findOne({
      userId,
    })
      .populate({
        path: "userId",
        select: "_id role name email phone createdAt updatedAt",
      })
      .populate({
        path: "complexId",
        select:
          "_id name address ownerName ownerPhone totalFloors totalShops",
      })
      .populate({
        path: "roomId",
        select:
          "_id complexId floorId number type areaSqft monthlyRent securityDeposit status electricityMeterNumber waterMeterNumber createdAt updatedAt",
        populate: {
          path: "floorId",
          select:
            "_id complexId name sortOrder createdAt updatedAt",
        },
      })
      .lean();

    // =================================================
    // TENANT NOT FOUND
    // =================================================

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant profile not found",
      });
    }

    // =================================================
    // GET ROOM ID
    // =================================================

    const roomId = tenant.roomId?._id;

    let electricityReadings = [];

    // =================================================
    // GET ELECTRICITY READINGS
    // =================================================

    if (roomId) {
      electricityReadings =
        await MeterReading.find({
          roomId,
          meterType: "Electricity",
        })
          .sort({
            billingMonth: -1,
          })
          .lean();
    }

    // =================================================
    // FORMAT RESPONSE
    // =================================================

    const responseData = {
      tenant: {
        _id: tenant._id,

        fullName: tenant.fullName,

        phone: tenant.phone,

        email: tenant.email,

        gender: tenant.gender,

        moveInDate: tenant.moveInDate,

        emergencyContact: {
          name:
            tenant.emergencyContactName || null,

          phone:
            tenant.emergencyContactPhone || null,
        },

        documents: {
          idProofType:
            tenant.idProofType || null,

          idProofNumber:
            tenant.idProofNumber || null,

          agreementOnFile:
            tenant.agreementOnFile,
        },
      },

      // =================================================
      // USER ACCOUNT
      // =================================================

      account: tenant.userId || null,

      // =================================================
      // COMPLEX
      // =================================================

      complex: tenant.complexId || null,

      // =================================================
      // ROOM
      // =================================================

      room: tenant.roomId
        ? {
            _id: tenant.roomId._id,

            number: tenant.roomId.number,

            type: tenant.roomId.type,

            areaSqft: tenant.roomId.areaSqft,

            monthlyRent:
              tenant.roomId.monthlyRent,

            securityDeposit:
              tenant.roomId.securityDeposit,

            status: tenant.roomId.status,

            // -----------------------------------------
            // METERS
            // -----------------------------------------

            meters: {
              electricityMeterNumber:
                tenant.roomId
                  .electricityMeterNumber || null,

              waterMeterNumber:
                tenant.roomId
                  .waterMeterNumber || null,
            },

            // -----------------------------------------
            // FLOOR
            // -----------------------------------------

            floor: tenant.roomId.floorId
              ? {
                  _id:
                    tenant.roomId.floorId._id,

                  name:
                    tenant.roomId.floorId.name,

                  sortOrder:
                    tenant.roomId.floorId.sortOrder,
                }
              : null,

            // -----------------------------------------
            // ELECTRICITY READINGS
            // -----------------------------------------

            electricityReadings,
          }
        : null,

      createdAt: tenant.createdAt,

      updatedAt: tenant.updatedAt,
    };

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,
      message: "Tenant details fetched successfully",
      data: responseData,
    });
  } catch (error) {
    console.error(
      "GET MY TENANT DETAILS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch tenant details",
      error: error.message,
    });
  }
};