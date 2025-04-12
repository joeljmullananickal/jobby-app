import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {FaStar, FaMapMarkerAlt} from 'react-icons/fa' // Star and Location icons
import {GiBriefcase} from 'react-icons/gi' // Job icon (briefcase)
import Loader from 'react-loader-spinner'
import './index.css'

const employmentTypesList = [
  {label: 'Full Time', employmentTypeId: 'FULLTIME'},
  {label: 'Part Time', employmentTypeId: 'PARTTIME'},
  {label: 'Freelance', employmentTypeId: 'FREELANCE'},
  {label: 'Internship', employmentTypeId: 'INTERNSHIP'},
]

const salaryRangesList = [
  {salaryRangeId: '1000000', label: '10 LPA and above'},
  {salaryRangeId: '2000000', label: '20 LPA and above'},
  {salaryRangeId: '3000000', label: '30 LPA and above'},
  {salaryRangeId: '4000000', label: '40 LPA and above'},
]

const locationList = [
  {locationId: 'HYDERABAD', label: 'Hyderabad'},
  {locationId: 'BANGLORE', label: 'Banglore'},
  {locationId: 'CHENNAI', label: 'Chennai'},
  {locationId: 'MUMBAI', label: 'Mumbai'},
  {locationId: 'DELHI', label: 'Delhi'},
]

class Jobs extends Component {
  state = {
    profileData: null,
    jobsData: [],
    searchInput: '',
    selectedEmploymentTypes: [],
    selectedSalaryRange: '',
    selectedLocationList: [],
    isLoading: true,
    hasError: false,
  }

  componentDidMount() {
    this.fetchProfileData()
    this.fetchJobsData()
  }

