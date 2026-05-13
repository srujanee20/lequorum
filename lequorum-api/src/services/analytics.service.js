import { Poll, Question, Option, Response, Answer, sequelize } from '../models/init.js';

export const buildAnalytics = async pollId => {
    const poll = await Poll.findByPk(pollId, { attributes: ['id', 'title'] });
    const totalResponses = await Response.count({ where: { pollId } });

    const questions = await Question.findAll({
        where: { pollId },
        include: [{ model: Option, as: 'options' }],
        order: [
            ['order', 'ASC'],
            [{ model: Option, as: 'options' }, 'order', 'ASC']
        ]
    });

    const responseRows = await Response.findAll({
        where: { pollId },
        attributes: ['id'],
        raw: true
    });

    const responseIds = responseRows.map(row => row.id);

    let countMap = {};
    if (responseIds.length > 0) {
        const counts = await Answer.findAll({
            where: { responseId: responseIds },
            attributes: [
                'optionId',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['optionId'],
            raw: true
        });

        counts.forEach(({ optionId, count }) => {
            countMap[optionId] = parseInt(count, 10);
        });
    }

    const questionsData = questions.map(ques => {
        const options = ques.options.map(opt => {
            const count = countMap[opt.id] || 0;

            return {
                id: opt.id,
                text: opt.text,
                order: opt.order,
                count,
                percentage: totalResponses > 0 ? Math.round((count / totalResponses) * 1000) / 10 : 0
            };
        });

        return {
            id: ques.id,
            text: ques.text,
            isMandatory: ques.isMandatory,
            order: ques.order,
            totalAnswers: options.reduce((sum, opt) => sum + opt.count, 0),
            options
        };
    });

    return {
        pollId,
        title: poll.title,
        totalResponses,
        questions: questionsData
    };
};
