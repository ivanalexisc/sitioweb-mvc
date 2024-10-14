import { useState } from "react";
import Footer from "../indexDashboard/Footer";
import { useFetch } from '../../useFetch';
import './Productstable.css'

const ProductsTable = () => {
  const { data, error, loading } = useFetch('http://localhost:3000/api/products');
  const [editingProduct, setEditingProduct] = useState(null); // Estado para el producto a editar
  const [newProduct, setNewProduct] = useState({ nombre: '', precio: '', cantidad: '', id_categoria:'', id_color:''}); // Estado para el nuevo producto
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Estado para abrir/cerrar el modal de agregar producto

  const handleDeleteProduct = (productId) => {
    console.log("Producto eliminado con ID:", productId);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    console.log("Editando producto:", product);
  };

  const handleSaveEdit = () => {
    console.log("Producto guardado:", editingProduct);
    setEditingProduct(null); // Limpiamos el estado después de guardar
  };

  const handleAddProduct = () => {
    console.log("Producto agregado:", newProduct);
    // Aquí puedes hacer la lógica para enviar el nuevo producto al backend
    setIsAddModalOpen(false); // Cierra el modal después de agregar el producto
    setNewProduct({ nombre: '', precio: '', cantidad: '' }); // Limpia el formulario
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="d-flex flex-column" id="wrapper">
      <div className="container-fluid">
        <h3 className="text-dark mb-4">Productos en la Base de datos</h3>
        <div className="card shadow">
          <div className="card-header py-3">
            <p className="text-primary m-0 fw-bold">Información de Productos</p>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-12 text-end">
                <button
                  className="btn btn-success mb-3"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  Agregar Producto
                </button>
              </div>
            </div>

            <div className="table-responsive table mt-2">
              <table className="table my-0">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Categoría</th>
                    <th>Color</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {data.resultados.map((product) => (
                    <tr key={product.id}>
                      <td>{product.nombre}</td>
                      <td>{product.precio}</td>
                      <td>{product.Categorie?.genero}</td>
                      <td>{product.Color?.nombre}</td>
                      <td>{product.cantidad}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm me-2"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          Eliminar
                        </button>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleEditProduct(product)}
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para editar un producto */}
      {editingProduct && (
        <div className="modal">
          <div className="modal-content">
            <h4>Editando Producto</h4>
            <label>
              Nombre:
              <input
                type="text"
                value={editingProduct.nombre}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, nombre: e.target.value })
                }
              />
            </label>
            <label>
              Precio:
              <input
                type="number"
                value={editingProduct.precio}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, precio: e.target.value })
                }
              />
            </label>
            <label>
              Stock:
              <input
                type="number"
                value={editingProduct.cantidad}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, cantidad: e.target.value })
                }
              />
            </label>
            <button className="btn btn-primary" onClick={handleSaveEdit}>
              Guardar
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setEditingProduct(null)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Modal para agregar un nuevo producto */}
      {isAddModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h4>Agregar Producto</h4>
            <label>
              Nombre:
              <input
                type="text"
                value={newProduct.nombre}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, nombre: e.target.value })
                }
              />
            </label>
            <label>
              Precio:
              <input
                type="number"
                value={newProduct.precio}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, precio: e.target.value })
                }
              />
            </label>
            <label>
              Stock:
              <input
                type="number"
                value={newProduct.cantidad}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, cantidad: e.target.value })
                }
              />
            </label>
            <button className="btn btn-primary" onClick={handleAddProduct}>
              Guardar
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductsTable;
