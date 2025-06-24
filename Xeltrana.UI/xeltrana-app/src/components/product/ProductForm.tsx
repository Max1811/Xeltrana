import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../../services/api";
import "./productForm.css";
import { Audience } from "./models/products.model";
import {
  Color,
  Product,
  ProductSize,
  ProductVariantCreate,
  SizeType,
} from "../../types/types";
import {
  mapProductVariantCreateToVariants,
  mapVariantsToProductVariantCreate,
} from "./productForm.model";

type ProductFormProps = {
  productId?: number;
};

const ProductForm: React.FC<ProductFormProps> = ({ productId }) => {
  const productOption = productId ? "Update Product" : "Create Product";

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
  const [selectedType, setSelectedType] = useState<SizeType>(SizeType.Clothes);
  const [productSizes, setProductSizes] = useState<ProductSize[]>([]);
  const [createProductVariant, setCreateProductVariant] =
    useState<ProductVariantCreate>({ availableItems: [] });

  const sizeTypeOptions = Object.keys(SizeType)
    .filter((key) => !isNaN(Number(SizeType[key as any])))
    .map((key) => ({
      label: key,
      value: SizeType[key as keyof typeof SizeType],
    }));

  useEffect(() => {
    const fetchEditProductData = async () => {
      const product = await api.get<Product>(`/products/${productId}`);
      const productData = product.data;

      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.originalPrice.toString());
      setCategory(productData.categoryId);
      setIsForMen(
        productData.audienceId === Audience.Men ||
          productData.audienceId === Audience.Unisex
      );
      setIsForWomen(
        productData.audienceId === Audience.Women ||
          productData.audienceId === Audience.Unisex
      );

      setPreviewUrls(productData.images);

      const mappedProductVariantData = mapVariantsToProductVariantCreate(
        productData.productVariants
      );
      setCreateProductVariant(mappedProductVariantData);
    };

    if (productId) {
      fetchEditProductData();
    }
  }, [productId]);

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

  const toggleColor = (color: {
    colorId: number;
    hexCode: string;
    color: string;
  }) => {
    setCreateProductVariant((prev) => {
      const exists = prev.availableItems.find(
        (c) => c.colorId === color.colorId
      );

      const newAvailableItems = exists
        ? prev.availableItems.filter((c) => c.colorId !== color.colorId)
        : [...prev.availableItems, { ...color, sizes: [] }];

      return { ...prev, availableItems: newAvailableItems };
    });
  };

  const addSizeToColor = (colorId: number, size: ProductSize) => {
    setCreateProductVariant((prev) => {
      const updatedItems = prev.availableItems.map((color) => {
        if (color.colorId !== colorId) return color;

        const alreadyExists = color.sizes.some((s) => s.sizeId === size.id);
        if (alreadyExists) return color;

        return {
          ...color,
          sizes: [
            ...color.sizes,
            { sizeId: size.id, size: size.name, stockAmount: 1 },
          ],
        };
      });

      return { ...prev, availableItems: updatedItems };
    });
  };

  const removeSizeFromColor = (colorId: number, sizeId: number) => {
    setCreateProductVariant((prev) => {
      const updatedItems = prev.availableItems.map((color) => {
        if (color.colorId !== colorId) return color;

        return {
          ...color,
          sizes: color.sizes.filter((size) => size.sizeId !== sizeId),
        };
      });

      return { ...prev, availableItems: updatedItems };
    });
  };

  const updateStockAmount = (
    colorId: number,
    sizeId: number,
    stock: number
  ) => {
    setCreateProductVariant((prev) => {
      const updatedItems = prev.availableItems.map((color) => {
        if (color.colorId !== colorId) return color;

        const updatedSizes = color.sizes.map((size) =>
          size.sizeId === sizeId ? { ...size, stockAmount: stock } : size
        );

        return { ...color, sizes: updatedSizes };
      });

      return { ...prev, availableItems: updatedItems };
    });
  };

  const handleSubmit = async () => {
    for (const file of files) {
      await handleFileUpload(file);
    }
    console.log(files);
    console.log(previewUrls);
    const productVariantsMapped =
      mapProductVariantCreateToVariants(createProductVariant);

    if (productId) {
      const updateProduct = {
        id: productId,
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
        productVariants: productVariantsMapped,
        Images: previewUrls,
      };

      await api.put("/products/product", updateProduct);
    } else {
      const createProduct = {
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
        productVariants: productVariantsMapped,
      };

      await api.post("/products/product", createProduct);
    }

    alert(`Successfully ${productId ? "Updated" : "Created"}!`);
  };

  return (
    <div className="form-container">
      <h2 className="form-title">{productOption}</h2>

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

      <label htmlFor="categorySelect">Select Category:</label>
      <select
        id="categorySelect"
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
      <div className="colors-section">
        <label htmlFor="sizeTypeSelect">Select Size Type:</label>
        <select
          id="sizeTypeSelect"
          value={selectedType}
          onChange={(e) => setSelectedType(Number(e.target.value))}
          className="custom-select"
        >
          {sizeTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p>Select Colors:</p>
        <div className="color-buttons">
          {availableColors.map((color) => {
            const selected = createProductVariant.availableItems.some(
              (c) => c.colorId === color.id
            );
            return (
              <button
                key={color.id}
                className={`color-button ${selected ? "selected" : ""}`}
                style={{ backgroundColor: color.hexCode }}
                onClick={() =>
                  toggleColor({
                    color: color.name,
                    colorId: color.id,
                    hexCode: color.hexCode,
                  })
                }
              />
            );
          })}
        </div>
      </div>

      <div className="variants-section">
        {createProductVariant.availableItems.map((color) => (
          <div key={color.colorId} className="color-block">
            <div
              className="color-size-wrapper"
              style={{ display: "flex", alignItems: "center" }}
            >
              <h3>{color.color}</h3>
              <div
                className={"color-button"}
                style={{
                  backgroundColor: color.hexCode,
                  marginLeft: "10px",
                  cursor: "default",
                }}
              ></div>
            </div>

            <div className="size-buttons">
              {productSizes
                .filter((size) => size.type === selectedType)
                .map((size) => {
                  const alreadyAdded = color.sizes.some(
                    (s) => s.sizeId === size.id
                  );
                  return (
                    <button
                      key={size.id}
                      className={`size-button ${
                        alreadyAdded ? "disabled" : ""
                      }`}
                      onClick={() => addSizeToColor(color.colorId, size)}
                      disabled={alreadyAdded}
                    >
                      {size.name}
                    </button>
                  );
                })}
            </div>

            <div className="stock-inputs">
              {color.sizes.map((size) => (
                <div key={size.sizeId} className="stock-row">
                  <span className="size-label">{size.size}</span>
                  <input
                    type="number"
                    value={size.stockAmount}
                    className="stock-input"
                    onChange={(e) =>
                      updateStockAmount(
                        color.colorId,
                        size.sizeId,
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                  <button
                    className="remove-size"
                    onClick={() =>
                      removeSizeFromColor(color.colorId, size.sizeId)
                    }
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className="form-button" onClick={handleSubmit}>
        {productOption}
      </button>
    </div>
  );
};

export default ProductForm;
