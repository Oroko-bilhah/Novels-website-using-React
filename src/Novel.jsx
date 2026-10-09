import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { stories } from './data/stories/index.js'

import {
  getSavedProgress,
  removeNovelProgress,
  getSavedFavorites,
  saveFavorites,
} from './utils/readingProgress.js'
import NovelCard from './NovelCard.jsx'
import './Novel.css'

function Novel() {
  const { id } = useParams()
  const novelId = Number(id)
  const [imageError, setImageError] = useState(false)
  const [favorites, setFavorites] = useState(() => getSavedFavorites())

  const [novelMeta, setNovelMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [relatedNovels, setRelatedNovels] = useState([])

  useEffect(() => {
  async function fetchNovel() {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/books/${novelId}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch book')
      }

      const data = await response.json()
setNovelMeta(data.book)

const booksResponse = await fetch('http://localhost:5000/api/v1/books')

if (booksResponse.ok) {
  const booksData = await booksResponse.json()

  setRelatedNovels(
    booksData.books
      .filter(
        (book) =>
          book.category === data.book.category &&
          book.id !== data.book.id
      )
      .slice(0, 3)
  )
}
    } catch (err) {
      setError('Could not load this book.')
    } finally {
      setLoading(false)
    }
  }

  fetchNovel()
}, [novelId])
  const story = stories.find((s) => s.id === novelId)
  const saved = getSavedProgress(novelId)

  // Toggle favorite for this book
  const isFavorite = favorites.includes(novelId)
  const toggleFavorite = () => {
    setFavorites((prev) => {
      const next = prev.includes(novelId)
        ? prev.filter((i) => i !== novelId)
        : [...prev, novelId]
      saveFavorites(next)
      return next
    })
  }

  const handleResetProgress = () => {
    removeNovelProgress(novelId)
    window.location.reload()
  }


   if (loading) {
  return (
    <div className="novel-reader-wrapper">
      <p>Loading book details...</p>
    </div>
  )
}
if (error || !novelMeta) {
    return (
      <div className="novel-reader-wrapper">
        <div className="reader-error-card" role="alert">
          <div className="reader-error-icon" aria-hidden="true">📖</div>
          <h2>Novel Not Found</h2>
          <p>We couldn&apos;t find a book with ID <strong>#{id}</strong> in our catalog.</p>
          <div className="reader-error-actions">
            <Link to="/" className="reader-nav-btn primary">
              ← Return to Library
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const totalPagesInBook = story
    ? story.chapters.reduce((total, ch) => total + ch.pages.length, 0)
    : novelMeta.totalPages || 25

  const totalChapters = story ? story.chapters.length : novelMeta.totalChapters || 5

  return (
    <div className="novel-details-page-wrapper">
      {/* Top Breadcrumb Navigation */}
      <nav className="reader-top-nav" aria-label="Book breadcrumbs">
        <div className="reader-breadcrumbs">
          <Link to="/" className="reader-breadcrumb-link">
            Library
          </Link>
          <span className="reader-breadcrumb-sep" aria-hidden="true">/</span>
          {novelMeta.category && (
            <>
              <span className="reader-breadcrumb-sub">{novelMeta.category}</span>
              <span className="reader-breadcrumb-sep" aria-hidden="true">/</span>
            </>
          )}
          <span className="reader-breadcrumb-current">{novelMeta.name}</span>
        </div>

        <Link to="/" className="reader-back-library-link">
          ← Back to Library
        </Link>
      </nav>

      {/* Book Hero / Overview Card */}
      <header className="book-details-hero-card">
        {/* Cover Artwork Showcase with Perfect Fit */}
        <div className="book-details-cover-container">
          <div className="book-details-cover-frame">
            {imageError ? (
              <div className="book-details-fallback-cover" aria-hidden="true">
                <span className="details-fallback-icon">📖</span>
                <span className="details-fallback-title">{novelMeta.name}</span>
              </div>
            ) : (
              <img
                src={novelMeta.image}
                alt={`Cover of ${novelMeta.name}`}
                className="book-details-cover-img"
                onError={() => setImageError(true)}
              />
            )}
          </div>
        </div>

        {/* Book Information & Actions */}
        <div className="book-details-info">
          {novelMeta.category && (
            <span className="reader-category-pill">{novelMeta.category}</span>
          )}

          <h1 className="book-details-title">{novelMeta.name}</h1>
          <p className="book-details-author">by {novelMeta.author}</p>

          <p className="book-details-synopsis">{novelMeta.description}</p>

          {/* Key Book Metadata */}
          <div className="book-details-meta-grid">
            <div className="book-meta-item">
              <span className="meta-item-label">Chapters</span>
              <span className="meta-item-value">{totalChapters} Chapters</span>
            </div>
            <div className="book-meta-item">
              <span className="meta-item-label">Length</span>
              <span className="meta-item-value">{totalPagesInBook} Pages</span>
            </div>
            <div className="book-meta-item">
              <span className="meta-item-label">Genre</span>
              <span className="meta-item-value">{novelMeta.category}</span>
            </div>
            {novelMeta.year && (
              <div className="book-meta-item">
                <span className="meta-item-label">Published</span>
                <span className="meta-item-value">{novelMeta.year}</span>
              </div>
            )}
          </div>

          {/* Reading Progress Card / Launch Banner */}
          {saved && saved.percentage > 0 ? (
            <div className="book-details-progress-banner">
              <div className="progress-banner-text-row">
                <span className="progress-banner-label">Your Reading Progress:</span>
                <span className="progress-banner-val">{saved.percentage}% Complete</span>
              </div>
              <div
                className="book-details-progress-track"
                role="progressbar"
                aria-valuenow={saved.percentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Reading progress: ${saved.percentage}%`}
              >
                <div
                  className="book-details-progress-fill"
                  style={{ width: `${saved.percentage}%` }}
                />
              </div>
              <p className="progress-banner-subtext">
                Currently on Chapter {(saved.chapterIndex || 0) + 1}: &ldquo;{saved.chapterTitle || 'Chapter ' + ((saved.chapterIndex || 0) + 1)}&rdquo;, Page {(saved.currentPage || 0) + 1}
              </p>
            </div>
          ) : null}

          {/* Action CTAs */}
          <div className="book-details-cta-row">
            {story ? (
              <>
                <Link
                  to={saved && saved.percentage > 0 ? `/read/${novelMeta.id}?resume=true` : `/read/${novelMeta.id}?chapter=1`}
                  className="book-primary-read-btn"
                >
                  {saved && saved.percentage > 0 ? '▶ Continue Reading' : '▶ Start Reading Book'}
                </Link>

                {saved && saved.percentage > 0 && (
                  <button
                    type="button"
                    className="book-reset-progress-btn"
                    onClick={handleResetProgress}
                  >
                    Start Over
                  </button>
                )}
              </>
            ) : (
              <div className="book-edition-coming-soon-badge">
                <span className="coming-soon-icon" aria-hidden="true">⏳</span>
                <span>Text Edition in Preparation — Coming Soon</span>
              </div>
            )}

            <button
              type="button"
              className={`book-favorite-toggle-btn ${isFavorite ? 'active' : ''}`}
              onClick={toggleFavorite}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-pressed={isFavorite}
            >
              <span aria-hidden="true">{isFavorite ? '♥' : '♡'}</span>
              <span>{isFavorite ? 'Favorited' : 'Add to Favorites'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Table of Contents Section */}
      <section className="reader-toc-card" aria-label="Table of contents">
        <div className="reader-toc-header">
          <h2>Table of Contents</h2>
          <p>
            {story
              ? 'Select any chapter to begin reading immediately on our dedicated reading page.'
              : 'Chapter titles and overview for this edition.'}
          </p>
        </div>

        {story ? (
          <ul className="reader-chapter-list">
            {story.chapters.map((chapter, idx) => {
              const isCurrent = saved && saved.chapterIndex === idx
              const isCompleted = saved && saved.chapterIndex > idx

              return (
                <li key={chapter.id}>
                  <Link
                    to={`/read/${novelMeta.id}?chapter=${idx + 1}`}
                    className={`reader-chapter-btn ${isCurrent ? 'is-active-progress' : ''}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="reader-chapter-info">
                      <span className="reader-chapter-num">{idx + 1}</span>
                      <div>
                        <span className="reader-chapter-title-text">
                          {chapter.title}
                        </span>
                        {isCurrent && (
                          <span className="reader-chapter-current-badge">
                            In Progress (Page {(saved.currentPage || 0) + 1}/{chapter.pages.length})
                          </span>
                        )}
                        {isCompleted && (
                          <span className="reader-chapter-done-badge">
                            Completed ✓
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="reader-chapter-right">
                      <span className="reader-chapter-pages-badge">
                        {chapter.pages.length} Pages
                      </span>
                      <span className="reader-chapter-action">
                        Read on Dedicated Page →
                      </span>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="edition-notice-box">
            <p>
              The digital chapters for <strong>{novelMeta.name}</strong> are currently being formatted.
              In the meantime, feel free to read other stories from the library below!
            </p>
            <Link to="/" className="reader-nav-btn primary" style={{ display: 'inline-block', marginTop: '12px' }}>
              Explore Available Novels
            </Link>
          </div>
        )}
      </section>

      {/* Related Novels Section */}
      {relatedNovels.length > 0 && (
        <section className="book-related-section" aria-label="Related novels">
          <div className="section-heading" style={{ padding: 0, margin: '40px 0 20px' }}>
            <h2 className="section-title" style={{ fontSize: '24px' }}>More {novelMeta.category} Novels</h2>
            <p>Other popular titles in this genre you might enjoy.</p>
          </div>

          <ul className="novel-list" style={{ padding: 0 }}>
            {relatedNovels.map((n) => (
              <li key={n.id}>
                <NovelCard
                  novel={n}
                  toggleFavorite={() => {}}
                  favorites={favorites}
                  progress={getSavedProgress(n.id)}
                />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

export default Novel