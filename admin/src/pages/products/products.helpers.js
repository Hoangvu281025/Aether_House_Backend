// src/utils/products.helpers.js
export const getMainImage = (item) =>
  item?.images?.find((img) => img.is_main) || item?.images?.[0];

export const getVariants = (p) =>
  p?.variants || p?.productVariants || p?.colorVariants || [];
