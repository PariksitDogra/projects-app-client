import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./NewProject.css";
import 'react-dropdown/style.css'
import Select from 'react-select';
import { API } from "aws-amplify";



const options = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Active', label:'Active'},
  { value: 'Completed', label:'Completed'}
];

export default class NewProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: null,
      projectTitle: "",
      projectStatus:{value: 'Pending', label:'Pending'},
      content: "",
    };
  }

  dropdownOnChange = (projectStatus) => {
    this.setState({ projectStatus });
  }

  validateForm() {
    return this.state.content.length > 0 && this.state.projectTitle.length > 0 ;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ isLoading: true });
  
    try {
      await this.createProject({
        title: this.state.projectTitle,
        projectStatus: this.state.projectStatus.value,
        mgmtId: this.props.getEmailId(),
        content: this.state.content
      });
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }
  
  createProject(project) {
    return API.post("projectAPI", "/projects", {
      body: project
    });
  }

  render() {
    return (
      <div className="NewProject">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="projectTitle" bsSize="large">
            <ControlLabel>Project Title</ControlLabel>
            <FormControl
              autoFocus
              type="Title"
              onChange={this.handleChange}
              value={this.state.projectTitle}
            />
          </FormGroup>
          <ControlLabel>Project Description</ControlLabel>
          <FormGroup controlId="content">
            <FormControl
              onChange={this.handleChange}
              value={this.state.content}
              componentClass="textarea"
            />
          </FormGroup>
          <ControlLabel>Project Status </ControlLabel> 
          <Select
            value={this.state.projectStatus}
            onChange={this.dropdownOnChange}
            options={options}
          />
          <LoaderButton
            block
            bsStyle="primary"
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Create"
            loadingText="Creating…"
          />
        </form>
      </div>
    );
  }
}