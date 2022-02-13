const mongoose = require("mongoose");

const subscriptionSchema = mongoose.Schema(
  {
    subscriptionKey: {
      type: Object,
      required: true
    },
    accountType: {
      type: String,
      default: "user"
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
