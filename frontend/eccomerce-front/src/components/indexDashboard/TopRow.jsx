import React from "react";
import CardTopRow from './cards/CardTopRow';
import { useFetch } from '../../useFetch';

const TopRow = () => {
  const { data, error, loading } = useFetch("http://localhost:3000/api/products");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Accede a los productos en 'data.resultados'
  const productCount = data?.resultados?.length || 0;

  // Calcular la suma de los precios de los productos asegurándonos de que son números
  const totalAmount = data?.resultados?.reduce((acc, product) => acc + parseFloat(product.precio), 0) || 0;

  return (
    <div className="row">
      <CardTopRow 
        text="Products in database" 
        number={productCount} 
        borderColorClass="border-left-primary" 
      />
      <CardTopRow 
        text="Amounts in products" 
        number={`$${totalAmount.toFixed(2)}`} // Mostrar la suma total de los precios con 2 decimales
        borderColorClass="border-left-success" 
      />
      <CardTopRow 
        text="Sales" 
        number="130" 
        borderColorClass="border-left-warning" 
      />
    </div>
  );
}

export default TopRow;
