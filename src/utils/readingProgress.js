const PROGRESS_KEY = 'novella_reading_progress'
const FAVORITES_KEY = 'novella_favorites'

function dispatchProgressUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('novella-progress-update'))
  }
}

/**
 * Safely parse JSON from localStorage
 */
function safeGetItem(key, fallback) {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch (err) {
    console.warn(`Failed to read ${key} from localStorage:`, err)
    return fallback
  }
}

/**
 * Safely save JSON to localStorage
 */
function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.warn(`Failed to save ${key} to localStorage:`, err)
  }
}

/**
 * Calculate overall book progress based on story chapters and current position
 */
export function calculateBookProgress(story, chapterIndex, currentPage) {
  if (!story || !story.chapters || story.chapters.length === 0) {
    return {
      completedPages: 0,
      totalPages: 0,
      percentage: 0,
    }
  }

  const totalPages = story.chapters.reduce((sum, ch) => sum + (ch.pages?.length || 0), 0)
  if (totalPages === 0) {
    return { completedPages: 0, totalPages: 0, percentage: 0 }
  }

  // Calculate pages completed in previous chapters
  let pagesBefore = 0
  for (let i = 0; i < chapterIndex && i < story.chapters.length; i++) {
    pagesBefore += story.chapters[i].pages?.length || 0
  }

  const completedPages = pagesBefore + (currentPage + 1)
  const percentage = Math.min(100, Math.max(0, Math.round((completedPages / totalPages) * 100)))

  return {
    completedPages,
    totalPages,
    percentage,
  }
}

/**
 * Get reading progress for a specific novel ID
 */
export function getSavedProgress(novelId) {
  const all = safeGetItem(PROGRESS_KEY, {})
  return all[novelId] || null
}

/**
 * Save progress for a novel
 */
export function saveNovelProgress(progressData) {
  const { novelId } = progressData
  if (!novelId) return

  const all = safeGetItem(PROGRESS_KEY, {})
  all[novelId] = {
    ...progressData,
    lastReadAt: Date.now(),
  }
  safeSetItem(PROGRESS_KEY, all)
  dispatchProgressUpdate()
}

/**
 * Remove progress for a single novel
 */
export function removeNovelProgress(novelId) {
  const all = safeGetItem(PROGRESS_KEY, {})
  if (all[novelId]) {
    delete all[novelId]
    safeSetItem(PROGRESS_KEY, all)
    dispatchProgressUpdate()
  }
}

/**
 * Get all saved reading progress items, ordered by most recently read
 */
export function getAllSavedProgress() {
  const all = safeGetItem(PROGRESS_KEY, {})
  return Object.values(all).sort((a, b) => (b.lastReadAt || 0) - (a.lastReadAt || 0))
}

/**
 * Clear all reading progress
 */
export function clearAllSavedProgress() {
  try {
    localStorage.removeItem(PROGRESS_KEY)
    dispatchProgressUpdate()
  } catch (err) {
    console.warn('Failed to clear progress:', err)
  }
}

/**
 * Get saved favorite novel IDs
 */
export function getSavedFavorites() {
  return safeGetItem(FAVORITES_KEY, [])
}

/**
 * Save favorite novel IDs
 */
export function saveFavorites(favoritesList) {
  safeSetItem(FAVORITES_KEY, favoritesList)
}
