import { Link } from 'react-router-dom'
import NovelCard from './NovelCard'
import { novels as allNovels } from './data/novels'
import { getSavedProgress } from './utils/readingProgress'

function Fiction({ favorites = [], toggleFavorite = () => {} }) {
  const fictionNovels = allNovels.filter((n) => n.category === 'Fiction')

  return (
    <div className="fiction-page-container">
      <nav className="fiction-breadcrumbs" aria-label="Breadcrumb">
        <Link to="/" className="fiction-back-link">
          ← Back to Library
        </Link>
        <span className="fiction-breadcrumb-sep">/</span>
        <span className="fiction-breadcrumb-current">Fiction Showcase</span>
      </nav>

      <header className="fiction-header">
        <span className="fiction-tag-pill">Curated Genre</span>
        <h1 className="fiction-title">Fiction Novels</h1>
        <p className="fiction-subtitle">
          Immerse yourself in captivating fiction stories spanning imagination, humanity, and wonder.
        </p>
        <div className="fiction-meta-badge">
          <span>📚 {fictionNovels.length} Fiction Novels Available</span>
        </div>
      </header>

      <div className="fiction-grid-wrapper">
        <ul className="novel-list fiction-list">
          {fictionNovels.map((novel) => {
            const progress = getSavedProgress(novel.id)
            return (
              <li key={novel.id}>
                <NovelCard
                  novel={novel}
                  toggleFavorite={toggleFavorite}
                  favorites={favorites}
                  progress={progress}
                />
              </li>
            )
          })}
        </ul>
      </div>

      <div className="fiction-footer-cta">
        <p>Want to explore other literary genres?</p>
        <Link to="/" className="fiction-cta-btn">
          Browse Full Library Catalog
        </Link>
      </div>
    </div>
  )
}

export default Fiction
