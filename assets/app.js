/* global hoodie */

document.body.addEventListener('submit', function (event) {
  event.preventDefault()

  var amount = document.querySelector('[name=amount]').value
  var note = document.querySelector('[name=note]').value
  event.target.reset()

  hoodie.store.add({
    amount: amount,
    note: note
  })
})

hoodie.store.findAll().then(function (notes) {
  notes.forEach(addNote)
})
hoodie.store.on('add', addNote)

function addNote (note) {
  var row = document.createElement('tr')
  var amountTd = document.createElement('td')
  var noteTd = document.createElement('td')

  amountTd.textContent = note.amount
  noteTd.textContent = note.note

  row.appendChild(amountTd)
  row.appendChild(noteTd)

  document.querySelector('tbody').appendChild(row)
}
