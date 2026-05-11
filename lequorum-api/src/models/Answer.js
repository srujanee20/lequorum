import { Model, DataTypes} from "sequelize";

export default (sequelize) => {

    class Answer extends Model {

    }

    Answer.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            responseId: {
                field: "response_id",
                type: DataTypes.UUID,
                allowNull: false
            },
            questionId: {
                field: "question_id",
                type: DataTypes.UUID,
                allowNull: false
            },
            optionId: {
                field: "option_id",
                type: DataTypes.UUID,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: "Answer",
            tableName: "answers",
            timestamps: true,
            underscored: true,
            freezeTableName: true
        }
    );

    return Answer;
}