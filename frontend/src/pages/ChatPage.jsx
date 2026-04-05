import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
    retry: false,
  });

  useEffect(() => {
    let active = true;
    let clientInstance = null;
    let channelInstance = null;

    const initChat = async () => {
      if (!tokenData?.token || !authUser || !targetUserId) return;

      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);
        clientInstance = client;

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        const channelId = [authUser._id, targetUserId].sort().join("-");
        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();
        channelInstance = currChannel;

        if (!active) return;
        setChatClient(client);
        setChannel(currChannel);
      } catch (chatError) {
        console.error("Error initializing chat:", chatError);
        setError("Could not connect to chat. Please refresh the page.");
        toast.error("Could not connect to chat. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    };

    initChat();

    return () => {
      active = false;
      if (channelInstance) {
        channelInstance.stopWatching().catch(() => {
          // ignore cleanup errors
        });
      }
      if (clientInstance) {
        clientInstance.disconnectUser().catch(() => {
          // ignore cleanup errors
        });
      }
    };
  }, [tokenData, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;
      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });
      toast.success("Video call link sent successfully!");
    }
  };

  if (loading) return <ChatLoader />;
  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-6 text-center">
        <p className="text-lg font-semibold mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary">
          Retry
        </button>
      </div>
    );
  }

  if (!chatClient || !channel) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-6 text-center">
        <p className="text-lg font-semibold mb-4">Chat is unavailable.</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary">
          Reload
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[93vh] md:min-h-[88vh] px-4 py-4 lg:px-6 lg:py-6">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative min-h-[72vh] rounded-3xl overflow-hidden bg-base-200 shadow-sm">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};
export default ChatPage;
