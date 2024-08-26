function CardBackRow({category} ){
    
    return (
        <div className="col-lg-6 mb-4">
                        <div className="card bg-info text-white shadow">
                            <div className="card-body">
                                <h2>{category}</h2>
                            </div>
                        </div>
                    </div>
    );
}


export default CardBackRow