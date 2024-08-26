import TopRow from './TopRow'
import BackRow from './BackRow'
function PageContent(){
    return (
<div className="container-fluid">


<div className="d-sm-flex align-items-center justify-content-between mb-4">
    <h1 className="h3 mb-0 text-gray-800">App Dashboard</h1>
</div>

<TopRow/>
<BackRow/>





</div>
    );
}
export default PageContent;