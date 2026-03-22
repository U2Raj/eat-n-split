import { useState } from "react";
import { initialFriends } from "./Constants";
import {
  Users,
  Image,
  Wallet,
  User,
  UserCheck,
  CreditCard,
  UserPlus,
  X,
  CheckCircle2,
  ArrowLeftRight,
} from "lucide-react";

function Button({ onClickProp, children }) {
  return (
    <button className="button" onClick={onClickProp}>
      {children}
    </button>
  );
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

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          selectedFriend={selectedFriend}
          onFriendSelected={handleFriendSelection}
          friends={friends}
        />

        {isAddFriendFormOpen && (
          <FormAddFriend onAddFriend={handleAddFriend} />
        )}

        <Button
          onClickProp={() => setIsAddFriendFormOpen((open) => !open)}
        >
          {isAddFriendFormOpen ? (
            <>
              <X size={14} strokeWidth={2.5} />
              Close
            </>
          ) : (
            <>
              <UserPlus size={14} strokeWidth={2.5} />
              Add Friend
            </>
          )}
        </Button>
      </div>

      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendList({ selectedFriend, onFriendSelected, friends }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          key={friend.id}
          friend={friend}
          selectedFriend={selectedFriend?.id === friend.id}
          onFriendSelected={onFriendSelected}
        />
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
          You owe {friend.name} ₨ {Math.abs(friend.balance)}
        </p>
      ) : friend.balance > 0 ? (
        <p className="green">
          {friend.name} owes you ₨ {friend.balance}
        </p>
      ) : (
        <p className="neutral">You and {friend.name} are even</p>
      )}

      <Button onClickProp={() => onFriendSelected(friend)}>
        {selectedFriend ? (
          <>
            <X size={13} strokeWidth={2.5} />
            Close
          </>
        ) : (
          <>
            <CheckCircle2 size={13} strokeWidth={2.5} />
            Select
          </>
        )}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [friendName, setFriendName] = useState("");
  const [friendImage, setFriendImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();
    if (!friendName || !friendImage) return;

    const id = crypto.randomUUID();
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
      <label>
        <User size={15} strokeWidth={2} />
        Friend Name
      </label>
      <input
        type="text"
        value={friendName}
        onChange={(e) => setFriendName(e.target.value)}
        placeholder="e.g. Sarah"
      />

      <label>
        <Image size={15} strokeWidth={2} />
        Image URL
      </label>
      <input
        type="text"
        value={friendImage}
        onChange={(e) => setFriendImage(e.target.value)}
      />

      <Button onClickProp={handleSubmit}>
        <UserPlus size={14} strokeWidth={2.5} />
        Add
      </Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [billValue, setBillValue] = useState("");
  const [userExpense, setUserExpense] = useState("");
  const friendExpense = billValue ? billValue - userExpense : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();
    if (!billValue || !userExpense) return;
    onSplitBill(whoIsPaying === "user" ? friendExpense : -userExpense);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>
        <ArrowLeftRight size={20} strokeWidth={2} />
        Split a bill with {selectedFriend.name}
      </h2>

      <label>
        <Wallet size={15} strokeWidth={2} />
        Bill Value
      </label>
      <input
        type="number"
        value={billValue}
        onChange={(e) => setBillValue(Number(e.target.value))}
        placeholder="0"
      />

      <label>
        <User size={15} strokeWidth={2} />
        Your Expense
      </label>
      <input
        type="number"
        value={userExpense}
        onChange={(e) =>
          setUserExpense(
            Number(e.target.value) > billValue
              ? userExpense
              : Number(e.target.value)
          )
        }
        placeholder="0"
      />

      <label>
        <Users size={15} strokeWidth={2} />
        {selectedFriend.name}'s Expense
      </label>
      <input type="number" value={friendExpense} disabled />

      <label>
        <CreditCard size={15} strokeWidth={2} />
        Who is paying?
      </label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>
        <ArrowLeftRight size={14} strokeWidth={2.5} />
        Split Bill
      </Button>
    </form>
  );
}