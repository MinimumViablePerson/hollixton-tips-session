import './style.css'

type Email = {
  id: number
  subject: string
  body: string
  read: boolean
}

type State = {
  emails: Email[]
  selectedEmail: Email | null
}

// I have a list of something
// I want to switch between showing the list and showing what I selected
let state: State = {
  emails: [],
  selectedEmail: null
}

function getEmailsFromServer () {
  fetch('http://localhost:4000/emails')
    .then(resp => resp.json())
    .then(emails => {
      state.emails = emails
      render()
    })
}

function createEmailOnServer (subject: string, body: string) {
  let url = 'http://localhost:4000/emails'

  let options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      subject: subject,
      body: body,
      read: false
    })
  }

  fetch(url, options)
    .then(resp => resp.json())
    .then(newEmail => {
      state.emails.push(newEmail)
      render()
    })
}

function updateReadEmailOnServer (email: Email) {
  fetch(`http://localhost:4000/emails/${email.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ read: true })
  })
}

function renderEmailList (appEl: HTMLElement) {
  let listEl = document.createElement('ul')

  for (let email of state.emails) {
    let listItemEl = document.createElement('li')
    if (email.read) listItemEl.classList.add('read')
    listItemEl.textContent = email.subject
    listItemEl.addEventListener('click', () => {
      state.selectedEmail = email
      email.read = true

      updateReadEmailOnServer(email)

      render()
    })
    listEl.append(listItemEl)
  }
  appEl.append(listEl)
}

function renderEmailDetails (appEl: HTMLElement) {
  if (state.selectedEmail === null) return

  let detailsEl = document.createElement('div')
  detailsEl.textContent = state.selectedEmail.body
  detailsEl.addEventListener('click', function () {
    state.selectedEmail = null
    render()
  })
  appEl.appendChild(detailsEl)
}

function renderNewEmailForm (appEl: HTMLElement) {
  let formEl = document.createElement('form')
  formEl.addEventListener('submit', function (event) {
    event.preventDefault()

    // let newEmail = {
    //   body: bodyInput.value,
    //   subject: subjectInput.value,
    //   read: false
    // }

    // state.emails.push(newEmail)

    // update the server
    createEmailOnServer(subjectInput.value, bodyInput.value)
  })

  let subjectInput = document.createElement('input')
  subjectInput.name = 'subject'
  subjectInput.placeholder = 'subject'

  let bodyInput = document.createElement('input')
  bodyInput.name = 'body'
  bodyInput.placeholder = 'body'

  let submitButton = document.createElement('button')
  submitButton.type = 'submit'
  submitButton.textContent = 'SUBMIT'

  formEl.append(subjectInput, bodyInput, submitButton)
  appEl.append(formEl)
}

function render () {
  console.log('Current state:', state)

  let appEl = document.querySelector<HTMLElement>('#app')
  if (appEl === null) return
  appEl.textContent = ''

  renderNewEmailForm(appEl)

  // if no item is selected, show the list
  if (state.selectedEmail) renderEmailDetails(appEl)
  // if an item is selected, show the details of that item
  else renderEmailList(appEl)
}

render()
getEmailsFromServer()
