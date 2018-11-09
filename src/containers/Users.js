import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import "./Home.css";
import { API } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";
export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      users: [],
      content:""
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }
    
    try {
      const users = await this.users();
     
      this.setState({ users });
      console.log(users)
    } catch (e) {
      alert(e);
    }
  
    this.setState({ isLoading: false });
  }
  
  users() {
    return API.post("projectAPI", "/users/view", {
    });
    
  }

  renderUserList(users) {
    return [{}].concat(users).map(
      (user, i) =>
        i !== 0
          ? <LinkContainer
              key={user.userId}
              to={`/users/${user.userId}`}
            >
              <ListGroupItem header={user.emailId}>
                {" Role: " + user.permRole}
              </ListGroupItem>
            </LinkContainer>
          : <div></div>
            
    );
  }

  renderLander() {
    return (
      <div className="lander">
        <h1>SpiffyCloud</h1>
        <p>A Project Management Application</p>
      </div>
    );
  }

  renderUsers() {
    return (
      <div className="users">
        <PageHeader>Users</PageHeader>
        <ListGroup>
          {!this.state.isLoading && this.renderUserList(this.state.users)}
        </ListGroup>
      </div>
    );
  }

  render() {
    return (
      <div className="Users">
        {this.props.isAuthenticated ? this.renderUsers() : this.renderLander()}
      </div>
    );
  }
}