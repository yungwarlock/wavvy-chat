export interface User {
  id: string;
  amount: string;
}

export interface CallRequest {
  id: string;
  caller: User;
  recipent: User;
  status: "waiting" | "accepted" | "rejected";
  meetingInfo?: {
    channelId: string;
    token: string;
  }
}

