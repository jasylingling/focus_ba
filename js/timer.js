let seconds = 1500; // 25 minutes * 60 seconds = 1500 seconds
let timer;
let isPaused = true;
let isPomodoro = true;
let isShortBreak = false;
let isLongBreak = false;

const startPauseButtons = document.querySelectorAll(".timer-countdown .start-button");
const displays = document.querySelectorAll(".large-timer");

startPauseButtons.forEach(button => {

  button.addEventListener("click", function() {
    // console.log(document.querySelector('.timer-minutes').value)
    // seconds = document.querySelector('.timer-minutes').value * 60
    if (isPaused) {
      document.querySelectorAll('.minutes-container').forEach(container => container.style.display = 'none')
      document.querySelectorAll('.large-timer').forEach(container => container.style.display = 'block')
      startPauseButtons.forEach(b => {b.innerHTML = "Pause";})
      
      isPaused = false;
      timer = setInterval(function() {
        seconds--;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        document.querySelector('.large-timer').innerHTML = `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
        document.querySelector('[data-ui="#dialog-timer"]').innerHTML = `<i class="small-padding" aria-label="link to timer">timer</i>${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
        document.querySelector('[data-ui="#dialog-timer-responsive"]').innerHTML = `<i aria-label="link to timer">timer</i>${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
        displays.forEach(display => {
          display.innerHTML = `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
        })    
        if (seconds === 0) {
          clearInterval(timer);
          // document.querySelector('[data-ui="#dialog-timer"]').innerHTML = `<i class="small-padding" aria-label="link to timer">timer</i>Done!`
          // document.querySelector('[data-ui="#dialog-timer-responsive"]').innerHTML = `<i aria-label="link to timer">timer</i>Done!`

          
          const audio = new Audio("audio/timer_bell.mp3");
          audio.play()
          resetTimer()
          
          // Check if we neede to add a toast
          // let toast =  document.createElement('div')
          // toast.innerHTML = `
          //   <i>warning</i>
          //   <span>I'm a toast</span>
          //   <div class="max"></div>
          //   <i>close</i>
          // `
          // toast.classList.add('toasty')
          // toast.setAttribute('onclick', 'removeToast()')
          // document.body.appendChild(toast)
          document.querySelector('#toast').classList.add('active')

        }
      }, 1000);
    } else {
      resetAll()
    }
  });
})

const optionButtons = document.querySelectorAll('.timer-option button')
optionButtons.forEach(optionButton => {
  
  optionButton.addEventListener('click', e => {
    optionButtons.forEach(b => b.classList.remove('fill'))
    optionButtons.forEach(b => b.classList.add('border'))
    const text = optionButton.innerText
    setClickedButton(text)
    if(text[0] === 'P') {
      console.log('Pomodoro')
      if (!isPomodoro) {
        resetAll()
        isPomodoro = true
        isShortBreak = false
        isLongBreak = false
        clearInterval(timer)
        seconds = 1500; // 25 minutes * 60 seconds = 1500 seconds
        resetDisplay('25:00')
        document.querySelectorAll('.minutes-container').forEach(element=> element.style.display = 'block')
        document.querySelectorAll('.large-timer').forEach(element=> element.style.display = 'none')
      } 
    } else if (text[0] ==='S') {
      console.log('Short Break')
      if (!isShortBreak) {
        resetAll()
        isPomodoro = false
        isShortBreak = true
        isLongBreak = false
        clearInterval(timer)
        seconds = 300; // 5 minutes * 60 seconds = 300 seconds
        resetDisplay('5:00')
        document.querySelectorAll('.minutes-container').forEach(element=> element.style.display = 'block')
        document.querySelectorAll('.large-timer').forEach(element=> element.style.display = 'none')
      }
    } else if (text[0] ==='L') {
      console.log('Long Break')
      if(!isLongBreak) {
        resetAll()
        isPomodoro = false
        isShortBreak = false
        isLongBreak = true
        clearInterval(timer)
        seconds = 900; // 15 minutes * 60 seconds = 300 seconds
        resetDisplay('15:00')
        document.querySelectorAll('.minutes-container').forEach(element=> element.style.display = 'block')
        document.querySelectorAll('.large-timer').forEach(element=> element.style.display = 'none')
      }
    }
  })
})

function resetAll () {
  document.querySelector('[data-ui="#dialog-timer"]').innerHTML = `<i class="small-padding" aria-label="link to timer">timer</i>Timer`
  document.querySelector('[data-ui="#dialog-timer-responsive"]').innerHTML = `<i class="small-padding" aria-label="link to timer">timer</i>Timer`
  startPauseButtons.forEach(b => {b.innerHTML = "Start";})

  isPaused = true;
  clearInterval(timer);
}

function resetDisplay (time) {
  displays.forEach(display => {
    display.innerHTML = time ;
  })  
  let parsedTime = time.split(':')
  document.querySelectorAll('.timer-minutes').forEach(element => element.value = parsedTime[0] )
}

function setClickedButton (buttonText) {
  optionButtons.forEach(btn => {
    if (btn.innerText == buttonText) {
      btn.classList.add('fill')
      btn.classList.remove('border')
    }
  })
}

// Overwrite other timer's time when timer is changed

document.querySelectorAll('.timer-minutes')[0].addEventListener('input', function () {
  document.querySelectorAll('.timer-minutes')[1].value = this.value 
  seconds = document.querySelector('.timer-minutes').value * 60
  if(seconds < 60) {seconds = 60}
} )

document.querySelectorAll('.timer-minutes')[1].addEventListener('input', function () {
  document.querySelectorAll('.timer-minutes')[0].value = this.value
  seconds = document.querySelector('.timer-minutes').value * 60
  if(seconds < 60) {seconds = 60}
} )

document.querySelectorAll('.reset-timer').forEach(button => {
  button.addEventListener('click', e=> {
    resetTimer()
    
  })

  
})

function resetTimer() {
  if(isPomodoro){
    resetAll()
    clearInterval(timer)
    seconds = 1500; // 15 minutes * 60 seconds = 300 seconds
    resetDisplay('25:00')
  }
  if(isShortBreak) {
    resetAll()
    clearInterval(timer)
    seconds = 300; //5 minutes * 60 seconds = 300 seconds
    resetDisplay('5:00')
  }
  if(isLongBreak) {
    resetAll()
    clearInterval(timer)
    seconds = 900; //15 minutes * 60 seconds = 300 seconds
    resetDisplay('15:00')
  }


  document.querySelectorAll('.minutes-container').forEach(element=> element.style.display = 'block')
  document.querySelectorAll('.large-timer').forEach(element=> element.style.display = 'none')
}


function removeToast () {
  ui('#toast', 0)
}