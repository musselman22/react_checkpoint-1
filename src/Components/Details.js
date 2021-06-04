import { Component } from 'react'

class Details extends Component {
  constructor(props) {
    super(props)
    this.state = { data: [] }
  }

  componentDidMount() {
    fetch("http://localhost:3001/emails")
      .then(response => response.json())
      .then(values => this.setState({ data: values }))
  }


  // http://localhost:3001/emails  get request
  render() {
    let dataArray = this.state.data.map(email => <li>{email.subject} - {email.sender}</li>)
    return (
      <ul>{dataArray}</ul>
    )
  }

}

export default Details;