import { action, makeObservable } from 'mobx';
import BaseStore from './BaseStore';
import PlaylistModel, { IPlaylistData } from '../models/PlaylistModel';
import PlaylistItemModel, { IPlaylistItemData } from '../models/PlaylistItemModel';
import SceneStore from './SceneStore';

export default class PlaylistStore extends BaseStore<PlaylistModel> {
  sceneStore: SceneStore;

  constructor() {
    super();
    makeObservable(this);
    this.sceneStore = SceneStore.get();
  }

  getModelType() {
    return PlaylistModel;
  }

  // this can be generified, just getting it working for now
  @action
  addNewPlaylist(displayName: string, defaultDuration: number, items: PlaylistItemModel[] = []): void {
    this.addItem(new PlaylistModel(this.getNextId(), displayName, defaultDuration, items));
  }

  getNextId(): number {
    const ids = this.items.map(i => {
      const id = i.id;
      return typeof id === 'string' ? parseInt(id, 10) : id;
    }).sort((a, b) => a - b);

    const maxId = Math.max(...ids);
    if (Number.isNaN(maxId)) {
      throw new Error("[PlaylistStore] Got NaN when trying to find the next ID");
    }

    return maxId + 1;
  }

  // this is hacky and should not live here, or really work like this at all
  hydrateScenesOnPlaylists(playlists: any[]): void {
    playlists.forEach((playlist) => {
      const newItems = this.hydratePlaylistItems(playlist);
      // eslint-disable-next-line no-param-reassign
      playlist.items = newItems;
    });
  }

  hydratePlaylistItems(playlist: any): PlaylistItemModel[] {
    return playlist.items.map((item: IPlaylistItemData) => {
      const scene = this.sceneStore.find('id', item.sceneId);
      return new PlaylistItemModel(item.id, scene, item.duration);
    });
  }

  // We need to find the actual scene objects in the SceneStore for each playlist and attach them to the item
  @action
  refreshFromJS(arr: any[]): void {
    // hacky method to jam the SceneModel objects in
    this.hydrateScenesOnPlaylists(arr);

    super.refreshFromJS(arr);
  }
}
