/* eslint no-undef: 0 */
import React, { Component } from 'react';
import { graphql, gql, compose } from 'react-apollo';
import { GC_USER_ID, GC_AUTH_TOKEN, ROOT } from '../constants';

class Login extends Component {
  state = {
    login: true, // switch between Login and SignUp
    email: '',
    password: '',
    name: '',
  };

  _confirm = () => {
    if (this.state.login) {
      this._signInUser();
    } else {
      this._createuser();
    }
  };

  _signInUser = async () => {
    const { email, password } = this.state;
    const result = await this.props.signinUserMutation({
      variables: {
        email,
        password,
      },
    });
    const id = result.data.signinUser.user.id;
    const token = result.data.signinUser.token;
    this._saveUserData(id, token);
    this._redirectToRoot();
  };

  _createuser = async () => {
    const { name, email, password } = this.state;
    const result = await this.props.createUserMutation({
      variables: {
        name,
        email,
        password,
      },
    });
    const id = result.data.signinUser.user.id;
    const token = result.data.signinUser.token;
    this._saveUserData(id, token);
    this._redirectToRoot();
  };

  _redirectToRoot = () => {
    this.props.history.push(ROOT);
  };

  _saveUserData = (id, token) => {
    localStorage.setItem(GC_USER_ID, id);
    localStorage.setItem(GC_AUTH_TOKEN, token);
  };

  render() {
    return (
      <div>
        <h4 className="mv3">
          {this.state.login ? 'Login' : 'Sign Up'}
        </h4>
        <div className="flex flex-column">
          {!this.state.login &&
            <input
              value={this.state.name}
              onChange={e => this.setState({ name: e.target.value })}
              type="text"
              placeholder="Your name"
            />}
          <input
            value={this.state.email}
            onChange={e => this.setState({ email: e.target.value })}
            type="text"
            placeholder="Your email address"
          />
          <input
            value={this.state.password}
            onChange={e => this.setState({ password: e.target.value })}
            type="password"
            placeholder="Choose a safe password"
          />
        </div>
        <div className="flex mt3">
          <div
            className="pointer mr2 button"
            role="button"
            tabIndex={0}
            onClick={() => this._confirm()}
          >
            {this.state.login ? 'login' : 'create account'}
          </div>
          <div
            className="pointer button"
            role="button"
            tabIndex={0}
            onClick={() => this.setState({ login: !this.state.login })}
          >
            {this.state.login
              ? 'need to create an account?'
              : 'already have an account?'}
          </div>
        </div>
      </div>
    );
  }
}

const CREATE_USER_MUTATION = gql`
  mutation CreateUserMutation(
    $name: String!
    $email: String!
    $password: String!
  ) {
    createUser(
      name: $name
      authProvider: { email: { email: $email, password: $password } }
    ) {
      id
    }
    signinUser(email: { email: $email, password: $password }) {
      token
      user {
        id
      }
    }
  }
`;

const SIGNIN_USER_MUTATION = gql`
  mutation SigninUserMutation($email: String!, $password: String!) {
    signinUser(email: { email: $email, password: $password }) {
      token
      user {
        id
      }
    }
  }
`;

export default compose(
  graphql(CREATE_USER_MUTATION, { name: 'createUserMutation' }),
  graphql(SIGNIN_USER_MUTATION, { name: 'signinUserMutation' }),
)(Login);
