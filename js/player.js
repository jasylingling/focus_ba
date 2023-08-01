/* Define Global Variables */
// Sounds will contain all instances of howler
const sounds = {}
let filterGlobal = null
let moodsGlobal = null
let isDragging = false;
let showAll = false;
// Variable to check if user dragged or clicked
let startX

const soundInfo = [
  {
    name: 'ambient_bonfire',
    isDefault: false,
    category: 'ambient',
    mood: null
  },
  {
    name: 'ambient_cafe',
    isDefault: false,
    category: 'ambient',
    mood: null
  },
  {
    name: 'ambient_cat_purr',
    isDefault: true,
    category: 'ambient',
    mood: null
  },
  {
    name: 'ambient_forest',
    isDefault: true,
    category: 'ambient',
    mood: null
  },
  {
    name: 'ambient_rain',
    isDefault: true,
    category: 'ambient',
    mood: null
  },
  {
    name: 'ambient_waves',
    isDefault: true,
    category: 'ambient',
    mood: null
  },
  {
    name: 'ambient_wind',
    isDefault: false,
    category: 'ambient',
    mood: null
  },
  {
    name: 'instrumental_bach',
    isDefault: true,
    category: 'instrumental',
    mood: 'study'
  },
  {
    name: 'instrumental_japan',
    isDefault: false,
    category: 'instrumental',
    mood: 'booster'
  },
  {
    name: 'instrumental_piano',
    isDefault: true,
    category: 'instrumental',
    mood: 'study'
  },
  {
    name: 'instrumental_underwater',
    isDefault: false,
    category: 'instrumental',
    mood: null
  },
  {
    name: 'jazz_chillout_lounge',
    isDefault: false,
    category: 'jazz_chillout',
    mood: 'booster'
  },
  {
    name: 'jazz_chillout_night',
    isDefault: true,
    category: 'jazz_chillout',
    mood: 'cozy'
  },
  {
    name: 'jazz_chillout_restaurant',
    isDefault: false,
    category: 'jazz_chillout',
    mood: 'cozy'
  },
  {
    name: 'lofi_afternoon',
    isDefault: true,
    category: 'lofi',
    mood: 'study'
  },
  {
    name: 'lofi_clouds',
    isDefault: false,
    category: 'lofi',
    mood: 'study'
  },
  {
    name: 'lofi_hug',
    isDefault: false,
    category: 'lofi',
    mood: 'cozy'
  },
  {
    name: 'lofi_moonlight',
    isDefault: true,
    category: 'lofi',
    mood: 'cozy'
  },
]

document.querySelectorAll('.ambient-icons-container').forEach(function (icon) {
  /* 
  Get the data-audio attribute of all icons 
  Create a new instance of Howeler for each of the data attributes ignoring "random"
  */
  if (icon.dataset.audio != 'random') {
    sounds[icon.dataset.audio] = new Howl({
      src: [`audio/${icon.dataset.audio}.mp3`],
      loop: true,
      volume: 0.5
    });

    /* 
    The following 3 even listener check if the user is dragging or simply clicking 
    As soon as mouse down is registered, we save the clientX position
    If the start position is less than 3 pixels away from the end position we call it a click
    Otherwise we call it a drag
    */

    if (isTouchDevice()) {
      // The user is using a touch device
      icon.addEventListener('touchstart', function(event) {
        isDragging = true;
        startX = event.touches[0].clientX;
    });
    
    icon.addEventListener('touchmove', function(event) {
        if (isDragging) {
            // Perform drag actions (volume control)
            // Get the x coordinate of the dragged icon using getBoundingClientRect
            const rect = icon.getBoundingClientRect()
            // Change the width of the volume one according to the position of the touch inside the selected icon
            icon.querySelector('.volume-bar').style.width = map_range(event.touches[0].clientX, rect.left,rect.left + icon.offsetWidth, 1, 100) + "%"
            // Change the volume of the specified sound
            sounds[icon.dataset.audio].volume(map_range(event.touches[0].clientX, rect.left,rect.left + icon.offsetWidth, 1, 100) / 100)
        }
    });
    
    icon.addEventListener('touchend', function(event) {
        isDragging = false;
        // Check if drag distance is below threshold
        let endX = event.changedTouches[0].clientX;
        let distance = Math.abs(endX - startX);
        if (distance < 3) {
            // Perform click actions
            // Play / Pause + Class Toggle      
            this.classList.toggle("primary")
            if (sounds[icon.dataset.audio].playing()) {
                sounds[icon.dataset.audio].pause()
            } else {
                sounds[icon.dataset.audio].play()
            }
        }
    });
    } else {
      // The user is using a click device
      icon.addEventListener('mousedown', function(event) {
        isDragging = true;
        startX = event.clientX;
      });
      
      icon.addEventListener('mousemove', function(event) {
          if (isDragging) {
            // Perform drag actions (volume control)
            // Get the x coordinate of the dragged icon using getBoundingClientRect
            const rect = icon.getBoundingClientRect()
            // Change the width of the volume one according to the position of the mouse inside the selected icon
            icon.querySelector('.volume-bar').style.width = map_range(event.clientX, rect.left,rect.left + icon.offsetWidth, 1, 100) + "%"
            // Change the volume of the specified sound
            sounds[icon.dataset.audio].volume(map_range(event.clientX, rect.left,rect.left + icon.offsetWidth, 1, 100) / 100)
          }
      });
      
      icon.addEventListener('mouseup', function(event) {
          isDragging = false;
          // Check if drag distance is below threshold
          let endX = event.clientX;
          let distance = Math.abs(endX - startX);
          if (distance < 3) {
              // Perform click actions
              // Play / Pause + Class Toggle      
              this.classList.toggle("primary")
              if (sounds[icon.dataset.audio].playing()) {
                sounds[icon.dataset.audio].pause()
              } else {
                sounds[icon.dataset.audio].play()
              }
          }
      });
    }

  }
})

