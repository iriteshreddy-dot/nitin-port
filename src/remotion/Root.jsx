import { Composition, registerRoot } from 'remotion';
import { LoadingComposition } from './LoadingComposition';

const RemotionRoot = () => (
  <Composition
    id="LoadingComposition"
    component={LoadingComposition}
    durationInFrames={210}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(RemotionRoot);
