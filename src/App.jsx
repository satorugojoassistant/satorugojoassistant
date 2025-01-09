import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = "https://telegram.org/js/telegram-widget.js?22"
    script.async = true
    script.setAttribute('data-telegram-login', 'demo_test_1212_bot')
    script.setAttribute('data-size', 'small')
    script.setAttribute('data-userpic', 'false')
    script.setAttribute('data-radius', '10')
    script.setAttribute('data-onauth', 'onTelegramAuth(user)')
    script.setAttribute('data-request-access', 'write')
    document.getElementById('telegram-login').appendChild(script)
  }, [])

  window.onTelegramAuth = function(user) {
    alert('Logged in as ' + user.first_name + ' ' + user.last_name + ' (' + user.id + (user.username ? ', @' + user.username : '') + ')')
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div id="telegram-login"></div>
    </>
  )
}

export default App
