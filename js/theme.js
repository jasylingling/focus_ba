// Dark / Lightmode
/* 
  On page load:
  Check if user already has darkmode set up
  Change body class and checkbox according to user's setting
*/
if (localStorage.getItem("dark") != null) {
  const body = document.querySelector("body");
  if (localStorage.getItem("dark") == "true") {
    body.classList.remove("light");
    body.classList.add("dark");
    document.querySelectorAll(".switch.theme input").forEach((item) => {
      item.checked = true;
    });
  } else {
    body.classList.remove("dark");
    body.classList.add("light");
    document.querySelectorAll(".switch.theme input").forEach((item) => {
      item.checked = false;
    });
  }
}

/* 
  On page check click:
  Check if checkbox is checked or not
  Change body class and checkbox according to checkbox' status
*/
document.querySelectorAll(".switch.theme").forEach((item) => {
  item.addEventListener("click", function () {
    console.log("click?");
    const isChecked = this.querySelector("input").checked;
    const body = document.querySelector("body");
    if (isChecked) {
      document.querySelectorAll(".switch.theme input").forEach((item) => {
        item.checked = true;
      });
      body.classList.remove("light");
      body.classList.add("dark");
      localStorage.setItem("dark", true);
    } else {
      document.querySelectorAll(".switch.theme input").forEach((item) => {
        item.checked = false;
      });
      body.classList.remove("dark");
      body.classList.add("light");
      localStorage.setItem("dark", false);
    }
  });
});

// Fix for removing active class in menu when closing dialog
document.querySelectorAll(".dialog-close").forEach((button) => {
  button.addEventListener("click", (e) => {
    document.querySelectorAll(".menu-item").forEach((item) => {
      item.classList.remove("active");
    });
  });
});
