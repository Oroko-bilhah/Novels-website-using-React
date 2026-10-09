import { useState, useEffect, useMemo, useCallback } from 'react'
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom'
import './App.css'
import Novel from './Novel'
import Reader from './Reader'
import Fiction from './Fiction'
import NovelCard from './NovelCard'
import ContinueReading from './ContinueReading'

import {
  getSavedFavorites,
  saveFavorites,
  getAllSavedProgress,
  removeNovelProgress,
} from './utils/readingProgress'

// Category options available for filtering
const CATEGORIES = ['All', 'Fiction', 'Science', 'Philosophy', 'Religion', 'Romance']

function NovelWrapper() {
  const { id } = useParams()
  return <Novel key={id} />
}

function ReaderWrapper() {
  const { id } = useParams()
  return <Reader key={id} />
}

function HomePage({
  novels,
  filteredNovels,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  favorites,
  toggleFavorite,
  progressList,
  progressMap,
  handleRemoveProgress,
  handleResetFilters,
  categoryCounts,
}) {
  return (
    <main>
      {/* Hero Banner */}
      <section className="hero" aria-labelledby="hero-heading">
        <h1 id="hero-heading">Discover your next story</h1>
        <p>Explore novels, find new worlds, and get lost in a good book.</p>
        <button
          type="button"
          onClick={() => {
            document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          Start Exploring
        </button>
      </section>

      {/* Continue Reading Section (Visible when user has stories in progress) */}
      <ContinueReading
        progressList={progressList}
        novels={novels}
        onRemoveProgress={handleRemoveProgress}
      />

      {/* Discovery & Search Bar */}
      <section id="catalog" className="discovery-section" aria-label="Find novels">
        <div className="section-heading">
          <h2 className="section-title">Explore Novels</h2>
          <p>Search by title or author, filter by category, or browse your favorites.</p>
        </div>

        {/* Search Input Bar */}
        <div className="search-bar-wrap">
          <div className="search-input-box">
            <span className="search-icon" aria-hidden="true">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search novels by title or author..."
              aria-label="Search novels by title or author"
              className="search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search input"
              >
                ✕
              </button>
            )}
          </div>

          {searchQuery && (
            <div className="search-result-hint" role="status">
              Found <strong>{filteredNovels.length}</strong> {filteredNovels.length === 1 ? 'novel' : 'novels'} matching &ldquo;{searchQuery}&rdquo;
            </div>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="category-list" role="tablist" aria-label="Filter novels by category">
          {CATEGORIES.map((cat) => {
            const count = categoryCounts[cat] || 0
            const isSelected = selectedCategory === cat
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`category-pill ${isSelected ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                <span>{cat}</span>
                <span className="category-pill-count">{count}</span>
              </button>
            )
          })}
          <button
            type="button"
            role="tab"
            aria-selected={selectedCategory === 'Favorites'}
            className={`category-pill favorites-pill ${selectedCategory === 'Favorites' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('Favorites')}
          >
            <span>♥ Favorites</span>
            <span className="category-pill-count">{favorites.length}</span>
          </button>
        </div>
      </section>

      {/* Novel Catalog Grid */}
      <section className="catalog-grid-section" aria-label="Novel catalog">
        {filteredNovels.length > 0 ? (
          <ul className="novel-list">
            {filteredNovels.map((novel) => (
              <li key={novel.id}>
                <NovelCard
                  novel={novel}
                  toggleFavorite={toggleFavorite}
                  favorites={favorites}
                  progress={progressMap[novel.id]}
                />
              </li>
            ))}
          </ul>
        ) : (
          /* Empty States */
          <div className="catalog-empty-card" role="status">
            {selectedCategory === 'Favorites' && !searchQuery ? (
              <>
                <div className="empty-state-icon" aria-hidden="true">♡</div>
                <h3 className="empty-state-title">No Favorites Saved Yet</h3>
                <p className="empty-state-text">
                  You haven&apos;t added any novels to your favorites list yet. Click the heart icon on any story to save it for easy access anytime!
                </p>
                <button
                  type="button"
                  className="empty-state-btn primary"
                  onClick={() => setSelectedCategory('All')}
                >
                  Explore All Novels
                </button>
              </>
            ) : (
              <>
                <div className="empty-state-icon" aria-hidden="true">🔍</div>
                <h3 className="empty-state-title">No Novels Found</h3>
                <p className="empty-state-text">
                  We couldn&apos;t find any stories matching your criteria
                  {searchQuery && <span> for &ldquo;<strong>{searchQuery}</strong>&rdquo;</span>}
                  {selectedCategory !== 'All' && <span> in <strong>{selectedCategory}</strong></span>}.
                </p>
                <button
                  type="button"
                  className="empty-state-btn primary"
                  onClick={handleResetFilters}
                >
                  Reset Search &amp; Filters
                </button>
              </>
            )}
          </div>
        )}
      </section>

      {/* Recently Added Section */}
      <section className="recent" aria-labelledby="recently-added-heading">
        <div className="section-heading">
          <h2 id="recently-added-heading" className="section-title">Recently Added</h2>
          <p>Fresh additions and latest releases in the Novella library.</p>
        </div>

        <ul className="recent-content">
          {novels.slice(-4).map((novel) => (
            <li key={novel.id}>
              <NovelCard
                novel={novel}
                toggleFavorite={toggleFavorite}
                favorites={favorites}
                progress={progressMap[novel.id]}
              />
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

function App() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [novels, setNovels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [favorites, setFavorites] = useState(() => getSavedFavorites())
  const [progressList, setProgressList] = useState(() => getAllSavedProgress())
  const navigate = useNavigate()

  // Refresh progress state whenever returning to page or focusing
  const refreshProgress = useCallback(() => {
    setProgressList(getAllSavedProgress())
  }, [])

  useEffect(()=>{
    async function fetchNovels() {
      try {
        const response = await fetch('http://localhost:5000/api/v1/books')
        if(!response.ok){
          throw new Error('Failed to fetch  books')
        }
        const data = await response.json()
        setNovels(data.books)
      }
      catch (err) {
        setError('Could not load books, make sure backend is running.')
      }
      finally {
        setLoading(false)
      }
    }
    fetchNovels()
  },[]
  )
  useEffect(() => {
    window.addEventListener('focus', refreshProgress)
    window.addEventListener('storage', refreshProgress)
    window.addEventListener('novella-progress-update', refreshProgress)
    return () => {
      window.removeEventListener('focus', refreshProgress)
      window.removeEventListener('storage', refreshProgress)
      window.removeEventListener('novella-progress-update', refreshProgress)
    }
  }, [refreshProgress])

  // Persist favorites to localStorage
  const toggleFavorite = (novel) => {
    setFavorites((prev) => {
      const nextFavorites = prev.includes(novel.id)
        ? prev.filter((id) => id !== novel.id)
        : [...prev, novel.id]
      saveFavorites(nextFavorites)
      return nextFavorites
    })
  }

  const handleRemoveProgress = (novelId) => {
    removeNovelProgress(novelId)
    setProgressList(getAllSavedProgress())
  }

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat)
    navigate('/')
  }

  const handleResetFilters = () => {
    setSelectedCategory('All')
    setSearchQuery('')
  }

  // Pre-calculate progress map for fast card lookup
  const progressMap = useMemo(() => {
    const map = {}
    progressList.forEach((item) => {
      map[item.novelId] = item
    })
    return map
  }, [progressList])

  // Calculate book counts per category across all 38 books
  const categoryCounts = useMemo(() => {
    const counts = { All: novels.length }
    CATEGORIES.forEach((cat) => {
      if (cat !== 'All') {
        counts[cat] = novels.filter((n) => n.category === cat).length
      }
    })
    return counts
  }, [novels])

  // Filter novels by search query and category
  const filteredNovels = useMemo(() => {
    return novels.filter((novel) => {
      // Category filter
      let matchesCategory = true
      if (selectedCategory === 'Favorites') {
        matchesCategory = favorites.includes(novel.id)
      } else if (selectedCategory !== 'All') {
        matchesCategory = novel.category === selectedCategory
      }

      // Search query filter (matches title or author)
      let matchesSearch = true
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase()
        const matchesName = novel.name.toLowerCase().includes(query)
        const matchesAuthor = novel.author.toLowerCase().includes(query)
        const matchesCategoryName = novel.category?.toLowerCase().includes(query)
        matchesSearch = matchesName || matchesAuthor || matchesCategoryName
      }

      return matchesCategory && matchesSearch
    })
  }, [novels, selectedCategory, searchQuery, favorites])

  
if (loading) {
  return <div className="App">Loading Novella library...</div>
}

if (error) {
  return <div className="App">{error}</div>
}

  return (
    <div className="App">
      {/* Main Top Navigation */}
      <nav className="nav" aria-label="Main Navigation">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }} aria-label="Novella Home">
          <h2 className="logo">NOVELLA</h2>
        </Link>

        <ul className="nav-links">
          <li>
            <button
              type="button"
              className={selectedCategory === 'All' ? 'nav-active' : ''}
              onClick={() => handleSelectCategory('All')}
            >
              All
            </button>
          </li>
          <li>
            <button
              type="button"
              className={selectedCategory === 'Fiction' ? 'nav-active' : ''}
              onClick={() => handleSelectCategory('Fiction')}
            >
              Fiction
            </button>
          </li>
          <li>
            <button
              type="button"
              className={selectedCategory === 'Science' ? 'nav-active' : ''}
              onClick={() => handleSelectCategory('Science')}
            >
              Science
            </button>
          </li>
          <li>
            <button
              type="button"
              className={selectedCategory === 'Philosophy' ? 'nav-active' : ''}
              onClick={() => handleSelectCategory('Philosophy')}
            >
              Philosophy
            </button>
          </li>
          <li>
            <button
              type="button"
              className={selectedCategory === 'Religion' ? 'nav-active' : ''}
              onClick={() => handleSelectCategory('Religion')}
            >
              Religion
            </button>
          </li>
          <li>
            <button
              type="button"
              className={selectedCategory === 'Romance' ? 'nav-active' : ''}
              onClick={() => handleSelectCategory('Romance')}
            >
              Romance
            </button>
          </li>
          <li>
            <button
              type="button"
              className={`nav-fav-btn ${selectedCategory === 'Favorites' ? 'nav-active' : ''}`}
              onClick={() => handleSelectCategory('Favorites')}
              aria-label={`View ${favorites.length} saved favorites`}
            >
              Favorites {favorites.length > 0 && <span className="nav-fav-badge">{favorites.length}</span>}
            </button>
          </li>
        </ul>
      </nav>

      {/* Routes: Each view renders on its own separate page! */}
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              novels={novels}
              filteredNovels={filteredNovels}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              progressList={progressList}
              progressMap={progressMap}
              handleRemoveProgress={handleRemoveProgress}
              handleResetFilters={handleResetFilters}
              categoryCounts={categoryCounts}
            />
          }
        />
        <Route path="/novel/:id" element={<NovelWrapper />} />
        <Route path="/read/:id" element={<ReaderWrapper />} />
        <Route path="/novel/:id/read" element={<ReaderWrapper />} />
        <Route
          path="/Fiction"
          element={
            <Fiction
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          }
        />
        <Route
          path="*"
          element={
            <HomePage
              novels={novels}
              filteredNovels={filteredNovels}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              progressList={progressList}
              progressMap={progressMap}
              handleRemoveProgress={handleRemoveProgress}
              handleResetFilters={handleResetFilters}
              categoryCounts={categoryCounts}
            />
          }
        />
      </Routes>

      {/* Footer */}
      <footer className="footer" role="contentinfo">
        <div className="footer-content">
          <div className="footer-brand">
            <h2>NOVELLA</h2>
            <p>
              Discover stories, explore new worlds, and find your next favorite read.
              Your reading progress is automatically saved so you never lose your place.
            </p>
          </div>

          <div className="footer-links">
            <h3>Explore</h3>
            <Link to="/">Library Home</Link>
            <Link to="/Fiction">Fiction Showcase</Link>
            <button
              type="button"
              className="footer-link-btn"
              onClick={() => handleSelectCategory('Science')}
            >
              Science Novels
            </button>
            <button
              type="button"
              className="footer-link-btn"
              onClick={() => handleSelectCategory('Romance')}
            >
              Romance Novels
            </button>
          </div>

          <div className="footer-links">
            <h3>Reading Tools</h3>
            <button
              type="button"
              className="footer-link-btn"
              onClick={() => handleSelectCategory('Favorites')}
            >
              Saved Favorites ({favorites.length})
            </button>
            <a href="#catalog" onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })}>
              Search Library
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Novella. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App