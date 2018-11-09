import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import AppliedRoute from "./components/AppliedRoute";
import ResetPassword from "./containers/ResetPassword";
import Signup from "./containers/Signup";
import NewProject from "./containers/NewProject";
import Projects from "./containers/Projects";
import Users from "./containers/Users";
import ViewUser from "./containers/ViewUser";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
export default ({ childProps }) =>

    <Switch>
        <AppliedRoute path="/" exact component={Home} props={childProps} />
        <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
        <UnauthenticatedRoute path="/signup" exact component={Signup} props={childProps} />
        <AuthenticatedRoute path="/projects/new" exact component={NewProject} props={childProps} />
        <AuthenticatedRoute path="/projects/:id" exact component={Projects} props={childProps} />
        <AuthenticatedRoute path="/users" exact component={Users} props={childProps} />
        <AuthenticatedRoute path="/users/:id" exact component={ViewUser} props={childProps} />
        { /* Finally, catch all unmatched routes */}
        <Route component={NotFound} />
        {/*<UnauthenticatedRoute
            path="/login/reset"
            exact
            component={ResetPassword}
            props={childProps}
        />*/}
    </Switch>;