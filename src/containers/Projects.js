import React, { Component } from "react";
import { API, Storage } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./Projects.css";
import Select from 'react-select';


const options = [
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
      dropDownOptions: null
    };
  }

  async componentDidMount() {
    try {
      const project = await this.getProject();
      const { mgmtId, content, title, developers, projectStatus } = project;



      this.setState({
        project,
        content,
        title,
        mgmtId,
        developers,
        projectStatus,
        
      });
      this.setState({dropDownOptions: {value: this.state.projectStatus, label: this.state.projectStatus}})
    } catch (e) {
      alert(e);
    }
  }

  getProject() {
    return API.get("projectAPI", `/projects/${this.props.match.params.id}`);
  }

  validateForm() {
    return this.state.content.length > 0 && this.state.title.length > 0;
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

  handleDelete = async event => {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    this.setState({ isDeleting: true });
  }
  dropdownOnChange = (dropDownOptions) => {
    this.setState({ dropDownOptions });
    this.setState({ projectStatus: dropDownOptions })
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
              value={this.state.dropDownOptions}
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
