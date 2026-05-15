import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
    class User extends Model {}

    User.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            username: {
                type: DataTypes.STRING(30),
                allowNull: false,
                unique: true
            },
            password: {
                field: 'password_hash',
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'User',
            tableName: 'users',
            timestamps: true,
            underscored: true,
            freezeTableName: true
        }
    );

    return User;
};