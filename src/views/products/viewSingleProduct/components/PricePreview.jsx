import React from "react";
import { formatPrice } from '../../../../services/utils/gen_utility';

const PricePreview = ({ price = 0, discountPrice = 0, enableDiscount = false }) => {
  const percent =
    price && discountPrice && discountPrice <= price
      ? Math.round(((price - discountPrice) / price) * 100)
      : 0;

  // CASE 1 & 2: Discount not enabled OR percent = 0 → Only show main price
  if (!enableDiscount || percent === 0) {
    return (
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>Price Preview:</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#52c41a", fontWeight: 600, fontSize: 16 }}>
            {formatPrice(price)}
          </span>
        </div>
      </div>
    );
  }

  // CASE 3: Discount enabled & percent > 0 → Show full preview
  return (
    <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 16 }}>
      <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>Price Preview:</span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ textDecoration: "line-through", color: "#888" }}>
          {formatPrice(price)}
        </span>
        <span style={{ color: "#52c41a", fontWeight: 600, fontSize: 16 }}>
          {formatPrice(discountPrice)}
        </span>
        <span
          style={{
            color: "#ff4d4f",
            fontSize: 12,
            background: "#fff2f0",
            padding: "2px 6px",
            borderRadius: 10,
          }}
        >
          Save {percent}%
        </span>
      </div>
    </div>
  );
};

export default PricePreview;
