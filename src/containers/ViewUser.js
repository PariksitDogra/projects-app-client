import React, { Component } from "react";
import { API, Storage } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel, ListGroupItem } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./ViewUser.css";
import Select from 'react-select';
import { LinkContainer } from "react-router-bootstrap";

export default class ViewUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: null,
      user: null,
      emailId: "",
      content: "",
      permRole: "",
      option: null
    };
  }

  async componentDidMount() {
    try {
      const user = await this.getUser();
      const { emailId, content, permRole, } = user;
      this.setState({
        user,
        content,
        emailId,
        permRole,

      });
      this.setState({option: { value: this.state.permRole, label: this.state.permRole } })
    } catch (e) {
      alert(e);
    }
  }

  getUser() {
    return API.get("projectAPI", `/users/${this.props.match.params.id}`);
  }

  validateForm() {
    return this.state.content.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  saveUser(user) {
    return API.put("projectAPI", `/users/${this.props.match.params.id}`, {
      body: user
    });
  }

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {

      await this.saveUser({
        content: this.state.content,
        permRole: this.state.permRole,
        emailId: this.state.email,

      });
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

render() {
  return (
    <div className="ViewUser">
      {this.state.user &&
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="title" bsSize="large">
            <ControlLabel>Email Address: {this.state.emailId}</ControlLabel>
            <ControlLabel>Role: {this.state.permRole}</ControlLabel>
          </FormGroup>
          <ControlLabel>Employee Description</ControlLabel>
          <FormGroup controlId="content">
            <FormControl
              onChange={this.handleChange}
              value={this.state.content}
              componentClass="textarea"
              style={{ height: 300 }}
              disabled={true}
            />
          </FormGroup>
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
        </form>}
    </div>
  );
}
  
}
