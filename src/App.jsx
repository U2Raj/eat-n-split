import { useState } from "react";
import { initialFriends } from "./Constants";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList />
      </div>
    </div>
  );
}

function FriendList() {
  const friends = initialFriends;

  return (
    <ul>
      {friends.map((friend) => (
        <Friend key={friend.id} friend={friend} />
      ))}
    </ul>
  );
}

function Friend({ friend }) {
  return <li>
  <img src={friend.image} alt={friend.name} />
  <h3>{friend.name}</h3>
 { friend.balance < 0 ? (
    <p className="red">You owe {friend.name} {Math.abs(friend.balance)}$</p>
  ) : friend.balance > 0 ? (
    <p className="green">{friend.name} owes you {friend.balance}$</p>
  ) : (
    <p>You and {friend.name} are even</p>
  ) } 
  <button className="button">Select</button>
  </li>;
}
