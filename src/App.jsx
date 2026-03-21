import { Children, useState } from "react";
import { initialFriends } from "./Constants";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList />
        <FormAddFriend />
        <Button>Add Friend</Button>
      </div>
      <FormSplitBill />
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
  <Button>Select</Button>
  </li>;
}

function Button({ children }) {
  return (<button className="button">{children}</button>)
}

function FormAddFriend() {
  return (
  <form className="form-add-friend">
    <label>👫 Friend Name</label>
    <input type="text" />
    <label>🌆 Image URL</label>
    <input type="text" />
  </form>
  )
}

function FormSplitBill() {
  return(
  <form className="form-split-bill">
   <h2>Split a bill with X</h2>
    <label>💰 Bill Value</label>
    <input type="text" />
    <label>🧍 Your Expense</label>
    <input type="text" />
    <label>👫 {`X's Expense`}</label>
    <input type="text" disabled />
    <label>💵 Who is paying the bill?</label>
    <select>
      <option value="you">You</option>
      <option value="friend">X</option>
    </select>
  </form>
  )
}