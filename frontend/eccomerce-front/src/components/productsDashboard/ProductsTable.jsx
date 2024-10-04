import Footer from "../indexDashboard/Footer";
import { useFetch } from '../../useFetch';
const UserTable = ()=>{
  const { data, error, loading } = useFetch('http://localhost:3000/api/products');
    
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;


    return(
      
   <div  className="d-flex flex-column" id="wrapper">
  <div className="container-fluid">
  <h3 className="text-dark mb-4">Productos en la Base de datos</h3>
  <div className="card shadow">
    <div className="card-header py-3">
      <p className="text-primary m-0 fw-bold">Informacion de Productos</p>
    </div>
    <div className="card-body">
      <div className="row">
        <div className="col-md-6 text-nowrap">
          <div
            id="dataTable_length"
            className="dataTables_length"
            aria-controls="dataTable"
          >
            
          </div>
        </div> 
      </div>
      <div
        className="table-responsive table mt-2"
        id="dataTable"
        role="grid"
        aria-describedby="dataTable_info"
      >
        <table className="table my-0" id="dataTable">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Categoria</th>
              <th>Color</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
          {error && <p>Error: {error}</p>}
          {loading && <p>Loading...</p>}
          {data.resultados.map ((product) => (
            <tr key={product.id}>
                <td>{product.nombre}</td>
                <td>{product.precio}</td>
                <td>{product.Categorie?.genero}</td>
                <td>{product.Color?.nombre}</td>
                <td>{product.cantidad}</td>
            </tr>
          ))}
            
            
          </tbody>
          
        </table>
      </div>
    </div>
  </div>
</div>
       <Footer/>
       </div>
        
    )
}
export default UserTable;