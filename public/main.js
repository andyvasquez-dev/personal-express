// document.addEventListener("DOMContentLoaded", postVotes)

document.querySelector('.menuContainer').addEventListener('click',()=>{
  document.querySelector('.bar1').classList.toggle('change')
  document.querySelector('.bar2').classList.toggle('change')
  document.querySelector('.bar3').classList.toggle('change')
  document.querySelector('.overlay').classList.toggle('hidden')
  // document.querySelector('').classList.toggle()
})

// function getCurrentVotes(){
//   //
//   fetch('/currentVotes',{
//     method:'get'
//   })
//     .then(res=>res.json())
//     .then(data=>{
//       console.log(data);
//       const votes =document.querySelector('.votes')
//       votes.innerHTML = ""
//       data.timestamps.sort((a,b) => parseFloat(a.time) - parseFloat(b.time))
//       console.log(data.timestamps);
//       data.timestamps.forEach((entry, i) => {
//
//         let li = document.createElement('li')
//         li.classList.add('entry')
//
//         let pMovie = document.createElement('p')
//         let movieNode = document.createTextNode(entry.movie)
//         pMovie.appendChild(movieNode)
//
//         let pVotes = document.createElement('p')
//         let votesNode = document.createTextNode(entry.votes)
//         pVotes.appendChild(votesNode)
//
//         li.appendChild(pMovie)
//         li.appendChild(pVotes)
//
//         votes.appendChild(li)
//     })
//   })
// }

function postVotes(usersNoms){
  console.log('made it');
  fetch('postVotes',{
    method:'post',
    headers:{'Content-Type' : 'application/json'},
    body:JSON.stringify({
      'movie1':usersNoms[0],
      'movie2':usersNoms[1],
      'movie3':usersNoms[2],
      'movie4':usersNoms[3],
      'movie5':usersNoms[4]
    })
  })
  .then(response=> { if (response.ok) return response.json()})
  .then(data => {
    console.log(data);
    removeThanks();
    window.location.reload(true)

  })
}

const titleInput = document.querySelector('#titleInput')
const resultsList = document.querySelector('.resultsList')
const nominationList = document.querySelector('.nominationsList')
let buttons = document.querySelector('button')
let nominationCount = 0;
let nominationsArray = [];

document.addEventListener('DOMContentLoaded', getLocalNominations);

document.querySelector('.okButton').addEventListener('click', removeThanks)
document.querySelector('.submitButton').addEventListener('click', submitButton)

function removeThanks(){
  document.querySelector('.thanksDetails').classList.add('hidden')
  document.querySelector('.overlay').classList.add('hidden')
  nominationCount=0;
  nominationsArray=[];
  document.querySelector('.countdown').textContent = `${5-nominationCount} votes left!`
  window.localStorage.clear()
}

function submitButton(){
  nominationList.innerHTML='';
  resultsList.innerHTML='';
  document.querySelector('.outputContainer').classList.add('hidden')
  document.querySelector('.banner').classList.add('hidden')

  document.querySelector('.overlay').classList.remove('hidden')
  document.querySelector('.thanksDetails').classList.remove('hidden')
  // document.querySelector('.okButton').classList.toggle('hidden')
  postVotes(nominationsArray);
}

function fullBallot(){
  document.querySelector('#complete').classList.toggle("hidden");
  document.querySelector('.banner').classList.toggle("hidden")
}

function removeSelection(e){
  let movieTitle = e.target.previousSibling.textContent
  removeLocalNominations(movieTitle);
  let currentResultList = document.querySelector('.resultsList').children

  for(let i = 0; i < currentResultList.length; i++){
    console.log(currentResultList[i].firstChild);
    if(currentResultList[i].firstChild.id){
      if(currentResultList[i].firstChild.innerHTML.includes(movieTitle)){
        currentResultList[i].firstChild.childNodes[1].firstChild.classList.remove('opacity')
        currentResultList[i].firstChild.id=""
      }
    }
  }

  nominationsArray = nominationsArray.filter((a,b)=>{ return ( a !== movieTitle)})

  console.log(currentResultList);

  if (nominationCount>0) {
    nominationCount--;
    document.querySelector('.countdown').textContent = `${5-nominationCount} votes left!`
  }

  e.target.parentElement.remove()
  if (!document.querySelector('.complete').classList.contains('hidden')) {
    fullBallot();
  }
}

function nominateSelection(e){
  let currentNominationList = document.querySelector('#nominations').children

  if (nominationCount<=4 && (!nominationsArray.includes(e.target.parentElement.parentElement.firstChild.textContent))){
    e.target.classList.add('opacity');

    let listItem = document.createElement('li')
    let movieSelection = document.createElement('h3')
    movieSelection.textContent = e.target.parentElement.previousSibling.textContent
    e.target.parentElement.parentElement.id= `${nominationCount}`
    saveLocalNomination(e.target.parentElement.previousSibling.textContent);

    let removeButton = document.createElement('button')
    let removeButtonNode = document.createTextNode('Remove')
    removeButton.appendChild(removeButtonNode)
    removeButton.addEventListener('click',removeSelection)

    listItem.appendChild(movieSelection);
    listItem.appendChild(removeButton)
    nominationList.appendChild(listItem)

    nominationsArray.push(e.target.parentElement.parentElement.firstChild.textContent)
    nominationCount++;
    document.querySelector('.countdown').textContent = `${5-nominationCount} votes left!`
    if (nominationCount===5){
      fullBallot();
    }
  }
}

