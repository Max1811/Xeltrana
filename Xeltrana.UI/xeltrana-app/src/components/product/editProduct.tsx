import { useParams } from "react-router-dom";
import ProductForm from "./productForm";

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="create-product-form-container">
      <ProductForm productId={Number(id)} />
    </div>
  );
};

export default EditProduct;
