import React, { useState } from "react";
import "../styles/HomePage.css";
import logo from './images/logo.png'
import FileBase64 from 'react-file-base64';
import Loader from 'react-loader-spinner';
import { Button, Comment, Form, Header } from 'semantic-ui-react';
import SweetAlert from 'react-bootstrap-sweetalert';
import Heart from "react-animated-heart";
import { Col, FormGroup, Input, Label, Row, Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavbarText, Container, Modal, ModalHeader, ModalBody, ModalFooter, Badge } from 'reactstrap';
import axios from "axios";

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false, // Navbar Open Close
            commentSectionView: false, // Comments section open close
            postsData: [], // Posts Data
            userComment: '', //User Comments
            userPostImage: [], // Users Posts Image
            userPostTitle: '', // Users Posts Title
            userPostDescription: '', // Users Posts Description
            modal: false, // Modal
            spinner: false, // Spinner
            swal: false, // Sweet Alert
            postsEmpty: false, //Checks for post empty or not
            profileImage: [], // User Profile Image
            postsMode: false, // Post Mode (Public or Private)
            followersList: [], // Followers List
            usersCommentId: '' // Users Comments ID
        }

        this.navbarToggle = this.navbarToggle.bind(this); // Navbar Toggle Function
        this.redirectMyPosts = this.redirectMyPosts.bind(this); // Redirect to my posts function
        this.redirectHome = this.redirectHome.bind(this); // Redirect to home function
        this.modalToggle = this.modalToggle.bind(this); // Modal Toggle function
        this.getPrimaryDetails = this.getPrimaryDetails.bind(this); // Runs first to excute API
        this.comment = this.comment.bind(this); // Comments function
        this.likeButton = this.likeButton.bind(this); // Like button function
        this.uploadPost = this.uploadPost.bind(this); // upload post function
        this.logout = this.logout.bind(this) // Logout function
    }
    componentWillMount() {

        window.scrollTo(0, 0);
        this.getPrimaryDetails();
    }
    viewComments(postId) {
        console.log(postId)
        this.setState({ commentSectionView: !this.state.commentSectionView, usersCommentId: postId })
    }
    async getPrimaryDetails() {
        this.setState({ spinner: true })
        this.setState({ postsEmpty: false });
        var token = localStorage.getItem("token_social_media");
        var userId = localStorage.getItem("userId");
        const body = {
            userId: userId
        }
        const headers = {
            'content-type': 'application/json',
            'x-access-token': token
        }
        await axios.get("http://localhost:3333/post/getPosts", { headers })
            .then(async dataObj => {
                this.setState({ postsData: dataObj.data.data })
                await axios.post("http://localhost:3333/auth/getUsers", body, { headers })
                    .then(async res => {
                        console.log(res.data)
                        for (var i = 0; i < res.data.data.length; i++) {
                            if (res.data.data[i].userId == localStorage.getItem("userId")) {
                                res.data.data.splice(i, 1);
                            }
                        }
                        console.log(res.data.data);
                        this.setState({ followersList: res.data.data })
                        this.setState({ postsEmpty: false });
                        this.setState({ spinner: false })

                    }).catch(err => {
                        console.log(err);
                        this.setState({ spinner: false })
                        this.setState({ swal: true })
                        this.setState({ postsEmpty: false });
                    })
            }).catch(err => {
                console.log(err);
                this.setState({ spinner: false })
                this.setState({ swal: true })
                this.setState({ postsEmpty: false });
            })
    }
    navbarToggle = () => {
        this.setState({ isOpen: !this.state.isOpen })
    }
    async comment(postId) {
        this.setState({ spinner: true })
        this.setState({ postsEmpty: false });
        if (this.state.userComment.length == 0) {
            this.setState({ swal: true })
        }
        else {
            var token = localStorage.getItem("token_social_media");
            var userId = localStorage.getItem("userId");
            var userName = localStorage.getItem("userName");
            var profileImage = localStorage.getItem("profileImage");
            var dt = new Date();
            var hours = dt.getHours();
            var AmOrPm = hours >= 12 ? 'pm' : 'am';
            hours = (hours % 12) || 12;
            var minutes = dt.getMinutes();
            var finalTime = hours + ":" + minutes + " " + AmOrPm;
            const body = {
                userId: userId,
                postId: postId,
                comments: this.state.userComment,
                userName: userName,
                commentedAt: finalTime,
                profileImage: profileImage
            }
            const headers = {
                'content-type': 'application/json',
                'x-access-token': token
            }
            axios.post("http://localhost:3333/post/addComment", body, { headers }
            ).then(res => {
                this.setState({ spinner: false })
                this.setState({ postsEmpty: false });
                this.getPrimaryDetails();
            }).catch(err => {
                console.log(err)
                this.setState({ spinner: false })
                this.setState({ swal: true })
                this.setState({ postsEmpty: false });
                this.getPrimaryDetails();
            })
        }
    }
    likeButton = async (postId, value) => {
        this.setState({ postsEmpty: false });
        this.setState({ spinner: true })
        var userId = localStorage.getItem("userId");
        var token = localStorage.getItem("token_social_media")
        if (value === false) {
            const headers = {
                'content-type': 'application/json',
                'x-access-token': token
            }
            const body = {
                userId: userId,
                postId: postId
            }
            await axios.post("http://localhost:3333/post/like", body, { headers }).then(res => {

                this.setState({ spinner: false })
                this.getPrimaryDetails();
            }).catch(err => {
                this.setState({ spinner: false })
                console.log(err)
                this.setState({ swal: true })
                this.getPrimaryDetails();
            }
            )
        }
        else {
            const body = {
                userId: userId,
                postId: postId
            }
            const headers = {
                'content-type': 'application/json',
                'x-access-token': token
            }
            await axios.post("http://localhost:3333/post/unlike", body, { headers }
            ).then(res => {

                this.setState({ spinner: false })
                this.getPrimaryDetails();
            }).catch(err => {
                this.setState({ spinner: false })
                this.setState({ swal: true })
                this.getPrimaryDetails();
                console.log(err)
            }
            )

        }
    }
    getFiles(files) {
        this.setState({ userPostImage: files.base64 })

    }
    modalToggle() {
        this.setState({
            modal: !this.state.modal
        });
    }
    async uploadPost() {
        this.setState({ spinner: true })
        this.setState({ postsEmpty: false });
        this.setState({ modal: false })
        let token = localStorage.getItem("token_social_media")
        var dt = new Date();
        var hours = dt.getHours();
        var AmOrPm = hours >= 12 ? 'pm' : 'am';
        hours = (hours % 12) || 12;
        var minutes = dt.getMinutes();
        var finalTime = hours + ":" + minutes + " " + AmOrPm;
        const headers = {
            'content-type': 'application/json',
            'x-access-token': token
        }
        const body = {
            userId: localStorage.getItem("userId"),
            userPostTitle: this.state.userPostTitle,
            userPostDescription: this.state.userPostDescription,
            userPostImage: this.state.userPostImage,
            postedAt: finalTime,
            userName: localStorage.getItem("userName"),
            private: this.state.postsMode
        }
        await axios.post("http://localhost:3333/post/uploadPost", body, { headers }).then(res => {
            this.setState({ spinner: false })
            this.getPrimaryDetails();
        }).catch(err => {
            console.log(err);
            this.setState({ spinner: false })
            this.setState({ swal: true })
        })
    }
    profile() {
        window.location.href = '/profile';
    }
    logout() {
        localStorage.clear();
        window.location.href = '/login';
    }
    async mode(e) {
        await this.setState({ postsMode: e })
    }
    async follow(friendsId) {
        this.setState({ spinner: true })
        this.setState({ postsEmpty: false });
        let token = localStorage.getItem("token_social_media");
        const headers = {
            'content-type': 'application/json',
            'x-access-token': token
        }
        const body = {
            userId: localStorage.getItem("userId"),
            friendsId: friendsId,

        }
        await axios.post("http://localhost:3333/auth/follow", body, { headers }).then(res => {
            this.setState({ spinner: false })
            this.getPrimaryDetails();
        }).catch(err => {
            console.log(err);
            this.setState({ spinner: false })
            this.setState({ swal: true })
        })
    }
    redirectHome() {
        window.location.href = '/';
    }
    redirectMyPosts() {
        window.location.href = '/my-posts';
    }
    render() {
        var token = localStorage.getItem("token_social_media");
        if (!token) {
            window.location.href = '/login';
        }
        return (
            <div>
                <Navbar color="light" light expand="md">
                    <img
                        alt=""
                        src={logo}
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                    />&nbsp;&nbsp;
        <NavbarBrand href="/">Social Media</NavbarBrand>
                    <NavbarToggler onClick={this.navbarToggle} />
                    <SweetAlert
                        error
                        show={this.state.swal}
                        title="Something went wrong, Please logout and login again"
                        onConfirm={() => this.setState({ swal: false })}
                    >
                    </SweetAlert>
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="mr-auto" navbar >
                        </Nav>
                        <NavbarText style={{ cursor: 'pointer' }} onClick={this.redirectHome}>Posts</NavbarText>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br />
                        <NavbarText style={{ cursor: 'pointer' }} onClick={this.redirectMyPosts}>My Posts</NavbarText>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br />

                        <NavbarText style={{ cursor: 'pointer' }} onClick={this.modalToggle}>Upload Post</NavbarText>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br />
                        <NavbarText style={{ cursor: 'pointer' }} onClick={this.profile}>Profile</NavbarText>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br />
                        <NavbarText style={{ cursor: 'pointer' }} onClick={this.logout}>Logout</NavbarText>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </Collapse>
                </Navbar>
                <Container>
                    <Row>
                        <Modal isOpen={this.state.modal} toggle={this.modalToggle} size="lg">
                            <ModalHeader xl={8} lg={12} md={12} toggle={this.modalToggle}>Upload Post</ModalHeader>
                            <ModalBody>
                                <Form>
                                    <FormGroup row>
                                        <Label sm={4}>
                                            PostTitle
                                        </Label>
                                        <Col sm={8}>
                                            <Input
                                                type="text"
                                                placeholder="Post Title"
                                                value={this.state.userPostTitle}
                                                onChange={(event) => this.setState({ userPostTitle: event.target.value })} style={{ backgroundColor: '#F0F5FB' }}
                                            />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label sm={4}>
                                            Post Description
                                        </Label>
                                        <Col sm={8}>
                                            <Input
                                                type="textarea"
                                                placeholder="Post Description"
                                                value={this.state.userPostDescription}
                                                onChange={(event) => this.setState({ userPostDescription: event.target.value })} style={{ backgroundColor: '#F0F5FB' }}
                                            />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label sm={4}>Post Image</Label>
                                        <Col sm={7}>
                                            <FileBase64 id="profileImage" name="profileImage" required onDone={this.getFiles.bind(this)} />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label sm={5}>
                                        </Label>
                                        <Col sm={7}>
                                            <Input
                                                type="checkbox"

                                                value={this.state.postsMode}
                                                onChange={(e) => this.mode(e.target.checked)}
                                            />Private Post
                                        </Col>
                                    </FormGroup>
                                </Form>
                            </ModalBody>
                            <ModalFooter>
                                <Button color='success' onClick={this.uploadPost}>Save{' '}</Button>
                                <Button color='secondary' onClick={this.modalToggle}>Cancel</Button>
                            </ModalFooter>
                        </Modal>
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
                            <Col xl={12} lg={12} md={12} >
                                <div class="gtco-testimonials">
                                    <h2>Posts</h2>
                                    <Row>
                                        {this.state.followersList.map((data, index) => (
                                            <Col xl={3} lg={3} md={4} >

                                                <div style={{ marginTop: '4%', marginBottom: '2%' }}>
                                                    <div class="card text-center"><img class="card-img-top" style={{ maxWidth: '50px', borderRadius: '50%', margin: '15px auto 0', boxShadow: '0 8px 20px -4px #95abbb', width: '50px', height: '50px' }} key={index} src={data.profileImage} alt="" />
                                                        <div class="card-body">
                                                            <h5 key={index} >{data.userName} <br />
                                                                <Button style={{ backgroundColor: '#004E8E', color: '#fff' }} onClick={this.follow.bind(this, data.userId)} >+{' '}Follow</Button>
                                                            </h5>
                                                        </div>
                                                    </div>
                                                </div>

                                            </Col>
                                        ))}
                                    </Row>
                                    <span>
                                        {this.state.postsData.length === 0 ?
                                            <p style={{
                                                position: 'absolute', left: '50%', marginTop: '10%',
                                                transform: 'translate(-50%, -50%)', fontSize: '26px'
                                            }}> No Post found</p>
                                            : <span>
                                                {this.state.postsData.map((data, index) => (
                                                    <Row>
                                                        <Col xl={1} lg={1} md={12} ></Col>
                                                        <Col xl={10} lg={10} md={12} >
                                                            <div style={{ marginTop: '2%', marginBottom: '2%' }}>
                                                                <div class="card text-center"><img class="card-img-top" key={index} src={data.userPostImage} alt="" />
                                                                    <div class="card-body">
                                                                        <h5 key={index} >{data.userName} <br />
                                                                            <span style={{ fontWeight: '700', color: 'black' }}> {data.userPostTitle}</span>
                                                                        </h5>
                                                                        <p class="card-text" style={{ fontSize: '14px' }} key={index}>{data.userPostDescription} </p>
                                                                    </div>
                                                                    <div >
                                                                        <span style={{ float: 'left' }}>
                                                                            <Heart isClick={data.likedUsersId.includes(localStorage.getItem("userId"))} onClick={this.likeButton.bind(this, data.postId, data.likedUsersId.includes(localStorage.getItem("userId")))}  >

                                                                            </Heart> </span> <span style={{ float: 'left', marginTop: '5%' }}> {data.likedUsersId.length} Likes</span>
                                                                        <p style={{ float: 'right', marginTop: '2%', cursor: 'pointer' }} key={index} onClick={this.viewComments.bind(this, data.postId)}><Badge color="secondary">{data.commentsUsersID.length}</Badge> {' '}View Comments</p>
                                                                    </div>
                                                                    {data.postId === this.state.usersCommentId ?
                                                                        <div>
                                                                            {this.state.commentSectionView === true ?
                                                                                <Comment.Group key={index}>
                                                                                    {data.commentsUsersID.map(
                                                                                        ({ comments, userName, commentedAt, profileImage }) => (
                                                                                            <div>
                                                                                                <Comment style={{ float: 'left' }}>
                                                                                                    <Comment.Avatar key={index} src={profileImage} />
                                                                                                    <Comment.Content >
                                                                                                        <Comment.Author as='a' key={index}>{userName}</Comment.Author>
                                                                                                        <Comment.Metadata>
                                                                                                            <div key={index}>{commentedAt}</div>
                                                                                                        </Comment.Metadata>
                                                                                                        <Comment.Text key={index}>{comments}</Comment.Text>
                                                                                                    </Comment.Content>
                                                                                                </Comment><br /><br /><br />
                                                                                                <br />
                                                                                            </div>
                                                                                        ))}
                                                                                    <div style={{ marginTop: '5%' }}>
                                                                                        <Input type="textarea" name="text" id="exampleText" onChange={(event) => this.setState({ userComment: event.target.value })} />
                                                                                        <Button content='Add Comment' labelPosition='left' icon='edit' primary style={{ marginTop: '4%', marginBottom: '2%' }} onClick={this.comment.bind(this, data.postId)} />
                                                                                    </div>
                                                                                </Comment.Group>
                                                                                : null}
                                                                        </div>
                                                                        : null}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                ))
                                                }
                                            </span>
                                        }
                                    </span>
                                </div>
                            </Col>
                        }
                    </Row>
                </Container>
            </div>
        )
    }
}

export default HomePage;
