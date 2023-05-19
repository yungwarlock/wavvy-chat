import AgoraRTC, {IAgoraRTCClient, IAgoraRTCRemoteUser} from "agora-rtc-sdk-ng";

class VideoController {
  private readonly appId: string;
  private readonly token: string;
  private readonly channel: string;

  private readonly agora: IAgoraRTCClient;
  private localTrack: IAgoraRTCRemoteUser | null = null;

  private static joinSubscribers: Array<(user: IAgoraRTCRemoteUser) => void> = [];
  private static leaveSubscribers: Array<(user: IAgoraRTCRemoteUser) => void> = [];

  constructor(appId: string, channel: string, token: string) {
    this.appId = appId;
    this.token = token;
    this.channel = channel;
    this.agora = AgoraRTC.createClient({mode: "rtc", codec: "vp8"});

    this.agora.on("user-left", (user) => this.dispatchLeave(user));
    this.agora.on("user-published", (user, mediaType) => this.dispatchJoin(user, mediaType));
  }

  public async startSession(): Promise<IAgoraRTCRemoteUser> {
    const uid = await this.agora.join(this.appId, this.channel, this.token);
    const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();

    this.agora.publish([audioTrack, videoTrack]);

    this.localTrack = {uid, audioTrack, videoTrack} as unknown as IAgoraRTCRemoteUser;
    return this.localTrack;
  }

  public async stopSession() {
    if (this.localTrack) {
      this.localTrack.audioTrack?.stop();
      this.localTrack.videoTrack?.stop();
    }
    VideoController.joinSubscribers = [];
    VideoController.leaveSubscribers = [];
  }

  public async onUserJoin(subscriber: (user: IAgoraRTCRemoteUser) => void) {
    VideoController.joinSubscribers.push(subscriber);
  }

  public async onUserLeave(subscriber: (user: IAgoraRTCRemoteUser) => void) {
    VideoController.leaveSubscribers.push(subscriber);
  }

  private async dispatchJoin(user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") {
    await this.agora.subscribe(user, mediaType);

    if (mediaType === "video") {
      for (const subscriber of VideoController.joinSubscribers) {
        subscriber(user);
      }
    }

    if (mediaType === "audio") {
      user.audioTrack?.play();
    }
  }

  private dispatchLeave(user: IAgoraRTCRemoteUser) {
    for (const subscriber of VideoController.leaveSubscribers) {
      subscriber(user);
    }
  }
}

export {IAgoraRTCRemoteUser};

export default VideoController;
