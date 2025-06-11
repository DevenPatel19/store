import { useParams } from "react-router-dom";
import ProductForm from "../components/Productform.jsx";

export default function EditProduct() {
  const { id } = useParams();
  return <ProductForm mode="edit" id={id} />;
}
