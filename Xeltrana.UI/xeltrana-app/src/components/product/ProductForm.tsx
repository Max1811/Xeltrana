import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../../services/api";
import "./productForm.css";
import { Audience } from "./models/products.model";
import {
  Color,
  ProductSize,
  ProductVariant,
  SizeType,
} from "../../types/types";

const ProductForm: React.FC = () => {
  const [tempRef] = useState(() => crypto.randomUUID());
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string>("");
  const [category, setCategory] = useState<number>(1);
  const [isForMen, setIsForMen] = useState(false);
  const [isForWomen, setIsForWomen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [availableColors, setAvailableColors] = useState<Color[]>([]);
  const [productSizes, setProductSizes] = useState<ProductSize[]>([]);

  const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const categoriesResult = await api.get("/products/categories");
        setCategories(categoriesResult.data as []);

        const productColors = await api.get<Color[]>("/products/colors");
        setAvailableColors(productColors.data);

        const productSizesData = await api.get<ProductSize[]>(
          "/products/sizes"
        );
        setProductSizes(productSizesData.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProductData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files);

    setFiles((prevFiles) => {
      const existingKeys = new Set(prevFiles.map((f) => f.name + f.size));
      const filteredNewFiles = newFiles.filter(
        (f) => !existingKeys.has(f.name + f.size)
      );
      return [...prevFiles, ...filteredNewFiles];
    });

    setPreviewUrls((prevUrls) => [
      ...prevUrls,
      ...newFiles.map((file) => URL.createObjectURL(file)),
    ]);

    e.target.value = "";
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    setPreviewUrls((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleFileUpload = async (file: File) => {
    const res = await api.post<any>("images/presign-upload", {
      fileName: file.name,
      tempRef,
      contentType: file.type,
    });

    const { uploadUrl } = res.data;

    await axios.put(uploadUrl, file, {
      headers: { "Content-Type": file.type },
    });
  };

  const handleAddVariant = () => {
    setProductVariants((prev) => [
      ...prev,
      {
        colorId: availableColors.length > 0 ? availableColors[0].id : 0,
        productSizes: [{ size: "", quantity: 1, sizeId: SizeType.Alpha }],
      },
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    setProductVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVariantChange = (
    index: number,
    field: keyof ProductVariant,
    value: any
  ) => {
    const newVariants = [...productVariants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setProductVariants(newVariants);
  };

  const handleSizeChange = (
    variantIndex: number,
    sizeIndex: number,
    field: keyof ProductSize,
    value: any
  ) => {
    const newVariants = [...productVariants];
    const updatedSizes = [...newVariants[variantIndex].productSizes];
    updatedSizes[sizeIndex] = {
      ...updatedSizes[sizeIndex],
      [field]: field === "quantity" ? Number(value) : value,
    };
    newVariants[variantIndex].productSizes = updatedSizes;
    setProductVariants(newVariants);
  };

  const handleAddSize = (variantIndex: number) => {
    const newVariants = [...productVariants];
    newVariants[variantIndex].productSizes.push({
      size: "",
      quantity: 1,
      sizeId: SizeType.Alpha,
    });
    setProductVariants(newVariants);
  };

  const handleRemoveSize = (variantIndex: number, sizeIndex: number) => {
    const newVariants = [...productVariants];
    newVariants[variantIndex].productSizes = newVariants[
      variantIndex
    ].productSizes.filter((_, i) => i !== sizeIndex);
    setProductVariants(newVariants);
  };

  const handleSubmit = async () => {
    for (const file of files) {
      await handleFileUpload(file);
    }

    await api.post("/products/product", {
      name,
      description,
      originalPrice: Number(price),
      categoryId: category,
      audienceId:
        isForMen && isForWomen
          ? Audience.Unisex
          : isForMen
          ? Audience.Men
          : Audience.Women,
      tempRef,
      productVariants,
    });

    alert("Successfully created!");
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Create Product</h2>

      <input
        className="form-input"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <textarea
        className="form-input"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        className="form-input"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <select
        className="form-input"
        value={category}
        onChange={(e) => setCategory(Number(e.target.value))}
      >
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <div className="checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={isForMen}
            onChange={(e) => setIsForMen(e.target.checked)}
          />
          <span>For Men</span>
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={isForWomen}
            onChange={(e) => setIsForWomen(e.target.checked)}
          />
          <span>For Women</span>
        </label>
      </div>

      <div className="file-upload-wrapper">
        <label htmlFor="fileUpload" className="custom-file-upload">
          Choose Images
        </label>
        <input
          id="fileUpload"
          type="file"
          multiple
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <span className="files-selected-number">
          {files.length > 0
            ? `${files.length} file(s) selected`
            : "No files selected"}
        </span>
      </div>

      <div className="preview-grid">
        {previewUrls.map((url, index) => (
          <div key={index} className="preview-image-wrapper">
            <img src={url} alt={`preview-${index}`} className="preview-image" />
            <button
              type="button"
              className="remove-button"
              onClick={() => handleRemoveFile(index)}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <h3>Product Variants</h3>
      <button type="button" onClick={handleAddVariant}>
        Add Variant
      </button>

      {productVariants.map((variant, i) => (
        <div
          key={i}
          style={{
            margin: "10px 0",
            border: "1px solid #ccc",
            padding: "10px",
          }}
        >
          <select
            value={variant.colorId}
            onChange={(e) =>
              handleVariantChange(i, "colorId", Number(e.target.value))
            }
          >
            {availableColors.map((color) => (
              <option key={color.id} value={color.id}>
                {color.name}
              </option>
            ))}
          </select>

          <button type="button" onClick={() => handleRemoveVariant(i)}>
            Remove Variant
          </button>

          <div>
            {variant.productSizes.map((size, j) => (
              <div key={j}>
                <input
                  placeholder="Size"
                  value={size.size}
                  onChange={(e) =>
                    handleSizeChange(i, j, "size", e.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={size.quantity}
                  onChange={(e) =>
                    handleSizeChange(i, j, "quantity", e.target.value)
                  }
                />
                <button onClick={() => handleRemoveSize(i, j)}>
                  Remove Size
                </button>
              </div>
            ))}
            <button type="button" onClick={() => handleAddSize(i)}>
              Add Size
            </button>
          </div>
        </div>
      ))}

      <button className="form-button" onClick={handleSubmit}>
        Create Product
      </button>
    </div>
  );
};

export default ProductForm;
