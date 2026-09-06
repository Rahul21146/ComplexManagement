const User = require(".././models/User");
const OTP = require("../././models/otpSchema");

const {sendEmail} = require("../config/mailer");
const gernateRandonString  = require("../controllers/utils").gernateRandonString;

exports.sendOTP = async (req, res) => {

    try {

        const { email } = req.body;

        // 1. Check email
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        // 2. Generate OTP
        const otp = gernateRandonString(6);

        console.log("Generated OTP:", otp);

        // 3. OTP expiry - 5 minutes
        const expiresAt = new Date(
            Date.now() + 5 * 60 * 1000
        );

        // 4. Save OTP
        await OTP.findOneAndUpdate(
            { email },

            {
                email,
                otp,
                expiresAt
            },

            {
                upsert: true,
                new: true
            }
        );

        // 5. Email HTML
        const htmlContent = `
            <div>
                <h2>Email Verification</h2>

                <p>Your OTP is:</p>

                <h1>${otp}</h1>

                <p>This OTP will expire in 5 minutes.</p>

                <p>
                    If you did not request this OTP,
                    please ignore this email.
                </p>
            </div>
        `;

        // 6. Send email
        await sendEmail(
            email,
            "Email Verification OTP",
            htmlContent
        );

        // 7. Response
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to send OTP",
            error: error.message
        });
    }
};





exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // 1. Validate input
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            });
        }

        // 2. Find the latest OTP for this email
        const otpRecord = await OTP.findOne({
            email: email.toLowerCase()
        }).sort({ createdAt: -1 });

        // 3. Check if OTP exists
        if (!otpRecord) {
            return res.status(404).json({
                success: false,
                message: "OTP not found"
            });
        }

        // 4. Check OTP expiry
        if (otpRecord.expiresAt < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired"
            });
        }

        // 5. Compare OTP
        if (otpRecord.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // 6. OTP is correct
        return res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "OTP verification failed",
            error: error.message
        });
    }
};