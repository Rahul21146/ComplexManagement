const mongoose = require("mongoose");

const Tenant = require("../../models/Tenant");
const Complex = require("../../models/Complex");

// =====================================================
// GET ALL TENANTS OF COMPLEX
// =====================================================

exports.getTenantsByComplex = async (req, res) => {
  try {
    // =================================================
    // OWNER
    // =================================================

    const ownerUserId = req.user.id;

    // =================================================
    // COMPLEX ID FROM PARAMS
    // =================================================

    const { complexId } = req.params;

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
    // CHECK COMPLEX OWNERSHIP
    // =================================================

    const complex = await Complex.findOne({
      _id: complexId,
      ownerUserId,
      isActive: true,
    }).lean();

    if (!complex) {
      return res.status(404).json({
        success: false,
        message:
          "Complex not found or you do not have access",
      });
    }

    // =================================================
    // GET TENANTS
    // =================================================

    const tenants = await Tenant.find({
      complexId,
    })
      // =================================================
      // USER INFORMATION
      // =================================================

      .populate({
        path: "userId",
        select:
          "_id role email phone name createdAt updatedAt",
      })

      // =================================================
      // ROOM INFORMATION
      // =================================================

      .populate({
        path: "roomId",

        select:
          "_id complexId floorId number type areaSqft monthlyRent securityDeposit electricityMeterNumber waterMeterNumber status createdAt updatedAt",

        // =================================================
        // FLOOR INFORMATION
        // =================================================

        populate: {
          path: "floorId",
          select:
            "_id complexId name sortOrder createdAt updatedAt",
        },
      })

      // =================================================
      // SORT
      // =================================================

      .sort({
        createdAt: -1,
      })

      .lean();

    // =================================================
    // FORMAT TENANT DATA
    // =================================================

    const formattedTenants = tenants.map(
      (tenant) => {
        const room = tenant.roomId;

        const floor =
          room &&
          typeof room.floorId === "object"
            ? room.floorId
            : null;

        return {
          // =================================================
          // TENANT INFORMATION
          // =================================================

          _id: tenant._id,

          userId: tenant.userId,

          complexId: tenant.complexId,

          fullName: tenant.fullName,

          phone: tenant.phone,

          email: tenant.email,

          gender: tenant.gender,

          moveInDate:
            tenant.moveInDate,

          // =================================================
          // EMERGENCY CONTACT
          // =================================================

          emergencyContact: {
            name:
              tenant.emergencyContactName ||
              null,

            phone:
              tenant.emergencyContactPhone ||
              null,
          },

          // =================================================
          // DOCUMENTS
          // =================================================

          documents: {
            idProofType:
              tenant.idProofType ||
              null,

            idProofNumber:
              tenant.idProofNumber ||
              null,

            agreementOnFile:
              tenant.agreementOnFile,
          },

          // =================================================
          // ROOM DETAILS
          // =================================================

          roomDetails: room
            ? {
                _id: room._id,

                number:
                  room.number,

                type:
                  room.type,

                areaSqft:
                  room.areaSqft,

                monthlyRent:
                  room.monthlyRent,

                securityDeposit:
                  room.securityDeposit,

                status:
                  room.status,

                electricityMeterNumber:
                  room.electricityMeterNumber,

                waterMeterNumber:
                  room.waterMeterNumber,

                complexId:
                  room.complexId,

                floor: floor
                  ? {
                      _id:
                        floor._id,

                      name:
                        floor.name,

                      sortOrder:
                        floor.sortOrder,

                      complexId:
                        floor.complexId,
                    }
                  : null,

                createdAt:
                  room.createdAt,

                updatedAt:
                  room.updatedAt,
              }
            : null,

          // =================================================
          // TENANT RECORD DATES
          // =================================================

          createdAt:
            tenant.createdAt,

          updatedAt:
            tenant.updatedAt,
        };
      }
    );

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,

      count:
        formattedTenants.length,

      complex,

      tenants:
        formattedTenants,
    });

  } catch (error) {
    console.error(
      "GET TENANTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch tenants",
      error:
        error.message,
    });
  }
};