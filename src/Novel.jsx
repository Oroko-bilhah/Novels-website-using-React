import { useParams, Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { stories } from './data/stories/index.js'
import './Novel.css'

function Novel() {
  const { id } = useParams()
  const [selectedChapter, setSelectedChapter] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const readerTopRef = useRef(null)

  const story = stories.find((story) => story.id === Number(id))

  // Smooth scroll reader into view on chapter or page change
  useEffect(() => {
    if (readerTopRef.current) {
      readerTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [id, selectedChapter, currentPage])

  // Reset chapter selection if novel id changes
  useEffect(() => {
    setSelectedChapter(null)
    setCurrentPage(0)
  }, [id])

  if (!story) {
    return (
      <div className="novel-reader-wrapper">
        <div className="reader-empty-card">
          <div className="reader-empty-icon">📖</div>
          <h2>Story Not Available Yet</h2>
          <p>We are actively curating more stories. Please check back soon or explore other novels.</p>
          <Link to="/" className="reader-nav-btn primary">
            ← Back to Library
          </Link>
        </div>
      </div>
    )
  }

  // Find next chapter if available
  const currentChapterIndex = selectedChapter
    ? story.chapters.findIndex((c) => c.id === selectedChapter.id)
    : -1
  const nextChapter =
    currentChapterIndex >= 0 && currentChapterIndex < story.chapters.length - 1
      ? story.chapters[currentChapterIndex + 1]
      : null

  const totalPagesInBook = story.chapters.reduce(
    (total, ch) => total + ch.pages.length,
    0
  )

  const handleSelectChapter = (chapter) => {
    setSelectedChapter(chapter)
    setCurrentPage(0)
  }

  const handleNextChapter = () => {
    if (nextChapter) {
      setSelectedChapter(nextChapter)
      setCurrentPage(0)
    } else {
      setSelectedChapter(null)
      setCurrentPage(0)
    }
  }

  return (
    <div className="novel-reader-wrapper" ref={readerTopRef}>
      {/* Top breadcrumb navigation */}
      <div className="reader-top-nav">
        <Link to="/" className="reader-back-library-link">
          ← Back to Library
        </Link>
      </div>

      {/* Book title and author overview */}
      <header className="reader-book-header">
        {story.category && (
          <span className="reader-category-pill">{story.category}</span>
        )}
        <h1 className="reader-book-title">{story.title}</h1>
        {story.author && (
          <p className="reader-book-author">By {story.author}</p>
        )}
        {story.description && (
          <p className="reader-book-desc">{story.description}</p>
        )}
        <div className="reader-book-meta">
          <span>📚 {story.chapters.length} Chapters</span>
          <span>•</span>
          <span>📄 {totalPagesInBook} Pages</span>
        </div>
      </header>

      {/* Table of Contents View */}
      {!selectedChapter && (
        <div className="reader-toc-card">
          <div className="reader-toc-header">
            <h2>Table of Contents</h2>
            <p>Select a chapter below to immerse yourself in the story.</p>
          </div>

          <ul className="reader-chapter-list">
            {story.chapters.map((chapter, idx) => (
              <li key={chapter.id}>
                <button
                  type="button"
                  className="reader-chapter-btn"
                  onClick={() => handleSelectChapter(chapter)}
                >
                  <div className="reader-chapter-info">
                    <span className="reader-chapter-num">{idx + 1}</span>
                    <span className="reader-chapter-title-text">
                      {chapter.title}
                    </span>
                  </div>
                  <div className="reader-chapter-right">
                    <span className="reader-chapter-pages-badge">
                      {chapter.pages.length} Pages
                    </span>
                    <span className="reader-chapter-action">
                      Read Chapter →
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Active Chapter Reading View */}
      {selectedChapter && (
        <div className="reader-reading-container">
          <div className="reader-paper-card">
            {/* Card top bar */}
            <div className="reader-card-top-bar">
              <button
                type="button"
                className="reader-toc-return-btn"
                onClick={() => setSelectedChapter(null)}
              >
                ← Table of Contents
              </button>
              <span className="reader-card-chapter-indicator">
                Chapter {currentChapterIndex + 1} of {story.chapters.length}
              </span>
            </div>

            {/* Reading progress track */}
            <div className="reader-progress-track">
              <div
                className="reader-progress-bar"
                style={{
                  width: `${
                    ((currentPage + 1) / selectedChapter.pages.length) * 100
                  }%`,
                }}
              />
            </div>

            {/* Chapter Heading Inside the Book */}
            <div className="reader-chapter-header">
              <div className="reader-chapter-badge">
                Chapter {currentChapterIndex + 1}
              </div>
              <h2 className="reader-chapter-heading">
                {selectedChapter.title}
              </h2>
              <div className="reader-ornament-divider">
                <span className="reader-ornament-symbol">✦</span>
              </div>
            </div>

            {/* Story Page Content */}
            <div className="reader-page-prose-container">
              <p className="reader-page-prose">
                {selectedChapter.pages[currentPage]}
              </p>
            </div>

            {/* Next Chapter Prompt at end of chapter */}
            {currentPage === selectedChapter.pages.length - 1 && (
              <div className="reader-chapter-complete-banner">
                <p>
                  {nextChapter
                    ? `You've completed Chapter ${currentChapterIndex + 1}!`
                    : "You've finished the final chapter of this novel!"}
                </p>
                <button
                  type="button"
                  className="reader-btn-next-chapter"
                  onClick={handleNextChapter}
                >
                  {nextChapter
                    ? `Continue to Chapter ${currentChapterIndex + 2}: ${
                        nextChapter.title
                      } →`
                    : "Return to Table of Contents 📖"}
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            <div className="reader-pagination-bar">
              <button
                type="button"
                className="reader-nav-btn"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 0}
              >
                ← Previous Page
              </button>

              <div className="reader-page-indicator-wrap">
                <span className="reader-page-indicator-text">
                  Page {currentPage + 1} of {selectedChapter.pages.length}
                </span>
                <div className="reader-page-dots">
                  {selectedChapter.pages.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      aria-label={`Jump to page ${dotIdx + 1}`}
                      className={`reader-page-dot ${
                        dotIdx === currentPage ? 'active' : ''
                      }`}
                      onClick={() => setCurrentPage(dotIdx)}
                    />
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="reader-nav-btn primary"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === selectedChapter.pages.length - 1}
              >
                Next Page →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Novel