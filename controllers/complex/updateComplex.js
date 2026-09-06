const Complex = require("../../models/Complex");

exports.updateComplex = async (req, res) => {
    try {
        const complexId = req.params.id;
        const ownerUserId = req.user.id;

        const {
            name,
            type,
            description,
            address,
            city,
            state,
            pinCode,
            country,
            contactNumber,
            contactEmail,
            emergencyContact
        } = req.body;

        const complex = await Complex.findOne({
            _id: complexId,
            ownerUserId,
            isActive: true
        });

        if (!complex) {
            return res.status(404).json({
                success: false,
                message: "Complex not found"
            });
        }

        // Update fields
        if (name !== undefined) complex.name = name;
        if (type !== undefined) complex.type = type;
        if (description !== undefined) complex.description = description;
        if (address !== undefined) complex.address = address;
        if (city !== undefined) complex.city = city;
        if (state !== undefined) complex.state = state;
        if (pinCode !== undefined) complex.pinCode = pinCode;
        if (country !== undefined) complex.country = country;
        if (contactNumber !== undefined) {
            complex.contactNumber = contactNumber;
        }
        if (contactEmail !== undefined) {
            complex.contactEmail = contactEmail;
        }
        if (emergencyContact !== undefined) {
            complex.emergencyContact = emergencyContact;
        }

        await complex.save();

        return res.status(200).json({
            success: true,
            message: "Complex updated successfully",
            complex
        });

    } catch (error) {
        console.log("UPDATE COMPLEX ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update complex",
            error: error.message
        });
    }
};