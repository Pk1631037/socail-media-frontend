import React from "react";
import "../styles/login.css";
import axios from 'axios';
import "../styles/HomePage.css";
import Loader from 'react-loader-spinner'
import FileBase64 from 'react-file-base64';
import logo from './images/logo.png'
import {
    Button,
    CardBody,
    Col,
    Form,
    FormGroup,
    Input,
    Label,
    Row,
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavbarText,
    Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import SweetAlert from 'react-bootstrap-sweetalert';
class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "", // Email
            password: "", // Password
            userName: "", // User Name
            mobileNumber: "", // Mobile Number
            userId: '', // User Id
            spinner: false, // Spinner 
            swal: false, // Sweet Alert
            profileImage: [], // Profile Image
            modal: false, //Modal
            friendsList: [], // Friends List
            userDetails: [] // User Details
        }
        this.navbarToggle = this.navbarToggle.bind(this); // Navbar Toggle Function
        this.modalToggle = this.modalToggle.bind(this); // Modal Toggle function
        this.getPrimaryDetails = this.getPrimaryDetails.bind(this);// Runs first to excute API
        this.uploadPost = this.uploadPost.bind(this);  // upload post function
    }
    async componentDidMount() {
        window.scrollTo(0, 0);
        this.getPrimaryDetails();
    }
    async getPrimaryDetails() {
        this.setState({ spinner: true })
        var token = localStorage.getItem("token_social_media");
        var userId = localStorage.getItem("userId");
        const data = {
            userId: userId
        }
        const headers = {
            'content-type': 'application/json',
            'x-access-token': token
        }
        await axios.post("http://localhost:3333/auth/profile", data, { headers }).then(async res => {
            console.log(res)
            this.setState({
                email: res.data.data.user.email,
                mobileNumber: res.data.data.user.mobileNumber,
                profileImage: res.data.data.user.profileImage,
                userName: res.data.data.user.userName,
                friendsList: res.data.data.user.friendsList
            })
            console.log(this.state.friendsList)
            const data1 = {
                userId: this.state.friendsList
            }
            await axios.post("http://localhost:3333/auth/getUsername", data1, { headers }).then(res1 => {
                this.setState({ userDetails: res1.data.data })
                this.setState({ spinner: false })
            }).catch(err => {
                console.log(err);
                this.setState({ spinner: false })
                this.setState({ swal: true })
            })
            this.setState({ spinner: false })
        }).catch(err => {
            console.log(err);
            this.setState({ spinner: false })
            this.setState({ swal: true })
        })
    }
    navbarToggle = () => {
        this.setState({ isOpen: !this.state.isOpen })
    }
    getFiles(files) {
        this.setState({ profileImage: files.base64 })
    }
    modalToggle() {
        this.setState({
            modal: !this.state.modal
        });
    }
    async uploadPost() {
        this.setState({ spinner: true })
        this.setState({ modal: false })
        let token = localStorage.getItem("token_social_media")
        const data = {
            userId: localStorage.getItem("userId"),
            userName: this.state.userName,
            mobileNumber: this.state.mobileNumber,
            profileImage: this.state.profileImage
        }
        const headers = {
            'content-type': 'application/json',
            'x-access-token': token
        }
        axios.post("http://localhost:3333/auth/update", data, { headers }).then(res => {
            this.setState({ spinner: false })
            this.getPrimaryDetails();
        }).catch(err => {
            console.log(err);
            this.setState({ spinner: false })
            this.setState({ swal: true })
        })
    }
    posts() {
        window.location.href = '/'
    }
    logout() {
        localStorage.clear();
        window.location.href = '/login';
    }
    render() {
        var token = localStorage.getItem("token_social_media");
        if (!token) {
            window.location.href = '/login';
        }
        else {
            return (
                <div>
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
                        <div>
                            <Navbar color="light" light expand="md">
                                <SweetAlert
                                    error
                                    show={this.state.swal}
                                    title="Something went wrong, Please logout and login again"
                                    onConfirm={() => this.setState({ swal: false })}
                                >
                                </SweetAlert>
                                <img
                                    alt=""
                                    src={logo}
                                    width="30"
                                    height="30"
                                    className="d-inline-block align-top"
                                />&nbsp;&nbsp;
                                <NavbarBrand href="/">Social Media</NavbarBrand>
                                <NavbarToggler onClick={this.navbarToggle} />
                                <Collapse isOpen={this.state.isOpen} navbar>
                                    <Nav className="mr-auto" navbar >
                                    </Nav>
                                    <NavbarText style={{ cursor: 'pointer' }} onClick={this.posts}>Posts</NavbarText>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br />
                                    <NavbarText style={{ cursor: 'pointer' }} onClick={this.logout}>Logout</NavbarText>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </Collapse>
                            </Navbar>
                            <Col xl={12} lg={12} md={12} >
                                <div class="gtco-testimonials">
                                    <h2>My Profile</h2>
                                    <Row>
                                        <Col xl={3} lg={12} md={12} >
                                        </Col>
                                        <Col xl={6} lg={12} md={12} >
                                            <div>
                                                <div class="card text-center"><img class="card-img-top" src={this.state.profileImage} alt="" />
                                                    <div class="card-body">
                                                        <h5>{this.state.userName} <br />
                                                        </h5>
                                                        <CardBody>
                                                            <Form>
                                                                <FormGroup row>
                                                                    <Label sm={4} style={{ float: 'left' }}>
                                                                        Email
                                                                    </Label>
                                                                    <Col sm={8}>
                                                                        <Input
                                                                            disabled
                                                                            placeholder={this.state.email}
                                                                        />
                                                                    </Col>
                                                                </FormGroup>
                                                                <FormGroup row>
                                                                    <Label sm={4} style={{ float: 'left' }}>
                                                                        Name
                                                                    </Label>
                                                                    <Col sm={8}>
                                                                        <Input
                                                                            disabled
                                                                            placeholder={this.state.userName}
                                                                        />
                                                                    </Col>
                                                                </FormGroup>
                                                                <FormGroup row>
                                                                    <Label sm={4} style={{ float: 'left' }}>
                                                                        Mobile Number
                                                                     </Label>
                                                                    <Col sm={8}>
                                                                        <Input
                                                                            disabled
                                                                            placeholder={this.state.mobileNumber}
                                                                        />
                                                                    </Col>
                                                                </FormGroup>
                                                            </Form>
                                                            <center>
                                                                <Button style={{ background: '#004E8E', backgroundColor: '#004E8E' }} onClick={this.modalToggle}> Edit</Button>
                                                            </center>
                                                        </CardBody>
                                                        <h5 style={{ color: '#000' }}>Followers <br /></h5>
                                                        <Row>

                                                            {this.state.userDetails.map((data, index) => (
                                                                <Col xl={4} lg={4} md={6} sm={6} >

                                                                    <div style={{ marginTop: '4%', marginBottom: '2%' }}>
                                                                        <div class="card text-center" style={{ backgroundColor: '#E9ECEF' }}><img class="card-img-top" style={{ maxWidth: '50px', borderRadius: '50%', margin: '15px auto 0', boxShadow: '0 8px 20px -4px #fff', width: '50px', height: '50px' }} key={index} src={data.profileImage} alt="" />
                                                                            <div class="card-body">
                                                                                <h5 key={index} >{data.userName} <br /></h5>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                </Col>
                                                            ))}
                                                        </Row>
                                                        <Modal isOpen={this.state.modal} toggle={this.modalToggle} size="lg">
                                                            <ModalHeader xl={8} lg={12} md={12} toggle={this.modalToggle}>Edit</ModalHeader>
                                                            <ModalBody>
                                                                <Form>
                                                                    <FormGroup row>
                                                                        <Label sm={4}>
                                                                            Name
                                                                        </Label>
                                                                        <Col sm={8}>
                                                                            <Input
                                                                                placeholder={this.state.userName}
                                                                                value={this.state.userName}
                                                                                onChange={(event) => this.setState({ userName: event.target.value })} style={{ backgroundColor: '#F0F5FB' }}
                                                                            />
                                                                        </Col>
                                                                    </FormGroup>
                                                                    <FormGroup row>
                                                                        <Label sm={4}>
                                                                            Mobile Number
                                                                        </Label>
                                                                        <Col sm={8}>
                                                                            <Input
                                                                                value={this.state.mobileNumber}
                                                                                onChange={(event) => this.setState({ mobileNumber: event.target.value })} style={{ backgroundColor: '#F0F5FB' }}
                                                                            />
                                                                        </Col>
                                                                    </FormGroup>
                                                                    <FormGroup row>
                                                                        <Label sm={4}>Profile Picture</Label>&nbsp;&nbsp;&nbsp;&nbsp;
                                                                            <FileBase64 sm={8} id="profileImage" name="profileImage" required onDone={this.getFiles.bind(this)} />
                                                                    </FormGroup>
                                                                </Form>
                                                            </ModalBody>
                                                            <ModalFooter>
                                                                <Button color='success' onClick={this.uploadPost}>Save{' '}</Button>
                                                                <Button color='secondary' onClick={this.modalToggle}>Cancel</Button>
                                                            </ModalFooter>
                                                        </Modal>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </div>
                    }
                </div>
            )
        }
    }
}
export default ProfilePage;
