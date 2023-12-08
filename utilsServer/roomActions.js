// Keep track of users connected to the server.
const users = [];
// Add a user to the socket so other users can see they are online
const addUser = async (userId, socketId) => {
  const user = users.find((user) => user.userId === userId);

  if (user && user.socketId === socketId) {
    return users;
  } else {
    if (user && user.socketId !== socketId) {
      await removeUser(user.socketId);
    }

    const newUser = { userId, socketId };

    users.push(newUser);

    return users;
  }
};

// Remove user from socket so they no longer are displayed online
const removeUser = async (socketId) => {
  const indexOf = users.map((user) => user.socketId).indexOf(socketId);

  await users.splice(indexOf, 1);

  return;
};

// Find a specified user who is connected to a socket
const findConnectedUser = (userId) =>
  users.find((user) => user.userId === userId);

module.exports = { addUser, removeUser, findConnectedUser };
