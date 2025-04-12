import {Component} from 'react'
import {Link} from 'react-router-dom'
import './index.css'

class Home extends Component {
  render() {
    return (
      <div className="home-container">
        <div className="home-content">
          <h1>Find The Job That Fits Your Life</h1>
          <p>
            Millions of people are searching for jobs, salary information, and
            company reviews. Find the job that fits your abilities and
            potential.
          </p>
          <Link to="/jobs">
            <button type="button" className="find-jobs-button">
              Find Jobs
            </button>
          </Link>
        </div>
      </div>
    )
  }
}

export default Home
