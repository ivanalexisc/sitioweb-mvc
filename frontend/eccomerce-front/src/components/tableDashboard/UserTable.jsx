import Footer from "../indexDashboard/Footer";
const UserTable = ()=>{
    return(
      
   <div  className="d-flex flex-column" id="wrapper">
  <div className="container-fluid">
  <h3 className="text-dark mb-4">Usuarios En la BD</h3>
  <div className="card shadow">
    <div className="card-header py-3">
      <p className="text-primary m-0 fw-bold">Informacion de Usuarios</p>
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
              <th>Apellido</th>
              <th>Direccion</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>hola</td>
              <td>Accountant</td>
              <td>Tokyo</td>
              <td>33</td>
            </tr>
            
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