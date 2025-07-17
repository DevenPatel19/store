// src/pages/EditInvoice.jsx
import React from "react";
import { useParams } from "react-router-dom";
import InvoiceForm from "../../components/Invoiceform";

const EditInvoice = () => {
  const { id } = useParams(); // ✅ this replaces match.params.id

  return <InvoiceForm mode="edit" id={id} />;
};

export default EditInvoice;

