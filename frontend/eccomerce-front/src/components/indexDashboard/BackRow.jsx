import product_avatar from '../../assets/images/dummy-avatar.jpg';
import CardBackRow from './cards/CardBackRow';
const BackRow = () => {
    return(
        <div className="row">

    <div className="col-lg-6 mb-4">
        <div className="card shadow mb-4">
            <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Last product in Data Dase</h6>
            </div>
            <div className="card-body">
                <div className="text-center">
                <img
                                className="img-fluid px-3 px-sm-4 mt-3 mb-4"
                                style={{ width: "25rem" }} 
                                src={product_avatar}
                                alt="image dummy"
                            />
                </div>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, consequatur explicabo officia inventore libero veritatis iure voluptate reiciendis a magnam, vitae, aperiam voluptatum non corporis quae dolorem culpa exercitationem ratione?</p>
                <a target="_blank" rel="nofollow" href="/">View product detail</a>
            </div>
        </div>
    </div>


    <div className="col-lg-6 mb-4">						
        <div className="card shadow mb-4">
            <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Categories in Data Base</h6>
            </div>
            <div className="card-body">
                <div className="row">
                    <CardBackRow category="Category 01" />
                    <CardBackRow category="Category 02" />
                    <CardBackRow category="Category 03"/>
                    <CardBackRow category="Category 04" />
                    <CardBackRow category="Category 05" />
                    <CardBackRow category="Category 06"/>
                    
                </div>
            </div>
        </div>
    </div>
</div>
    );
}

export default BackRow;