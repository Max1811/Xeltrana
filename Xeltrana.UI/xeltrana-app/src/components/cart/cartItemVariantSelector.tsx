import React, { useEffect, useState } from "react";
import { ViewProductVariant } from "../../types/types";
import "./cartItemVariantSelector.css";
import api from "../../services/api";
import { useStoreContext } from "../../context/storeContext";

type Props = {
  variants: ViewProductVariant[] | null;
  cartItemId: number;
  selectedProductVariantId?: number;
};

const VariantSelector: React.FC<Props> = ({
  variants,
  cartItemId,
  selectedProductVariantId,
}) => {
  const colors = Array.from(
    new Map(variants?.map((v) => [v.colorId, v])).values()
  );

  const { cart } = useStoreContext();

  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
  const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSizeId(parseInt(e.target.value));
  };

  useEffect(() => {
    if (selectedProductVariantId) {
      const selectedVariant = variants?.find(
        (v) => v.id === selectedProductVariantId
      );

      setSelectedColorId(selectedVariant?.colorId as number | null);
      setSelectedSizeId(selectedVariant?.sizeId as number | null);
    }
  }, [selectedProductVariantId, variants]);

  const handleSave = async () => {
    const selectedVariant = variants?.find(
      (v) => v.colorId === selectedColorId && v.sizeId === selectedSizeId
    );

    await api.put(`/cart/cartItem/${cartItemId}/productVariant`, {
      productVariantId: selectedVariant?.id,
    });

    cart.refreshCart();
  };

  const filteredSizes = selectedColorId
    ? variants?.filter((v) => v.colorId === selectedColorId)
    : [];

  const isButtonEnabled = selectedColorId !== null && selectedSizeId !== null;

  return (
    <div className="variant-selector">
      <div className="color-dropdown-wrapper">
        <div
          className="color-dropdown-toggle"
          onClick={() => setIsColorDropdownOpen((prev) => !prev)}
        >
          {selectedColorId ? (
            <>
              <span
                className="color-circle"
                style={{
                  backgroundColor: colors.find(
                    (c) => c.colorId === selectedColorId
                  )?.hexCode,
                }}
              ></span>
              <span>
                {colors.find((c) => c.colorId === selectedColorId)?.color}
              </span>
            </>
          ) : (
            <span>Select color</span>
          )}
        </div>

        {isColorDropdownOpen && (
          <div className="color-dropdown-options">
            {colors.map((c) => (
              <div
                key={c.colorId}
                className="color-option"
                onClick={() => {
                  setSelectedColorId(c.colorId);
                  setSelectedSizeId(null);
                  setIsColorDropdownOpen(false);
                }}
              >
                <span
                  className="color-circle"
                  style={{ backgroundColor: c.hexCode }}
                ></span>
                <span>{c.color}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <select
        value={selectedSizeId ?? ""}
        onChange={handleSizeChange}
        disabled={!selectedColorId}
      >
        <option value="" disabled>
          Select size
        </option>
        {filteredSizes?.map((v) => (
          <option key={v.sizeId} value={v.sizeId}>
            {v.size}
          </option>
        ))}
      </select>

      <button
        className="save-button"
        onClick={handleSave}
        disabled={!isButtonEnabled}
      >
        Save
      </button>
    </div>
  );
};

export default VariantSelector;
