import React from "react";
import { Switch, Route } from "react-router-dom";

import Main from "./pages/Main";
import Repository from "./pages/Repository";

export default function Router() {
    return (
        <Switch>
            <Route exact path="/" component={Main} />
            <Route path="/repository/:repository" component={Repository} />
        </Switch>
    );
}