/* Random option support */
// When random is clicked
document.querySelector(".shuffle").addEventListener("click", function () {
  // Reset all icons
  document.querySelectorAll('.ambient-icons-container').forEach(function (icon) {
    icon.classList.remove("primary")
  })
  // Pause all sounds
  for (s in sounds) {
    sounds[s].pause()
  }

  // Generate a random number between 0 - the length of the sounds object
  // Play a random sound using the generated random number
  // add primary class to corresponding icon
  const keys = Object.keys(sounds);
  let random
  let newFilteredArray = []
  let newMoodedArray = []
  for (key in sounds ){
    console.log(key)
    soundInfo.forEach(info => {
      if (info.name == key) {
        if (info.category == filterGlobal) {
          newFilteredArray.push(info.name)
        }
        if (info.mood == moodsGlobal) {
          newMoodedArray.push(info.name)
        }
      }
    })
    console.log(newMoodedArray)

  }
  if (filterGlobal == null && moodsGlobal == null ) {
    random = Math.floor(Math.random() * Object.keys(sounds).length);
    sounds[keys[random]].play()
    const randomElement = document.querySelector([`[data-audio="${keys[random]}"]`])
    randomElement.classList.add("primary")
  }  else if(moodsGlobal != null && filterGlobal == null) {
    console.log('we are randoming a mood?')
    random = Math.floor(Math.random() * newMoodedArray.length);
    sounds[newMoodedArray[random]].play()
    const randomElement = document.querySelector([`[data-audio="${newMoodedArray[random]}"]`])
    randomElement.classList.add("primary")
  } else if (moodsGlobal == null && filterGlobal != null) {
    random = Math.floor(Math.random() * newFilteredArray.length);
    sounds[newFilteredArray[random]].play()
    const randomElement = document.querySelector([`[data-audio="${newFilteredArray[random]}"]`])
    randomElement.classList.add("primary")
  }
  
  
  
})


/**
 * Re-maps a number from one range to another.
 *
 * @param {number} value The input we want to remap
 * @param {number} low1 The minimum expected input value
 * @param {number} high1 The maximum expected input value
 * @param {number} low2 The minimum expected output value
 * @param {number} high2 The maximum expected output value
 * @return {number} Re-map number
 */
function map_range(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}



function isTouchDevice() {
  return 'ontouchstart' in window // Check if touch events are supported
      || navigator.maxTouchPoints > 0 // Check if touch points are supported (IE/Edge)
      || navigator.msMaxTouchPoints > 0; // Check if touch points are supported (IE10/11)
}




