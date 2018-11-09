import React, { Component } from "react";
import { API, Storage } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel, ListGroupItem } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./Projects.css";
import Select from 'react-select';
import { LinkContainer } from "react-router-bootstrap";
import { EEXIST } from "constants";

const statusOptions = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Active', label: 'Active' },
  { value: 'Completed', label: 'Completed' }
];


export default class Projects extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: null,
      isDeleting: null,
      project: null,
      content: "",
      mgmtId: "",
      title: "",
      developers: [],
      projectStatus: "",
      dropDownOptions: null,
      currentOption: { value: "null", label: "null" },
      availableUsers: ["dummy"]
    };
  }
  getUsers() {
    return API.post("projectAPI", "/users/view", {
    });
  }

  async componentDidMount() {
    try {
      const project = await this.getProject();
      const availableUsers = await this.getUsers();
      const { mgmtId, content, title, developers, projectStatus } = project;



      this.setState({
        project,
        content,
        title,
        mgmtId,
        developers,
        projectStatus,
        availableUsers: this.getEmailIds(availableUsers, developers)

      });
      this.setState({ dropDownOptions: { value: this.state.projectStatus, label: this.state.projectStatus } })
      
    } catch (e) {
      alert(e);
    }
  }
  

  getEmailIds= (users, developers) => {
    var availableUsers = []

    for (var i = 0; i < users.length; i++){
      availableUsers.push(users[i].emailId);
      for(var x = 0; x < developers.length;x++){
        if(users[i].emailId===developers[x]){
          availableUsers.pop();
          break;
        }
      }
      
    }
    return availableUsers;
  }

  getProject() {
    return API.get("projectAPI", `/projects/${this.props.match.params.id}`);
  }

  validateForm() {
    return this.state.content.length > 0 && this.state.title.length > 0 && this.state.projectStatus != null;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  saveProject(project) {
    return API.put("projectAPI", `/projects/${this.props.match.params.id}`, {
      body: project
    });
  }

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {

      await this.saveProject({
        content: this.state.content,
        title: this.state.title,
        developers: this.state.developers,
        projectStatus: this.state.projectStatus.value

      });
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  deleteProject() {
    return API.del("projectAPI", `/projects/${this.props.match.params.id}`);
  }

  handleDelete = async event => {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    this.setState({ isDeleting: true });

    try {
      await this.deleteProject();
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isDeleting: false });
    }
  }


  dropdownOnChange = (dropDownOptions) => {
    this.setState({ dropDownOptions });
    this.setState({ projectStatus: dropDownOptions })

  }

  dropdownDev = (currentOption) => {
    this.setState({ currentOption });
  }

  removeDeveloper = event => {
    var e = document.getElementById("devList");
    var developer = e.options[e.selectedIndex].value;
    var developers = this.state.developers;
    var users = this.state.availableUsers;
    for (var i = 0; i < developers.length; i++)
      if (developers[i] === developer) {
        developers.splice(i, 1);
        users.push(developer);
      }
    this.setState({ developers })
    this.setState({availableUsers: users})

  }

  addDeveloper = event => {
    var e = document.getElementById("userList");
    var user = e.options[e.selectedIndex].value;
    var developers = this.state.developers;
    var users = this.state.availableUsers;
    for (var i = 0; i < users.length; i++)
      if(users[i] === user) {
        users.splice(i, 1);
        developers.push(user)
      }
    this.setState({ developers })
    this.setState({availableUsers: users})
  }


render() {
  return (
    <div className="Projects">
      {this.state.project &&
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="title" bsSize="large">
            <ControlLabel>Project Title</ControlLabel>
            <FormControl
              type="Title"
              onChange={this.handleChange}
              value={this.state.title}
            />
          </FormGroup>
          <ControlLabel>Project Description</ControlLabel>
          <FormGroup controlId="content">
            <FormControl
              onChange={this.handleChange}
              value={this.state.content}
              componentClass="textarea"
              style={{ height: 300 }}
            />
          </FormGroup>
          <ControlLabel>Project Status </ControlLabel>
          <Select
            className="statusTable"
            value={this.state.dropDownOptions}
            onChange={this.dropdownOnChange}
            options={statusOptions}
          />
          <p></p>
          <ControlLabel>Project Developers </ControlLabel>
          <select id="devList" name="devList">
            {this.state.developers.map((e) => {
              return <option key={e} value={e}>{e}</option>;
            })}
          </select>
          <p></p>
          <ControlLabel>Available Developers </ControlLabel>
          <select id="userList" name="userList">
            {this.state.availableUsers.map((e) => {
              return <option key={e} value={e}>{e}</option>;
            })}
          </select>
          <LoaderButton
            
            type="button"
            onClick={this.addDeveloper}
            text="Add a developer"
            bsStyle="primary"
            isLoading={this.state.isLoading}
            loadingText="Adding developer..."
          ></LoaderButton>
          <LoaderButton
            block
            type="button"
            onClick={this.removeDeveloper}
            text="Remove developer"
            bsStyle="primary"
            isLoading={this.state.isLoading}
            loadingText="Removing developer..."
          ></LoaderButton>
          <LoaderButton
            block
            bsStyle="primary"
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Save"
            loadingText="Saving…"
          />
          <LoaderButton
            block
            bsStyle="danger"
            bsSize="large"
            isLoading={this.state.isDeleting}
            onClick={this.handleDelete}
            text="Delete"
            loadingText="Deleting…"
          />
        </form>}
    </div>
  );
}
  
}
