
function Sidebar() {
  return (
    <nav className="navbar align-items-start sidebar sidebar-dark accordion bg-gradient-primary p-0 navbar-dark">
    <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
      
      <a className="sidebar-brand d-flex align-items-center justify-content-center" href="/">
        <div className="sidebar-brand-icon">
          <i className="fas fa-chart-line"></i>
        </div>
        <div className="sidebar-brand-text mx-3">Admin</div>
      </a>
      
      <hr className="sidebar-divider my-0" />
      
      <li className="nav-item active">
        <a className="nav-link" href="/">
          <i className="fas fa-fw fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </a>
      </li>
      
      <hr className="sidebar-divider" />
      
      <div className="sidebar-heading">Actions</div>
      
      <li className="nav-item">
        <a className="nav-link collapsed" href="/usuarios ">
          <i className="fas fa-fw fa-folder"></i>
          <span>Usuarios</span>
        </a>
      </li>
      
      <li className="nav-item">
        <a className="nav-link" href="/productos">
          <i className="fas fa-fw fa-chart-area"></i>
          <span>Productos</span>
        </a>
      </li>
      
      <li className="nav-item">
        <a className="nav-link" href="/">
          <i className="fas fa-fw fa-table"></i>
          <span>Tables</span>
        </a>
      </li>
      
      <hr className="sidebar-divider d-none d-md-block" />
    </ul>
    </nav>
  );
}

export default Sidebar;