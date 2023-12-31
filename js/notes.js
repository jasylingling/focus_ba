// Select all notes textareas
const textareas = document.querySelectorAll('.notes-area')
// Create a variable for timeout
let timeoutId

// Check input on the textareas (we loop because there are multiple text areas)
textareas.forEach(textarea => {
  textarea.addEventListener('input', () => {
    clearTimeout(timeoutId)
    // This is a 1.5 second timeout, which means we save changes automatically 3 seconds after the last input
    timeoutId= setTimeout(() => {
      localStorage.setItem('notes', textarea.value)
      textareas.forEach(area => {
        area.value = textarea.value
      })
    }, 1500)
  })
  // This loads the saved notes into the textareas on page load
  const savedNotes = localStorage.getItem('notes')
  if(savedNotes) {
    textarea.value = savedNotes
  }
})

document.querySelectorAll('.download-notes').forEach(btn => {
  btn.addEventListener("click", function(e) {
    e.preventDefault()
    document.querySelectorAll('.notes-area')[0].value = document.querySelector('.notes-area').value.trim()
    document.querySelector('#notes-saved span').innerText = "Nichts zum Downloaden ☹️"
    document.querySelector('#notes-saved i').innerText = "warning"
    document.querySelector('#notes-saved').classList.remove('green')
    document.querySelector('#notes-saved').classList.add('red10')
    document.querySelectorAll('.notes-area')[1].value = document.querySelector('.notes-area').value.trim()
    document.querySelector('#notes-saved-responsive span').innerText = "Nichts zum Downloaden ☹️"
    document.querySelector('#notes-saved-responsive i').innerText = "warning"
    document.querySelector('#notes-saved-responsive').classList.remove('green')
    document.querySelector('#notes-saved-responsive').classList.add('red10')
    if(document.querySelectorAll('.notes-area')[0].value.length > 0 || document.querySelectorAll('.notes-area')[1].value.length > 0){
      document.querySelector('#notes-saved span').innerText = "Download erfolgreich!"
      document.querySelector('#notes-saved i').innerText = "check"
      document.querySelector('#notes-saved').classList.add('green')
      document.querySelector('#notes-saved').classList.remove('red10')
      document.querySelector('#notes-saved-responsive span').innerText = "Download erfolgreich!"
      document.querySelector('#notes-saved-responsive i').innerText = "check"
      document.querySelector('#notes-saved-responsive').classList.add('green')
      document.querySelector('#notes-saved-responsive').classList.remove('red10')
      const text = document.querySelector('.notes-area').value;
      const blob = new Blob([text], { type: "text/plain" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "notes.txt";
      a.click();
    }
  });
})

// Easy copy function
document.querySelectorAll('.copy-notes').forEach(btn => {
  btn.addEventListener("click", function(e) {
    const text = document.querySelector('.notes-area');
    if (navigator.clipboard && navigator.clipboard.writeText){
      text.select(); // select the text field
      text.setSelectionRange(0, 99999); // for mobile devices
      navigator.clipboard.writeText(text.value) // copy the text inside the text field
      .then(function() {
        //TODO: Create personal message not alert if needed
        // alert('Text copied to clipboard!');
        
      })
      .catch(function(error) {
        console.error('Failed to copy text: ', error);
        //TODO: Create personal message not alert if needed
        // alert('API FAILED');
      });
    } else {
       // Fallback for browsers that do not support the Clipboard API
       const input = document.createElement('input');
       input.setAttribute('readonly', 'true');
       input.setAttribute('value', text.value);
       input.style.position = 'absolute';
       input.style.left = '-9999px';
       document.body.appendChild(input);
       input.focus();
       input.setSelectionRange(0, input.value.length);
       let copied = false;
       try {
        // Deprecated but needed for mobile devices
         copied = document.execCommand('copy');
       } catch (err) {
        //TODO: Create personal message not alert if needed
         console.error('Failed to copy text: ', err);
       }
       document.body.removeChild(input);

       if (copied) {
         //TODO: Create personal message not alert if needed
        //  alert('Text copied to clipboard!');
       } else {
         //TODO: Create personal message not alert if needed
        //  alert('Failed to copy text. Please copy it manually.');
       }
    }
  });
})



