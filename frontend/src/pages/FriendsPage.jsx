import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import { CheckCircleIcon, UserPlusIcon, UsersIcon } from "lucide-react";

import FriendCard from "../components/FriendCard.jsx";
import UserCard from "../components/UserCard.jsx";
import NoFriendsFound from "../components/NoFriendsFound.jsx";

const FriendsPage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");

  const { data: friends = [], isLoading: loadingFriends, error: friendsError } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers, error: usersError } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs, error: requestsError } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  const filteredFriends = friends.filter(friend =>
    friend.fullName && friend.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-8">
        {/* HEADER WITH SEARCH */}
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Your Friends</h1>
              <p className="text-base-content/70 mt-2">
                Manage your connections and discover new language partners
              </p>
            </div>
            <Link to="/notifications" className="btn btn-outline btn-sm">
              <UsersIcon className="mr-2 size-4" />
              Friend Requests
            </Link>
          </div>

          {/* IMPROVED SEARCH BAR */}
          <div className="relative max-w-md">
            <div className="form-control">
              <div className="input-group input-group-lg">
                <input
                  type="text"
                  placeholder="Search friends by name..."
                  className="input input-bordered input-lg flex-1 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="btn btn-ghost btn-circle btn-sm mr-1"
                    onClick={() => setSearchTerm("")}
                    title="Clear search"
                  >
                    <span className="text-base-content/50 text-sm">✕</span>
                  </button>
                )}
              </div>
            </div>
            {searchTerm && (
              <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-base-200 rounded-lg shadow-lg z-10">
                <p className="text-sm text-base-content/70 px-2">
                  {filteredFriends.length} {filteredFriends.length === 1 ? 'friend' : 'friends'} found
                </p>
              </div>
            )}
          </div>
        </div>

        {/* FRIENDS SECTION */}
        {friendsError ? (
          <div className="alert alert-error">
            <span>Error loading friends: {friendsError.message}</span>
          </div>
        ) : loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : filteredFriends.length === 0 ? (
          searchTerm ? (
            <div className="card bg-base-200 p-8 text-center">
              <h3 className="font-semibold text-lg mb-2">No friends found</h3>
              <p className="text-base-content/70 mb-4">
                Try adjusting your search terms
              </p>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setSearchTerm("")}
              >
                Clear search
              </button>
            </div>
          ) : (
            <NoFriendsFound />
          )
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFriends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        {/* RECOMMENDED USERS SECTION */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meet New Learners</h2>
            <p className="text-base-content/70 mt-2">
              Discover perfect language exchange partners based on your profile
            </p>
          </div>

          {usersError ? (
            <div className="alert alert-error">
              <span>Error loading recommendations: {usersError.message}</span>
            </div>
          ) : loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-8 text-center">
              <h3 className="font-semibold text-lg mb-2">No recommendations available</h3>
              <p className="text-base-content/70">
                Check back later for new language partners!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                return (
                  <UserCard
                    key={user._id}
                    user={user}
                    actionLabel={hasRequestBeenSent ? "Request Sent" : "Send Friend Request"}
                    actionIcon={hasRequestBeenSent ? CheckCircleIcon : UserPlusIcon}
                    actionDisabled={hasRequestBeenSent || isPending}
                    onAction={() => sendRequestMutation(user._id)}
                  />
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default FriendsPage;
