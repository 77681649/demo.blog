import React from "react";
import { Router, Route, Switch } from "dva/router";
import IndexPage from "./routes/IndexPage";
import LoginPage from "./routes/LoginPage";

function RouterConfig({ history }) {
  console.log(history);
  return (
    <Router history={history}>
      <Switch>
        <Route path="/secret/admin" exact component={IndexPage} />
        <Route path="/secret/admin/login" exact component={LoginPage} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
