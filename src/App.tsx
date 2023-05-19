import React from "react";
import VideoController, {IAgoraRTCRemoteUser} from "./video";

const APP_ID = import.meta.env.VITE_AGORA_APP_ID;
const CHANNEL = import.meta.env.VITE_AGORA_CHANNEL;
const TOKEN = import.meta.env.VITE_AGORA_TEMP_TOKEN;

const VideoRoom = (): JSX.Element => {
  const [users, setUsers] = React.useState<IAgoraRTCRemoteUser[]>([]);
  const [localTrack, setLocalTrack] = React.useState<IAgoraRTCRemoteUser | null>();

  const controller = React.useMemo(
    () => new VideoController(APP_ID, CHANNEL, TOKEN),
    []
  );

  React.useEffect(() => {
    controller
      .startSession()
      .then((localTrack) => setLocalTrack(localTrack));

    controller.onUserJoin((user) => {
      setUsers((previousUsers) => [...previousUsers, user]);
    });

    controller.onUserLeave((user) => {
      setUsers((previousUsers) =>
        previousUsers.filter((u) => u.uid !== user.uid)
      );
    });

    return () => {
      controller.stopSession();
    };
  }, []);

  return (
    <div style={{display: "flex", justifyContent: "center"}}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 200px)",
        }}
      >
        {localTrack && <VideoPlayer user={localTrack} />}
        {users.map((user) => (
          <VideoPlayer key={user.uid} user={user} />
        ))}
      </div>
    </div>
  );

};

interface VideoPlayerProps {
  user: IAgoraRTCRemoteUser;
}

export const VideoPlayer = ({user}: VideoPlayerProps) => {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    user.videoTrack?.play(ref.current as HTMLDivElement, {
      mirror: false,
    });
  }, []);

  return (
    <div>
      Uid: {user.uid}
      <div
        ref={ref}
        style={{width: "200px", height: "200px"}}
      ></div>
    </div>
  );
};
const App = (): JSX.Element => {
  const [joined, setJoined] = React.useState(false);

  return (
    <div className="App">
      <h1>Virtual Call</h1>

      {!joined && (
        <button onClick={() => setJoined(true)}>
          Join Room
        </button>
      )}

      {joined && <VideoRoom />}
    </div>
  );
};


export default App;
