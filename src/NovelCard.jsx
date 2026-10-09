import { Link } from 'react-router-dom'
import { useState } from 'react'

function NovelCard({ novel, toggleFavorite, favorites, progress }) {
  const [imageError, setImageError] = useState(false)
  const isFavorite = favorites && favorites.includes(novel.id)
  const hasProgress = progress && typeof progress.percentage === 'number' && progress.percentage > 0
  const isStoryAvailable = novel.id <= 8

  const readTarget = isStoryAvailable
    ? hasProgress
      ? `/read/${novel.id}?resume=true`
      : `/read/${novel.id}`
    : `/novel/${novel.id}`

  return (
    <article className="novel-card-article">
      <div className="novel-card-media-wrap">
        <Link 
          to={`/novel/${novel.id}`}
          className="novel-card-cover-link"
          aria-label={`View book details for ${novel.name} by ${novel.author}`}
        >
          {imageError ? (
            <div className="novel-card-fallback-cover" aria-hidden="true">
              <span className="fallback-book-icon">📖</span>
              <span className="fallback-title">{novel.name}</span>
            </div>
          ) : (
            <img
              src={novel.image}
              alt={`Cover art for ${novel.name}`}
              className="novel-card-image"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          )}
        </Link>
        {novel.category && (
          <span className="novel-card-category-badge">{novel.category}</span>
        )}
      </div>

      <div className="novel-card-content">
        <div className="novel-card-header">
          <Link 
            to={`/novel/${novel.id}`}
            className="novel-card-title-link"
          >
            <h3 className="novel-card-title">{novel.name}</h3>
          </Link>
          <p className="novel-card-author">by {novel.author}</p>
        </div>

        <p className="novel-card-desc">{novel.description}</p>

        {/* Reading progress display */}
        <div className="novel-card-progress-section">
          {hasProgress ? (
            <div className="novel-card-progress-active">
              <div className="card-progress-labels">
                <span className="card-progress-status">
                  {progress.percentage === 100
                    ? 'Completed ✓'
                    : `Ch. ${progress.chapterIndex + 1} • Page ${progress.currentPage + 1}`}
                </span>
                <span className="card-progress-pct">{progress.percentage}%</span>
              </div>
              <div
                className="card-progress-track"
                role="progressbar"
                aria-valuenow={progress.percentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Reading progress for ${novel.name}: ${progress.percentage} percent`}
              >
                <div
                  className="card-progress-fill"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="novel-card-progress-unread">
              <span className="card-unread-indicator">
                {isStoryAvailable ? 'Unread' : 'Preview'}
              </span>
              <span className="card-meta-pages">
                {novel.totalPages ? `${novel.totalPages} pages` : '5 chapters'}
              </span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="novel-card-actions">
          <button
            type="button"
            onClick={() => toggleFavorite(novel)}
            className={`card-favorite-btn ${isFavorite ? 'active' : ''}`}
            aria-label={isFavorite ? `Remove ${novel.name} from favorites` : `Add ${novel.name} to favorites`}
            aria-pressed={isFavorite}
          >
            <span className="fav-heart" aria-hidden="true">
              {isFavorite ? '♥' : '♡'}
            </span>
            <span className="fav-text">
              {isFavorite ? 'Favorited' : 'Favorite'}
            </span>
          </button>

          <Link
            to={readTarget}
            className={`card-read-link ${hasProgress ? 'resume-btn' : ''}`}
            aria-label={hasProgress ? `Continue reading ${novel.name}` : `Read ${novel.name}`}
          >
            {hasProgress ? 'Continue →' : isStoryAvailable ? 'Read Now →' : 'Details →'}
          </Link>
        </div>
      </div>
    </article>
  )
}

export default NovelCard
