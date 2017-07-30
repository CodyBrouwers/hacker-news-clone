/* eslint no-undef: 0 */
/* eslint no-use-before-define: 0 */
import React, { Component } from 'react';
import { graphql, gql } from 'react-apollo';
import Link from './Link';

class LinkList extends Component {
  _updateCacheAfterVote = (store, createVote, linkId) => {
    const data = store.readQuery({ query: ALL_LINKS_QUERY });

    const votedLink = data.allLinks.find(link => link.id === linkId);
    votedLink.votes = createVote.link.votes;

    store.writeQuery({ query: ALL_LINKS_QUERY, data });
  };

  render() {
    const allLinksQuery = this.props.allLinksQuery;
    if (allLinksQuery && allLinksQuery.loading) {
      return <div>Loading</div>;
    }

    if (allLinksQuery && allLinksQuery.error) {
      return <div>Error</div>;
    }

    const linksToRender = allLinksQuery.allLinks;

    return (
      <div>
        {linksToRender.map((link, index) =>
          (<Link
            key={link.id}
            updateStoreAfterVote={this._updateCacheAfterVote}
            index={index}
            link={link}
          />),
        )}
      </div>
    );
  }
}

export const ALL_LINKS_QUERY = gql`
  query AllLinksQuery {
    allLinks {
      id
      createdAt
      url
      description
      postedBy {
        id
        name
      }
      votes {
        id
        user {
          id
        }
      }
    }
  }
`;

export default graphql(ALL_LINKS_QUERY, { name: 'allLinksQuery' })(LinkList);
