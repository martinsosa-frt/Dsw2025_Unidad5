import { useEffect, useState } from "react";
import Card from "../../shared/components/Card";
import { getProducts } from "../services/listProducts";
import { getOrders } from "../services/listOrders";

function Home() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  const fetchProducts = async () => {
    try {
      const { data, error } = await getProducts("", "", 1, 1);

      if (error) throw error;

      setTotalProducts(data.total);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchOrders = async () => {
    try {
      const { data, error } = await getOrders("", "", 1, 1);

      if (error) throw error;

      setTotalOrders(data.total);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  return (
    <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2">
      <Card>
        <h3>Productos</h3>
        <p>Cantidad: {totalProducts} </p>
      </Card>

      <Card>
        <h3>Ordenes</h3>
        <p>Cantidad: {totalOrders}</p>
      </Card>
    </div>
  );
}

export default Home;
