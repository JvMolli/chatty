import Sequelize from 'sequelize';
// initialize our database
const db = new Sequelize('chatty', null, null, {
  dialect: 'sqlite',
  storage: './chatty.sqlite',
  logging: true, // mark this true if you want to see logs
});
// define groups
const GroupModel = db.define('group', {
  name: { type: Sequelize.STRING },
  imageId: { type: Sequelize.INTEGER },
});
// define messages
const MessageModel = db.define('message', {
  text: { type: Sequelize.STRING },
});
// define users
const UserModel = db.define('user', {
  email: { type: Sequelize.STRING },
  username: { type: Sequelize.STRING },
  password: { type: Sequelize.STRING },
});

const ImageModel = db.define('image', {
  uri: { type: Sequelize.STRING },
});

// users belong to multiple groups
UserModel.belongsToMany(GroupModel, { through: 'GroupUser' });
// users belong to multiple users as friends
UserModel.belongsToMany(UserModel, { through: 'Friends', as: 'friends' });
// messages are sent from users
MessageModel.belongsTo(UserModel);
// messages are sent to groups
MessageModel.belongsTo(GroupModel);
// groups have multiple users
GroupModel.belongsToMany(UserModel, { through: 'GroupUser' });

GroupModel.belongsTo(ImageModel);

const Group = db.models.group;
const Message = db.models.message;
const User = db.models.user;
const Image = db.models.image;
export {
  db, Group, Message, User, Image,
};
