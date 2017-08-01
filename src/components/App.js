import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Header from './Header';
import Search from './Search';
import Login from './Login';
import LinkList from './LinkList';
import CreateLink from './CreateLink';

const App = () =>
  (<div className="center w85">
    <Header />
    <div className="ph3 pv1 background-gray">
      <Switch>
        <Route exact path="/hacker-news-clone" render={() => <Redirect to="/hacker-news-clone/newest/1" />} />
        <Route exact path="/hacker-news-clone/login" component={Login} />
        <Route exact path="/hacker-news-clone/create" component={CreateLink} />
        <Route exact path="/hacker-news-clone/search" component={Search} />
        <Route exact path="/hacker-news-clone/top" component={LinkList} />
        <Route exact path="/hacker-news-clone/newest/:page" component={LinkList} />

        {/* <Route exact path="/" render={() => <Redirect to="/newest/1" />} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/create" component={CreateLink} />
        <Route exact path="/search" component={Search} />
        <Route exact path="/top" component={LinkList} />
        <Route exact path="/newest/:page" component={LinkList} /> */}
      </Switch>
    </div>
  </div>);

export default App;
