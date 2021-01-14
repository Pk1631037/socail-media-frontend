import React from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import LoginPage from "./components/Loginpage.jsx";
import RegisterPage from "./components/RegisterPage.jsx";
import HomePage from "./components/HomePage.jsx";
import ProfilePage from "./components/ProfilePage.jsx";
import PublicPage from "./components/PublicPage.jsx";
import MyPage from "./components/MyPage.jsx";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
class App extends React.Component {
  comonentDidMount() {

    window.scrollTo(0, 0)
  }
  render() {
    return (
      <Router >
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route exact path="/login">
          <LoginPage />
        </Route>
        <Route exact path="/register">
          <RegisterPage />
        </Route>
        <Route exact path="/profile">
          <ProfilePage />
        </Route>
        <Route exact path="/public-posts">
          <PublicPage />
        </Route>
        <Route exact path="/my-posts">
          <MyPage />
        </Route>
      </Router>
    );
  }

}
export default App;
