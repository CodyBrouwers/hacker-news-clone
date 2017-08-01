/* eslint no-undef: 0 */
/* eslint no-use-before-define: 0 */
import React, { Component } from 'react';
import { gql, withApollo } from 'react-apollo';
import Link from './Link';

class Search extends Component {
  state = {
    links: [],
    searchText: '',
  };

  _executeSearch = async () => {
    const { searchText } = this.state;
    const result = await this.props.client.query({
      query: ALL_LINKS_SEARCH_QUERY,
      variables: { searchText },
    });
    const links = result.data.allLinks;
    this.setState({ links });
  };

  render() {
    return (
      <div>
        <div>
          <input type="text" onChange={e => this.setState({ searchText: e.target.value })} />
          <button onClick={() => this._executeSearch()}>Search</button>
        </div>
        {this.state.links.map((link, index) => <Link key={link.id} link={link} index={index} />)}
      </div>
    );
  }
}

const ALL_LINKS_SEARCH_QUERY = gql`
  query AllLinksSearchQuery($searchText: String!) {
    allLinks(
      filter: { OR: [{ url_contains: $searchText }, { description_contains: $searchText }] }
    ) {
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
`;

export default withApollo(Search);
