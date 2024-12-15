import React, { useState ,useEffect } from 'react';
import { StreamVideo, StreamCall } from '@stream-io/video-react-sdk';
import MyUILayout from './MyUILayout';

function Meeting({ call, client }) {
  const [callEnded, setCallEnded] = useState(false);
 

  useEffect(() => {
    if (call) {
      call.join({ create: true }).catch((error) => {
        console.error('Error joining call:', error);
      });

      call.on('call.ended', () => {
        setCallEnded(true);
      });
    }
  }, [call]);

  if (callEnded) {
    return <div>Our Consultation session has ended!</div>;
  }
  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <MyUILayout />
      </StreamCall>
    </StreamVideo>
  );
}

export default Meeting;
