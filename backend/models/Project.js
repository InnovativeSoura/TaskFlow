import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "Planning",
        "Active",
        "Completed",
        "Archived",
      ],
      default: "Planning",
    },

    priority: {
      type: String,
      enum: [
        "Low",
        "Medium",
        "High",
        "Critical",
      ],
      default: "Medium",
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    endDate: {
      type: Date,
      default: null,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    color: {
      type: String,
      default: "#2563eb",
    },

    archived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.virtual("completion").get(function () {
  return `${this.progress}%`;
});

projectSchema.set("toJSON", {
  virtuals: true,
});

projectSchema.set("toObject", {
  virtuals: true,
});

export default mongoose.model("Project", projectSchema);