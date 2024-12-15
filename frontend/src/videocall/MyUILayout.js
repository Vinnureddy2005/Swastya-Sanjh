
import React, { useEffect } from 'react';
import {
  CallControls,
  CallingState,
  SpeakerLayout,

  useCallStateHooks
} from '@stream-io/video-react-sdk';

const MyUILayout = ({ call, onCallTerminated }) => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      onCallTerminated();
    }
  }, [callingState, onCallTerminated]);

  if (callingState !== CallingState.JOINED) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ backgroundColor: '#f0f0f0', padding: '20px' }}>
      <SpeakerLayout participantsBarPosition="bottom" />
      <CallControls />
    </div>
  );
};

export default MyUILayout;

