document.addEventListener('DOMContentLoaded',function(event) {

  const url = 'http://localhost:3000/api/v1/notes'
  const leftContent = document.querySelector('#left-content')
  const rightContent = document.querySelector('#right-content')
  const leftContainer = document.querySelector('#left-container')
  const rightContainer = document.querySelector('#right-content')
  const subBtn = document.querySelector('#note-submit-button')
  const inputFieldTitle = document.querySelector('#new-input-title')
  const inputFieldText = document.querySelector('#new-input-text')
  const mainContainer = document.querySelector('#container')

// functions #################################################################

  function index() {
    return fetch(url).then(resp => resp.json())
  }
// selects each Note out of the Notes Array
  function rendernotes(notesObjs) {
    const notes = notesObjs.map(postNoteToPage)
  }

// renders each note to the Page
  function postNoteToPage(notesObj) {
    let noteTitle = document.createElement('li')
    noteTitle.id = notesObj.id
    noteTitle.className = "note"
    noteTitle.innerHTML = notesObj.title
    noteTitle.dataset.actionContentTitle = notesObj.title
    leftContent.appendChild(noteTitle)

    let noteTxt = document.createElement('p')

    noteTxt.className = "note"
    noteTxt.id = `noteTxt_${notesObj.id}`
    noteTxt.innerHTML = limitContent(notesObj.body).replace(/\\n/g, '<br>') 
    noteTxt.dataset.actionContent = notesObj.body.replace(/\\n/g, '') 
    noteTitle.appendChild(noteTxt)

    const editBtn = document.createElement('button')
    editBtn.dataset.action = "edit"
    editBtn.id = `edit-button-id_${notesObj.id}`
    let t = document.createTextNode("Edit ME")
    editBtn.appendChild(t)
    noteTitle.insertAdjacentElement('beforeend',editBtn)
    const delBtn = document.createElement('button')
    delBtn.id = notesObj.id
    delBtn.dataset.action = "delete";
    delBtn.id = `delete-button-id_${notesObj.id}`;
    let t1 = document.createTextNode("Delete ME")
    delBtn.appendChild(t1)
    noteTitle.insertAdjacentElement('beforeend',delBtn)
    const showBtn = document.createElement('button')
    showBtn.id = notesObj.id
    showBtn.dataset.action = "show"
    showBtn.id = `show-button-id_${notesObj.id}`
    let t2 = document.createTextNode("Show ME")
    showBtn.appendChild(t2)
    noteTitle.insertAdjacentElement('beforeend',showBtn)
    let pB = document.createElement("hr")
    noteTitle.insertAdjacentElement('beforeend',pB)
    noteTitle.insertAdjacentElement('beforeend',pB)
    
  }


  index().then(rendernotes)

// limits the number of letters displayed on the left side of the page
  const limitContent = (title, limit = 12) => {
    const newTitle = [];
    if (title.length > limit) {
      title.split(' ').reduce((acc, cur) => {
        if (acc + cur.length <= limit) {
          newTitle.push(cur);
        }
      return acc + cur.length;
      }, 0);

    // return the result
    return `${newTitle.join(' ')} ...`;
    }
  return title;
  }
// sends a new Note  to the api
  const sendNewNote = (parent) => {
    const title = document.querySelector('#new-input-title').value
    const text = document.querySelector('#new-input-text').value
    clearInputFields()
    const postConfig = {
      method: "POST",
      body: JSON.stringify({
        body:title,
        title:text,
        user_id:1
      }),
      headers: {'Content-Type': 'application/json'}
    }
    return fetch(url,postConfig).then(resp => resp.json())
  }
  function clearRight() {
    rightContent.innerHTML = ''
  }

  const showNote = (parent) => {
    const textFromNote = document.getElementById(`noteTxt_${parent.id}`)
    let titleH3 = document.createElement('h3')
    let titleTextH3 = document.createTextNode('Title')
    titleH3.appendChild(titleTextH3)
    rightContainer.appendChild(titleH3)
    let title = document.createElement('h5')
    let titleText = document.createTextNode(`${parent.dataset.actionContentTitle}`)
    title.appendChild(titleText)
    rightContainer.appendChild(title)
    let contentH3 = document.createElement('h3')
    let contentTextH3 = document.createTextNode('Title')
    contentH3.appendChild(contentTextH3)
    rightContainer.appendChild(contentH3)
    let content = document.createElement('h5')
    let contentText = document.createTextNode(textFromNote.dataset.actionContent)
    content.appendChild(contentText)
    rightContainer.appendChild(content)
  }


  const editNote = (parent) => {
    const divContainerUpdate = document.createElement('div')
    divContainerUpdate.id = parent.id
    rightContainer.appendChild(divContainerUpdate)
    const textContent = document.getElementById(`noteTxt_${parent.id}`)
    const title = document.createElement('h4')
    const tit = document.createTextNode('Title')
    title.appendChild(tit)
    divContainerUpdate.appendChild(title)
    const dispFieldTitle = document.createElement('textarea')
    dispFieldTitle.type = 'text'
    dispFieldTitle.cols = '50'
    dispFieldTitle.rows = '5'
    dispFieldTitle.dataset.action = 'dispFieldTitle'
    dispFieldTitle.id = `dispFieldTitle_${parent.id}`
    dispFieldTitle.class = 'dispField'
    
    dispFieldTitle.value = parent.dataset.actionContentTitle
    divContainerUpdate.appendChild(dispFieldTitle)

    const pB = document.createElement('br')
    pB.tagName = 'br'
    divContainerUpdate.appendChild(pB)
    const cont = document.createElement('h4')
    const con = document.createTextNode('Content')
    cont.appendChild(con)
    divContainerUpdate.appendChild(cont)
    const dispFieldContent = document.createElement('textarea')
    dispFieldContent.type = 'text'
    dispFieldContent.cols = '50'
    dispFieldContent.rows = '5'
    dispFieldContent.dataset.action = `dispFieldContent_${parent.id}`
    dispFieldContent.id = 'dispFieldContent'
    dispFieldContent.class = 'dispField'
    dispFieldContent.innerHTML = textContent.dataset.actionContent
    divContainerUpdate.appendChild(dispFieldContent)
    const updBtn = document.createElement('button')
    updBtn.id = parent.id
    updBtn.dataset.action = "update"
    updBtn.id = `update-button-id_${parent.id}`
    let t2 = document.createTextNode("Update ME")
    updBtn.appendChild(t2)
    divContainerUpdate.insertAdjacentElement('beforeend',updBtn)
  }

  function clearInputFields() {
    inputFieldTitle.value = ''
    inputFieldText.value = ''
  }

  function deleteNote(parent) {
    const id = parent.id
    const delUrl = `${url}/${id}` 
    const deleteConfig = {method:'DELETE'}
    return fetch(delUrl, deleteConfig)
  }

  function updateNote(parent) {
    const newTite = parent.childNodes[1].value
    const newText = parent.childNodes[4].value
    const id = parent.id
    const updateUrl = `${url}/${id}`
    const updateConfig = {
      method: "PATCH",
      body: JSON.stringify({
        body: newText,
        title: newTite,
        user_id: 2
      }),
      headers: {'Content-Type': 'application/json',
                Accepts: 'application/json'
              }
    }
    return fetch(updateUrl, updateConfig).then(res => res.json()).then(json => console.log(json))
  }

  function clearLeft() {
    leftContent.innerHTML = ''
  }

  // event listener #################################################################

  mainContainer.addEventListener('click', function (e) {
    if (e.target.dataset.action === 'show') {
      console.log(e.target.parentNode)
      clearRight()
      const parent = e.target.parentNode
      showNote(parent)
    }

    if (e.target.dataset.action === 'new-input') {
      e.preventDefault()
      const parent = e.target.parentNode
      console.log(parent)
      sendNewNote(parent).then(postNoteToPage)
    }
    if (e.target.dataset.action === 'delete') {
      const parent = e.target.parentNode
      deleteNote(parent).then(() => { parent.remove() })
      clearRight()
    }
    if (e.target.dataset.action === 'edit') {
      clearRight()
      const parent = e.target.parentNode
      console.log(e.target)
      editNote(parent)
    }
    if (e.target.dataset.action === 'update') {
      const parent = e.target.parentNode
      console.log(parent)
      updateNote(parent).then(clearLeft).then(clearRight).then(index).then(rendernotes)//.then(showNote)
    }
  })

})

  
