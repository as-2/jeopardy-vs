class TriviaGameShow {
   constructor(element, options={}) {
      //Which categories we should use (or use default is nothing provided)
      //this.useCategoryIds = options.useCategoryIds || [ 1892, 4483, 88, 218, 68, 18];
      /*
         Default Categories pulled from https://jservice.io/search:
         ---
         1892: Video Games
         4483: Three Letter Animals
         88: Geography
         218: Science and Nature
      */
      // Generate an array of 5 unique random category IDs
      const maxCategoryID = 24000;
      const randomCategoryIDs = new Set();

      while (randomCategoryIDs.size < 6) {
         const randomCategoryID = Math.floor(Math.random() * maxCategoryID) + 1;
         randomCategoryIDs.add(randomCategoryID);
      }

      // Convert the set of random IDs to an array
      const randomCategoryIdsArray = Array.from(randomCategoryIDs);

      // Use the generated random category IDs
      this.useCategoryIds = randomCategoryIdsArray;

      // Generate an array of 5 unique random category IDs with a clueCount of at least 5
      // FIXME - GET CATEGORIES
      // generateRandomCategoryIds().then(randomIds => {
      //    this.useCategoryIds = randomIds;
      // });

      //Database
      this.categories = [];
      this.clues = {};

      //State
      this.currentClue = null;
      this.score1 = 0;
      this.score2 = 0;
      this.score3 = 0;

      //Elements
      this.boardElement = element.querySelector(".board");
      this.scoreCountElement1 = element.querySelector(".score-count-1");
      this.scoreCountElement2 = element.querySelector(".score-count-2");
      this.scoreCountElement3 = element.querySelector(".score-count-3");
      this.formElement = element.querySelector("form");
      this.inputElement = element.querySelector("button[name=user-answer]");
      this.modalElement = element.querySelector(".card-modal"); //the popup for the current question
      this.clueTextElement = element.querySelector(".clue-text");
      this.clueCategoryElement = element.querySelector(".clue-category");
      this.resultElement = element.querySelector(".result");
      this.resultTextElement = element.querySelector(".result_correct-answer-text");
      this.successTextElement = element.querySelector(".result_success");
      this.failTextElement = element.querySelector(".result_fail");
      }
 
      initGame() {
         //Bind event handlers
         this.boardElement.addEventListener("click", event => {
            if (event.target.dataset.clueId) {
               this.handleClueClick(event);
            }
         });
         this.formElement.addEventListener("submit", event => {
            // this.handleFormSubmitv1(event);  // original function
            this.handleFormSubmit(event);
         });
   
         //Render initial state of score
         this.updateScore1(0);
         this.updateScore2(0);
         this.updateScore3(0);
   
         //Kick off the category fetch
         //
         // INSTEAD: GET A NEW CATEGORY FETCH FOR DOUBLE JEOPARDY IN THIS CASE,
         // MULTIPLY ALL OF THE CLUES' VALUES BY 2 TO REFLECT DOUBLE JEOPARDY
         //
         this.fetchCategories();
   
         //FINALLY, GET FINAL JEOPARDY
      }
 
      
      fetchCategories() {
         //Fetch all of the data from the API
         const categories = this.useCategoryIds.map(category_id => {
            return new Promise((resolve, reject) => {
               // fetch(`https://jservice.io/api/category?id=${category_id}`, {
               //    mode: 'no-cors'
               // })
               fetch(`https://jservice.io/api/category?id=${category_id}`)
                  .then(response => response.json()).then(data => {
                     resolve(data);
                  });
            });
         });
   
         //Sift through the data when all categories come back
         Promise.all(categories).then(results => {
 
            //Build up our list of categories
            results.forEach((result, categoryIndex) => {
   
               //Start with a blank category
               var category = {
                  title: result.title,
                  clues: []
               }
               
               const clueValues = [200, 400, 600, 800, 1000]
               //Add every clue within a category to our database of clues
               //GETS FIVE RANDOM CLUES FROM THIS CATEGORY
               var clues = shuffle(result.clues).splice(0,5).forEach((clue, index) => {
                  console.log(clue)
   
                  //Create unique ID for this clue
                  var clueId = categoryIndex + "-" + index;
                  category.clues.push(clueId);
                  

                  //Add clue to DB
                  this.clues[clueId] = {
                     question: clue.question,
                     answer: clue.answer,
                     value: clueValues[index],
                     // value: (index + 1) * 100,
                     currentCategory: category.title
                  };
               })
   
               //Add this category to our DB of categories
               this.categories.push(category);
            });
   
            //Render each category to the DOM
            this.categories.forEach((c) => {
               this.renderCategory(c);
            });
       });
      }
      
 
      renderCategory(category) {
         let column = document.createElement("div");
         column.classList.add("column");
         column.innerHTML = (
            `<header>${category.title}</header>
            <ul>
            </ul>`
         ).trim();
   
         var ul = column.querySelector("ul");
         category.clues.forEach(clueId => {
            var clue = this.clues[clueId];
            ul.innerHTML += `<li><button data-clue-id=${clueId}>${clue.value}</button></li>`
         })
   
         //Add to DOM
         this.boardElement.appendChild(column);
      }
 
      updateScore1(change) {
         // YELLOW
         this.score1 += change;
         this.scoreCountElement1.textContent = this.score1;
      }

      updateScore2(change) {
         // GREEN
         this.score2 += change;
         this.scoreCountElement2.textContent = this.score2;
      }

      updateScore3(change) {
         // BLUE
         this.score3 += change;
         this.scoreCountElement3.textContent = this.score3;
      }
 
      handleClueClick(event) {
         var clue = this.clues[event.target.dataset.clueId];
         //WHY ISN'T THIS DOING ANYTHING
         console.log(clue)
   
         //Mark this button as used
         event.target.classList.add("used");
   
         //Clear out the input field
         // this.inputElement.value = "";
   
         //Update current clue
         this.currentClue = clue;
   
         //Update the text
         this.clueTextElement.textContent = this.currentClue.question;
         this.resultTextElement.textContent = this.currentClue.answer;
         this.clueCategoryElement.textContent = this.currentClue.currentCategory;
   
         //Hide the result
         this.modalElement.classList.remove("showing-result");
   
         //Show the modal
         this.modalElement.classList.add("visible");
         // this.inputElement.focus();
      }
 
      //Handle an answer from user
      handleFormSubmit(event) {
         // var isCorrect;
         console.log("AHHHHHHHHH");
         console.log(this.inputElement.value); 
         console.log("oh u actually made it past");
         if (this.inputElement.value === "correct") {
            var isCorrect = true;
         } else {
            var isCorrect = false;
         }

         if (isCorrect) {
            this.updateScore1(this.currentClue.value);
         } else {
            this.updateScore1(-this.currentClue.value);
         }

         // this is all fine

         // if (this.inputElement.value == "correct") {
         //    var isCorrect = true;
         //    console.log("CORRECT");
         //    this.updateScore1(this.currentClue.value);
         // } else {
         //    var isCorrect = false;
         //    console.log("INCORRECT");
         //    this.updateScore1(-this.currentClue.value);
         // }

         // if (responseValidity == "correct") {
         //    this.updateScore1(this.currentClue.value);
         // } else {
         //    this.updateScore1(-this.currentClue.value);
         // }

         this.revealAnswer(isCorrect);
      }

      handleFormSubmitv1(event) {
         event.preventDefault();
   
         var isCorrect = this.cleanseAnswer(this.inputElement.value) === this.cleanseAnswer(this.currentClue.answer);
         if (isCorrect) {
            this.updateScore1(this.currentClue.value);
         } else {
            this.updateScore1(-this.currentClue.value);
         }
   
         //Show answer
         this.revealAnswer(isCorrect);
      }
 
      //Standardize an answer string so we can compare and accept variations
      cleanseAnswer(input="") {
         var friendlyAnswer = input.toLowerCase();
         friendlyAnswer = friendlyAnswer.replace("<i>", "");
         friendlyAnswer = friendlyAnswer.replace("</i>", "");
         friendlyAnswer = friendlyAnswer.replace(/ /g, "");
         friendlyAnswer = friendlyAnswer.replace(/"/g, "");
         friendlyAnswer = friendlyAnswer.replace(/^a /, "");
         friendlyAnswer = friendlyAnswer.replace(/^an /, "");
         return friendlyAnswer.trim();
      }


      revealAnswer(isCorrect) {
   
         //Show the individual success/fail case
         this.successTextElement.style.display = isCorrect ? "block" : "none";
         this.failTextElement.style.display = !isCorrect ? "block" : "none";
   
         //Show the whole result container
         this.modalElement.classList.add("showing-result");
   
         //Disappear after a short bit
         // FOR SOME REASON IT BREAKS AFTER THIS EVEN THO I DIDNT CHANGE ANYTHING SMH
         setTimeout(() => {
            this.modalElement.classList.remove("visible");
         }, 3000);
      }
 
 }
 
 
 
 //Utils -----------------------------------
 /**https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
  * Shuffles array in place.
  * @param {Array} a items An array containing the items.
  */
 function shuffle(a) {
     var j, x, i;
     for (i = a.length - 1; i > 0; i--) {
         j = Math.floor(Math.random() * (i + 1));
         x = a[i];
         a[i] = a[j];
         a[j] = x;
     }
     return a;
 } //https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
 
 //-------------------------------------------
 
 const game = new TriviaGameShow( document.querySelector(".app"), {});
 game.initGame();
 
 
 /* BONUS CHALLENGES - cool enhancements */
 //1. Change answer logic to be in question format. "What is a... ___answer___"
 //2. Query value based on API response, not our own random ordering
 //3. Multiplayer scores!
 //4. Make your own categories and clues
 