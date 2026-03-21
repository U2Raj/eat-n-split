import { Children, useState } from "react";
import { initialFriends } from "./Constants";


function Button({ onClickProp,children }) {
  return <button className="button" onClick={onClickProp}>
    {children}
  </button>;
}

export default function App() {
  const [isAddFriendFormOpen, setIsAddFriendFormOpen] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleAddFriend(newFriend) {
    setFriends((friends) => [...friends, newFriend]);
    setIsAddFriendFormOpen(false);
  }
  function handleFriendSelection(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setIsAddFriendFormOpen(false);
  }
  return (
    <div className="app">
      <div className="sidebar">

        <FriendList selectedFriend={selectedFriend} onFriendSelected={handleFriendSelection} friends={friends} />

        {isAddFriendFormOpen && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button onClickProp={() => setIsAddFriendFormOpen((open) => !open)}>
          {isAddFriendFormOpen ? "Close" : "Add Friend"}
        </Button>

      </div>

      {selectedFriend && <FormSplitBill selectedFriend={selectedFriend} />}

    </div>
  );
}

function FriendList({ selectedFriend, onFriendSelected, friends }) {

  return (
    <ul>
      {friends.map((friend) => (
        <Friend key={friend.id} friend={friend} selectedFriend={selectedFriend?.id === friend.id} onFriendSelected={onFriendSelected} />
      ))}
    </ul>
  );
}

function Friend({ friend, selectedFriend, onFriendSelected }) {
  return (
    <li className={selectedFriend ? "selected" : ""}>
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
      <Button onClickProp={() => onFriendSelected(friend)}>{selectedFriend ? "Close" : "Select"}</Button>
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

function FormSplitBill({selectedFriend}) {
  return (
    <form className="form-split-bill">
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>💰 Bill Value</label>
      <input type="text" />
      <label>🧍 Your Expense</label>
      <input type="text" />
      <label>👫 {`${selectedFriend.name}'s Expense`}</label>
      <input type="text" disabled />
      <label>💵 Who is paying the bill?</label>
      <select>
        <option value="you">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
