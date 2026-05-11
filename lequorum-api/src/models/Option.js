import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {

    class Option extends Model {

    }

    Option.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            questionId: {
                field: 'question_id',
                type: DataTypes.UUID,
                allowNull: false
            },
            text: {
                type: DataTypes.STRING(200),
                allowNull: false
            },
            order: {
                type: DataTypes.INTEGER,
                allowNull: false,
                default: 0
            }
        },
        {
            sequelize,
            modelName: 'Option',
            tableName: 'options',
            timestamps: false,
            underscored: true,
            freezeTableName: true,
        }
    );

    return Option;
}