import CardBackRow from './cards/CardBackRow';
import { useFetch } from '../../useFetch';

const CategoriesContent = () => {
    const { data, error, loading } = useFetch('http://localhost:3000/api/categories');
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="row">
            {data.resultados.map((category) => (
                <CardBackRow key={category.id} category={category.genero} />
            ))}
        </div>
    );
}

export default CategoriesContent;
