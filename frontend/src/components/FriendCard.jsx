import UserCard from "./UserCard";

const FriendCard = ({ friend }) => {
  return (
    <UserCard
      user={friend}
      linkTo={`/chat/${friend._id}`}
      badgeLabel="Message"
    />
  );
};

export default FriendCard;
