import { sequelize, Poll, Question, Response, Answer } from '../models/init.js';
import { getIo } from '../configs/socket.config.js';
import { buildAnalytics } from '../services/analytics.service.js';
import { SocketEvents } from '../common/constants.js';
import { logger } from '../configs/logger.config.js';

export const submitResponse = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const pollId = req.params.id;
        const { answers } = req.body;
        const userId = req.user ? req.user.id : null;

        const poll = await Poll.findByPk(pollId);

        if (!poll) {
            logger.warn({ pollId }, 'Response failed: Poll not found');
            return res.status(404).json({ error: 'Poll not found' });
        }

        if (poll.isPublished) {
            await transaction.rollback();

            logger.warn({ pollId }, 'Response failed: Poll is closed');
            return res.status(403).json({ error: 'This poll is closed' });
        }
        if (poll.isExpired()) {
            await transaction.rollback();

            logger.warn({ pollId }, 'Response failed: Poll has expired');
            return res.status(410).json({ error: 'This poll has expired' });
        }

        if (!poll.isAnonymous && !userId) {
            logger.warn({ pollId }, 'Response failed: Authentication required');
            return res.status(401).json({ error: 'Authentication required for this poll' });
        }

        const questions = await Question.findAll({ where: { pollId } });
        const mandatoryQuestionIds = questions.filter(question => question.isMandatory)
            .map(question => question.id);

        const answeredQuestionIds = Object.keys(answers);

        const missing = mandatoryQuestionIds.filter(id => !answeredQuestionIds.includes(id));
        if (missing.length > 0) {
            await transaction.rollback();

            logger.warn({ pollId, missing }, 'Response failed: Missing mandatory questions');
            return res.status(422).json({
                error: 'Please answer all mandatory questions',
                missing
            });
        }

        const validQuestionIds = new Set(questions.map(q => q.id));
        for (const qid of answeredQuestionIds) {
            if (!validQuestionIds.has(qid)) {
                await transaction.rollback();

                logger.warn({ pollId, qid }, 'Response failed: Invalid question ID');
                return res.status(422).json({ error: `Invalid question id: ${qid}` });
            }
        }

        const response = await Response.create(
            { pollId, userId },
            { transaction }
        );

        const answerRows = Object.entries(answers).map(([questionId, optionId]) => ({
            responseId: response.id,
            questionId,
            optionId
        }));

        await Answer.bulkCreate(answerRows, { transaction });

        await transaction.commit();

        try {
            const io = getIo();
            const analytics = await buildAnalytics(pollId);
            io.to(pollId).emit(SocketEvents.UPDATE_ANALYTICS, analytics);
            io.to(pollId).emit(SocketEvents.UPDATE_COUNT, { total: analytics.totalResponses });
        } catch (socketErr) {
            logger.error(socketErr, 'Failed to emit socket events for poll updates');
        }

        logger.info({ pollId, userId, responseId: response.id }, 'Response submitted successfully');
        res.status(201).json({ message: 'Response submitted successfully' });
    } catch (err) {
        await transaction.rollback();

        logger.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
