const mongoose = require("mongoose");
const forgetPasswordSchema = new mongoose.Schema({
    recovery_email: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

const ForgotPassword = mongoose.model("ForgotPassword", forgetPasswordSchema);

module.exports = ForgotPassword;