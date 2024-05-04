"use server";
 
export const createRoom = async () => {
  const response = await fetch("https://api.huddle01.com/api/v1/create-room", {
    method: "POST",
    body: JSON.stringify({
      title: "Creator Room",
    }),
    headers: {
      "Content-type": "application/json",
      "x-api-key": "O2f8knlUEX4P4OI26SDArlbxmKCdsPuK"!,
    },
    cache: "no-cache",
  });
 
  const data = await response.json();
  const roomId = data.data.roomId;
  return roomId;
};