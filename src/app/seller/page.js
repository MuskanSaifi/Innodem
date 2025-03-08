async function productlist() {
    const products = await fetch("http://localhost:3000/api/seller")
    const data = await products.json()
    return data
}
const seller = async () => {
    let seller = await productlist()
    return (
        <>
        <div className="container mt-5 mb-5">
<div className="row">

            <h1>Seller</h1>
            {
                seller.map((item) => (
                    <div className="col-md-3">
                        <div className="card shadow mb-3 p-2">

                    <p className="cat-title">{item.name}</p>
                        </div>
                        </div>
                        
                ))
            }
            </div>
            </div>
        </>
    )
}
export function generateMetadata() {
    return {
        title: "seller"
    }
}

export default seller