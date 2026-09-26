import './style.css'

const button = document.querySelector('#button')
const count = document.querySelector('#count')

let clicks = 0

button.addEventListener('click', () => {
  clicks += 1
  count.textContent = `Clicked ${clicks} ${clicks === 1 ? 'time' : 'times'}`
})
