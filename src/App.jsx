import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Fiction from './Fiction'


const novels = [
  {
    Name: "The beauty of Earth",
    Author: "John Doe",
    Description: "A novel about the beauty of our planet and the importance of preserving it.,Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam aut error accusamus placeat expedita eligendi officiis voluptatem quam iste, qui nisi ducimus labore vitae velit distinctio odit eum adipisci reprehenderit!",
    image: "https://images.unsplash.com/photo-1500534623283-312aade485b7"
  },
  {
    Name: "The wonders of nature",
    Author: "Jane Smith",
    Description: "A novel about the wonders of nature and the importance of preserving it.,Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam aut error accusamus placeat expedita eligendi officiis voluptatem quam iste, qui nisi ducimus labore vitae velit distinctio odit eum adipisci reprehenderit!",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e"
  },
  {
    Name: "The love of humanity",
    Author: "Bob Johnson",
    Description: "A novel about the love of humanity and the importance of preserving it.,Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam aut error accusamus placeat expedita eligendi officiis voluptatem quam iste, qui nisi ducimus labore vitae velit distinctio odit eum adipisci reprehenderit!",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac"
  },
  {
    Name: "The power of imagination",
    Author: "Alice Brown",
    Description: "A novel about the power of imagination and the importance of preserving it.,Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam aut error accusamus placeat expedita eligendi officiis voluptatem quam iste, qui nisi ducimus labore vitae velit distinctio odit eum adipisci reprehenderit!",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23"
  },
  {
    Name: "The joy of storytelling",
    Author: "Charlie Wilson",
    Description: "A novel about the joy of storytelling and the importance of preserving it.,Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam aut error accusamus placeat expedita eligendi officiis voluptatem quam iste, qui nisi ducimus labore vitae velit distinctio odit eum adipisci reprehenderit!",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a"
  }
]

function App() {
  const [favorites, setFavorites] = useState([])
  const [description, setDescription] = useState(null)
function toggleFavorite(novel) {
 if (favorites.includes(novel)) {
    setFavorites(favorites.filter(favorites => favorites !== novel))
  } else {
    setFavorites([...favorites, novel])
 }}
  return (
    <div className="App">
      <nav className="nav">
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
  <Route path="/Fiction" element={<Fiction />} />

  <Route path="/favorites" element={
    <div>
      <h1>Favorites</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {favorites.map((novel, index) => (
          <li key={index}>
            {novel.Name}, {novel.Author}
          </li>
        ))}
      </ul>
    </div>
  } />
</Routes>
      <h1>Welcome to Novella</h1>
      <ul className="novel-list">
        {novels.map((novel, index)=>
        <li key={index} onClick={() => setDescription(novel)}>
           <img src={novel.image} alt={novel.Name} />
          <h2>{novel.Name}</h2>
          <p>by {novel.Author}</p>
          <p>{novel.Description}</p>
          <button onClick={() => toggleFavorite(novel)}>Favorite</button>
        </li>
        )}
      </ul>
    <ul style={{ listStyle: 'none', padding: 0 }}>
      <button onClick={() => setFavorites([])}>Clear Favorites</button  >
      {favorites.map((novel, index) =>( <li key={index} >{novel.Name}, {novel.Author}</li>) )}
    </ul>
    </div>
  )
}

export default App