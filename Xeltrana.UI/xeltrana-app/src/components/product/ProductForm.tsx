import React, { useState } from "react";
import axios from "axios";
import api from "../../services/api";
import "./productForm.css";

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

  const categoryOptions = [1, 2, 3, 4];

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

    e.target.value = ""; // allow re-selection of the same file
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

  const handleSubmit = async () => {
    for (const file of files) {
      await handleFileUpload(file);
    }

    await api.post("/products/product", {
      name,
      description,
      price: Number(price),
      categoryId: category,
      isForMen,
      isForWomen,
      tempRef,
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
        {categoryOptions.map((cat) => (
          <option key={cat} value={cat}>
            Category {cat}
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

      <button className="form-button" onClick={handleSubmit}>
        Create Product
      </button>
    </div>
  );
};

export default ProductForm;
