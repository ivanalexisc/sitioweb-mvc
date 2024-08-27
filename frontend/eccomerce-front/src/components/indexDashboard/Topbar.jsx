import avatar from '../../assets/images/dummy-avatar.jpg';

function Topbar() {
    return (
        <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
            
            <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                <i className="fa fa-bars"></i>
            </button>
            <form className="d-none d-sm-inline-block me-auto ms-md-3 my-2 my-md-0 mw-100 navbar-search">
  <div className="input-group">
    <input
      className="bg-light form-control border-0 small"
      type="text"
      placeholder="Search for ..."
    />
    <button className="btn btn-primary py-0" type="button">
      <i className="fas fa-search" />
    </button>
  </div>
</form>


            <ul className="navbar-nav ml-auto">

                <li className="nav-item dropdown no-arrow mx-1">
                    <a className="nav-link dropdown-toggle" href="/" id="alertsDropdown">
                        <i className="fas fa-bell fa-fw"></i>
                        <span className="badge badge-danger badge-counter">3+</span>
                    </a>
                </li>

                <li className="nav-item dropdown no-arrow mx-1">
                    <a className="nav-link dropdown-toggle" href="/" id="messagesDropdown">
                        <i className="fas fa-envelope fa-fw"></i>
                        <span className="badge badge-danger badge-counter">7</span>
                    </a>
                </li>

                <div className="topbar-divider d-none d-sm-block"></div>

                <li className="nav-item dropdown no-arrow">
                    <a className="nav-link dropdown-toggle" href="/" id="userDropdown">
                        <span className="mr-2 d-none d-lg-inline text-gray-600 small">Walter White</span>
                        <img 
                            className="img-profile rounded-circle" 
                            src={avatar}
                            width="60" 
                            alt="User Avatar"
                        />
                    </a>
                </li>

            </ul>

        </nav> 
    );
}
export default Topbar;
