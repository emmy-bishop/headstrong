const Sequelize = require('sequelize');
require('dotenv').config();

const { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'mysql',
  logging: false
});

sequelize.authenticate()
  .then(() => console.info('Connected to the Database'))
  .catch((err) => console.warn('Cannot connect to db:\n', err));


const Countdown = sequelize.define('countdowns', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  username: {
    type: Sequelize.STRING,
  },
  event: {
    type: Sequelize.STRING,
  },
  date: {
    type: Sequelize.STRING,
  },
  task: {
    type: Sequelize.STRING,
  },
  stressors: {
    type: Sequelize.STRING,
  },
  story: {
    type: Sequelize.TEXT('long'),
  }
});
Countdown.sync({alter: true});

const addCountdown = async(username, event, date, task, stressors, story) => {
  try {
    const newCountdown = await Countdown.create({
      username,
      event,
      date,
      task,
      stressors,
      story
    });
    return newCountdown.save();
  } catch (err) {
    console.error('Failed to SAVE countdown to db:', err);
  }
};


const Entries = sequelize.define('entries', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },

  username: {
    type: Sequelize.STRING(50),
    allowNull: false
  },

  title: {
    type: Sequelize.STRING(100),
    allowNull: false
  },

  blog: {
    type: Sequelize.STRING(1000),
    allowNull: false
  },

  journalImage: {
    type: Sequelize.STRING(10000)
  },

  temp: {
    type: Sequelize.STRING
  },

  weatherDescription: {
    type: Sequelize.STRING
  },

  mood: {
    type: Sequelize.STRING
  },
  favSounds: {
    type: Sequelize.STRING
  }

});
Entries.sync();

const getAllJournals = (user) => {
  if (user) {
    return Entries.findAll({
      where: {
        username: user
      }
    });
  } else {
    return Entries.findAll();
  }
};

const deleteJournal = (body) => {
  const { id } = body;
  return Entries.destroy({
    where: {
      id: id
    }
  });
};

const addJournals = async(body, user) => {

  const { mood, title, blog, journalImage, temp, weatherDescription, favSounds } = body;

  const newEntry = await Entries.create({
    username: user,
    title: title,
    blog: blog,
    journalImage: journalImage,
    temp: temp,
    weatherDescription: weatherDescription,
    mood: mood
  });

  return newEntry.save();
};

const updateJournal = (body) => {
  const { username, title, blog, id, journalImage, favSounds } = body;
  //first object is what you want to change
  return Entries.update({
    username: username,
    blog: blog,
    title: title,
    journalImage: journalImage,
    favSounds: favSounds
  },
  {
    where: {
      id: id
    }
  });

};




module.exports = {
  getAllJournals,
  addJournals,
  deleteJournal,
  updateJournal,
  Entries,
  addCountdown,
  Countdown,
};
