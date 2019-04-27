// Provides a bunch of mock data to create stores

import PlaylistItemModel from '../models/PlaylistItemModel';

class MockData {

  static getClipStoreData() {
    return [
      {
        id: '1',
        displayName: 'Color Wash',
        clipId: 'color_wash',
        controls: [
          {
            displayName: 'Hue',
            type: 'knob',
            defaultValue: 50,
          },
          {
            displayName: 'Saturation',
            type: 'knob',
            defaultValue: 50,
          },
          {
            displayName: 'Brightness',
            type: 'knob',
            defaultValue: 50,
          },
        ],
      },
      {
        id: '2',
        displayName: 'Animated Gif',
        clipId: 'animated_gif',
        controls: [
          {
            displayName: 'Image',
            type: 'fileInput',
            defaultValue: 'sonic.gif',
          },
          {
            displayName: 'Scale',
            type: 'knob',
            defaultValue: 50,
          },
          {
            displayName: 'Speed',
            type: 'knob',
            defaultValue: 50,
          },
          {
            displayName: 'Position',
            type: 'twoAxisSlider',
            defaultValue: 50,
          },
        ],
      },
      {
        id: '3',
        displayName: 'Image Scroll',
        clipId: 'image_scroll',
        controls: [
          {
            displayName: 'Image',
            type: 'fileInput',
            defaultValue: 'yoshi.png',
          },
          {
            displayName: 'Scale',
            type: 'knob',
            defaultValue: 50,
          },
          {
            displayName: 'Position',
            type: 'twoAxisSlider',
            defaultValue: 50,
          },
          {
            displayName: 'X Scroll',
            type: 'slider',
            defaultValue: 50,
          },
          {
            displayName: 'Y Scroll',
            type: 'slider',
            defaultValue: 50,
          },
        ],
      },
      {
        id: '4',
        displayName: 'Text Scroll',
        clipId: 'text_scroll',
        controls: [
          {
            displayName: 'Scale',
            type: 'knob',
            defaultValue: 50,
          },
          {
            displayName: 'Hue',
            type: 'knob',
            defaultValue: 50,
          },
          {
            displayName: 'Box Width',
            type: 'knob',
            defaultValue: 50,
          },
          {
            displayName: 'Position',
            type: 'twoAxisSlider',
            defaultValue: 50,
          },
          {
            displayName: 'X Scroll',
            type: 'slider',
            defaultValue: 50,
          },
          {
            displayName: 'Y Scroll',
            type: 'slider',
            defaultValue: 50,
          },
          {
            displayName: 'Text Input',
            type: 'textInput',
            defaultValue: 50,
          },
        ],
      },
      {
        id: '5',
        displayName: 'Solid Color',
        clipId: 'solid_color',
        controls: [
          {
            displayName: 'Hue',
            type: 'knob',
            defaultValue: 50,
          },
          {
            displayName: 'Saturation',
            type: 'knob',
            defaultValue: 50,
          },
          {
            displayName: 'Brightness',
            type: 'knob',
            defaultValue: 50,
          },
        ],
      },
    ];
  }

  static getPlaylistStoreData(sceneStore) {
    return [
      {
        id: '1',
        displayName: 'Rad Playlist',
        items: [
          PlaylistItemModel.fromJS({ scene: sceneStore.findScene('Color'), duration: 234 }),
          PlaylistItemModel.fromJS({ scene: sceneStore.findScene('Text Scroll'), duration: 53 }),
          PlaylistItemModel.fromJS({ scene: sceneStore.findScene('Color'), duration: 123 }),
          PlaylistItemModel.fromJS({ scene: sceneStore.findScene('Colored Image Scroll'), duration: 533 }),
          PlaylistItemModel.fromJS({ scene: sceneStore.findScene('Color'), duration: 132 }),
          PlaylistItemModel.fromJS({ scene: sceneStore.findScene('Color Gif'), duration: 54 }),
        ],
      },
      {
        id: '2',
        displayName: 'Image Playlist',
        items: [
          PlaylistItemModel.fromJS({ scene: sceneStore.findScene('Colored Image Scroll'), duration: 56 }),
          PlaylistItemModel.fromJS({ scene: sceneStore.findScene('Color Gif'), duration: 234 }),
          PlaylistItemModel.fromJS({ scene: sceneStore.findScene('Colored Image Scroll'), duration: 111 }),
          PlaylistItemModel.fromJS({ scene: sceneStore.findScene('Color Gif'), duration: 564 }),
          PlaylistItemModel.fromJS({ scene: sceneStore.findScene('Colored Image Scroll'), duration: 755 }),
          PlaylistItemModel.fromJS({ scene: sceneStore.findScene('Color Gif'), duration: 554 }),
        ],
      },
    ];
  }

  static getSceneStoreData(clipStore) {
    return [
      {
        id: '1',
        displayName: 'Color',
        channel1Clip: clipStore.findClip('solid_color'),
        channel2Clip: clipStore.findClip('color_wash'),
      },
      {
        id: '2',
        displayName: 'Text Scroll',
        channel1Clip: clipStore.findClip('solid_color'),
        channel2Clip: clipStore.findClip('color_wash'),
      },
      {
        id: '3',
        displayName: 'Colored Image Scroll',
        channel1Clip: clipStore.findClip('image_scroll'),
        channel2Clip: clipStore.findClip('color_wash'),
      },
      {
        id: '4',
        displayName: 'Color Gif',
        channel1Clip: clipStore.findClip('solid_color'),
        channel2Clip: clipStore.findClip('animated_gif'),
      },
    ];
  }
}

export default MockData;
