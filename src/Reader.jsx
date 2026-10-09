import { useParams, Link, useSearchParams } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { stories } from './data/stories/index.js'
import { novels } from './data/novels.js'
import {
  getSavedProgress,
  saveNovelProgress,
  calculateBookProgress,
} from './utils/readingProgress.js'
import './Novel.css'

function Reader() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const novelId = Number(id)
  const readerTopRef = useRef(null)

  const story = stories.find((s) => s.id === novelId)
  const novelMeta = novels.find((n) => n.id === novelId)

  const saved = getSavedProgress(novelId)
  const requestedChapterParam = searchParams.get('chapter')
  const shouldResume = searchParams.get('resume') === 'true'

  // Determine initial chapter index
  const initialChapterIndex = (() => {
    if (!story || !story.chapters || story.chapters.length === 0) return 0
    if (requestedChapterParam) {
      const parsed = parseInt(requestedChapterParam, 10) - 1
      if (!isNaN(parsed) && parsed >= 0 && parsed < story.chapters.length) {
        return parsed
      }
    }
    if ((shouldResume || !requestedChapterParam) && saved && typeof saved.chapterIndex === 'number') {
      if (saved.chapterIndex >= 0 && saved.chapterIndex < story.chapters.length) {
        return saved.chapterIndex
      }
    }
    return 0
  })()

  // Determine initial page
  const initialPage = (() => {
    if (requestedChapterParam) return 0
    if ((shouldResume || !requestedChapterParam) && saved && typeof saved.currentPage === 'number') {
      return saved.currentPage
    }
    return 0
  })()

  const [currentChapterIndex, setCurrentChapterIndex] = useState(initialChapterIndex)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [fontSize, setFontSize] = useState('medium') // 'small', 'medium', 'large'

  const selectedChapter = story?.chapters?.[currentChapterIndex] || null

  const totalPagesInBook = story
    ? story.chapters.reduce((total, ch) => total + (ch.pages?.length || 0), 0)
    : 0

  const bookProgress = story && selectedChapter
    ? calculateBookProgress(story, currentChapterIndex, currentPage)
    : { completedPages: 0, totalPages: 25, percentage: 0 }

  const nextChapter =
    story && currentChapterIndex < story.chapters.length - 1
      ? story.chapters[currentChapterIndex + 1]
      : null

  const prevChapter =
    story && currentChapterIndex > 0
      ? story.chapters[currentChapterIndex - 1]
      : null

  // Save progress on chapter or page change
  useEffect(() => {
    if (!story || !selectedChapter || currentChapterIndex < 0) return

    const progressInfo = calculateBookProgress(story, currentChapterIndex, currentPage)

    saveNovelProgress({
      novelId: story.id,
      novelTitle: story.title,
      novelAuthor: story.author,
      novelCategory: story.category,
      novelImage: novelMeta?.image,
      chapterId: selectedChapter.id,
      chapterIndex: currentChapterIndex,
      chapterTitle: selectedChapter.title,
      currentPage: currentPage,
      totalPagesInChapter: selectedChapter.pages.length,
      totalPagesInBook: totalPagesInBook,
      completedPagesOverall: progressInfo.completedPages,
      percentage: progressInfo.percentage,
    })
  }, [story, selectedChapter, currentChapterIndex, currentPage, novelMeta, totalPagesInBook])

  // Scroll to reader top on page/chapter change
  useEffect(() => {
    if (readerTopRef.current) {
      readerTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [currentChapterIndex, currentPage])

  // Keyboard navigation: Left/Right arrow keys
  useEffect(() => {
    if (!selectedChapter) return

    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return

      if (e.key === 'ArrowRight') {
        setCurrentPage((prev) => Math.min(selectedChapter.pages.length - 1, prev + 1))
      } else if (e.key === 'ArrowLeft') {
        setCurrentPage((prev) => Math.max(0, prev - 1))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedChapter])

  // Error State: Novel not found
  if (!story || !selectedChapter) {
    return (
      <div className="novel-reader-wrapper">
        <div className="reader-error-card" role="alert">
          <div className="reader-error-icon" aria-hidden="true">📖</div>
          <h2>Novel Not Found</h2>
          <p>We couldn&apos;t load the reading view for story <strong>#{id}</strong>.</p>
          <div className="reader-error-actions">
            <Link to="/" className="reader-nav-btn primary">
              ← Return to Library
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleNextChapter = () => {
    if (nextChapter) {
      setCurrentChapterIndex((prev) => prev + 1)
      setCurrentPage(0)
    }
  }

  const handlePrevChapter = () => {
    if (prevChapter) {
      setCurrentChapterIndex((prev) => prev - 1)
      setCurrentPage(prevChapter.pages.length - 1)
    }
  }

  const chapterPercentage = Math.round(
    ((currentPage + 1) / selectedChapter.pages.length) * 100
  )

  return (
    <div className="novel-reader-wrapper dedicated-reader-page" ref={readerTopRef}>
      {/* Sticky top-of-viewport Progress Bar */}
      <div
        className="reader-sticky-progress-container"
        role="progressbar"
        aria-valuenow={bookProgress.percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Overall book progress: ${bookProgress.percentage}%`}
      >
        <div
          className="reader-sticky-progress-fill"
          style={{ width: `${bookProgress.percentage}%` }}
        />
      </div>

      {/* Reader Top Navigation Bar */}
      <nav className="reader-top-nav" aria-label="Reader navigation">
        <div className="reader-breadcrumbs">
          <Link to="/" className="reader-breadcrumb-link">
            Library
          </Link>
          <span className="reader-breadcrumb-sep" aria-hidden="true">/</span>
          <Link to={`/novel/${story.id}`} className="reader-breadcrumb-link">
            {story.title}
          </Link>
          <span className="reader-breadcrumb-sep" aria-hidden="true">/</span>
          <span className="reader-breadcrumb-current">
            Chapter {currentChapterIndex + 1}
          </span>
        </div>

        <div className="reader-nav-right-actions">
          {/* Font Size Controls */}
          <div className="reader-font-controls" aria-label="Adjust font size">
            <span className="reader-font-label" aria-hidden="true">A</span>
            <button
              type="button"
              className={`font-size-btn ${fontSize === 'small' ? 'active' : ''}`}
              onClick={() => setFontSize('small')}
              aria-label="Small font size"
            >
              Small
            </button>
            <button
              type="button"
              className={`font-size-btn ${fontSize === 'medium' ? 'active' : ''}`}
              onClick={() => setFontSize('medium')}
              aria-label="Normal font size"
            >
              Normal
            </button>
            <button
              type="button"
              className={`font-size-btn ${fontSize === 'large' ? 'active' : ''}`}
              onClick={() => setFontSize('large')}
              aria-label="Large font size"
            >
              Large
            </button>
          </div>

          <Link to={`/novel/${story.id}`} className="reader-back-library-link">
            ← Book Overview
          </Link>
        </div>
      </nav>

      {/* Reader Prose Card */}
      <div className="reader-reading-container">
        <article className="reader-paper-card">
          {/* Card Top Bar */}
          <div className="reader-card-top-bar">
            <Link to={`/novel/${story.id}`} className="reader-toc-return-btn">
              ← Table of Contents
            </Link>

            <div className="reader-card-chapter-controls">
              {prevChapter && (
                <button
                  type="button"
                  className="reader-prev-chap-btn"
                  onClick={handlePrevChapter}
                  title={`Previous Chapter: ${prevChapter.title}`}
                >
                  ‹ Prev Chapter
                </button>
              )}
              <span className="reader-card-chapter-indicator">
                Chapter {currentChapterIndex + 1} of {story.chapters.length}
              </span>
              {nextChapter && (
                <button
                  type="button"
                  className="reader-next-chap-btn"
                  onClick={handleNextChapter}
                  title={`Next Chapter: ${nextChapter.title}`}
                >
                  Next Chapter ›
                </button>
              )}
            </div>
          </div>

          {/* Reading Progress Metrics */}
          <div className="reader-progress-metrics">
            <div className="reader-progress-metric-row">
              <span className="reader-progress-metric-title">Book Progress:</span>
              <span className="reader-progress-metric-val">
                {bookProgress.percentage}% ({bookProgress.completedPages} of {totalPagesInBook} pages read)
              </span>
            </div>
            <div
              className="reader-book-progress-track"
              role="progressbar"
              aria-valuenow={bookProgress.percentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Overall book progress: ${bookProgress.percentage}%`}
            >
              <div
                className="reader-book-progress-fill"
                style={{ width: `${bookProgress.percentage}%` }}
              />
            </div>

            <div className="reader-progress-metric-row secondary">
              <span className="reader-progress-metric-title">
                Chapter {currentChapterIndex + 1}:
              </span>
              <span className="reader-progress-metric-val">
                Page {currentPage + 1} of {selectedChapter.pages.length} ({chapterPercentage}%)
              </span>
            </div>
            <div
              className="reader-progress-track"
              role="progressbar"
              aria-valuenow={chapterPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Current chapter progress: ${chapterPercentage}%`}
            >
              <div
                className="reader-progress-bar"
                style={{ width: `${chapterPercentage}%` }}
              />
            </div>
          </div>

          {/* Chapter Heading */}
          <div className="reader-chapter-header">
            <div className="reader-chapter-badge">
              Chapter {currentChapterIndex + 1}
            </div>
            <h1 className="reader-chapter-heading">
              {selectedChapter.title}
            </h1>
            <div className="reader-ornament-divider" aria-hidden="true">
              <span className="reader-ornament-symbol">✦</span>
            </div>
          </div>

          {/* Story Page Content */}
          <div className={`reader-page-prose-container font-${fontSize}`}>
            <p className="reader-page-prose">
              {selectedChapter.pages[currentPage]}
            </p>
          </div>

          {/* Chapter Completed / Next Chapter Banner */}
          {currentPage === selectedChapter.pages.length - 1 && (
            <div className="reader-chapter-complete-banner" role="status">
              <p>
                {nextChapter
                  ? `You've completed Chapter ${currentChapterIndex + 1}: "${selectedChapter.title}"!`
                  : "Congratulations! You have finished the final chapter of this novel!"}
              </p>
              {nextChapter ? (
                <button
                  type="button"
                  className="reader-btn-next-chapter"
                  onClick={handleNextChapter}
                >
                  Continue to Chapter {currentChapterIndex + 2}: {nextChapter.title} →
                </button>
              ) : (
                <Link
                  to={`/novel/${story.id}`}
                  className="reader-btn-next-chapter"
                  style={{ textDecoration: 'none', display: 'inline-block' }}
                >
                  Return to Book Overview 📖
                </Link>
              )}
            </div>
          )}

          {/* Pagination Controls */}
          <div className="reader-pagination-bar">
            <button
              type="button"
              className="reader-nav-btn"
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 0}
              aria-label="Go to previous page"
            >
              ← Previous Page
            </button>

            <div className="reader-page-indicator-wrap">
              <span className="reader-page-indicator-text">
                Page {currentPage + 1} of {selectedChapter.pages.length}
              </span>
              <div className="reader-page-dots" role="tablist" aria-label="Page selection">
                {selectedChapter.pages.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    role="tab"
                    aria-selected={dotIdx === currentPage}
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
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === selectedChapter.pages.length - 1}
              aria-label="Go to next page"
            >
              Next Page →
            </button>
          </div>

          <div className="reader-keyboard-hint" aria-hidden="true">
            Tip: Use Left (←) and Right (→) arrow keys to turn pages
          </div>
        </article>
      </div>
    </div>
  )
}

export default Reader
