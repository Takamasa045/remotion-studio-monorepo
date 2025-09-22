import {PlaylistMV} from './PlaylistMV';
import {videoConfig as config} from './project.config';

// Root.tsx 側の Composition で付与している初期値をこちらにも反映
const defaults = {
  bpm: 100,
  sliceText: 'PLAYLIST MV',
  words: [],
  wafuTitle: '',
  wafuSubtitle: '',
  sliceInSec: 0,
  sliceDurSec: 3,
  textEffect: 'sliceReveal',
};

export default {
  id: 'PlaylistMV',
  tags: ['mv'],
  component: PlaylistMV,
  config,
  defaults,
};
