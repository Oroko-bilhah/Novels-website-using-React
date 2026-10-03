import { useParams } from 'react-router-dom'
function Novel () {
    const { id } = useParams()
    return (
        <div>
           <h1>Novel Page</h1>
           <p>This is where the novel will be read</p>
           <p>Novel ID: {id}</p>

        </div>
    )
}

export default Novel