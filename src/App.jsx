import { Children, useState } from "react";
import { initialFriends } from "./Constants";


function Button({ onClickProp,children }) {
  return <button className="button" onClick={onClickProp}>
    {children}
  </button>;
}

export default function App() {
  const [isAddFriendFormOpen, setIsAddFriendFormOpen] = useState(false);
  const [isFriendSelected, setIsFriendSelected] = useState(false);
  const [friends, setFriends] = useState(initialFriends);

  function handleAddFriend(newFriend) {
    setFriends((friends) => [...friends, newFriend]);
    setIsAddFriendFormOpen(false);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList isFriendSelected={isFriendSelected} onFriendSelected={setIsFriendSelected} friends={friends} />
        {isAddFriendFormOpen && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClickProp={() => setIsAddFriendFormOpen((open) => !open)}>
          {isAddFriendFormOpen ? "Close" : "Add Friend"}
        </Button>
      </div>
      {isFriendSelected && <FormSplitBill />}
    </div>
  );
}

function FriendList({ isFriendSelected, onFriendSelected, friends }) {

  return (
    <ul>
      {friends.map((friend) => (
        <Friend key={friend.id} friend={friend} isFriendSelected={isFriendSelected} onFriendSelected={onFriendSelected} />
      ))}
    </ul>
  );
}

function Friend({ friend, isFriendSelected, onFriendSelected }) {
  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 ? (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      ) : friend.balance > 0 ? (
        <p className="green">
          {friend.name} owes you {friend.balance}$
        </p>
      ) : (
        <p>You and {friend.name} are even</p>
      )}
      <Button onClickProp={() => onFriendSelected(true)}>Select</Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [friendName, setFriendName] = useState("");
  const [friendImage, setFriendImage] = useState("https://i.pravatar.cc/48");
  
  function handleSubmit(e) {
    e.preventDefault(); //To prevent the page reload
    if (!friendName || !friendImage) return;

    const id = crypto.randomUUID(); //To generate a unique id for the new friend
    const newFriend = {
      id,
      name: friendName,
      image: `https://i.pravatar.cc/48?u=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);
    setFriendName("");
    setFriendImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend">
      <label>👫 Friend Name</label>
      <input type="text" value={friendName} onChange={(e) => setFriendName(e.target.value)} />
      <label>🌆 Image URL</label>
      <input type="text" value={friendImage} onChange={(e) => setFriendImage(e.target.value)} />
      <Button onClickProp={handleSubmit}>Add</Button>
    </form>
  );
}

function FormSplitBill() {
  return (
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
      <Button>Split Bill</Button>
    </form>
  );
}
