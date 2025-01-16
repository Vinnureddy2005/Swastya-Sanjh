import {
  CallingState,
  StreamCall,
  StreamVideo,
  StreamVideoClient
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import React, { useEffect, useState } from 'react';
import JoinMeeting from './JoinMeeting';
import MyUILayout from './MyUILayout';

const apiKey = 'your-api-key';
const token = 'your-token';
const userId = 'your-userId';
const user = {
  id: userId,
  name: 'your-name',
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
