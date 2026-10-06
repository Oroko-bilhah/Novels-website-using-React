import { Link } from 'react-router-dom'

function NovelCard({ novel, toggleFavorite, favorites }) {
  return (
    <div>
      <Link to={`/novel/${novel.id}`}>
        <img src={novel.image} alt={novel.name} />
      </Link>

      <Link to={`/novel/${novel.id}`}>
      <h2>{novel.name}</h2>
      </Link>
      <p>{novel.author}</p>
      <p>{novel.description}</p>

      <button onClick={() => toggleFavorite(novel)}>
        {favorites.includes(novel.id)
          ? "Remove Favorite"
          : "Favorite"}
      </button>
    </div>
  )
}

export default NovelCard
