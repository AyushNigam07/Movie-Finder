
let totalResults ;
var modalWrap = null;
const fetchData = (pageNo) => {
let input = document.getElementById("input").value; 
if(input === ""){
alert("Type something first")
return;
}
document.getElementById("pagination").innerHTML = ''
document.getElementById("cards").innerHTML  = `<div class="spinner-border text-primary text-center" role="status">
  <span class="visually-hidden">Loading...</span>
</div>`
document.getElementById("dynamicBtn").innerHTML = `
<button class="btn btn-outline-success" type="button" disabled>
  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  <span class="visually-hidden">Loading...</span>
</button>
`
let data ;
 fetch(`http://www.omdbapi.com/?s=${input}&page=${pageNo}&apikey=fdd039ff`).then((response)=> {
 response.json().then((result)=> { 
try {
if(result.Search !== undefined){
 data = result.Search.map((e,index) => {
return ( 
`
<div class="card m-2 "  id="cards" style="width: 18rem">
  <img src=${e.Poster==="N/A" ? "./no-image-icon-23494.png" : e.Poster } class="card-img-top" alt="...">
  <div class="card-body d-flex justify-content-end flex-column">
    <h5 class="card-title">${e.Title}</h5>
    <p class="card-text"> ${e.Year}</p>
<button class="btn btn-primary" id="dynamicBtn2" onclick={movieDetails("${e.imdbID}",${index})} >Know More</button>
</div>
  </div>
`
)
})
 document.getElementById("cards").innerHTML =   data;
document.getElementById("dynamicBtn").innerHTML = ` <button class="btn btn-outline-success" onclick={fetchData()} >Search</button>`
totalResults = ((result.totalResults)/10).toString().split(".")[0];
let pages = `<li class="page-item"><a class="page-link" onclick=(fetchData(${1})) href="#">1</a></li>`  ;
 for (let i = 2; i < result.totalResults/10; i++) {
 pages += `
 <li class="page-item"><a class="page-link" onclick=(fetchData(${i})) href="#">${i}</a></li>
`
}
document.getElementById("pagination").innerHTML = `
<nav aria-label="Page navigation example">
<ul class="pagination justify-content-center d-flex flex-wrap">
<li class="page-item">
<a class="page-link" id="prevbtn" href="#" onclick=(fetchData(${pageNo-1})) aria-label="Previous">
<span aria-hidden="true">&laquo;</span>
</a>
</li>
${pages}
    <li class="page-item">
    <a class="page-link" id="nxtbtn" href="#" onclick=(fetchData(${pageNo+1})) aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
        </a>
        </li>
        </ul>
        </nav>
        `}
else {
  alert("Result not found")
  document.getElementById("cards").innerHTML  = ""
  document.getElementById("dynamicBtn").innerHTML = ` <button class="btn btn-outline-success" onclick={fetchData()} >Search</button>`
  input = "" ;
}
} catch (error) {
}
if(pageNo===1){
  document.getElementById("prevbtn").classList.add("disabled")
}
else if(Number(totalResults) > pageNo > 1){
  document.getElementById("prevbtn").classList.remove("disabled")
  document.getElementById("nxtbtn").classList.remove("disabled")
}
else if(pageNo  == Number(totalResults)){
  document.getElementById("nxtbtn").classList.add("disabled")
}
})
})
}
const movieDetails = (id , index) => {
const children = document.getElementById("cards").children[index].querySelector('#dynamicBtn2');
children.innerHTML =  `
  <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
  <span class="visually-hidden">Loading...</span>` 
fetch(`http://www.omdbapi.com/?i=${id}&apikey=fdd039ff&`).then((response)=> {
 response.json().then((result)=> { 
try {
 if (modalWrap !== null) {
    modalWrap.remove();
  }
  modalWrap = document.createElement('div');
  modalWrap.innerHTML = `
   <div class="modal fade" tabindex="-1">
      <div class="modal-dialog  modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header bg-light">
            <h5 class="modal-title">${result.Title}(${result.Year})</h5>
          </div>
          <div class="modal-body">
  <img src=${result.Poster==="N/A" ? "./no-image-icon-23494.png" : result.Poster } class="card-img-top" alt="...">
            <h6>Description - ${result.Plot}</h6>
<h6>Director - ${result.Director}</h6>
<h6>Actors - ${result.Actors}</h6>
<h6>Genre -  ${result.Genre}</h6>
<h6>Language - ${result.Language}</h6>
<h6>imdb Rating - ${result.imdbRating}/10</h6>
<h6>Awards - ${result.Awards}</h6>
          </div>
          <div class="modal-footer bg-light">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>

  `;
  document.body.append(modalWrap);
  var modal = new bootstrap.Modal(modalWrap.querySelector('.modal'));
  modal.show();
children.innerText ="Know More"
}
catch (error) {
alert (error)
}
})
})
}
document.getElementById("input").addEventListener("keypress" , (event) => {
  if(event.key === "Enter") fetchData(1) 
})