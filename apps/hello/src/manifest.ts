import {Scene as HelloScene} from './Scene';

const config = {width: 1080, height: 1080, fps: 30, durationInFrames: 150};
const defaults = {text: 'Hello Remotion!', color: '#111111', speed: 1, delay: 0};

export default {
  id: 'HelloComp',
  tags: ['demo'],
  component: HelloScene,
  config,
  defaults,
};

