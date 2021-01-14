import React from "react";
import { BrowserRouter as Link } from "react-router-dom";
import "../styles/login.css";
import axios from 'axios';
import Loader from 'react-loader-spinner'
import FileBase64 from 'react-file-base64';
import {
  Button,
  CardBody,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
  Container,
} from 'reactstrap';
import SweetAlert from 'react-bootstrap-sweetalert';
class Registerpage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "", // Email
      password: "", // Password
      userName: "", // Username
      mobileNumber: "", // Mobile Number
      spinner: false, // Spinner
      swal: false, // Sweet Alert
      profileImage: [] // Profile Image
    }
    this.register = this.register.bind(this); // Register Function
  }
  comonentDidMount() {
    window.scrollTo(0, 0)
  }
  register = async () => {
    this.setState({ spinner: true })
    await axios.post('http://localhost:3333/auth/register', {
      email: this.state.email,
      password: this.state.password,
      userName: this.state.userName,
      mobileNumber: this.state.mobileNumber,
      profileImage: this.state.profileImage
    }).then(response => {
      window.location.href = '/login'
      this.setState({ spinner: false })
    }).catch(err => {
      console.log(err);
      this.setState({ spinner: false })
      this.setState({ swal: true })
    })
  }
  getFiles(files) {
    this.setState({ profileImage: files.base64 })
  }
  render() {
    return (
      <div>
        <Container>
          {this.state.spinner === true ?
            <Loader
              type="ThreeDots"
              color="#004E8E"
              height={100}
              width={100}
              style={{
                position: 'absolute', left: '50%', top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
            :
            <Row>
              <Col xl={5} lg={8} md={8} style={{
                position: 'absolute', left: '50%', top: '50%',
                transform: 'translate(-50%, -50%)', boxShadow: '0px 0px 15px rgba(0,0,0,0.15)'
              }}>
                <center>
                  <h3 style={{ marginTop: '2%' }}>Sign Up</h3></center>
                <CardBody>
                  <FormGroup>
                    <Label >Email</Label>
                    <Input type="email" placeholder="john@gmail.com" onChange={(event) => this.setState({ email: event.target.value })} style={{ backgroundColor: '#F0F5FB' }} />
                  </FormGroup>
                  <FormGroup>
                    <Label >User Name</Label>
                    <Input type="text" placeholder="Johnson" onChange={(event) => this.setState({ userName: event.target.value })} style={{ backgroundColor: '#F0F5FB' }} />
                  </FormGroup>
                  <FormGroup>
                    <Label >Password</Label>
                    <Input type="password" placeholder="password" onChange={(event) => this.setState({ password: event.target.value })} style={{ backgroundColor: '#F0F5FB' }} />
                  </FormGroup>
                  <FormGroup>
                    <Label >Mobile Number</Label>
                    <Input type="text" placeholder="9632587410" onChange={(event) => this.setState({ mobileNumber: event.target.value })} style={{ backgroundColor: '#F0F5FB' }} />
                  </FormGroup>
                  <FormGroup>
                    <Label >Profile Picture</Label>&nbsp;&nbsp;&nbsp;&nbsp;
        <FileBase64 id="profileImage" name="profileImage" required onDone={this.getFiles.bind(this)} />
                  </FormGroup>
                  <center> <Button color="success" onClick={this.register}>Register</Button></center>
                  <p className="text-right">
                    Already User   <Button onClick={() => { window.location.href = '/login' }} style={{ backgroundColor: 'transparent', color: '#1E70BF', borderColor: 'transparent' }}>Login </Button>
                  </p>
                </CardBody>
                <SweetAlert
                  error
                  show={this.state.swal}
                  title="Please enter valid details"
                  onConfirm={() => this.setState({ swal: false })}
                >
                </SweetAlert>
              </Col>
            </Row>
          }
        </Container>
      </div>
    )
  }
}
export default Registerpage;
