import { sequelize, Poll, User, Question, Option } from "../models/init.js";
import { logger } from '../configs/logger.config.js';

export const getMyPolls = async (req, res) => {
    try {
        const polls = await Poll.findAll({
            where: { creatorId: req.user.id },
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'title', 'isAnonymous', 'expiresAt', 'isPublished', 'createdAt']
        });

        logger.debug({ userId: req.user.id, count: polls.length }, 'Fetched user polls');
        res.json(polls);
    } catch (err) {
        logger.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getPollById = async (req, res) => {
    try {
        const poll = await Poll.findByPk(req.params.id, {
            include: [
                { model: User, as: 'creator', attributes: ['username'] },
                {
                    model: Question,
                    as: 'questions',
                    include: [{ model: Option, as: 'options', order: [['order', 'ASC']] }],
                    order: [['order', 'ASC']]
                }
            ]
        });

        if (!poll) {
            logger.warn({ pollId: req.params.id }, 'Fetch failed: Poll not found');
            return res.status(404).json({ error: 'Poll not found' });
        }

        const state = poll.getState();
        logger.debug({ pollId: poll.id, state }, 'Fetched poll details');
        res.json({ ...poll.toJSON(), state });
    } catch (err) {
        logger.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createPoll = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { title, isAnonymous, expiresAt, questions } = req.body;

        const poll = await Poll.create(
            { title, isAnonymous, expiresAt, creatorId: req.user.id },
            { transaction: transaction }
        );

        for (const [quesIdx, ques] of questions.entries()) {
            const question = await Question.create(
                { pollId: poll.id, text: ques.text, isMandatory: ques.isMandatory, order: quesIdx },
                { transaction: transaction }
            );

            for (const [optIdx, opt] of ques.options.entries()) {
                await Option.create(
                    { questionId: question.id, text: opt.text, order: optIdx },
                    { transaction: transaction }
                );
            }
        }

        await transaction.commit();

        const created = await Poll.findByPk(poll.id, {
            include: [{
                model: Question,
                as: 'questions',
                include: [{ model: Option, as: 'options' }]
            }]
        });

        logger.info({ pollId: poll.id, creatorId: req.user.id }, 'Poll created successfully');
        res.status(201).json(created);

    } catch (err) {
        await transaction.rollback();
        logger.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const publishPoll = async (req, res) => {
    try {
        const poll = await Poll.findByPk(req.params.id);
        if (!poll) {
            logger.warn({ pollId: req.params.id }, 'Publish failed: Poll not found');
            return res.status(404).json({ error: 'Poll not found' });
        }

        if (poll.creatorId !== req.user.id) {
            logger.warn({ pollId: poll.id, userId: req.user.id }, 'Publish failed: Forbidden');
            return res.status(403).json({ error: 'Forbidden' });
        }

        if (!poll.isExpired()) {
            logger.warn({ pollId: poll.id }, 'Publish failed: Cannot publish an active poll');
            return res.status(400).json({ error: 'Cannot publish an active poll' });
        }

        if (poll.isPublished) {
            logger.warn({ pollId: poll.id }, 'Publish failed: Already published');
            return res.status(400).json({ error: 'Already published' });
        }

        poll.isPublished = true;
        await poll.save();
        logger.info({ pollId: poll.id }, 'Poll published successfully');
        res.json({ message: 'Poll published successfully' });
    } catch (err) {
        logger.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deletePoll = async (req, res) => {
    try {
        const poll = await Poll.findByPk(req.params.id);
        if (!poll) {
            logger.warn({ pollId: req.params.id }, 'Delete failed: Poll not found');
            return res.status(404).json({ error: 'Poll not found' });
        }

        if (poll.creatorId !== req.user.id) {
            logger.warn({ pollId: poll.id, userId: req.user.id }, 'Delete failed: Forbidden');
            return res.status(403).json({ error: 'Forbidden' });
        }

        await poll.destroy();

        logger.info({ pollId: poll.id }, 'Poll deleted successfully');
        res.json({ message: 'Poll deleted' });
    } catch (err) {
        logger.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};