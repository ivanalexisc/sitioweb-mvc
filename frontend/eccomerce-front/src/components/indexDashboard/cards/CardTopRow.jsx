function CardTopRow({text,number,borderColorClass}){
    return(
        <div className="col-md-4 mb-4">
        <div className={`card ${borderColorClass} shadow h-100 py-2`}>
            <div className="card-body">
                <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1"> {text} </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800"> {number} </div>
                    </div>
                    <div className="col-auto">
                        <i className="fas fa-clipboard-list fa-2x text-gray-300"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}
export default CardTopRow;