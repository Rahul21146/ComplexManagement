const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../config/mailer");

require("dotenv").config();


// =====================================================
// FORGOT PASSWORD
// =====================================================

exports.forgotPassword = async (req, res) => {
    try {

        console.log("\n========================================");
        console.log("FORGOT PASSWORD REQUEST");
        console.log("========================================");

        const { email } = req.body;

        console.log("Received email:", email);


        // 1. Validate email
        if (!email) {

            console.log("❌ Email is missing");

            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }


        // 2. Find user
        console.log("🔍 Searching user in database...");

        const user = await User.findOne({
            email: email.toLowerCase()
        });


        // Don't reveal whether email exists
        if (!user) {

            console.log("❌ No user found with email:", email);

            return res.status(200).json({
                success: true,
                message:
                    "There is no account associated with this email. Please register first."
            });
        }


        console.log("✅ User found");
        console.log("User ID:", user._id);
        console.log("User name:", user.name);
        console.log("User email:", user.email);


        // 3. Generate reset token
        console.log("🔐 Generating password reset token...");

        const resetToken = jwt.sign(
            {
                id: user._id,
                purpose: "password-reset"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "15m"
            }
        );

        console.log("✅ Reset token generated");
        console.log("Reset token:", resetToken);


        // 4. Frontend reset URL
        const resetUrl =
            `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        console.log("🌐 Reset URL:");
        console.log(resetUrl);


        // 5. Email content
        const htmlContent = `
            <h2>Password Reset</h2>

            <p>Hello ${user.name},</p>

            <p>
                Click the button below to reset your password.
            </p>

            <a href="${resetUrl}"
               style="
                   display:inline-block;
                   padding:10px 20px;
                   background:#007bff;
                   color:white;
                   text-decoration:none;
                   border-radius:5px;
               ">
                Reset Password
            </a>

            <p>
                This link will expire in 15 minutes.
            </p>

            <p>
                If you did not request a password reset,
                please ignore this email.
            </p>
        `;


        // 6. Send email
        console.log("📧 Sending reset email...");

        await sendEmail(
            user.email,
            "Reset Your Password",
            htmlContent
        );

        console.log("✅ Reset email sent successfully");
        console.log("Email sent to:", user.email);

        console.log("========================================\n");


        return res.status(200).json({
            success: true,
            message:
                "If an account exists with this email, a reset link has been sent."
        });

    } catch (error) {

        console.log("❌ FORGOT PASSWORD ERROR");
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to process password reset",
            error: error.message
        });
    }
};




// =====================================================
// RESET PASSWORD
// =====================================================

exports.resetPassword = async (req, res) => {
    try {

        console.log("\n========================================");
        console.log("RESET PASSWORD REQUEST");
        console.log("========================================");


        const {
            token,
            newPassword,
            confirmPassword
        } = req.body;


        console.log("Token received:", token ? "YES" : "NO");
        console.log("New password received:", newPassword ? "YES" : "NO");
        console.log(
            "Confirm password received:",
            confirmPassword ? "YES" : "NO"
        );


        // 1. Validate input
        if (!token || !newPassword || !confirmPassword) {

            console.log("❌ Required fields are missing");

            return res.status(400).json({
                success: false,
                message:
                    "Token, new password and confirm password are required"
            });
        }


        // 2. Check passwords match
        console.log("🔍 Checking passwords...");

        if (newPassword !== confirmPassword) {

            console.log("❌ Passwords do not match");

            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        console.log("✅ Passwords match");


        // 3. Verify JWT
        console.log("🔐 Verifying reset token...");

        let payload;

        try {

            payload = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            console.log("✅ Reset token is valid");
            console.log("Token payload:", payload);

        } catch (error) {

            console.log("❌ Token verification failed");
            console.log("Token error:", error.name);


            if (error.name === "TokenExpiredError") {

                console.log("⏰ Reset token has expired");

                return res.status(401).json({
                    success: false,
                    message: "Reset link has expired"
                });
            }


            console.log("❌ Invalid reset token");

            return res.status(401).json({
                success: false,
                message: "Invalid reset token"
            });
        }


        // 4. Check token purpose
        console.log("🔍 Checking token purpose...");

        if (payload.purpose !== "password-reset") {

            console.log("❌ Invalid token purpose");

            return res.status(401).json({
                success: false,
                message: "Invalid reset token"
            });
        }

        console.log("✅ Token purpose verified");


        // 5. Find user
        console.log("🔍 Finding user...");

        const user = await User.findById(payload.id);

        if (!user) {

            console.log("❌ User not found");
            console.log("User ID from token:", payload.id);

            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        console.log("✅ User found");
        console.log("User ID:", user._id);
        console.log("User email:", user.email);


        // 6. Hash new password
        console.log("🔒 Hashing new password...");

        const passwordHash = await bcrypt.hash(
            newPassword,
            10
        );

        console.log("✅ Password hashed successfully");


        // 7. Update password
        console.log("💾 Updating password in database...");

        user.passwordHash = passwordHash;

        await user.save();

        console.log("✅ Password updated successfully");


        console.log("========================================");
        console.log("PASSWORD RESET SUCCESSFUL");
        console.log("========================================\n");


        // 8. Response
        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {

        console.log("❌ RESET PASSWORD ERROR");
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to reset password",
            error: error.message
        });
    }
};



exports.changePassword = async (req, res) => {
    try {

        console.log("\n========================================");
        console.log("CHANGE PASSWORD REQUEST");
        console.log("========================================");

        const {
            oldPassword,
            newPassword,
            confirmPassword
        } = req.body;

        console.log("Old password received:", oldPassword ? "YES" : "NO");
        console.log("New password received:", newPassword ? "YES" : "NO");
        console.log(
            "Confirm password received:",
            confirmPassword ? "YES" : "NO"
        );


        // 1. Validate input
        if (!oldPassword || !newPassword || !confirmPassword) {

            console.log("❌ Required fields are missing");

            return res.status(400).json({
                success: false,
                message:
                    "Old password, new password and confirm password are required"
            });
        }


        // 2. Check passwords match
        if (newPassword !== confirmPassword) {

            console.log("❌ New passwords do not match");

            return res.status(400).json({
                success: false,
                message: "New password and confirm password do not match"
            });
        }

        console.log("✅ Password confirmation matched");


        // 3. Get logged-in user ID
        const userId = req.user.id;

        console.log("Logged-in user ID:", userId);


        // 4. Find user
        const user = await User.findById(userId);

        if (!user) {

            console.log("❌ User not found");

            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        console.log("✅ User found:", user.email);


        // 5. Check old password
        console.log("🔍 Checking old password...");

        const isPasswordCorrect = await bcrypt.compare(
            oldPassword,
            user.passwordHash
        );

        if (!isPasswordCorrect) {

            console.log("❌ Old password is incorrect");

            return res.status(401).json({
                success: false,
                message: "Old password is incorrect"
            });
        }

        console.log("✅ Old password is correct");


        // 6. Hash new password
        console.log("🔒 Hashing new password...");

        const newPasswordHash = await bcrypt.hash(
            newPassword,
            10
        );

        console.log("✅ New password hashed");


        // 7. Update password
        user.passwordHash = newPasswordHash;

        await user.save();

        console.log("✅ Password updated successfully");


        // 8. Send email notification
        console.log("📧 Sending password change notification...");

        const htmlContent = `
            <h2>Password Changed Successfully</h2>

            <p>Hello ${user.name},</p>

            <p>
                Your account password was changed successfully.
            </p>

            <p>
                <strong>Email:</strong> ${user.email}
            </p>

            <p>
                For security reasons, we do not include your old
                or new password in this email.
            </p>

            <p>
                If you did not make this change, please contact
                support immediately.
            </p>

            <p>
                Thank you,<br>
                Complex Management System
            </p>
        `;

        await sendEmail(
            user.email,
            "Your Password Was Changed",
            htmlContent
        );

        console.log("✅ Password change notification sent");
        console.log("Notification sent to:", user.email);


        console.log("========================================");
        console.log("PASSWORD CHANGE SUCCESSFUL");
        console.log("========================================\n");


        // 9. Response
        return res.status(200).json({
            success: true,
            message:
                "Password changed successfully. A confirmation email has been sent."
        });

    } catch (error) {

        console.log("❌ CHANGE PASSWORD ERROR");
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to change password",
            error: error.message
        });
    }
};