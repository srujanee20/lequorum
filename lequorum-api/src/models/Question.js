import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
    class Question extends Model {
    }

    Question.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            pollId: {
                field: 'poll_id',
                type: DataTypes.UUID,
                allowNull: false
            },
            text: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            isMandatory: {
                field: 'is_mandatory',
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            order: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            }
        },
        {
            sequelize,
            modelName: 'Question',
            tableName: 'questions',
            timestamps: true,
            underscored: true,
            freezeTableName: true
        }
    );

    return Question;
}