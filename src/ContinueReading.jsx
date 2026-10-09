import { Link } from 'react-router-dom'
import { useState } from 'react'

function ContinueReading({ progressList, novels, onRemoveProgress }) {
  const [failedImages, setFailedImages] = useState({})

  if (!progressList || progressList.length === 0) {
    return null
  }

  const handleImageError = (id) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }))
  }

  return (
    <section className="continue-reading-section" aria-label="Continue reading your in-progress novels">
      <div className="continue-reading-container">
        <div className="continue-reading-header">
          <div className="continue-reading-title-wrap">
            <span className="continue-reading-badge">Reading Activity</span>
            <h2 className="continue-reading-title">Continue Reading</h2>
            <p className="continue-reading-subtitle">
              Jump straight back into your latest story and pick up where you left off.
            </p>
          </div>
          <span className="continue-reading-count">
            {progressList.length} {progressList.length === 1 ? 'book' : 'books'} in progress
          </span>
        </div>

        <div className="continue-reading-grid">
          {progressList.map((item) => {
            const matchedNovel = novels.find((n) => n.id === Number(item.novelId))
            const coverImage = item.novelImage || matchedNovel?.image
            const title = item.novelTitle || matchedNovel?.name || 'Untitled Novel'
            const author = item.novelAuthor || matchedNovel?.author || 'Unknown Author'
            const category = item.novelCategory || matchedNovel?.category || 'Novel'
            const hasFailedImage = failedImages[item.novelId]

            return (
              <div key={item.novelId} className="continue-reading-card">
                <div className="continue-card-thumb-wrap">
                  {hasFailedImage || !coverImage ? (
                    <div className="continue-card-fallback-cover" aria-hidden="true">
                      <span>📖</span>
                    </div>
                  ) : (
                    <img
                      src={coverImage}
                      alt={`Cover for ${title}`}
                      className="continue-card-thumb"
                      onError={() => handleImageError(item.novelId)}
                      loading="lazy"
                    />
                  )}
                  {category && (
                    <span className="continue-card-category">{category}</span>
                  )}
                </div>

                <div className="continue-card-body">
                  <div className="continue-card-top-row">
                    <span className="continue-card-last-read">
                      {item.chapterTitle
                        ? `Ch. ${item.chapterIndex + 1}: ${item.chapterTitle}`
                        : `Chapter ${item.chapterIndex + 1}`}
                    </span>
                    <button
                      type="button"
                      className="continue-card-dismiss-btn"
                      onClick={() => onRemoveProgress(item.novelId)}
                      title="Remove from Continue Reading"
                      aria-label={`Remove ${title} from continue reading shelf`}
                    >
                      ×
                    </button>
                  </div>

                  <h3 className="continue-card-title">{title}</h3>
                  <p className="continue-card-author">by {author}</p>

                  <div className="continue-card-progress-wrap">
                    <div className="continue-card-progress-labels">
                      <span className="continue-page-label">
                        Page {item.currentPage + 1} of {item.totalPagesInChapter || 5}
                      </span>
                      <span className="continue-percentage-label">
                        {item.percentage}%
                      </span>
                    </div>
                    <div
                      className="continue-progress-track"
                      role="progressbar"
                      aria-valuenow={item.percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Reading progress for ${title}: ${item.percentage} percent`}
                    >
                      <div
                        className="continue-progress-fill"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="continue-card-footer">
                    <Link
                      to={`/read/${item.novelId}?resume=true`}
                      className="continue-resume-btn"
                      aria-label={`Resume reading ${title} at chapter ${item.chapterIndex + 1}, page ${item.currentPage + 1}`}
                    >
                      Resume Reading →
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ContinueReading
