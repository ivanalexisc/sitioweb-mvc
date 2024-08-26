function CardBackRow({ category }) {
    return (
        <div className="col-lg-6 mb-4">
            <div className="card bg-light text-black shadow">
                <div className="card-body">
                    {category}
                </div>
            </div>
        </div>
    );
}

export default CardBackRow;