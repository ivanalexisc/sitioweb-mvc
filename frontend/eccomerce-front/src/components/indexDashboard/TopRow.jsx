import CardTopRow from './cards/CardTopRow'


const  TopRow = () => {
    return (
        <div className="row">

 
    <CardTopRow text="Products in database" number="135" borderColorClass="border-left-primary" />
    <CardTopRow text="Amounts in products" number="$12000" borderColorClass="border-left-success" />
    <CardTopRow text="Sales" number="130" borderColorClass="border-left-warning" />
    
</div>
    );
}

export default TopRow;