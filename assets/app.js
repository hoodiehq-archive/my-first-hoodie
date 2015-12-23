var $trackerForm = document.querySelector('.js-tracker-input')
var $trackerOutput = document.querySelector('.js-tracker-output')
var $trackerClearButton = document.querySelector('.js-tracker-clear')

/**
 * If you submit a form it will emit a submit event.
 * This is better than listening for a click on the submit button for example.
 * It will catch you submitting via pressing 'enter' on a keyboard or something like 'Go' on a mobile keyboard.
 * More info on form accessibility: http://webaim.org/techniques/forms/
 **/
$trackerForm.addEventListener('submit', function (event) {
  /**
   * By default a form will submit your form data to the page itself,
   * this is useful if you're doing a traditional web app but we want to handle this in JavaScript instead.
   * if we're overriding this behaviour in JavaScript we need to grab the event
   * and prevent it from doing it's default behaviour.
   **/
  event.preventDefault()

  var amount = $trackerForm.querySelector('[name=amount]').value
  var note = $trackerForm.querySelector('[name=note]').value

  // Clear out out the values in the form ready for more input.
  $trackerForm.reset()

  hoodie.store.add({
    amount: amount,
    note: note
  })
})

$trackerClearButton.addEventListener('click', function (event) {
  hoodie.store.clear().then(function () {
    window.location.reload()
  });
});

/**
 * With hoodie we're storing our data locally and it will stick around next time you reload.
 * This means each time the page loads we need to find any previous notes that we have stored.
 */
hoodie.store.findAll().then(function (notes) {
  notes.forEach(addNote)
})

/**
 * Any newly added notes will emit the 'add' event
 * We can update the page with any new notes.
 */
hoodie.store.on('add', addNote)

function addNote (note) {
  var $tablePlaceholder = $trackerOutput.querySelector('.table-placeholder')
  // Remove initial placeholder content
  if ($tablePlaceholder) {
    $tablePlaceholder.remove()
  }
  if ($trackerClearButton.classList.contains('hide')) {
    $trackerClearButton.classList.remove('hide')
  }
  var row = document.createElement('tr')
  var amountTd = document.createElement('td')
  var noteTd = document.createElement('td')

  amountTd.textContent = note.amount
  noteTd.textContent = note.note

  row.appendChild(amountTd)
  row.appendChild(noteTd)

  $trackerOutput.appendChild(row)
}
