import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Novel from './Novel'
import Fiction from './Fiction'
import NovelCard from './NovelCard'


const novels = [
  {
    id: 1,
    name: "The Beauty of Earth",
    author: "John Doe",
    description: "A novel about the beauty of our planet.",
    category: "Fiction",
    image:"/Beauty-of-earth.jpg"
  },
  {
    id: 2,
    name: "The Wonders of Nature",
    author: "Jane Smith",
    category: "Science",
    description: "Discover the incredible wonders of nature.",
    image: "/Wonders-of-nature.jpg"
  },
  {
    id: 3,
    name: "The Love of Humanity",
    author: "Bob Johnson",
    category: "Fiction",
    description: "A story about compassion and humanity.",
    image: "/The-love-of-humanity.jpg"
  },
  {
    id: 4,
    name: "The Power of Imagination",
    author: "Alice Brown",
    category: "Fiction",
    description: "A journey into the power of imagination.",
    image: "/The-power-of-imagination.jpg"
  },
  {
    id: 5,
    name: "The Joy of Storytelling",
    author: "Charlie Wilson",
    category: "Fiction",
    description: "A celebration of stories and the people who tell them.",
    image: "/The-joy-of-storytelling.jpg"
  },
  {id: 6,
    name: "The parables of Jesus",
    author: "John Doe",
    description: "A book about the parables of Jesus.",
    category: "Religion",
    image: "/The-parables-of-Jesus.jpg"
  },
  {
    id: 7,
    name: "The Philosophy of Life",
    author: "Jane Smith",
    category: "Philosophy",
    description: "A philosophical exploration of life and existence.",
    image: "/The-philosophy-of-life.jpg"
  },
  {
    id: 8,
    name: "The secret lovers",
    author: "Alice Brown",
    category: "Romance",
    description: "A story about hidden love and its consequences.",
    image: "/The-secret-lovers.jpg"
  }

]

function App() {
  const [selectedCategory, setSelectedCategory] = useState('All')

const [favorites, setFavorites] = useState([])
  const filteredNovels = selectedCategory === 'All'
   ? novels
   :selectedCategory === 'Favorites'
   ? novels.filter((novel) => favorites.includes(novel.id))
  : novels.filter((novel) => novel.category === selectedCategory)

function toggleFavorite(novel) {
  if (favorites.includes(novel.id)) {
    setFavorites(favorites.filter(id => id !== novel.id))
  } else {
    setFavorites([...favorites, novel.id])
  }
}
  return (
    <div className="App">
      <nav className="nav">
    <h2 className="logo">NOVELLA</h2>
   <ul className="nav-links">
    <li><button onClick={()=>setSelectedCategory('All')}>All</button></li>
    <li><button onClick={()=>setSelectedCategory('Religion')}>Religion</button></li>
    <li><button onClick={()=>setSelectedCategory('Science')}>Science</button></li>
    <li><button onClick={()=>setSelectedCategory('Romance')}>Romance</button></li>
    <li><button onClick={()=>setSelectedCategory('Fiction')}>Fiction</button></li>
    <li><button onClick={()=>setSelectedCategory('Philosophy')}>Philosophy</button></li>
    <li><button onClick={()=>setSelectedCategory('Favorites')}>Favorites</button></li>
  </ul>
</nav>
<Routes>
  <Route path="/novel/:id" element={<Novel />} />
  <Route path="/Fiction" element={<Fiction />} />

</Routes>
  <section className="hero">
  <h1>Discover your next story</h1>
  <p>Explore novels, find new worlds, and get lost in a good book.</p>
  <button>Start Exploring</button>
</section>
      <div className="section-heading">
  <h2 id="featured" className="section-title">Featured Novels</h2>
  <p>Stories selected to help you find your next great read.</p>
</div>

      <ul className="novel-list">
        {filteredNovels.map((novel, index) => (
          <li key={index}>
           <NovelCard novel={novel} toggleFavorite={toggleFavorite}  favorites={favorites} />
        </li>
        ))}
      </ul>
      <section className="categories">
  <div className="section-heading">
    <h2 className="section-title">Browse by Category</h2>
    <p>Explore stories based on what you're in the mood to read.</p>
  </div>

  <div className="category-list">
    <Link to="/romance">Romance</Link>
    <Link to="/Fiction">Fiction</Link>
    <Link to="/philosophy">Philosophy</Link>
    <Link to="/science">Science</Link>
    <Link to="/religion">Religion</Link>
  </div>
  <section className="recent">
  <div className="section-heading">
    <h2 className="section-title">Recently Added</h2>
    <p>Take a look at some of the latest stories on Novella.</p>
  </div>

  <div className="recent-content">
    <p>More stories are coming soon.</p>
  </div>
</section>
</section>

<footer className="footer">
  <div className="footer-content">
    <div className="footer-brand">
      <h2>NOVELLA</h2>
      <p>
        Discover stories, explore new worlds,
        and find your next favorite read.
      </p>
    </div>

    <div className="footer-links">
      <h3>Explore</h3>
      <Link to="/">Home</Link>
      <Link to="/romance">Romance</Link>
      <Link to="/Fiction">Fiction</Link>
      <Link to="/science">Science</Link>
    </div>

    <div className="footer-links">
      <h3>About</h3>
      <a href="#about">About Us</a>
      <a href="#contact">Contact</a>
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