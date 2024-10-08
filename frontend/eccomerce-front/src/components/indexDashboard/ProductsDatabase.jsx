import { useFetch } from '../../useFetch';

function ProductsDatabase() {
    const { data, error, loading } = useFetch('http://localhost:3000/api/products');
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="card shadow mb-4">
            <h1 className="h3 mb-2 text-gray-800">All the products in the Database</h1>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Categories</th>
                                <th>Colors</th>
                                <th>Stock</th>
                            </tr>
                        </thead>
                        
                        <tbody>
							{error && <p>Error: {error}</p>}
							{loading && <p>Loading...</p>}
                            {data.resultados.map((product) => (
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
    );
}

export default ProductsDatabase;
