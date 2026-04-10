/**
 * Returns the image URL as-is.
 * All images are stored as full Cloudinary URLs in the database.
 * Local public assets (e.g. /logo.png) are served directly by Vite.
 */
export const getImageUrl = (path) => {
  if (!path || typeof path !== "string") return path;
  return path;
};

export const getImageUrls = (paths = []) => paths.map(getImageUrl);
