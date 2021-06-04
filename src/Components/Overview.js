import { Component } from 'react'
import Details from './Details'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Table from 'react-bootstrap/Table'

class Overview extends Component {
  constructor(props) {
    super(props)
    this.state = { data: [], details: [], search: [], showModal: false, searchFlag: false, searchDetails: false }
    this.onSearch = this.onSearch.bind(this)
    this.getDetails = this.getDetails.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleShow = this.handleShow.bind(this)
  }

  handleClose = () => this.setState({ showModal: false });
  handleShow = () => this.setState({ showModal: true });

  componentDidMount() {
    fetch("http://localhost:3001/emails")
      .then(response => response.json())
      .then(values => this.setState({ data: values }))
  }

  getDetails(event, index) {

    event.preventDefault()
    fetch(`http://localhost:3001/emails/${this.state.data[index].id}`)
      .then(response => response.json())
      .then(values => this.setState({ details: [values] }))

  }

  sendEmail(event, url = "http://localhost:3001/send") {
    let newObj = { sender: event.target[0].value, recipient: event.target[1].value, subject: event.target[2].value, message: event.target[3].value }
    fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(newObj)
    })
      .then(response => console.log(response.json()))

  }

  onSearch(event) {
    let newString = event.target.value
    let len = newString.length
    if (len < 1) {
      this.setState({ search: [] })
      this.setState({ searchFlag: false })
      this.setState({ searchDetails: false })
    } else {
      this.setState({ searchFlag: true })
      let results = this.state.data.filter((email) => {
        return email.subject.slice(0, len).toLowerCase() === newString.toLowerCase()
      })
      this.setState({ search: results })
      this.setState({ searchDetails: true })
    }
  }

  render() {
    let dataArray = this.state.data.map((email, index) => <li key={email.id} onClick={(event) => { this.getDetails(event, index) }}>{email.subject} - {email.sender}</li>)
    // let dataArray2 = this.state.data.map((email, index) => <tr key={email.id} onClick={(event) => { this.getDetails(event, index) }}><td >{email.subject}</td><td>{email.sender}</td></tr>)
    let dataDetails = this.state.details.map((email, index) => {
      return (
        <>
          <div>Date: {email.date}</div>
          <div>Sender: {email.sender}</div>
          <div>Recipient: {email.recipient}</div>
          <div>Subject: {email.subject}</div>
          <div>Message: {email.message}</div>
        </>
      )
    })
    let dataSearch = this.state.search.map((email, index) => <li key={email.id} onClick={(event) => { this.getDetails(event, index) }}>{email.subject} - {email.sender}</li>)
    let searchDetails = this.state.search.map((email, index) => {
      return (
        <>
          <div>Date: {email.date}</div>
          <div>Sender: {email.sender}</div>
          <div>Recipient: {email.recipient}</div>
          <div>Subject: {email.subject}</div>
          <div>Message: {email.message}</div>
        </>
      )
    })
    return (
      <Container>
        <Row>
          <Col>
            <Button variant="primary" onClick={this.handleShow}>Compose Email</Button>
            <Form.Control type="email" placeholder="Search for email by subject" onChange={this.onSearch} />
            {this.state.searchFlag === false ? <div></div> : <h1>Search results</h1>}
            <ul>{dataSearch}</ul>
            <h1>Inbox</h1>
            <ul>{dataArray}</ul>

            {/* <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>Subject - Sender</th>
                </tr>
                <tbody>
                  {dataArray2}
                </tbody>
              </thead>

            </Table> */}

            <Modal show={this.state.showModal} onHide={this.handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Compose Email</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={this.sendEmail}>
                  <Form.Group controlId="senderEmail">
                    <Form.Label>Sender Email</Form.Label>
                    <Form.Control type="email" name="sender" placeholder="name@example.com" />
                  </Form.Group>
                  <Form.Group controlId="recipientEmail">
                    <Form.Label>Recipient</Form.Label>
                    <Form.Control type="email" name="recipient" placeholder="name@example.com" />
                  </Form.Group>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>Subject</Form.Label>
                    <Form.Control type="text" name="subject" placeholder="Subject" />
                  </Form.Group>
                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Message</Form.Label>
                    <Form.Control as="textarea" name="message" rows={7} />
                  </Form.Group>

                  <Modal.Footer>
                    <Button type="submit" onClick={this.handleClose}>Send</Button>
                  </Modal.Footer>
                </Form>
              </Modal.Body>

            </Modal>
          </Col>

          <Col>
            {this.state.searchDetails === false ? dataDetails : searchDetails}
            {/* {dataDetails} */}
          </Col>
        </Row>
      </Container>
    )
  }
}

export default Overview;
