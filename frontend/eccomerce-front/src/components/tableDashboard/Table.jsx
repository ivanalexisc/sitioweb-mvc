import Sidebar from "../indexDashboard/Sidebar";
import UserTable from './UserTable'
import Topbar from "../indexDashboard/Topbar";
const Table = ()=>{
    return (
     
     <div id="wrapper" >
    <Sidebar/>
    <div id="content-wrapper">
    <div id="content">
    <Topbar/>
    <UserTable/>
    </div>
    </div>
     </div>
     
   
    )
}
export default Table;