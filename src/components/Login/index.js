import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    errorMsg: '',
    showError: false,
  }

  handleInputChange1 = event => {
    this.setState({username: event.target.value})
  }
  handleInputChange2 = event => {
    this.setState({password: event.target.value})
  }

  handleSubmit = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username: username, password: password}

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch('https://apis.ccbp.in/login', options)
    const data = await response.json()

    if (response.ok) {
      console.log('ok')
      Cookies.set('jwt_token', data.jwt_token, {expires: 30})
      const {history} = this.props
      history.replace('/')
    } else {
      this.setState({errorMsg: data.error_msg, showError: true})
    }
  }

  render() {
    const {username, password, showError, errorMsg} = this.state

    if (Cookies.get('jwt_token')) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="image"
        />
        <form className="login-form" onSubmit={this.handleSubmit}>
          <h1>Login</h1>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={this.handleInputChange1}
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={this.handleInputChange2}
          />
          <button type="submit">Login</button>
          {showError && <p className="error-message">{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default Login
