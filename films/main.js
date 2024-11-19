(function () {
const card = document.querySelector('.card__wrapper');
const output = document.querySelector('.output-list');
const directorSelect = document.querySelector('#directors');
const genreSelect = document.querySelector('#genres');
const titleSearch = document.querySelector('#title__search');

const minDurationSlider = document.querySelector('.durations #rangeMin');
const maxDurationSlider = document.querySelector('.durations #rangeMax');
const minDurationDisplay = document.querySelector('.durations #minValue');
const maxDurationDisplay = document.querySelector('.durations #maxValue');

const minYearSlider = document.querySelector('.years #rangeMin');
const maxYearSlider = document.querySelector('.years #rangeMax');
const minYearDisplay = document.querySelector('.years #minValue');
const maxYearDisplay = document.querySelector('.years #maxValue');

const SHORT = 'short';
const FULL = 'full';
let plot = FULL;

// Range search types
const DURATION = 'length';
const RATING = 'stars';
const YEAR = 'year';

const KEY = 'bcf37ded';
const URL = `https://www.omdbapi.com/?apikey=${KEY}&plot=${plot}&`;

let allFilms = {}, allDirectors = {}, allGenres = {};
let minLength, maxLength, minYear, maxYear;

let filteredArr = [];
let prevInput = '';

// Use this to suppliment IMDB data with my own
let selectedData = {
	storage: null,
	uid: null
};
let filmArrayCorrected = [];

/* omdb intergrations */ 
const searching = () =>  `<div class='omdb-card'><p>Searching...</p></div>`;
const noResult = () =>  `<div class='omdb-card'><h2>No results</h2>
							<p>Replace this with my data from JSON</p>
							</div>`;
const omdbDirectors = (dir) => {
	let ret = '';
	let dirs = dir.split(',');
	dirs.forEach((d, i) => { ret += `<a data-feature="director" data-payload='${d.trim()}'>${d}</a>${i === dirs.length-1 ? '' : ', '}` });
	return ret;
}
const omdbGenres = (genre) => {
	let ret = '';
	let genres = genre.split(',');
	genres.forEach((g, i) => { ret += `<a data-feature="genre" data-payload='${g.trim()}'>${g}</a>${i === genres.length-1 ? '' : ', '}` });
	return ret;
}
const filmResult = (filmData) => {
	// console.log(filmData);
	let actors = filmData.Actors.split(',');
	let directors = omdbDirectors(filmData.Director);
	let genres = omdbGenres(filmData.Genre);
  return `
    <div class='omdb-card'>
        <div class="close">X</div>
        <div class='film__poster'>
            <span class='film__poster--featured'><img src='${filmData.Poster}' /></span>
        </div>
        <div class='film__details'>
            <h2 class='film__title'>${filmData.Title}</h2>
            <ul class='film__tags list--inline'>
                <li class='film__rated'>${filmData.Rated}</li>
                <li class='film__year'>${filmData.Year}</li>
                <li class='film__genre'>${genres}</li>
                <li class='film__duration'>${filmData.Runtime}</li>
                <li class='film__media'>${selectedData.storage.split('|').join(', ')}</li>
            </ul>
            <p class='film__plot'>${filmData.Plot}</p>
            <div class='film__credits'>
                <p><strong>Written by:</strong> ${filmData.Writer}</p>
                <p><strong>Directed by:</strong> ${directors}</p>
                <p><strong>Starring:</strong></p>
                <ul class='film__actors list--inline'>
                    ${actors.map(actor => `<li>${actor}</li>`).join('')}
                </ul>
            </div>
        </div>
    </div>`;
};
const lookupFilm_OMDB = (omdbSearch) =>  {
	fetch(URL + omdbSearch, { method: 'get' }).
	then(function(res) { return res.json() }).
	then(function(data) { card.innerHTML = filmResult(data) }).
	catch(function(err) { card.innerHTML = noResult() });
}

/* Utility methods */
const reset = () => {
	directorSelect.options.selectedIndex = 0;
	genreSelect.options.selectedIndex = 0;
}
const sortObject = (source) => {
	const sorted = Object.keys(source).sort().reduce(
		(obj, key) => {
			obj[key] = source[key]; 
			return obj;
		},{}
	);
	return sorted;
}
const cardDir = (dir) => { reset(); filterBy(dir.trim(), 'director') }
const cardGenre = (genre) => { reset(); filterBy(genre.trim(), 'genre') }
card.addEventListener('click', (evt) => {
    evt.preventDefault();
    let dataSet = evt.target.dataset;
    switch(dataSet.feature){
        case 'director':
            cardDir(dataSet.payload);
            break;
        case 'genre':
            cardGenre(dataSet.payload);
            break;
        default:
            console.log('Error. Unknown data feature')
    }
});

const filterBy = (data, property) => {
	// console.log('filterBy', data, property);
	
	output.innerHTML = '';
	
	for(let key in allFilms) {
		const datum = allFilms[key];
		if(datum[property].includes(data)) {
			printFilmList(datum.title, datum.year, datum.omdbRef, datum.storage, datum.uid);
		}
	}
}
const filterByRange = (property) => {
	// console.log(`filterByRange ${property}`)
	output.innerHTML = '';
	let minVal, maxVal;
	switch(property){
		case DURATION:
			minVal = minLength;
			maxVal = maxLength;
			break;
		case YEAR:
			minVal = minYear;
			maxVal = maxYear;
			break;
		default:
			// do nothing
	}
	
	for(let key in allFilms) {
		const datum = allFilms[key];
		if(datum[property] >= minVal && datum[property] <= maxVal ) {
			printFilmList(datum.title, datum.year, datum.omdbRef, datum.storage, datum.uid);
		}
	}
	clearCard();
}

/* TABS */
let allTabs = [...document.querySelectorAll('.tab')];
let allTabContent = [...document.querySelectorAll('.tab-content')];
const handleTab = (evt) => {
	allTabContent.forEach(tc => tc.style.display = 'none');
    document.querySelector(`#${evt.target.dataset.linkid}`).style.display = 'block';
	allTabs.forEach(t => t === evt.target ? t.classList.add('active-tab') : t.classList.remove('active-tab'));
}
allTabs.forEach(t => t.addEventListener('click', handleTab));

/* UI */
const handleFilmListClick = (evt) => {
	evt.preventDefault();
	if(!evt.target.dataset.omdb) return;
	// console.log(evt.target.dataset.storage);
	// console.log(`handleFilmListClick`, allFilms[evt.target.dataset.uid]);
	card.innerHTML = searching();
	selectedData.storage = evt.target.dataset.storage;
	
	lookupFilm_OMDB(evt.target.dataset.omdb);
}
const handleSelectChange = (evt) => {
	filterBy(evt.target.value, evt.target.name);
	clearCard();
}
const handleRangeChange = (evt) => {
	let updatedValue = Number(evt.target.value);
	let searchProperty;
	
	switch(evt.target){
		case minDurationSlider:
			minLength = updatedValue;
			minDurationDisplay.innerHTML = updatedValue;
			searchProperty = DURATION;
			if(minLength > maxLength){
				maxLength = updatedValue;
				maxDurationSlider.value = updatedValue;
				maxDurationDisplay.innerHTML = updatedValue;
			}
			break;
		case maxDurationSlider:
			maxLength = updatedValue;
			maxDurationDisplay.innerHTML = updatedValue;
			searchProperty = DURATION;
			if(maxLength < minLength){
				minLength = updatedValue;
				minDurationSlider.value = updatedValue;
				minDurationDisplay.innerHTML = updatedValue;
			}
			break;
			
		case minYearSlider:
			minYear = updatedValue;
			minYearDisplay.innerHTML = updatedValue;
			searchProperty = YEAR;
			if(minYear > maxYear){
				maxYear = updatedValue;
				maxYearSlider.value = updatedValue;
				maxYearDisplay.innerHTML = updatedValue;
			}
			break;
		case maxYearSlider:
			maxYear = updatedValue;
			maxYearDisplay.innerHTML = updatedValue;
			searchProperty = YEAR;
			if(maxYear < minYear){
				minYear = updatedValue;
				minYearSlider.value = updatedValue;
				minYearDisplay.innerHTML = updatedValue;
			}
			break;
		default: 
			// do nothing
	}
	
	// Only run search once input interaction finishes
	if(evt.type === 'change') filterByRange(searchProperty);
}
const printFilmList = (title, year, omdbRef, storage, uid) => {
	output.innerHTML += `<p><span class="film-title" data-uid="${uid}" data-storage="${storage}" data-omdb="${omdbRef}">${title}</span> (${year})</p>`;
}
output.addEventListener('click', handleFilmListClick);

const clearCard = () => { card.innerHTML = '' }
const handleCardClick = (evt) => { if(evt.target.classList.contains('close')) clearCard() }
card.addEventListener('click', handleCardClick);

/* Set up data */
const readFilmList = (data) => {
	data.map( (datum, uid) => {
		const jointDirectors = datum.director.split('|');
		jointDirectors.forEach((director) => {
			// if(director === "") console.log(`Missing director - ${datum.title}`);
			if(director === "") director = 'Unknown';
			allDirectors[director] = director;
		});
		
		let filmLength = datum.length;
		if(filmLength && filmLength > 0 && filmLength != ""){
			if(minLength === undefined) { minLength = maxLength = data[0].length }
			minLength = Math.min(minLength, filmLength);
			maxLength = Math.max(maxLength, filmLength);
		}
		//	Utility to highlight missing data..
		// else{
		// 	console.log(`Missing length - ${datum.title}`)
		// }
		
		let filmYear = datum.year;
		if(filmYear && filmYear > 0 && filmYear != ""){
			if(minYear === undefined) { minYear = maxYear = data[0].year }
			minYear = Math.min(minYear, filmYear);
			maxYear = Math.max(maxYear, filmYear);
		}
		//	Utility to highlight missing data..
		// else{
		// 	console.log(`Missing year - ${datum.title}`)
		// }
		
		// allGenres
		const jointGenre = datum.category.split('|');
		jointGenre.forEach((genre) => {
			//	Utility to highlight missing data..
			// if(genre === "") console.log(`Missing genre - ${datum.title}`);//genre = 'Unknown';
			if(genre === "") genre = 'Unknown';
			allGenres[genre] = genre;
		});
		
		const titleAr = datum.title.split('|');
		const title = (titleAr.length > 1) ? `${titleAr[1]} ${titleAr[0]}` : titleAr[0];
		
		// If there is an IMDB ID, use it
		let omdbRef = datum.imdb ? `i=${datum.imdb}` : `t=${title.split(' ').join('-')}`;
		// Year not required but ignored if IMDB ID
		if(datum.year != '') omdbRef += `&y=${datum.year}`;
		
		/*	For testing
			Display all films */
		// printFilmList(title, datum.year, omdbRef, datum.storage, datum.uid);
		
		allFilms[datum.title] = {};
		allFilms[datum.title].uid = `uid_${uid}`;
		allFilms[datum.title].title = title;
		allFilms[datum.title].director = jointDirectors;
		allFilms[datum.title].genre = jointGenre;
		allFilms[datum.title].omdbRef = omdbRef;
		allFilms[datum.title].length = datum.length;
		allFilms[datum.title].year = datum.year;
		allFilms[datum.title].storage = datum.storage;
		allFilms[datum.title].rating = datum.BBFC;
		allFilms[datum.title].stars = datum.stars;
		
		filmArrayCorrected.push(allFilms[datum.title]);
	});
	populateSelect(allDirectors, directorSelect, handleSelectChange);
	populateSelect(allGenres, genreSelect, handleSelectChange);
	
	populateRangeInputs();
}
const populateSelect = (data, ui, handler) => {
	const sorted = sortObject(data);
	for (const key in sorted) {
		const dir = sorted[key];
		const opt = document.createElement('option');
		opt.value = dir;
		opt.text = dir;
		ui.add(opt);
	};
	ui.addEventListener('change', handleSelectChange, handler);
}
const populateRangeInputs = () => {
	// LENGTH
	minDurationSlider.min = maxDurationSlider.min = minLength;
	minDurationSlider.max = maxDurationSlider.max = maxLength;
	minDurationSlider.value = minLength;
	maxDurationSlider.value = maxLength;
	minDurationDisplay.innerHTML = minLength;
	maxDurationDisplay.innerHTML = maxLength;
	
	minDurationSlider.addEventListener('change', handleRangeChange);
	maxDurationSlider.addEventListener('change', handleRangeChange);
	minDurationSlider.addEventListener('input', handleRangeChange);
	maxDurationSlider.addEventListener('input', handleRangeChange);
	
	// YEAR
	minYearSlider.min = maxYearSlider.min = minYear;
	minYearSlider.max = maxYearSlider.max = maxYear;
	minYearSlider.value = minYear;
	maxYearSlider.value = maxYear;
	minYearDisplay.innerHTML = minYear;
	maxYearDisplay.innerHTML = maxYear;
	
	minYearSlider.addEventListener('change', handleRangeChange);
	maxYearSlider.addEventListener('change', handleRangeChange);
	minYearSlider.addEventListener('input', handleRangeChange);
	maxYearSlider.addEventListener('input', handleRangeChange);
}

/* Typeahead search */
const doTypeaheadSearch = (str) => {
	// Optimised search with shortest array to scan
	const optimisedData = (filteredArr.length > 0 && str.includes(prevInput)) ? [...filteredArr] : filmArrayCorrected;
	
	// Only search if required length. Reset otherwise
	str.length === 0 ? filteredArr.length = 0 : filteredArr = filterDataset(str, optimisedData);
	
	// Cache previous search term for next input
	prevInput = str;
}
const filterDataset = (str, arr) => {
	return arr.filter(datum => datum['title'].toLowerCase().includes(str));
}
const onTitleInput = (evt) => {
	// Search lower case for consistency
	doTypeaheadSearch(evt.target.value.toLowerCase());
	
	// Clear output
	output.innerHTML = '';
	
	// Build list of matches
	filteredArr.forEach(datum => printFilmList(datum.title, datum.year, datum.omdbRef, datum.storage, datum.uid));
}
titleSearch.addEventListener('input', onTitleInput);


/* Load and process the data */
let filmList = [];
async function fetchFilmsJSON() {
    const response = await fetch('./films.json');
    const films = await response.json();
    return films;
}
fetchFilmsJSON().then(films => {
    filmList = films;
    readFilmList(filmList);
});

})();