  fetchProfileData = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
    }

    const response = await fetch('https://apis.ccbp.in/profile', options)
    if (response.ok) {
      const data = await response.json()
      this.setState({profileData: data.profile_details, isLoading: false})
    } else {
      this.setState({hasError: true, isLoading: false})
    }
  }

  fetchJobsData = async () => {
    const {
      searchInput,
      selectedEmploymentTypes,
      selectedSalaryRange,
      selectedLocationList,
    } = this.state
    const jwtToken = Cookies.get('jwt_token')
    const employmentTypeFilter = selectedEmploymentTypes.join(',')
    const locationFilter = selectedLocationList.join(',')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeFilter}&location=${locationFilter}&minimum_package=${selectedSalaryRange}&search=${searchInput}`
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      this.setState({jobsData: data.jobs, isLoading: false})
    } else {
      this.setState({hasError: true, isLoading: false})
    }
  }

  handleSearchChange = event => {
    this.setState({searchInput: event.target.value})
  }

  handleSearchSubmit = () => {
    this.fetchJobsData()
  }

  handleEmploymentTypeChange = event => {
    const {selectedEmploymentTypes} = this.state
    const employmentType = event.target.value
    if (event.target.checked) {
      this.setState(
        {
          selectedEmploymentTypes: [...selectedEmploymentTypes, employmentType],
        },
        this.fetchJobsData,
      )
    } else {
      this.setState(
        {
          selectedEmploymentTypes: selectedEmploymentTypes.filter(
            item => item !== employmentType,
          ),
        },
        this.fetchJobsData,
      )
    }
  }

  handleLocationChange = event => {
    const {selectedLocationList} = this.state
    const locationType = event.target.value
    if (event.target.checked) {
      this.setState(
        {
          selectedLocationList: [...selectedLocationList, locationType],
        },
        this.fetchJobsData,
      )
    } else {
      this.setState(
        {
          selectedLocationList: selectedLocationList.filter(
            item => item !== locationType,
          ),
        },
        this.fetchJobsData,
      )
    }
  }

  handleRetry1 = () => {
    this.setState({isLoading: true, hasError: false}, this.fetchJobsData())
  }

  handleSalaryRangeChange = event => {
    this.setState({selectedSalaryRange: event.target.value}, this.fetchJobsData)
  }

  render() {
    const {
      profileData,
      jobsData,
      isLoading,
      hasError,
      searchInput,
      selectedEmploymentTypes,
      selectedSalaryRange,
      selectedLocationList,
    } = this.state

    return (
      <div className="jobs">
        <div className="profile">
          {isLoading && (
            <div className="loader-container" data-testid="loader">
              <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
            </div>
          )}
          {hasError && (
            <div className="error-view">
              <button
                type="button"
                data-testid="retryProfile"
                onClick={this.handleRetry1}
              >
                Retry
              </button>
            </div>
          )}
          {!isLoading && !hasError && (
            <div className="profile-section">
              <img
                src={profileData.profile_image_url}
                alt="profile"
                className="profile-image"
              />
              <h1>{profileData.name}</h1>
              <p>{profileData.short_bio}</p>
            </div>
          )}
          <hr />
          <div className="sticky">
            <h1>Type Of Employment</h1>
            <ul className="F">
              <li>
                {employmentTypesList.map(type => (
                  <label key={type.employmentTypeId}>
                    <input
                      type="checkbox"
                      value={type.employmentTypeId}
                      checked={selectedEmploymentTypes.includes(
                        type.employmentTypeId,
                      )}
                      onChange={this.handleEmploymentTypeChange}
                    />
                    {type.label}
                  </label>
                ))}
              </li>
            </ul>
            <hr />
            <h1>Salary Range</h1>
            <ul className="F">
              <li>
                {salaryRangesList.map(range => (
                  <label key={range.salaryRangeId}>
                    <input
                      type="radio"
                      name="salaryRange"
                      value={range.salaryRangeId}
                      checked={selectedSalaryRange === range.salaryRangeId}
                      onChange={this.handleSalaryRangeChange}
                    />
                    {range.label}
                  </label>
                ))}
              </li>
            </ul>
            <hr />
            <h1>Locations</h1>
            <ul className="F">
              <li>
                {locationList.map(type => (
                  <label key={type.locationId}>
                    <input
                      type="checkbox"
                      value={type.locationId}
                      checked={selectedLocationList.includes(type.locationId)}
                      onChange={this.handleLocationChange}
                    />
                    {type.label}
                  </label>
                ))}
              </li>
            </ul>
          </div>
        </div>

        <div className="jobs1">
          <input
            type="search"
            placeholder="Search"
            value={searchInput}
            onChange={this.handleSearchChange}
          />
          <button
            type="button"
            data-testid="searchButton"
            onClick={this.handleSearchSubmit}
          >
            Search
          </button>

          <div className="jobs-container">
            {isLoading && (
              <div className="loader-container" data-testid="loader">
                <Loader
                  type="ThreeDots"
                  color="#ffffff"
                  height="50"
                  width="50"
                />
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
                <button
                  type="button"
                  data-testid="retryJobs"
                  onClick={this.handleRetry1}
                >
                  Retry
                </button>
              </div>
            )}
            {!isLoading && !hasError && jobsData.length === 0 && (
              <div className="no-jobs-view">
                <img
                  src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
                  alt="no jobs"
                  className="image"
                />
                <h1>No Jobs found</h1>
                <p>We could not find any jobs. Try other filters</p>
              </div>
            )}
            {!isLoading && !hasError && jobsData.length > 0 && (
              <ul className="jobs-list">
                {jobsData.map(job => (
                  <li key={job.id}>
                    <Link to={`/jobs/${job.id}`} className="job-link">
                      <div>
                        <div className="A">
                          <img
                            src={job.company_logo_url}
                            alt="company logo"
                            className="company-logo"
                          />
                          <div className="Z">
                            <h1>{job.title}</h1>
                            <div className="B">
                              <FaStar />
                              <p>{job.rating}</p>
                            </div>
                          </div>
                        </div>
                        <div className="A1">
                          <ul className="A2">
                            <li>
                              <p className="list">
                                <FaMapMarkerAlt /> {job.location}
                              </p>
                            </li>
                            <li>
                              <p className="list">
                                <GiBriefcase /> {job.employment_type}
                              </p>
                            </li>
                          </ul>
                          <p>{job.package_per_annum}</p>
                        </div>
                        <hr />
                        <h1>Description</h1>
                        <p>{job.job_description}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
