import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Novel from './Novel'
import Fiction from './Fiction'


const novels = [
  {
    id: 1,
    name: "The Beauty of Earth",
    author: "John Doe",
    description: "A novel about the beauty of our planet.",
    image: "/beauty-of-earth.jpg"
  },
  {
    id: 2,
    name: "The Wonders of Nature",
    author: "Jane Smith",
    description: "Discover the incredible wonders of nature."
  },
  {
    id: 3,
    name: "The Love of Humanity",
    author: "Bob Johnson",
    description: "A story about compassion and humanity."
  },
  {
    id: 4,
    name: "The Power of Imagination",
    author: "Alice Brown",
    description: "A journey into the power of imagination."
  },
  {
    id: 5,
    name: "The Joy of Storytelling",
    author: "Charlie Wilson",
    description: "A celebration of stories and the people who tell them."
  }
]

function App() {
  const [favorites, setFavorites] = useState([])
function toggleFavorite(novel) {
 if (favorites.includes(novel)) {
    setFavorites(favorites.filter(favorites => favorites !== novel))
  } else {
    setFavorites([...favorites, novel])
 }}
  return (
    <div className="App">
      <nav className="nav">
    <h2 className="logo">NOVELLA</h2>
  <ul style={{ listStyle: 'none' }}>
    <li><Link to="/">All</Link></li>
    <li><Link to="/romance">Romance</Link></li>
    <li><Link to="/Fiction">Fiction</Link></li>
    <li><Link to="/philosophy">Philosophy</Link></li>
    <li><Link to="/science">Science</Link></li>
    <li><Link to="/religion">Religion</Link></li>
    <li><Link to="/favorites">Favorites</Link></li>
  </ul>
</nav>
<Routes>
  <Route path="/novel/:id" element={<Novel />} />
  <Route path="/Fiction" element={<Fiction />} />

  <Route path="/favorites" element={
    <div>
      <h1>Favorites</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {favorites.map((novel, index) => (
          <li key={index}>
            {novel.name}, {novel.author}
          </li>
        ))}
      </ul>
    </div>
  } />
</Routes>
  <section className="hero">
  <h1>Discover your next story</h1>
  <p>Explore novels, find new worlds, and get lost in a good book.</p>
  <button>Start Exploring</button>
</section>
      <div className="section-heading">
  <h2 className="section-title">Featured Novels</h2>
  <p>Stories selected to help you find your next great read.</p>
</div>
      <ul className="novel-list">
        {novels.map((novel, index)=>
        <li key={index}>
           <Link to={`/novel/${novel.id}`}>
             <img src={novel.image} alt={novel.name} />
           </Link>
          <h2>{novel.name}</h2>
          <p>by {novel.author}</p>
          <p>{novel.description}</p>
          <button onClick={() => toggleFavorite(novel)}>Favorite</button>
        </li>
        )}
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
    <ul style={{ listStyle: 'none', padding: 0 }}>
      <button onClick={() => setFavorites([])}>Clear Favorites</button  >
      {favorites.map((novel, index) =>( <li key={index} >{novel.name}, {novel.author}</li>) )}
    </ul>

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