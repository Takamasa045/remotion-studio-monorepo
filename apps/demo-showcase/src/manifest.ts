import React from 'react';
import {AbsoluteFill} from 'remotion';

const Placeholder: React.FC = () =>
  React.createElement(
    AbsoluteFill,
    {
      style: {
        backgroundColor: '#111',
        color: 'white',
        fontSize: 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
    'DemoShowcase'
  );

const config = {width: 1920, height: 1080, fps: 30, durationInFrames: 300};
const defaults = {};

export default {
  id: 'DemoShowcase',
  tags: ['demo', 'showcase'],
  component: Placeholder,
  config,
  defaults,
};
