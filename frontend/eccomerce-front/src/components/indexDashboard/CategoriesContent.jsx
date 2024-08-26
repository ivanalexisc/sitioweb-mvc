import CardBackRow from './cards/CardBackRow';
import { useFetch } from '../../useFetch';

const CategoriesContent = () => {
    const { data, error, loading } = useFetch('http://localhost:3000/api/categories');
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="col-lg-6 mb-4">						
            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Categories in Data Base</h6>
                </div>
                <div className="card-body">
                    <div className="row">
                        {data.resultados.map((category) => (
                            <CardBackRow key={category.id} category={category.genero} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CategoriesContent;