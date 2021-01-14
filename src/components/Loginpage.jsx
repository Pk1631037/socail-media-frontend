import React from "react";
import { BrowserRouter as Router, Switch, Redirect, Route, Link } from "react-router-dom";
import "../styles/login.css";
import axios from 'axios';
import Loader from 'react-loader-spinner'
import SweetAlert from 'react-bootstrap-sweetalert';
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
class Loginpage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "", // Email
      password: "", // Password
      spinner: false, // Spinner
      swal: false, // Sweet Alert
    }
    this.login = this.login.bind(this); // Login function
  }
  comonentDidMount() {
    localStorage.clear()
    window.scrollTo(0, 0)
  }

  login = async () => {
    this.setState({ spinner: true })
    await axios.post('http://localhost:3333/auth/login', {
      email: this.state.email,
      password: this.state.password,
    }).then(response => {
      if (response.data.message === "Login success :)") {
        console.log(response.data.data.user)
        localStorage.setItem("token_social_media", response.data.token);
        localStorage.setItem("userId", response.data.data.user.id);
        localStorage.setItem("userName", response.data.data.user.userName);
        localStorage.setItem("profileImage", response.data.data.user.profileImage);
      }
      window.location.href = '/'
      this.setState({ spinner: false })
    }).catch(err => {
      console.log(err);
      this.setState({ spinner: false })
      this.setState({ swal: true })
    })
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
                  <h3 style={{ marginTop: '2%' }}>Sign In</h3></center>
                <CardBody>
                  <FormGroup>
                    <Label >Email</Label>
                    <Input type="email" placeholder="john@gmail.com" onChange={(event) => this.setState({ email: event.target.value })} style={{ backgroundColor: '#F0F5FB' }} />
                  </FormGroup>
                  <FormGroup>
                    <Label >Password</Label>
                    <Input type="password" placeholder="password" onChange={(event) => this.setState({ password: event.target.value })} style={{ backgroundColor: '#F0F5FB' }} />
                  </FormGroup>
                  <center> <Button color="success" onClick={this.login}>Login</Button></center>
                  <p className="text-right">
                    New User  <Link to='/register' >Register </Link>
                  </p>
                </CardBody>
              </Col>
              <SweetAlert
                error
                show={this.state.swal}
                title="Please enter valid credentials"
                onConfirm={() => this.setState({ swal: false })}
              >
              </SweetAlert>
            </Row>
          }
        </Container>
      </div>
    )
  }
}

export default Loginpage;
