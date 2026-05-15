const prisma = require("../lib/prisma");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/imageUpload");
const { broadcast } = require("../utils/sseManager");

/**
 * Get all achievements - GET /api/admin/achievements
 */
exports.getAchievements = async (req, res, next) => {
  try {
    const achievements = await prisma.achievementContent.findMany({
      orderBy: { serial_no: "desc" },
    });

    res.json({
      success: true,
      data: achievements,
    });
  } catch (error) {
    console.error("Get achievements error:", error);
    next(error);
  }
};

/**
 * Create achievement - POST /api/admin/achievements
 */
exports.createAchievement = async (req, res, next) => {
  try {
    const { date_raw, achievement_date, title, description, category, linkedin_url, image_url, media_urls, mediaUrls } = req.body;
    // Support both snake_case and camelCase
    const resolvedMediaUrls = media_urls || mediaUrls || [];

    // DEBUG LOGGING
    console.log("[CREATE ACHIEVEMENT] Request body:", JSON.stringify(req.body, null, 2));
    console.log("[CREATE ACHIEVEMENT] Has file:", !!req.file);

    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({
        error: "Invalid input",
        message: "title is required",
      });
    }

    // Handle file upload if a file is present — append to media_urls
    let uploadedUrl = null;
    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(
          req.file.buffer,
          "srl_achievements",
          req.file.originalname
        );
        uploadedUrl = uploadResult.url;
      } catch (uploadError) {
        return res.status(500).json({
          error: "Upload failed",
          message: uploadError.message || "Failed to upload image to Cloudinary",
        });
      }
    }

    const isVideoMedia = (url) => {
      if (!url) return false;
      const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".quicktime"];
      const urlLower = url.toLowerCase();
      return (
        videoExtensions.some((ext) => urlLower.includes(ext)) ||
        urlLower.includes("/video/upload/")
      );
    };

    const baseMediaUrls = Array.isArray(resolvedMediaUrls) ? resolvedMediaUrls : [];
    const finalMediaUrls = uploadedUrl ? [...baseMediaUrls, uploadedUrl] : baseMediaUrls;
    console.log("[CREATE ACHIEVEMENT] Final media_urls:", finalMediaUrls);
    
    // Auto-detect type
    const detectedType = finalMediaUrls.length > 0 && isVideoMedia(finalMediaUrls[0]) ? "video" : "image";

    // Get the max serial_no and calculate the next one
    const maxSerialNo = await prisma.achievementContent.findFirst({
      orderBy: { serial_no: "desc" },
      select: { serial_no: true },
    });

    const nextSerialNo = (maxSerialNo?.serial_no || 0) + 1;

    const achievement = await prisma.achievementContent.create({
      data: {
        serial_no: nextSerialNo,
        date_raw: date_raw || null,
        achievement_date: achievement_date ? new Date(achievement_date) : null,
        title: title.trim(),
        description: description ? description.trim() : null,
        category: category ? category.trim() : null,
        type: detectedType,
        linkedin_url: linkedin_url ? linkedin_url.trim() : null,
        image_url: image_url || null,
        media_urls: finalMediaUrls,
        created_at: new Date(),
      },
    });

    broadcast('achievement_changed', { id: achievement.id });

    res.status(201).json({
      success: true,
      message: "Achievement created successfully",
      data: achievement,
    });
  } catch (error) {
    console.error("Create achievement error:", error);
    if (error.code === "P2002") {
      return res.status(400).json({
        error: "Conflict",
        message: "Duplicate entry error",
      });
    }
    next(error);
  }
};

/**
 * Update achievement - PUT /api/admin/achievements/:id
 */
exports.updateAchievement = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date_raw, achievement_date, title, description, category, type, linkedin_url, image_url, media_urls, mediaUrls } = req.body;
    // Support both snake_case and camelCase
    const resolvedMediaUrls = media_urls || mediaUrls;

    const isVideoMedia = (url) => {
      if (!url) return false;
      const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".quicktime"];
      const urlLower = url.toLowerCase();
      return (
        videoExtensions.some((ext) => urlLower.includes(ext)) ||
        urlLower.includes("/video/upload/")
      );
    };

    // DEBUG LOGGING
    console.log("[UPDATE ACHIEVEMENT] ID:", id);
    console.log("[UPDATE ACHIEVEMENT] Request body:", JSON.stringify(req.body, null, 2));
    console.log("[UPDATE ACHIEVEMENT] Has file:", !!req.file);

    const updateData = {};
    if (date_raw !== undefined) updateData.date_raw = date_raw;
    if (achievement_date !== undefined) updateData.achievement_date = achievement_date ? new Date(achievement_date) : null;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (type !== undefined) {
      updateData.type = type;
    }
    if (linkedin_url !== undefined) updateData.linkedin_url = linkedin_url;
    if (image_url !== undefined) updateData.image_url = image_url;

    // Handle file upload if a file is present — append to media_urls
    let uploadedUrl = null;
    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(
          req.file.buffer,
          "srl_achievements",
          req.file.originalname
        );
        uploadedUrl = uploadResult.url;
      } catch (uploadError) {
        return res.status(500).json({
          error: "Upload failed",
          message: uploadError.message || "Failed to upload image to Cloudinary",
        });
      }
    }

    if (uploadedUrl) {
      const baseMediaUrls = Array.isArray(resolvedMediaUrls) ? resolvedMediaUrls : [];
      const finalUrls = [...baseMediaUrls, uploadedUrl];
      updateData.media_urls = finalUrls;
      console.log("[UPDATE ACHIEVEMENT] Added uploaded file to media_urls:", uploadedUrl);
      
      // Auto-detect type if not explicitly provided
      if (type === undefined) {
        updateData.type = isVideoMedia(finalUrls[0]) ? "video" : "image";
      }
    } else if (resolvedMediaUrls !== undefined) {
      updateData.media_urls = resolvedMediaUrls;
      console.log("[UPDATE ACHIEVEMENT] Updating media_urls from payload:", resolvedMediaUrls);
      
      // Auto-detect type if not explicitly provided
      if (type === undefined && Array.isArray(resolvedMediaUrls) && resolvedMediaUrls.length > 0) {
        updateData.type = isVideoMedia(resolvedMediaUrls[0]) ? "video" : "image";
      }
    }

    console.log("[UPDATE ACHIEVEMENT] Final updateData:", JSON.stringify(updateData, null, 2));

    const achievement = await prisma.achievementContent.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    broadcast('achievement_changed', { id: achievement.id });

    res.json({
      success: true,
      message: "Achievement updated successfully",
      data: achievement,
    });
  } catch (error) {
    console.error("Update achievement error:", error);
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Not found",
        message: "Achievement not found",
      });
    }
    next(error);
  }
};

/**
 * Delete achievement - DELETE /api/admin/achievements/:id
 */
exports.deleteAchievement = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.achievementContent.delete({
      where: { id: parseInt(id) },
    });

    broadcast('achievement_changed', { id: parseInt(id) });

    res.json({
      success: true,
      message: "Achievement deleted successfully",
    });
  } catch (error) {
    console.error("Delete achievement error:", error);
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Not found",
        message: "Achievement not found",
      });
    }
    next(error);
  }
};

