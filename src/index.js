// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
const quoteList = document.getElementById('quote-list')
document.addEventListener('DOMContentLoaded', (event) => {
    fetchQuotes();
})

function fetchQuotes(){
    return fetch('http://localhost:3000/quotes?_embed=likes')
    .then(resp => resp.json())
    .then(json => renderQuotes(json))
}

function renderQuotes(json){
    quoteList.innerHTML = ""
    json.forEach(quote => {renderQuote(quote)})
}

function renderQuote(quote){
    const card = document.createElement('li')
    card.className = "quote-card"

    const blockQuote = document.createElement('blockquote')
    blockQuote.className = "blockquote"

    const p = document.createElement('p')
    p.className = "mb-0"
    p.innerText = `"${quote.quote}"`

    const footer = document.createElement('footer')
    footer.className = "blocknote-footer"
    footer.innerText = quote.author

    const breaker = document.createElement('br')

    const btnSuccess = document.createElement('span')
    btnSuccess.innerHTML = `<button class="btn-success">Likes: <span>${quote.likes.length}</span></button>`
    btnSuccess.addEventListener('click', () => handleLikeClick(quote))

    const btnDanger = document.createElement('button')
    btnDanger.className = "btn-danger"
    btnDanger.innerText = "Delete"
    btnDanger.addEventListener('click', () => {
            fetch(`http://localhost:3000/quotes/${quote.id}`, {
                method: "DELETE"
            }).then(fetchQuotes());
            
        }
    )

    blockQuote.appendChild(p)
    blockQuote.appendChild(footer)
    blockQuote.appendChild(breaker)
    blockQuote.appendChild(btnSuccess)
    blockQuote.appendChild(btnDanger)
    card.appendChild(blockQuote)
    quoteList.appendChild(card)

}

function handleLikeClick(quote){
    console.log(quote)
    fetch("http://localhost:3000/likes", {
        method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify( {
       quoteId: quote.id 
    })
})
    .then(fetchQuotes())
}







// New Quote
const quoteForm = document.getElementById('new-quote-form')

quoteForm.addEventListener('submit', event => {
    event.preventDefault()
    submitQuote(event.target)
})

function submitQuote(eventData){
    fetch("http://localhost:3000/quotes?_embed=likes", {
        method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
        "quote": eventData.thequote.value,
        "author": eventData.author.value,
        "likes": []
    })
    })
    .then(res => res.json())
  .then((obj_quote) => {
    renderQuote(obj_quote)
  })
}