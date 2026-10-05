import { Link } from 'react-router-dom'


function NovelCard ({novel, toggleFavorite}) {
    return
    (
        <div>
            <Link to={ '/novel/${novel.id}' }> <img src={novel.image} alt={novel.image} /></Link>
          <h2>
            {novel.name}
          </h2>
          <p>{novel.author}</p>
          <p>{novel.descption}</p>
          <button onClick= {()=> toggleFavorite(novel)}> 
            {
                favorites.includes(novel.id)
                ?"Remove Favorite"
                :"Favorite"
            }
          </button>
        </div>
    )
}
export default NovelCard