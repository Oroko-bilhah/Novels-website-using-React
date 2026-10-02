const fictionNovel = {
  Name: "The Power of Imagination",
  Author: "Alice Brown",
  Description: "A story about the power of imagination."
}

function Fiction() {
  return (
    <div>
      <h1>Fiction Novels</h1>
      <h2>{fictionNovel.Name}</h2>
      <p>by {fictionNovel.Author}</p>
      <p>{fictionNovel.Description}</p>
    </div>
  )
}

export default Fiction
