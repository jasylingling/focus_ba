// When clicking on sounds tab
// get rid of all favorites
document.querySelector(".t-sounds").addEventListener("click", function (e) {
  // Remove active class from favorite tab
  document.querySelector(".t-favorites").classList.remove("active");
  //reset all tabs
  resetTabs(this);
  document.querySelector(".filter-container").style.display = "flex";
  // Remove all styles from previously selected filters :
  document.querySelectorAll('.filter').forEach(filter=>filter.classList.remove('active-filter'))
  // Show all sounds that need to be shown
  document.querySelectorAll(".sound-container").forEach((icon) => {
    icon.style.display = "block";
    // if !show all -> show default icons only
    if (!showAll) {
      let iconName = icon.querySelector(".ambient-icons-container").dataset
        .audio;
      soundInfo.forEach((info) => {
        if (iconName == info.name) {
          if (info.isDefault) {
            icon.style.display = "block";
          } else {
            icon.style.display = "none";
          }
        }
        if (icon.classList.contains("random-container")) {
          icon.style.display = "none";
        }
      });
    }
  });
  document.querySelector(".show-all").style.display = "inline-flex";
  if (showAll) {
    document.querySelector(".show-all").style.display = "none";
  }
});

document.querySelector(".t-favorites").addEventListener("click", function (e) {
  document.querySelector(".t-sounds").classList.remove("active");
  resetTabs(this);
  document.querySelector(".filter-container").style.display = "none";
  document.querySelector(".show-all").style.display = "none";
  document.querySelectorAll(".sound-container").forEach((icon) => {
    icon.style.display = "none";
  });
  showAllFavs();
  checkIfEmpty();
});

function showAllFavs() {
  let savedFavs = loadFavorites();
  document.querySelectorAll(".sound-container").forEach((icon) => {
    let iconName = icon.querySelector(".ambient-icons-container").dataset.audio;
    if(savedFavs) {
      savedFavs.forEach((fav) => {
        if (fav == iconName) {
          icon.style.display = "block";
        }
      });
    }
  });
}

function resetTabs(tab) {
  if (!tab.classList.contains("active")) {
    tab.classList.add("active");
    stopAllSound();
    if (document.querySelector(".no-favs")) {
      document.querySelector(".no-favs").remove();
    }
  }
}

function checkIfEmpty() {
  let displayFlag = false;
  document
    .querySelectorAll(".sound-container:not(.random-container)")
    .forEach((item) => {
      if (item.style.display == "block") {
        displayFlag = true;
      }
    });
  if (!displayFlag) {
    if (document.querySelector(".no-favs")) {
      document.querySelector(".no-favs").remove();
    }
    const div = document.createElement("div");
    div.classList.add("s12", "no-favs", "large-margin");
    div.innerHTML = `
    <i class="ambient-icons">sentiment_dissatisfied</i>
    <div class="max large-margin"></div>
    <span>Oh oh, du hast noch keinen Lieblingssound hinzugefügt!</span>
    <div class="max large-margin"></div>
    <a href="index.html">
      <button class="large">Sounds zu Favoriten hinzufügen</button>
    </a>
    <div class="max large-margin"></div>
    <span class="small-text"><i class="small">info</i> Deine Favoriten werden automatisch in deinem Browser gespeichert. Wenn du deine Browserdaten
          löschst, werden deine <span class="underline">Favoriten</span> ebenfalls <span class="underline">gelöscht</span>.</span>
    `;
    document.querySelector(".random-container").style.display = "none";
    document.querySelector(".tabs").after(div);
  }
}

// Adding and removing favorites
function saveFavorites(data) {
  jsonData = JSON.stringify(data);
  localStorage.setItem("favorites", jsonData);
}

function loadFavorites() {
  try {
    let jsonData = localStorage.getItem("favorites");
    let data = JSON.parse(jsonData);
    return data;
  } catch (error) {
    return null;
  }
}

function changeFavoriteIcon(icon, method = false) {
  if (!icon.classList.contains("fill")) {
    icon.classList.add("fill");
    icon.innerText = "favorite";
    if (method != "justicon") {
      addFavorite(icon);
    }
  } else {
    icon.classList.remove("fill");
    icon.innerText = "heart_plus";
    if (method != "justicon") {
      removeFavorite(icon);
    }
  }
}

function addFavorite(icon) {
  const iconName = icon.parentElement.parentElement.querySelector(
    ".ambient-icons-container"
  ).dataset.audio;
  let allFavs = loadFavorites();
  if (allFavs != null) {
    allFavs.push(iconName);
    saveFavorites(allFavs);
  } else {
    allFavs = [];
    allFavs.push(iconName);
    saveFavorites(allFavs);
  }
}

function removeFavorite(icon) {
  const iconName = icon.parentElement.parentElement.querySelector(
    ".ambient-icons-container"
  ).dataset.audio;
  let allFavs = loadFavorites();
  filteredFavs = allFavs.filter(function (item) {
    return item !== iconName;
  });
  saveFavorites(filteredFavs);
  console.log(filteredFavs);
}

if (loadFavorites() != null) {
  // loading favorites on page load
  console.log(loadFavorites());
  loadFavorites().forEach((favorite) => {
    console.log(favorite);
    document.querySelectorAll(".sound-container").forEach((icon) => {
      if (
        icon.querySelector(".ambient-icons-container").dataset.audio == favorite
      ) {
        changeFavoriteIcon(icon.querySelector(".favorite-icon"), "justicon");
      }
    });
  });
} else {
  console.log(loadFavorites());
}

// click event for all hearts
document.querySelectorAll(".favorite-icon").forEach((icon) => {
  icon.addEventListener("click", (e) => {
    console.log("favoriting this icon :" + icon);
    changeFavoriteIcon(icon);
  });
});
