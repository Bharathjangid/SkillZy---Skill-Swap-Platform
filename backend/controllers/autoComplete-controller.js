const userModel = require("../models/user-model");
const debug = require("debug")("backend:autoComplete-controller");

module.exports.getAutoComplete = async (req, res) => {
  try {
    const { field, query = "" } = req.query;

    if (
      ![
        "skillsOffered",
        "skillsWanted",
        "location.city",
        "location.country",
      ].includes(field)
    ) {
      return res.status(400).json({ message: "Invalid field" });
    }

    const matchField = field;
    const projection = {};
    projection[field] = 1;

    const docs = await userModel
      .find({ [matchField]: { $regex: query, $options: "i" }, isBanned: false })
      .limit(10)
      .select(projection);

    const suggestions = new Set();

    for (const doc of docs) {
      const value = field.includes(".")
        ? field.split(".").reduce((obj, key) => obj?.[key], doc)
        : doc[field];
    }

    if (Array.isArray(value)) {
      value.forEach((v) => suggestions.add(v));
    } else if (value) {
      suggestions.add(value);
    }

    res.status(200).json({ suggestions: Array.from(suggestions).slice(0, 10) });
  } catch (error) {
    debug("Error getting auto complete", error.message);
    res.status(500).json({ message: error.message });
  }
};