function showResults(results){

  inputSearch.textContent = `Results for... "${titleInput.value}"`
  titleInput.value="";

  results=results.sort( (a, b) => b.year - a.year)

    results.forEach((item, i) => {
    let listItem = document.createElement('li')
    listItem.classList.add('movieItem')

    let movieHeaderSec=document.createElement('section')
    movieHeaderSec.classList.add('movieHeader')
    let movieDetailsSec=document.createElement('section')
    movieDetailsSec.classList.add('movieDetails')
    let detailsSection=document.createElement('section')
    detailsSection.classList.add('details')

    let image = document.createElement('img')
    image.src = item.poster;
    image.classList.add('poster')
    detailsSection.appendChild(image)
    movieDetailsSec.appendChild(detailsSection)



    //result information
    let movieTitle = document.createElement('h3')
    movieTitle.classList.add(`nominate${i}`)
    movieTitle.classList.add('movieTitle')
    let movieNode = document.createTextNode(`${item.movieTitle}  (${item.year})`);
    movieTitle.appendChild(movieNode)
    let buttonSection = document.createElement('section')
    let nominateButton = document.createElement('button')
    let nominateButtonNode = document.createTextNode('Nominate')
    nominateButton.appendChild(nominateButtonNode)
    nominateButton.classList.add(`nominate${i}`)
    nominateButton.addEventListener("click", nominateSelection)


    buttonSection.appendChild(nominateButton)
    // buttonSection.appendChild(arrowButton)

    movieHeaderSec.appendChild(movieTitle)
    movieHeaderSec.appendChild(buttonSection)

    listItem.appendChild(movieHeaderSec)
    listItem.appendChild(movieDetailsSec)

    document.querySelector('.loader').style.display= 'none';
    resultsList.appendChild(listItem)
  });
}

function movieSearch(){ // bring back all matches dating back to 1995
  document.querySelector('#output').classList.remove('hidden')
    inputSearch.textContent = `Results for... "${titleInput.value}"`
    document.querySelector('.loader').style.display='flex'
  // }14
  const yearCheckEnd = 2000
  const currentYear = 2020
  const searchResults = []

  let title = document.querySelector('#titleInput').value.toString().trim() // assigns title input to title, removes white space around text
  let counter=0;

  if (document.querySelector('#output').classList!=="outputContainer"){
    resultsList.innerHTML=''
  }

  while(title.includes(" ")){   // for proper formatting before the request, adds + inbetween spaces
    title=title.replace(" ", `+`)
  }

    // brings back matches from each year ending at yearcheckend`
    // const proxyurl = "https://cors-anywhere.herokuapp.com/";
    // fetch(proxyurl+`http://www.omdbapi.com/?s=${title}&apikey=`)
    //proxyurl+ below
    fetch(`http://www.omdbapi.com/?apikey=c2d156e8&s=${title}`)
      .then(response=>response.json())
      .then(data=>{
        console.log(data);
        if (data.Response=== "False") {
          document.querySelector('.nothingFound').style.display="block";
        }
        counter++
        if ( data.Response!== "False"){
          // if(data.Poster !== 'N/A'){
          data['Search'].forEach((search, i) => {
            searchResults.push({
              year : parseInt(search.Year),
              movieTitle : search.Title,
              poster : search.Poster,
              type : search.Type,
              imdbID : search.imdbID
            })
          });


          // }
          document.querySelector('.nothingFound').style.display='none';
          showResults(searchResults);
        }

      })


}

function getLocalNominations(){

  let nominations;
  if(localStorage.getItem('nominations') === null){ // if nothing with 'nominations exist then create an empty array'
    nominations = [];
  }
  else{
    nominations = JSON.parse(localStorage.getItem('nominations'))
  }
  if (nominations.length>0) {
    document.querySelector('#output').classList.remove('hidden')
  }
  nominations.forEach((nomination, i) => {

    //counter
    nominationCount = nominations.length;
    document.querySelector('.countdown').textContent = `${5-nominationCount} votes left!`

    let listItem = document.createElement('li')
    let movieSelection = document.createElement('h3')
    movieSelection.textContent = nomination


    let removeButton = document.createElement('button')
    let removeButtonNode = document.createTextNode('Remove')
    removeButton.appendChild(removeButtonNode)
    removeButton.addEventListener('click',removeSelection)

    listItem.appendChild(movieSelection);
    listItem.appendChild(removeButton)
    nominationList.appendChild(listItem)
    nominationsArray= nominations
    if (nominationCount===5){
      fullBallot();
    }
  });
}


function removeLocalNominations(nomination){
  let nominations;
  if(localStorage.getItem('nominations') === null){ // if nothing with 'nominations exist then create an empty array'
    nominations = [];
  }
  else{
    nominations = JSON.parse(localStorage.getItem('nominations'))
  }
  const nominationIndex = nomination;
  nominations.splice(nominations.indexOf(nominationIndex), 1)
  localStorage.setItem('nominations', JSON.stringify(nominations)) // saves nomination array as 'nominations'

}

function saveLocalNomination(nomination){
  let nominations;
  if(localStorage.getItem('nominations') === null){ // if nothing with 'nominations exist then create an empty array'
    nominations = [];
  }
  else{
    nominations = JSON.parse(localStorage.getItem('nominations'))
  }
  nominations.push(nomination);
  localStorage.setItem('nominations', JSON.stringify(nominations)) // saves nomination array as 'nominations'
}

titleInput.addEventListener('keyup', (e) => {
  if(e.keyCode === 13){
    if(titleInput.value){
      movieSearch();
    }
    else{
      console.log('looks like you didnt enter a string');
    }
  }
})
