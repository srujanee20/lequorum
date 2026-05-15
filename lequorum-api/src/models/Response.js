import { Model, DataTypes } from "sequelize";

export default (sequelize) => {

    class Response extends Model {}

    Response.init(
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
            userId: {
                field: 'user_id',
                type: DataTypes.UUID,
                allowNull: true
            },
            submittedAt: {
                field: 'submitted_at',
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            }
        },
        {
            sequelize,
            modelName: 'Response',
            tableName: 'responses',
            timestamps: true,
            underscored: true,
            freezeTableName: true
        }
    );

    return Response;
};