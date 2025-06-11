import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ShowOne = () => {
  const [product, setProduct] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/${id}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
      });
  }, [id]);

  if (!product) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
      <p><strong>SKU:</strong> {product.sku}</p>
      <p><strong>Barcodes:</strong> {product.barcodes}</p>
      <p><strong>Quantity:</strong> {product.quantity}</p>
      <p><strong>Low Stock Threshold:</strong> {product.threshold}</p>
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Category:</strong> {product.category}</p>
      {product.photoUrl && (
        <img
          src={product.photoUrl}
          alt={product.name}
          className="w-full mt-4 border rounded"
        />
      )}
    </div>
  );
};

export default ShowOne;
