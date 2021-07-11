const INPUT = form.input;
const BTN_SEARCH = form.search;
const ABOUT = document.querySelector('.about');
const CROSS = document.querySelector('.form__cross');
const MOVIES = document.querySelector('.movies');

INPUT.addEventListener('keydown', (event) => {
	if (event.keyCode === 13) {
		event.preventDefault();
	}
});

INPUT.addEventListener('input', (event) => {
	let cross = new Cross();

	if (event.target.value === '') {
		cross.hideCross();
		return;
	}

	cross.showCross();

	CROSS.addEventListener('click', () => {
		INPUT.value = '';
		cross.hideCross();
	});
});

BTN_SEARCH.addEventListener('click', () => {
	if (INPUT.value === '') return;

	MOVIES.innerHTML = "";

	const INPUT_DATA = INPUT.value;
	let searchShortData = transformDataForLink(INPUT_DATA);
	let getInformation = new GetData(searchShortData);

	getInformation.getShortData()
		.then(data => renderPreviewOfFilms(data.Search))
		.then(arr => addBtnFunctional(arr))
		.catch(err => console.log(err));
});

class Cross {
	showCross() {
		CROSS.classList.remove('hidden');
	}
	hideCross() {
		CROSS.classList.add('hidden');
	}
}

class GetData {
	constructor(byTitle = '', byID = '') {
		this.byTitle = byTitle;
		this.byID = byID;
	}
	async getShortData() {
		let response = await fetch(`https://www.omdbapi.com/?s=${this.byTitle}&plot=full&apikey=eeb56d4b`);
		let data = await response.json();

		return data;
	}
	async getFullData() {
		let response = await fetch(`https://www.omdbapi.com/?i=${this.byID}&plot=full&apikey=eeb56d4b`);
		let data = await response.json();

		return data;
	}
}

function transformDataForLink(data) {
	let tranformatedData = data.replace(/ /g, "+").replace(/:/g, "%3A");

	return tranformatedData;
}

function renderPreviewOfFilms(film) {
	let arr = [];

	film.forEach((items, i) => {
		let item = document.createElement('div');
		item.classList.add('movies__item');
		item.innerHTML = `
		<div class="movies__poster">
			<img src="${items.Poster}" alt="poster">
		</div>
		<div class="movies__name">
			<h2>${items.Title}</h2>
		</div>
		<h4 class="movies__type">${items.Type}</h4>
		<h4 class="movies__year">${items.Year}</h4>
		<button class="button movies__more">More details</button>
		`;

		MOVIES.appendChild(item);
		arr.push(items.imdbID);
	});

	return arr;
}

function addBtnFunctional(arrayWithID) {
	let btnsMore = document.querySelectorAll('.movies__more');

	btnsMore.forEach((btn, index) => {
		btn.addEventListener('click', (event) => {
			let info = new GetData("", arrayWithID[index]);

			info.getFullData()
				.then(data => renderMoreAboutFilms(data));
		});
	});
}

function renderMoreAboutFilms(film) {
	const ABOUT__INNER = document.querySelector(".about__inner");
	ABOUT__INNER.innerHTML = `
	<div class="about__poster">
		<img src="${film.Poster}" alt="Poster">
	</div>
	<div class="about__main">
		<div class="about__name">${film.Title}</div>
		<div class="about__type">${film.Rated} ${film.Year} ${film.Genre}</div>
		<div class="about__description">${film.Plot}</div>
		<div class="about__write"><b>Written by:</b> ${film.Writer}</div>
		<div class="about__direct"><b>Directed by:</b> ${film.Director}</div>
		<div class="about__starring"><b>Starring:</b> ${film.Actors}</div>
		<div class="about__box-office"><b>BoxOffice:</b> ${film.BoxOffice}</div>
		<div class="about__awards"><b>Awards:</b> ${film.Awards}</div>
		<div class="about__rate"><b>Ratings:</b></div>
	</div>
	`;

	const rate = document.querySelector(".about__rate");
	let ratings = film.Ratings;

	for (const item of ratings) {
		const p = document.createElement('p');
		p.innerText = `${item.Source} - ${item.Value}`;

		rate.appendChild(p);
	}

	ABOUT.classList.remove('hidden');
}

(function hidePopUp() {
	const FADE = document.querySelector('.about__fade');

	FADE.addEventListener('click', () => {
		ABOUT.classList.add('hidden');
	});
})();