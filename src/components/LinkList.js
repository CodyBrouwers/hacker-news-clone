/* eslint no-undef: 0 */
/* eslint no-use-before-define: 0 */
import React, { Component } from 'react';
import { graphql, gql } from 'react-apollo';
import { GC_USER_ID, GC_AUTH_TOKEN, LINKS_PER_PAGE } from './../constants';
import Link from './Link';

class LinkList extends Component {
  componentDidMount() {
    this._subscribeToNewLinks();
    this._subscribeToNewVotes();
  }

  _updateCacheAfterVote = (store, createVote, linkId) => {
    const data = store.readQuery({ query: ALL_LINKS_QUERY });

    const votedLink = data.allLinks.find(link => link.id === linkId);
    votedLink.votes = createVote.link.votes;

    store.writeQuery({ query: ALL_LINKS_QUERY, data });
  };

  _updateCacheAfterVote = (store, createVote, linkId) => {
    const isNewestPage = this.props.location.pathname.includes('newest');
    const page = parseInt(this.props.match.params.page, 10);
    const skip = isNewestPage ? (page - 1) * LINKS_PER_PAGE : 0;
    const first = isNewestPage ? LINKS_PER_PAGE : 100;
    const orderBy = isNewestPage ? 'createdAt_DESC' : null;
    const data = store.readQuery({ query: ALL_LINKS_QUERY, variables: { first, skip, orderBy } });

    const votedLink = data.allLinks.find(link => link.id === linkId);
    votedLink.votes = createVote.link.votes;
    store.writeQuery({ query: ALL_LINKS_QUERY, data });
  };

  _subscribeToNewLinks = () => {
    this.props.allLinksQuery.subscribeToMore({
      document: gql`
        subscription {
          Link(filter: { mutation_in: [CREATED] }) {
            node {
              id
              url
              description
              createdAt
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
        }
      `,
      updateQuery: (previous, { subscriptionData }) => {
        const newAllLinks = [...previous.allLinks, subscriptionData.data.Link.node];
        return {
          ...previous,
          allLinks: newAllLinks,
        };
      },
    });
  };

  _subscribeToNewVotes = () => {
    this.props.allLinksQuery.subscribeToMore({
      document: gql`
        subscription {
          Vote(filter: { mutation_in: [CREATED] }) {
            node {
              id
              link {
                id
                url
                description
                createdAt
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
              user {
                id
              }
            }
          }
        }
      `,
      updateQuery: (previous, { subscriptionData }) => {
        const votedLink = subscriptionData.data.Vote.node.link;
        const votedLinkIndex = previous.allLinks.findIndex(link => link.id === votedLink.id);
        const newAllLinks = previous.allLinks.slice();
        newAllLinks[votedLinkIndex] = votedLink;
        return {
          ...previous,
          allLinks: newAllLinks,
        };
      },
    });
  };

  _getLinksToRender = (isNewestPage) => {
    const allLinksQuery = this.props.allLinksQuery;
    if (isNewestPage) {
      return allLinksQuery.allLinks;
    }
    const rankedLinks = allLinksQuery.allLinks.slice();
    rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length);
    return rankedLinks;
  };

  _nextPage = () => {
    const page = parseInt(this.props.match.params.page, 10);
    if (page <= this.props.allLinksQuery._allLinksMeta.count / LINKS_PER_PAGE) {
      const nextPage = page + 1;
      this.props.history.push(`/newest/${nextPage}`);
    }
  };

  _previousPage = () => {
    const page = parseInt(this.props.match.params.page, 10);
    if (page > 1) {
      const nextPage = page - 1;
      this.props.history.push(`/newest/${nextPage}`);
    }
  };

  render() {
    const allLinksQuery = this.props.allLinksQuery;
    const isNewestPage = this.props.location.pathname.includes('new');
    const linksToRender = this._getLinksToRender(isNewestPage);
    const userId = localStorage.getItem(GC_USER_ID);

    if (allLinksQuery && allLinksQuery.loading) {
      return <div>Loading</div>;
    }

    if (allLinksQuery && allLinksQuery.error) {
      return <div>Error</div>;
    }

    return (
      <div>
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
        {isNewestPage &&
          <div>
            <button onClick={() => this._previousPage()}>Previous</button>
            <button onClick={() => this._nextPage()}>Next</button>
          </div>}
      </div>
    );
  }
}

export const ALL_LINKS_QUERY = gql`
  query AllLinksQuery($first: Int, $skip: Int, $orderBy: LinkOrderBy) {
    allLinks(first: $first, skip: $skip, orderBy: $orderBy) {
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
    _allLinksMeta {
      count
    }
  }
`;

export default graphql(ALL_LINKS_QUERY, {
  name: 'allLinksQuery',
  options: (ownProps) => {
    const page = parseInt(ownProps.match.params.page, 10);
    const isNewestPage = ownProps.location.pathname.includes('newest');
    const skip = isNewestPage ? (page - 1) * LINKS_PER_PAGE : 0;
    const first = isNewestPage ? LINKS_PER_PAGE : 100;
    const orderBy = isNewestPage ? 'createdAt_DESC' : null;
    return {
      variables: { first, skip, orderBy },
    };
  },
})(LinkList);
