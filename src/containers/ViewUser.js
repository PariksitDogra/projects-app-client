import React, { Component } from "react";
import { API, Storage } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel, ListGroupItem } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./ViewUser.css";
import Select from 'react-select';


const roleOptions = [
  { value: 'developer', label: 'developer' },
  { value: 'project manager', label: 'project manager' },
  { value: 'admin', label: 'admin' }
];


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
      this.setState({option: {value: this.state.permRole, label: this.state.permRole}});
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
        emailId: this.state.emailId,

      });
      this.props.history.push("/users");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }
  dropdownOnChange = (option) => {
    this.setState({ option });
    this.setState({ permRole: option.value })
    
  }
  boolCheck() {
    if (!(this.props.getPermRole() === "admin" || this.state.emailId === this.props.getEmailId())) {
      return true;
    } else {
      return false;
    }
  }
  renderSave(){
    if(this.props.getPermRole()==="admin" || this.state.emailId === this.props.getEmailId()){
      return <LoaderButton
              block
              className="viewUser"
              bsStyle="primary"
              bsSize="large"
              disabled={!this.validateForm()}
              type="submit"
              isLoading={this.state.isLoading}
              text="Save"
              loadingText="Saving…"
            />
    }else{
      return <p>
      </p>
    }
  }
  
  showRole(){
    if(!(this.props.getPermRole() === "admin" || this.state.mgmtId === this.props.getEmailId())){
      return <FormGroup controlId="Role" bsSize="large">
              <ControlLabel>Employee Role</ControlLabel>
              <FormControl
                type="Role"
                value={this.state.permRole}
                disabled={true}
              />
            </FormGroup>
    }else{
      return <Select
      className="roleTable"
      value={this.state.option}
      onChange={this.dropdownOnChange}
      options={roleOptions}
      />
    }
  }

  render() {
    return (
      <div className="ViewUser">
        {this.state.user &&
          <form onSubmit={this.handleSubmit}>
            <FormGroup controlId="emailId" bsSize="large">
              <ControlLabel>Email Address</ControlLabel>
              <FormControl
                type="Title"
                value={this.state.emailId}
                disabled={true}
              />
            </FormGroup>
            <ControlLabel>Employee Description</ControlLabel>
            <FormGroup controlId="content">
              <FormControl
                onChange={this.handleChange}
                value={this.state.content}
                componentClass="textarea"
                style={{ height: 300 }}
                disabled={this.boolCheck()}
              />
            </FormGroup>
            <div>{this.showRole()}</div>
            <div>{this.renderSave()}</div>
            
          </form>}
      </div>
    );
  }

}