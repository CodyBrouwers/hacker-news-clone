/* eslint no-undef: 0 */
import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { GC_USER_ID, GC_AUTH_TOKEN, ROOT, SEARCH, CREATE, LOGIN, NEWEST_PAGE } from '../constants';

const Header = (props) => {
  const userId = localStorage.getItem(GC_USER_ID);
  return (
    <div className="flex pa1 justify-between nowrap orange">
      <div className="flex flex-fixed black">
        <div className="fw7 mr1">Hacker News</div>
        <Link to={ROOT} className="ml1 no-underline black">
          new
        </Link>
        <div className="ml1">|</div>
        <Link to={SEARCH} className="ml1 no-underline black">
          search
        </Link>
        {userId &&
          <div className="flex">
            <div className="ml1">|</div>
            <Link to={CREATE} className="ml1 no-underline black">
              submit
            </Link>
          </div>}
      </div>
      <div className="flex flex-fixed">
        {userId
          ? <div
            role="button"
            tabIndex={0}
            className="ml1 pointer black"
            onClick={() => {
              localStorage.removeItem(GC_USER_ID);
              localStorage.removeItem(GC_AUTH_TOKEN);
              props.history.push(`${NEWEST_PAGE}/1`);
            }}
          >
              logout
          </div>
          : <Link to={LOGIN} className="ml1 no-underline black">
              login
          </Link>}
      </div>
    </div>
  );
};

export default withRouter(Header);
