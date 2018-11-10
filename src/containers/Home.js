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
      projects: [],
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }
    try {
      await API.get("projectAPI", "/users").then(value => this.props.setPermRole(value))
      const projects = await this.projects({
        userId: this.props.getEmailId()
      });
     
      this.setState({ projects });
    } catch (e) {
      alert(e);
    }
  
    this.setState({ isLoading: false });
  }
  
  projects(user) {
   
    if(this.props.getPermRole()==="admin"){
      
      return API.post("projectAPI", "/projects/pall",{
        body: user
      });
    }else{
      return API.post("projectAPI", "/projects/plist", {
        body: user
      });
    }
  }

  checkRole(){
    
    if(this.props.getPermRole() === "admin" || this.props.getPermRole()==="project manager"){
      return(
            <LinkContainer
              key="new"
              to="/projects/new"
            >
              <ListGroupItem className="newProj">
                <h4>
                  <b>{"\uFF0B"}</b> Create a new project
                </h4>
              </ListGroupItem>
            </LinkContainer>
      )}
  }

  renderProjectsList(projects) {
    return [{}].concat(projects).map(
      (project, i) =>
        i !== 0
          ? <LinkContainer
              key={project.projectId}
              to={`/projects/${project.projectId}`}
            >
              <ListGroupItem className="projs" header={project.title}>
                {"Created: " + new Date(project.createdAt).toLocaleString() + " by " + project.mgmtId}
              </ListGroupItem>
            </LinkContainer>
          : <div>{this.checkRole()}</div>
            
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

  renderProjects() {
    return (
      <div className="projects">
        <PageHeader>Your Projects</PageHeader>
        <ListGroup>
          {!this.state.isLoading && this.renderProjectsList(this.state.projects)}
        </ListGroup>
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderProjects() : this.renderLander()}
      </div>
    );
  }
}