const userModel = require("../models/user-model");
const debug = require('debug')('backend:search-controller');

module.exports.searchUsers = async (req, res) => {
  try {
    const {
      name,
      skill,
      city,
      country,
      availability,
      publicOnly = true,
      exactCity = false,
      exactCountry = false,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.body;

    const query = {};

    if (publicOnly === true || publicOnly === 'true') {
      query.isPublic = true;
    }

    query.isBanned = false;

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    if (skill) {
      query.$or = [
        { skillsOffered: { $regex: skill, $options: "i" } },
        { skillsWanted: { $regex: skill, $options: "i" } }
      ];
    }

    if (city) {
      query["location.city"] = exactCity
        ? city
        : { $regex: city, $options: "i" };
    }

    if (country) {
      query["location.country"] = exactCountry
        ? country
        : { $regex: country, $options: "i" };
    }

    if (availability && availability.length) {
      query.availability = { $in: availability };
    }

    const sortQuery = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      userModel
        .find(query)
        .select("-password -email -isBanned -isAdmin")
        .sort(sortQuery)
        .skip(skip)
        .limit(Number(limit)),
      userModel.countDocuments(query)
    ]);

    res.status(200).json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      results: users,
    });
  } catch (error) {
    console.error("Search error:", error.message);
    res.status(500).json({ message: "Error while searching users." });
  }
};
