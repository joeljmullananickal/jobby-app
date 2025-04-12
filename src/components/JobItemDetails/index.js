import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {FaMapMarkerAlt, FaStar} from 'react-icons/fa'
import {GiBriefcase} from 'react-icons/gi'
import './index.css'

class JobItemDetails extends Component {
  state = {
    jobDetails: null,
    similarJobs: [],
    isLoading: true,
    hasError: false,
  }

  componentDidMount() {
    this.fetchJobDetails()
  }

  fetchJobDetails = async () => {
    const {match} = this.props
    const {id} = match.params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      this.setState({
        jobDetails: data.job_details,
        similarJobs: data.similar_jobs,
        isLoading: false,
      })
    } else {
      this.setState({hasError: true, isLoading: false})
    }
  }

  render() {
    const {jobDetails, similarJobs, isLoading, hasError} = this.state

    return (
      <div className="job-details-container">
        {isLoading && (
          <div className="loader-container" data-testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
          </div>
        )}
        {hasError && (
          <div className="error-view">
            <img
              src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
              alt="failure view"
              className="image"
            />
            <h1>Oops! Something Went Wrong</h1>
            <p>We cannot seem to find the page you are looking for.</p>
            <button type="button" onClick={this.fetchJobsDetails}>
              Retry
            </button>
          </div>
        )}
        {!isLoading && !hasError && (
          <>
            <div className="job-details-header">
              <img
                src={jobDetails.company_logo_url}
                alt="job details company logo"
                className="company-logo"
              />
              <div>
                <h1>{jobDetails.title}</h1>
                <div className="job-rating">
                  <FaStar /> <p>{jobDetails.rating}</p>
                </div>
              </div>
              <div className="A">
                <ul className="job-header-info">
                  <li className="job-location">
                    <FaMapMarkerAlt /> <p>{jobDetails.location}</p>
                  </li>
                  <li className="job-type">
                    <GiBriefcase /> <p>{jobDetails.employment_type}</p>
                  </li>
                </ul>
                <p>{jobDetails.package_per_annum}</p>
              </div>
            </div>
            <hr />
            <div className="A">
              <h1>Description</h1>
              <button type="button" className="visit-company-button">
                <a
                  href={jobDetails.company_website_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit Company Website
                </a>
              </button>
            </div>
            <p>{jobDetails.job_description}</p>
            <h2>Skills</h2>
            <ul className="skills">
              {jobDetails.skills.map(skill => (
                <li key={skill.name} className="skill">
                  <img
                    src={skill.image_url}
                    alt={skill.name}
                    className="skill-image"
                  />
                  <span>{skill.name}</span>
                </li>
              ))}
            </ul>
            <h1>Life at Company</h1>
            <div className="life-at-company">
              <p>{jobDetails.life_at_company.description}</p>
              <img
                src={jobDetails.life_at_company.image_url}
                alt="Life at Company"
                className="life-at-company-image"
              />
            </div>
            <h2>Similar Jobs</h2>
            <ul className="similar-jobs-list">
              {similarJobs.map(job => (
                <li key={job.id}>
                  <div className="similar-job">
                    <div className="A1">
                      <img
                        src={job.company_logo_url}
                        alt="Similar Job Company Logo"
                        className="company-logo"
                      />
                      <div>
                        <h3>{job.title}</h3>
                        <div className="job-rating">
                          <FaStar />
                          <p>{job.rating}</p>
                        </div>
                      </div>
                    </div>
                    <h1>Description</h1>
                    <p>{job.job_description}</p>
                    <ul className="list1">
                      <li>
                        <div className="job-location">
                          <FaMapMarkerAlt /> <p>{job.location}</p>
                        </div>
                      </li>
                      <li>
                        <div className="job-type">
                          <GiBriefcase /> <p>{job.employment_type}</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    )
  }
}

export default JobItemDetails
