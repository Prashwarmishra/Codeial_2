const mongoose = require("mongoose");
const resetPasswordSchema = new mongoose.Schema({
    new_password: {
        type: String,
        required: true
    }
    // , user: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "user"
    // }
}, {
    timestamps: true,
});

const ResetPassword = mongoose.model("ResetPassword", resetPasswordSchema);

module.exports = ResetPassword;