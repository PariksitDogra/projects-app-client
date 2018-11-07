import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import AppliedRoute from "./components/AppliedRoute";
import ResetPassword from "./containers/ResetPassword";
import Signup from "./containers/Signup";
import NewProject from "./containers/NewProject";
export default ({ childProps }) =>
    <Switch>
        <AppliedRoute path="/" exact component={Home} props={childProps} />
        <AppliedRoute path="/login" exact component={Login} props={childProps} />
        <AppliedRoute path="/signup" exact component={Signup} props={childProps} />
        <AppliedRoute path="/projects/new" exact component={NewProject} props={childProps} />
        { /* Finally, catch all unmatched routes */}
        <Route component={NotFound} />
        {/*<UnauthenticatedRoute
            path="/login/reset"
            exact
            component={ResetPassword}
            props={childProps}
        />*/}
    </Switch>;