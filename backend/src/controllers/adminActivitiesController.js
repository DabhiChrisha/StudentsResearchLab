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
    console.error("Get activities error:", error);
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

    // DEBUG LOGGING
    console.log("[CREATE ACTIVITY] Request body:", JSON.stringify(req.body, null, 2));
    console.log("[CREATE ACTIVITY] Has file:", !!req.file);
    if (req.file) {
      console.log("[CREATE ACTIVITY] File name:", req.file.originalname);
      console.log("[CREATE ACTIVITY] File size:", req.file.size);
    }
    console.log("[CREATE ACTIVITY] Initial photoUrl (from body):", photoUrl);

    if (!title) {
      return res.status(400).json({
        error: "Invalid input",
        message: "title is required",
      });
    }

    // Handle file upload if a file is present
    if (req.file) {
      try {
        console.log("[CREATE ACTIVITY] Starting Cloudinary upload...");
        const uploadResult = await uploadToCloudinary(
          req.file.buffer,
          "srl_activities",
          req.file.originalname
        );
        console.log("[CREATE ACTIVITY] Cloudinary upload result:", JSON.stringify(uploadResult, null, 2));
        
        // Validate Cloudinary response
        if (!uploadResult || !uploadResult.url) {
          throw new Error(`Cloudinary upload returned invalid response: ${JSON.stringify(uploadResult)}`);
        }
        
        photoUrl = uploadResult.url;
        console.log("[CREATE ACTIVITY] photoUrl after upload:", photoUrl);
      } catch (uploadError) {
        console.error("[CREATE ACTIVITY] Cloudinary upload error:", uploadError);
        return res.status(500).json({
          error: "Upload failed",
          message: uploadError.message || "Failed to upload image to Cloudinary",
        });
      }
    }

    console.log("[CREATE ACTIVITY] Final photoUrl before DB insert:", photoUrl);
    console.log("[CREATE ACTIVITY] DB insert data:", JSON.stringify({
      title,
      description: description || null,
      date: date || null,
      link: link || null,
      brief: brief || null,
      Photo: photoUrl || null,
    }, null, 2));

    // Ensure Photo is either a URL string or null (not undefined)
    const finalPhotoValue = photoUrl || null;
    console.log("[CREATE ACTIVITY] Final Photo value to insert:", finalPhotoValue);

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

    console.log("[CREATE ACTIVITY] DB insert successful. Activity created:", JSON.stringify(activity, null, 2));

    broadcast('activity_changed', { id: activity.id });

    res.status(201).json({
      success: true,
      message: "Activity created successfully",
      data: activity,
    });
  } catch (error) {
    console.error("Create activity error:", error);
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

    // DEBUG LOGGING
    console.log("[UPDATE ACTIVITY] Activity ID:", id);
    console.log("[UPDATE ACTIVITY] Request body:", JSON.stringify(req.body, null, 2));
    console.log("[UPDATE ACTIVITY] Has file:", !!req.file);
    if (req.file) {
      console.log("[UPDATE ACTIVITY] File name:", req.file.originalname);
      console.log("[UPDATE ACTIVITY] File size:", req.file.size);
    }
    console.log("[UPDATE ACTIVITY] Initial photo from body (lowercase):", photo, "| Photo (capital P):", Photo, "| resolved:", Photo || photo);

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
        console.log("[UPDATE ACTIVITY] Starting Cloudinary upload...");
        const uploadResult = await uploadToCloudinary(
          req.file.buffer,
          "srl_activities",
          req.file.originalname
        );
        console.log("[UPDATE ACTIVITY] Cloudinary upload result:", JSON.stringify(uploadResult, null, 2));
        
        // Validate Cloudinary response
        if (!uploadResult || !uploadResult.url) {
          throw new Error(`Cloudinary upload returned invalid response: ${JSON.stringify(uploadResult)}`);
        }
        
        photoUrl = uploadResult.url;
        console.log("[UPDATE ACTIVITY] photoUrl after upload:", photoUrl);
      } catch (uploadError) {
        console.error("[UPDATE ACTIVITY] Cloudinary upload error:", uploadError);
        return res.status(500).json({
          error: "Upload failed",
          message: uploadError.message || "Failed to upload image to Cloudinary",
        });
      }
    }

    console.log("[UPDATE ACTIVITY] Final photoUrl:", photoUrl);
    console.log("[UPDATE ACTIVITY] photoUrl !== undefined?", photoUrl !== undefined);
    console.log("[UPDATE ACTIVITY] photoUrl truthiness:", Boolean(photoUrl));

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
        console.log("[UPDATE ACTIVITY] Clearing Photo (empty string converted to null)");
      } else {
        updateData.Photo = photoUrl;
        console.log("[UPDATE ACTIVITY] Setting Photo to:", photoUrl);
      }
    } else {
      console.log("[UPDATE ACTIVITY] Photo NOT added to updateData (photoUrl is undefined - preserving existing value)");
    }

    console.log("[UPDATE ACTIVITY] Final updateData:", JSON.stringify(updateData, null, 2));

    const activity = await prisma.activity.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    console.log("[UPDATE ACTIVITY] DB update successful. Activity updated:", JSON.stringify(activity, null, 2));

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
    console.error("Update activity error:", error);
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
    console.error("Delete activity error:", error);
    next(error);
  }
};

