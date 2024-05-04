'use client'
import React, { useState } from 'react';
import { AccessToken, Role } from "@huddle01/server-sdk/auth";
import { createRoom } from "./roomCreate";
import { useRoom, useLocalVideo, usePeerIds, useRemoteVideo } from '@huddle01/react/hooks';
import { Video } from '@huddle01/react/components';

interface RemotePeerProps {
  peerId: string;
}

const RemotePeer: React.FC<RemotePeerProps> = ({ peerId }) => {
  const { stream: videoStream } = useRemoteVideo({ peerId });

  return (
    <div>
      {videoStream && <Video stream={videoStream}></Video>}
    </div>
  );
}

const Home: React.FC = () => {
  const [roomId, setRoomId] = useState("");
  const [token, setToken] = useState("");
  const [inputValue, setInputValue] = useState('');

  const { joinRoom, leaveRoom } = useRoom({
    onJoin: () => { console.log('Joined the room'); },
    onLeave: () => { console.log('Left the room'); },
  });

  const { enableVideo, disableVideo, isVideoOn } = useLocalVideo();
  let { peerIds } = usePeerIds();

  console.log(peerIds)
  async function genAccessToken(roomId: string, roles: Role) {
    const accessToken = new AccessToken({
      apiKey: "O2f8knlUEX4P4OI26SDArlbxmKCdsPuK"!,
      roomId: roomId,
      role: roles,
      permissions: {
        admin: true,
        canConsume: true,
        canProduce: true,
        canProduceSources: {
          cam: true,
          mic: true,
          screen: true,
        },
        canRecvData: true,
        canSendData: true,
        canUpdateMetadata: true,
      }
    });

    try {
      const token = await accessToken.toJwt();
      console.log(token);
      setToken(token);
    } catch (error) {
      console.error("Error occurred while getting token:", error);
    }
  }

  async function genRoomId() {
    const roomId = await createRoom();
    setRoomId(roomId as string);
    console.log("Room ID generated:", roomId);
  }

  async function joinAsHost() {
    await genAccessToken(inputValue, Role.HOST);
    console.log("Joining as host...");
    await joinRoom({
      roomId: inputValue,
      token: token
    });
    
  }

  async function joinAsCoHost() {
    
    await genAccessToken(inputValue, Role.CO_HOST);
    console.log("Joining as co-host...");
    await joinRoom({
      roomId: inputValue,
      token: token
    });
    
  }

  function leaveTheRoom() {
    leaveRoom();
    console.log("Leaving room...");
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
  }

  return (

  <div className="bg-gradient-to-b from-gray-200 to-gray-400 min-h-screen flex items-center justify-center">
  <div className="flex justify-between w-full max-w-screen-lg">
    <div className="flex flex-col items-start space-y-4">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={genRoomId}>Generate Room ID</button>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => console.log("Room ID:", roomId)}>Show Room ID</button>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className="border rounded px-2 py-1"
        placeholder="Enter Room ID"
      />
      <div className="flex space-x-4">
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={joinAsHost}>Join as Host</button>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={joinAsCoHost}>Join as Co-host</button>
      </div>
      <button className={`bg-${isVideoOn ? 'red' : 'green'}-500 hover:bg-${isVideoOn ? 'red' : 'green'}-700 text-white font-bold py-2 px-4 rounded`} onClick={() => (isVideoOn ? disableVideo() : enableVideo())}>
        {isVideoOn ? 'Disable Video' : 'Enable Video'}
      </button>
      <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={leaveTheRoom}>Leave Room</button>
    </div>
    <div className="flex flex-wrap justify-center">
      {peerIds != null && peerIds.length > 0 ? (
        peerIds.map(peerId => (
          <RemotePeer peerId={peerId}  />
        ))
      ) : (
        <div className="w-48 h-48 flex items-center justify-center bg-gray-200">No videos turned on</div>
      )}
    </div>
  </div>
</div>

  );
}

export default Home;
