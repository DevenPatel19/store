import { useParams } from "react-router-dom";
import CustomerForm from "../../components/Customerform.jsx";

export default function EditCustomer() {
  const { id } = useParams();
  return <CustomerForm mode="edit" />;
}
