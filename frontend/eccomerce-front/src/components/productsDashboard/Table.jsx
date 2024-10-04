import Sidebar from "../indexDashboard/Sidebar";
import ProductsTable from './ProductsTable'
import Topbar from "../indexDashboard/Topbar";
const Table = ()=>{
    return (
     
     <div id="wrapper" >
    <Sidebar/>
    <div id="content-wrapper">
    <div id="content">
    <Topbar/>
    <ProductsTable/>
    </div>
    </div>
     </div>
     
   
    )
}
export default Table;