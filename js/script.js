const createHtmlElement = arr =>{
    const htmlelements = arr.map(element=>`<span class="badge badge-outline">${element}</span>`);
    return htmlelements.join(" ")
}

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const loadLesson = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((data) => displayLesson(data.data));
};

// remove active class
const removeActive = () => {
  const lessonBtns = document.querySelectorAll(".lesson-btn");
  // console.log(lessonBtns);
  lessonBtns.forEach((btn) => btn.classList.remove("active"));
};

const loadLevelWord = (id) => {
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeActive(); //remove all active class
      const clickBtn = document.getElementById(`lesson-btn-${id}`);
      // console.log(clickBtn);
      clickBtn.classList.add("active"); //add clicked active class
      displayLevelWord(data.data);
    });
};

const loadWordDetail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const details = await res.json();
  displayWordDetails(details.data);
};

// {
//     "word": "Eager",
//     "meaning": "আগ্রহী",
//     "pronunciation": "ইগার",
//     "level": 1,
//     "sentence": "The kids were eager to open their gifts.",
//     "points": 1,
//     "partsOfSpeech": "adjective",
//     "synonyms": [
//         "enthusiastic",
//         "excited",
//         "keen"
//     ],
//     "id": 5
// }

const displayWordDetails = (word) => {
  console.log(word);
  const detailsContainer = document.getElementById("details-container");
  detailsContainer.innerHTML = `
    <div class="">
        
    <div class="space-y-3">

      <!-- Title -->
      <h2 class=" text-2xl font-bold">
        ${word.word} (${word.meaning})
      </h2>

      <!-- Meaning -->
      <div>
        <p class="font-semibold">Meaning</p>
        <p class="text-gray-600">${word.pronunciation}</p>
      </div>

      <!-- Example -->
      <div>
        <p class="font-semibold">Example</p>
        <p class="text-gray-600">
          ${word.sentence}
        </p>
      </div>

      <!-- Synonyms -->
      <div>
        <p class="font-semibold">সমার্থক শব্দ গুলো</p>
        <div class="flex gap-2 mt-2">
        ${createHtmlElement(word.synonyms)}
        </div>
      </div>

      <!-- Button -->
      <div class="card-actions justify-start pt-3">
      <div class="modal-action">
           <form method="dialog">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn btn-primary">Complete Learning</button>
          </form>
        </div>
    </div>
  </div>
</div>
    `;
  document.getElementById("word_modal").showModal();
};

const displayLevelWord = (words) => {
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";

  if (words.length == 0) {
    wordContainer.innerHTML = `
        <div class="text-center col-span-full font-bangla space-y-4">
            <img class="mx-auto" src="./assets/alert-error.png"/>
            <p class="text-lg font-medium">এই <span class=".font-poppins">Lesson</span> এ এখনো কোন <span class=".font-poppins">Vocabulary</span> যুক্ত করা হয়নি। করেননি</p>
            <h2 class="text-4xl font-semibold">নেক্সট <span class=".font-poppins">Lesson</span> এ যান</h2>
        </div>
        `;
  }

  words.forEach((word) => {
    // console.log(word);

    // {
    //     "id": 85,
    //     "level": 1,
    //     "word": "Hat",
    //     "meaning": "টুপি",
    //     "pronunciation": "হ্যাট"
    // }

    const card = document.createElement("div");
    card.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm text-center py-8 px-5 space-y-4">
            <h2 class="text-2xl font-bold">${word.word ? word.word : "শব্দ পাওয়া যায়নি"}</h2>
            <p class="text-lg">Meaning /Pronounciation</p>
            <div class="font-bangla text-xl font-semibold">${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"} / ${word.pronunciation ? word.pronunciation : "pronunciation পাওয়া যায়নি"}</div>
            <div class="flex justify-between items-center ">
                <button onclick="loadWordDetail(${word.id})" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF] hover:text-white">
                    <i class="fa-solid fa-circle-info"></i>
                </button>
                <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF] hover:text-white">
                   <i class="fa-solid fa-volume-high"></i>
                </button>
            </div>
        </div>
    `;
    wordContainer.append(card);
  });
};

const displayLesson = (lessons) => {
  // 1. get the container and make it empty
  const lessonConatiner = document.getElementById("lesson-container");
  // empty
  lessonConatiner.innerHTML = "";
  // 2. get into every lessons
  for (let lesson of lessons) {
    // console.log(lesson);
    // 3. create element
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
        <button id="lesson-btn-${lesson.level_no}" onclick = "loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn" ><i class="fa-solid fa-book-open"></i> lesson-${lesson.level_no}</button>
    `;
    // 4.append the element to container
    lessonConatiner.appendChild(btnDiv);
  }
};

loadLesson();

// search
document.getElementById('search-btn').addEventListener('click',()=>{
    removeActive()
    const searchInput = document.getElementById('search-input');
    const searchValue = searchInput.value.trim().toLowerCase();
    // searchInput.value = ""
    console.log(searchValue);
    fetch('https://openapi.programming-hero.com/api/words/all')
    .then(res=>res.json())
    .then(data =>{
        const allWords = data.data;
        const filterWords = allWords.filter(word=>
            word.word.toLowerCase().includes(searchValue)

        )
        displayLevelWord(filterWords)
    })
})