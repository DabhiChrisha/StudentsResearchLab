const prisma = require("../lib/prisma");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/imageUpload");
const { broadcast } = require("../utils/sseManager");

/**
 * Get all activities - GET /api/admin/activities
 */
exports.getActivities = async (req, res, next) => {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: { id: "desc" },
    });

    res.json({
      success: true,
      data: activities || [],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create activity - POST /api/admin/activities
 */
exports.createActivity = async (req, res, next) => {
  try {
    const { title, description, date, link, brief, photo, Photo } = req.body;
    // Accept both 'Photo' (capital P, sent by admin portal) and 'photo' (lowercase)
    let photoUrl = Photo || photo;

    if (!title) {
      return res.status(400).json({
        error: "Invalid input",
        message: "title is required",
      });
    }

    // Handle file upload if a file is present
    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(
          req.file.buffer,
          "srl/activities",
          req.file.originalname,
          "image",
          req.file.mimetype
        );

        if (!uploadResult || !uploadResult.url) {
          throw new Error(`Cloudinary upload returned invalid response: ${JSON.stringify(uploadResult)}`);
        }

        photoUrl = uploadResult.url;
      } catch (uploadError) {
        return res.status(500).json({
          error: "Upload failed",
          message: "Failed to upload image to Cloudinary",
        });
      }
    }

    // Ensure Photo is either a URL string or null (not undefined)
    const finalPhotoValue = photoUrl || null;

    const activity = await prisma.activity.create({
      data: {
        title,
        description: description || null,
        date: date || null,
        link: link || null,
        brief: brief || null,
        Photo: finalPhotoValue,
      },
    });

    broadcast('activity_changed', { id: activity.id });

    res.status(201).json({
      success: true,
      message: "Activity created successfully",
      data: activity,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update activity - PUT /api/admin/activities/:id
 */
exports.updateActivity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, date, link, brief, photo, Photo } = req.body;
    // Accept both 'Photo' (capital P, sent by admin portal) and 'photo' (lowercase)

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (date !== undefined) updateData.date = date;
    if (link !== undefined) updateData.link = link;
    if (brief !== undefined) updateData.brief = brief;

    // Handle file upload if a file is present
    // Accept both 'Photo' (capital P, from admin portal JSON payload) and 'photo' (lowercase)
    let photoUrl = Photo || photo;
    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(
          req.file.buffer,
          "srl/activities",
          req.file.originalname,
          "image",
          req.file.mimetype
        );

        if (!uploadResult || !uploadResult.url) {
          throw new Error(`Cloudinary upload returned invalid response: ${JSON.stringify(uploadResult)}`);
        }

        photoUrl = uploadResult.url;
      } catch (uploadError) {
        return res.status(500).json({
          error: "Upload failed",
          message: "Failed to upload image to Cloudinary",
        });
      }
    }

    // Handle photo field: only update if explicitly provided (non-empty or null)
    // If photoUrl is undefined, skip (don't update Photo field for partial updates)
    // If photoUrl is null/empty string (explicitly cleared), set Photo to null
    // If photoUrl is a URL, set Photo to that URL
    if (photoUrl !== undefined) {
      // photoUrl could be:
      // 1. Null explicitly (from req.body.photo = null)
      // 2. Empty string explicitly (from req.body.photo = "")
      // 3. Cloudinary URL string (from req.body.photo = "https://...")
      // 4. Cloudinary URL string (from successful file upload)
      
      // Treat empty strings as null (for clearing the photo)
      if (photoUrl === "") {
        updateData.Photo = null;
      } else {
        updateData.Photo = photoUrl;
      }
    }

    const activity = await prisma.activity.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    broadcast('activity_changed', { id: activity.id });

    res.json({
      success: true,
      message: "Activity updated successfully",
      data: activity,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Not found",
        message: "Activity not found",
      });
    }
    next(error);
  }
};

/**
 * Delete activity - DELETE /api/admin/activities/:id
 */
exports.deleteActivity = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.activity.delete({
      where: { id: parseInt(id) },
    });

    broadcast('activity_changed', { id: parseInt(id) });

    res.json({
      success: true,
      message: "Activity deleted successfully",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Not found",
        message: "Activity not found",
      });
    }
    next(error);
  }
};

