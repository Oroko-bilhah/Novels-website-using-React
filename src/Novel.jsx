import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { stories } from './data/stories/index.js'

function Novel() {
  const { id } = useParams()
  const [selectedChapter, setSelectedChapter] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)

  const story = stories.find((story) => story.id === Number(id))

  if (!story) {
    return <h1>Story not available yet!</h1>
  }

  return (
    <div>
      <h1>{story.title}</h1>

      {!selectedChapter && (
        <div>
          <h2>Table of Contents</h2>

          <ul>
            {story.chapters.map((chapter) => (
              <li key={chapter.id}>
                <button onClick={() => {
                    setSelectedChapter(chapter)
                    setCurrentPage(0)}
                    }>
                  {chapter.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedChapter && (
        <div>
          <button onClick={() => setSelectedChapter(null)}>
            Back to Table of Contents
          </button>

          <h2>{selectedChapter.title}</h2>

         
        <p>{selectedChapter.pages[currentPage]}</p>
        <button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 0}
        >
        Previous
        </button>
        <button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === selectedChapter.pages.length - 1}
        >
        Next
        </button>
        
        </div>
      )}
    </div>
  )
}

export default Novel