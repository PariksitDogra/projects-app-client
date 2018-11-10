import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import "./App.css";
import Routes from "./Routes";
import { Auth, API } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";
import { CognitoIdentity } from "aws-sdk/clients/all";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true,
      userId: "None",
      permRole: "developer",
      trueId:""
    };
  }
  async componentDidMount() {
    try {
      await Auth.currentSession();
      await Auth.currentUserPoolUser().then(value => Auth.userAttributes(value).then(value => this.setEmailId(value[2].Value)))
      await API.get("projectAPI", "/users").then(value => this.setPermRole(value));
      await this.getCurrentUser().then(value => this.setState({trueId: value.userId}))

      Promise.resolve()
      this.userHasAuthenticated(true);
    }
    catch (e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }

    this.setState({ isAuthenticating: false });
  }

  userHasAuthenticated = (authenticated) => {
    this.setState({ isAuthenticated: authenticated });
  }

  getEmailId = event => {
    return this.state.userId;
  }

  setPermRole = (user) =>{
    this.setState({permRole: user.permRole})
  }
  setTrueId = (user) =>{
    this.setState({trueId: user.userId})
  }

  getPermRole = event => {
    return this.state.permRole
  }
  getCurrentUser = event => {
    return API.get("projectAPI", "/users")
  }

  setEmailId = (email) => {
    this.setState({ userId: email })
  }

  handleLogout = async event => {
    await Auth.signOut();

    this.userHasAuthenticated(false);
    this.props.history.push("/login");
  }

  

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated,
      setEmailId: this.setEmailId,
      getEmailId: this.getEmailId,
      getPermRole: this.getPermRole,
      setPermRole: this.setPermRole,
      getCurrentUser: this.getCurrentUser,
      setTrueId: this.setTrueId

    };

    return (
      !this.state.isAuthenticating &&
      <div className="App container">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand className ="homeButton">
              <Link to="/">SpiffyCloud</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              {this.state.isAuthenticated
                ? <Fragment>
                  <LinkContainer to="/users">
                    <NavItem className="helpMe" >Users</NavItem>
                  </LinkContainer>
                  <LinkContainer to={`/users/${this.state.trueId}`}>
                    <NavItem className="helpMe">Edit Profile
                    </NavItem>
                  </LinkContainer>
                  <NavItem className="helpMe" onClick={this.handleLogout}>Logout</NavItem>
                </Fragment>
                : <Fragment>
                  <LinkContainer to="/signup">
                    <NavItem className="helpMe" >Signup</NavItem>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <NavItem className="helpMe">Login</NavItem>
                  </LinkContainer>
                </Fragment>
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Routes childProps={childProps} />
      </div>
    );
  }
}

export default withRouter(App);