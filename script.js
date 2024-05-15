const buttonNext = document.querySelector('#next');
const buttonPrev = document.querySelector('#prev');
const mainElement = document.querySelector('main');
const containerCards = document.querySelector('#container-cards');
const containerSkeleton = document.querySelector('#container-skeleton');
const containerSlider = document.querySelector('#container-slider');
const logo = document.querySelector('#logo');
const searchInput = document.querySelector('#search');
const searchIcon = document.querySelector('#search-icon');

const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const containerImage = document.getElementById('container-image');
const modalContent = document.getElementById('modal-content');
const containerInfo = document.getElementById('container-info');
const closeBtn = document.querySelector('.close');

// let api_key = "e7f7fb896c6c45b19e344902851a1e07"
let api_key = "c542e67aec3a4340908f9de9e86038af"
let page_games = 1
let buttonsCard



buttonNext.addEventListener('click', () => {
  page_games++
  window.scrollTo(0, 0)
  console.log(page_games);

  if ( searchInput.value.length === 0 ) {
    getGames()
  } else {
    searchByName(searchInput.value)
  }

  if(page_games > 1) {
    containerSlider.style.display = 'none';
  }else{
    containerSlider.style.display = 'flex';
  }
})

buttonPrev.addEventListener('click', () => {
  if (page_games > 1) {
    page_games--
    window.scrollTo(0, 100)
    console.log(page_games);

    if ( searchInput.value.length === 0 ) {
      getGames()
    } else {
      searchByName(searchInput.value)
    }

    if(page_games > 1) {
      containerSlider.style.display = 'none';
    }else {
      containerSlider.style.display = 'flex';
    }
  }
})

searchInput.addEventListener('input', () => {
  page_games = 1
  if ( searchInput.value.length === 0 ) {
    getGames()
    getSliders()
  } else {
    searchByName(searchInput.value)
    containerSlider.innerHTML = ""
  }
});

searchIcon.addEventListener('click', () => {
  searchInput.classList.toggle('active')
})

getGames()
getSliders()
searchById()

async function fetchData() {
  let url = `https://api.rawg.io/api/games?page=${page_games}&key=${api_key}&page_size=30`
  let data;
  containerCards.innerHTML = ""
  skeletonCards()

  await fetch(url)
    .then(res => res.json())
    .then(datos => {
      data = datos.results
    })
    .catch(err => console.log(err))

    return data
}

async function searchByName(name) {
  let games;

  await fetch(`https://api.rawg.io/api/games?search=${name}&key=${api_key}&page_size=30&page=${page_games}`)
   .then(res => res.json())
   .then(data => {
      games = data.results
      containerCards.innerHTML = ""
      createCards(games)
    })
   .catch(err => console.log(err));
}

async function searchById(id) {
  let game;
  let url = `https://api.rawg.io/api/games/${id}?key=${api_key}`
    await fetch(url)
   .then(res => res.json())
   .then(data => {
      game = data
    })
    return game
}

function skeletonCards() {
  for (let i = 0; i < 30; i++) {
    const card = document.createElement("card");
    card.classList.add("card_skeleton");

    const backgroundImage = document.createElement("div");
    backgroundImage.classList.add("card_background_skeleton");

    const cardContent = document.createElement("div");
    cardContent.classList.add("card_content_skeleton");

    card.appendChild(backgroundImage);
    card.appendChild(cardContent);
    containerCards.appendChild(card)
  }
}

async function getGames() {
  let games = await fetchData()
  containerCards.innerHTML = ""
  createCards(games)
}

async function getSliders() {

  let tops = await fetchData()
  console.log(tops)

  tops.slice(15, 20).forEach(top => {

    let newSlide = document.createElement('div');
    newSlide.className = 'slide';
    newSlide.style.backgroundImage = 'url(' + top.background_image + ')';

    let newDiv = document.createElement('div');

    let newTitle = document.createElement('h3');
    newTitle.textContent = top.name;

    newDiv.appendChild(newTitle)
    newSlide.appendChild(newDiv)

    containerSlider.appendChild(newSlide)

  })

  const slides = document.querySelectorAll('.slide');

  let currentIndex = 0;

  function changeSlide() {
    removeActiveClass();
    slides[currentIndex].classList.add('active');
    currentIndex = (currentIndex + 1) % slides.length;
  }

  setInterval(changeSlide, 5000);

  slides.forEach(slide => {
    slide.addEventListener('click', () => {
      removeActiveClass();
      slide.classList.add('active');
    });
  });

  function removeActiveClass() {
    slides.forEach(sli => sli.classList.remove('active'));
  }
}

function createCards(array) {
  array.forEach(game => {

    const card = document.createElement("card");
    card.classList.add("card");
    
    const backgroundImage = document.createElement("img");
    backgroundImage.classList.add("card_background");
    backgroundImage.src = game.background_image;
    backgroundImage.alt = game.name;

    const cardContent = document.createElement("div");
    cardContent.classList.add("card_content", "flow");
    
    const cardContentContainer = document.createElement("div");
    cardContentContainer.classList.add("card_content--container", "flow");
    
    const title = document.createElement("h2");
    title.classList.add("card_title", "h2-card");
    title.textContent = game.name;
    
    const button = document.createElement("button");
    button.classList.add("card_button");
    button.textContent = "View More";
    button.id = game.id;

    cardContentContainer.appendChild(title);

    cardContent.appendChild(cardContentContainer);
    cardContent.appendChild(button);

    card.appendChild(backgroundImage);
    card.appendChild(cardContent);

    containerCards.appendChild(card)
  });

  modalActive()

  function handleMouseEnter(event) {
    const card = event.currentTarget;
    card.classList.add('active');
  }

  function handleMouseLeave(event) {
    const card = event.currentTarget;
    card.classList.remove('active');
  }

  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);
  });
}

function modalActive() {
  let game;

  document.querySelectorAll('.card_button').forEach(button => {
      button.addEventListener('click', async function () {
        game = await searchById(button.id)
        const span = document.createElement('span')
        span.classList.add('close')
        span.textContent = '&times;'
        
        modalTitle.textContent = game.name;
        const img = document.createElement('img');
        img.src = game.background_image;
        containerImage.appendChild(img);

        const p = document.createElement('p');
        p.textContent = game.description_raw;
        containerInfo.appendChild(p);

        modal.style.display = 'flex';

        const div = document.createElement('div');
        div.classList.add('metacritic');

        const h1 = document.createElement('h1');
        h1.textContent = game.metacritic;
        const img2 = document.createElement('img');
        img2.src = './assets/img/metacritic.png';

        div.append(h1, img2);

        containerInfo.appendChild(div);

      });
  });

  closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
      containerImage.innerHTML = '';
      modalTitle.textContent = '';
      containerInfo.innerHTML = '';
  });

  window.addEventListener('click', (event) => {
      if (event.target == modal) {
          modal.style.display = 'none';
          containerImage.innerHTML = '';
          modalTitle.textContent = '';
          containerInfo.innerHTML = '';
      }
  });
};


