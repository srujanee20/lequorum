import sequelize from "../configs/database.config.js";

import initUser from './User.js';
import initPoll from './Poll.js';
import initQuestion from './Question.js';
import initOption from './Option.js';
import initResponse from './Response.js';
import initAnswer from './Answer.js';

const User = initUser(sequelize);
const Poll = initPoll(sequelize);
const Question = initQuestion(sequelize);
const Option = initOption(sequelize);
const Response = initResponse(sequelize);
const Answer = initAnswer(sequelize);

User.hasMany(Poll, { foreignKey: 'creatorId', as: 'polls', onDelete: 'CASCADE' });
Poll.belongsTo(User, { foreignKey: 'creatorId', as: 'creator' });

Poll.hasMany(Question, { foreignKey: 'pollId', as: 'questions', onDelete: 'CASCADE' });
Question.belongsTo(Poll, { foreignKey: 'pollId' }); // FIXED TYPO

Question.hasMany(Option, { foreignKey: 'questionId', as: 'options', onDelete: 'CASCADE' });
Option.belongsTo(Question, { foreignKey: 'questionId' });

Poll.hasMany(Response, { foreignKey: 'pollId', as: 'responses', onDelete: 'CASCADE' }); // ADDED CASCADE
Response.belongsTo(Poll, { foreignKey: 'pollId' });

User.hasMany(Response, { foreignKey: 'userId', as: 'userResponses', onDelete: 'CASCADE' }); // ADDED CASCADE (or SET NULL)
Response.belongsTo(User, { foreignKey: 'userId', as: 'respondent' });

Response.hasMany(Answer, { foreignKey: 'responseId', as: 'answers', onDelete: 'CASCADE' });
Answer.belongsTo(Response, { foreignKey: 'responseId' });

Answer.belongsTo(Question, { foreignKey: 'questionId' });
Answer.belongsTo(Option, { foreignKey: 'optionId' });

export default { User, Poll, Question, Option, Response, Answer };