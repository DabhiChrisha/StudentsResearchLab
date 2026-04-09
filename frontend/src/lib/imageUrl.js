import urlMap from "../../../cloudinary-url-map.json";

const safeDecode = (value) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

export const getImageUrl = (path) => {
  if (!path || typeof path !== "string") return path;

  const normalized = path.replace(/\\/g, "/");
  const decoded = safeDecode(normalized);
  const withoutLeadingSlash = normalized.replace(/^\/+/, "");
  const decodedWithoutLeadingSlash = decoded.replace(/^\/+/, "");

  const candidates = [
    normalized,
    decoded,
    withoutLeadingSlash,
    decodedWithoutLeadingSlash,
    `frontend/public/${withoutLeadingSlash}`,
    `frontend/public/${decodedWithoutLeadingSlash}`,
    `frontend/src/assets/${withoutLeadingSlash.replace(/^assets\//, "")}`,
    `frontend/src/assets/${decodedWithoutLeadingSlash.replace(/^assets\//, "")}`,
  ];

  const match = candidates.find((candidate) => urlMap[candidate]);
  return match ? urlMap[match] : path;
};

export const getImageUrls = (paths = []) => paths.map(getImageUrl);
