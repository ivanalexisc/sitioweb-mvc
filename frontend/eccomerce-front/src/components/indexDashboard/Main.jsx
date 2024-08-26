import Topbar from './Topbar'
import PageContent from './Pagecontent';
import Footer from './Footer'
import ProductsDatabase from './ProductsDatabase';
function Main(){
    return(

    <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
            <Topbar/>
            <PageContent/>
            <ProductsDatabase/>
           <Footer/>
        </div>
    </div>
    );
}

export default Main