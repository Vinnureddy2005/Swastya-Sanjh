import React, { useState, useEffect } from 'react';
import {
  StreamVideoClient,
  StreamCall,
  StreamVideo,
  CallingState
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import JoinMeeting from './JoinMeeting';
import MyUILayout from './MyUILayout';

const apiKey = 'mvqeysbyyhba';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTMxMDE3NiJ9.rxinm4OxtMjZ3JYMOKzH3YafG49j4qNdeXu7gQK5R68';
const userId = '1310176';
const user = {
  id: userId,
  name: 'Meghana',
  image: 'https://example.com/image.png'
};

const client = new StreamVideoClient({ apiKey, user, token });

const VideoCall = () => {
  const [call, setCall] = useState(null);
  const [callTerminated, setCallTerminated] = useState(false);
 
  const handleJoin = (wardId) => {
    const newCall = client.call('default', wardId);
    setCall(newCall);
  };

  useEffect(() => {
    if (call) {
      call.join({ create: true }).catch((error) => {
        console.error('Error joining call:', error);
      });

      call.on('stateChanged', () => {
        if (call.state === CallingState.LEFT) {
          setCallTerminated(true);
        }
      });
    }
  }, [call]);

  if (callTerminated) {
    return <div><h1>Your Consultation has Ended!!</h1></div>;
  }

  if (!call) {
    return <JoinMeeting onJoin={handleJoin} />;
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <MyUILayout call={call} onCallTerminated={() => setCallTerminated(true)} />
      </StreamCall>
    </StreamVideo>
  );
};

export default VideoCall;