// Code for filter (Not Including MOODS)
document.querySelectorAll('.filter').forEach(item => {
  // for each filter, add a click event
  item.addEventListener('click', function(){
    // stop all currently playing sound sound 
    stopAllSound ()
    // hide the show all button
    document.querySelector('.show-all').style.display = 'none'
    document.querySelector('.random-container').style.display = 'block'
    toggleFilterStyle (item)


    const selectedFilter = this.dataset.category

    document.querySelectorAll('.sound-container:not(.random-container)').forEach(icon => {
      icon.style.display = 'none'
    })
    soundInfo.forEach(data => {
      if (data.category == selectedFilter) {
        filterGlobal = selectedFilter
        document.querySelectorAll('.sound-container').forEach(icon => {
          if (icon.querySelector('.ambient-icons-container').dataset.audio == data.name) {
            icon.style.display = 'block'
  
          }
        })
      }
    })
    let isActive = false
    document.querySelectorAll('.filter').forEach(x => {
      if (x.classList.contains('active-filter')) {
        isActive = true
      }
    })

    if (!isActive) {
      document.querySelectorAll('.sound-container').forEach(y => {
        console.log(y)
        filterGlobal = null
        y.style.display = 'block'
        if(!showAll) {
          hideIcons()
        }
       
      })
    }
  })

})

function toggleFilterStyle (filter) {
  document.querySelector('.moody').classList.remove('active-filter')
  moodsGlobal = null
  if (filter.classList.contains('active-filter')) {
    filter.classList.remove('active-filter')
    console.log('clicking on active filter')
    // show the show all button, since the filter is already active and we are going back to standard view
    document.querySelector('.show-all').style.display = 'inline-flex'
    if(showAll) {
      document.querySelector('.show-all').style.display = 'none'
    }
    
  } else {
    document.querySelectorAll('.filter').forEach(f => {
      f.classList.remove('active-filter')
    })
    filter.classList.add('active-filter')
  }

  
}


// Code for Moods

document.querySelectorAll('.mood').forEach(item => {
  item.addEventListener('click', function(){
    document.querySelector('.show-all').style.display = 'none'
    document.querySelector('.random-container').style.display = 'block'

    filterGlobal = null
    stopAllSound ()
    document.querySelectorAll('.filter').forEach(f => {
      f.classList.remove('active-filter')
    })
   
      if (!item.classList.contains('active')) {
        document.querySelectorAll('.mood').forEach(item => {
          item.classList.remove('active')
        })
        item.classList.add('active')
      } else {
      item.classList.add('active')
    }
    
    document.querySelector('.moody').classList.add('active-filter')

    const selectedMood = this.dataset.mood
    moodsGlobal = selectedMood

      document.querySelectorAll('.sound-container:not(.random-container)').forEach(icon => {
        icon.style.display = 'none'
      })
      soundInfo.forEach(data => {
        if (data.mood == selectedMood) {
          document.querySelectorAll('.sound-container').forEach(icon => {
            if (icon.querySelector('.ambient-icons-container').dataset.audio == data.name) {
              icon.style.display = 'block'
            }
          })
        }
      })
      
  })
})

// Fix for safari (work in progress)
if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)){
  document.querySelector('.moody').addEventListener('click', function() {
    document.querySelector('.moody menu').classList.toggle('active')
  } )
}

function stopAllSound () {
  // Reset all icons
  document.querySelectorAll('.ambient-icons-container').forEach(function (icon) {
    icon.classList.remove("primary")
  })
  // Pause all sounds
  for (s in sounds) {
    sounds[s].pause()
  }
}

// Hide items on page load
hideIcons()


function hideIcons() {
  document.querySelectorAll('.sound-container').forEach(icon => {
    let iconName = icon.querySelector('.ambient-icons-container').dataset.audio
    soundInfo.forEach(info => {
      if (iconName == info.name) {
        if (info.isDefault) {
          icon.style.display = 'block'
        } else {
          icon.style.display = 'none'
        }
      }
      if (icon.classList.contains('random-container') ) {
        icon.style.display = 'none'
      } 
    })

  })
  showAll = false
}


document.querySelector('.show-all').addEventListener('click', e => {
  if(!showAll) {
    showAll = true
    document.querySelectorAll('.sound-container').forEach(icon => {
      icon.style.display = 'block'
      document.querySelector('.show-all').style.display = 'none'
    })
  }
})