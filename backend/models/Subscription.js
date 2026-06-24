const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
{
user: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
required: true,
},


plan: {
  type: String,
  default: "Free",
},

status: {
  type: String,
  enum: ["active", "inactive", "cancelled"],
  default: "inactive",
},

stripeCustomerId: String,

stripeSubscriptionId: String,


},
{
timestamps: true,
}
);

module.exports = mongoose.model(
"Subscription",
subscriptionSchema
);
