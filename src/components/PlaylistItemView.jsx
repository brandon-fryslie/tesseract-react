import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import PlaylistStore from '../stores/PlaylistStore';

@observer
class PlaylistItemView extends React.Component {

  render() {


    return (
      <Card className="mt-3 mb-3">
        <Card.Header>Scenes</Card.Header>
        <ListGroup as="ul">
          {
            this.props.playlist.items.map((item, idx) => (
              <ListGroup.Item
                action
                as="li"
                key={ idx }
                onClick={ dom => this.props.onItemClick(dom, item) }
                active={ this.props.activeScene && this.props.activeScene.id === item.scene.id }>
                { item.scene.displayName }
              </ListGroup.Item>
            ))
          }
        </ListGroup>
      </Card>
    );
  }
}

PlaylistItemView.propTypes = {
  playlist: PropTypes.object.isRequired,
  // TODO: change this when playlists are implemented on the backend, this needs
  //  to take a playlist item, not a scene, because a playlist can contain the
  //  same scene multiple times
  activeScene: PropTypes.object,
  onItemClick: PropTypes.func.isRequired,
};

export default PlaylistItemView;
