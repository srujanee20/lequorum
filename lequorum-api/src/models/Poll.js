import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {

    class Poll extends Model {
        id;
        creatorId;
        title;
        isAnonymous;
        expiresAt;
        isPublished;

        isExpired() {
            return Date.now() > this.expiresAt;
        }

        getState() {
            if (this.isPublished)
                return 'published';
            else if (this.isExpired())
                return 'expired';
            else
                return 'active';
        }
    }

    Poll.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            creatorId: {
                field: 'creator_id',
                type: DataTypes.UUID,
                allowNull: false
            },
            title: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            isAnonymous: {
                field: 'is_anonymous',
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            expiresAt: {
                field: 'expires_at',
                type: DataTypes.DATE,
                allowNull: false
            },
            isPublished: {
                field: 'is_published',
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        },
        {
            sequelize,
            modelName: 'Poll',
            tableName: 'polls',
            timestamps: true,
            underscored: true,
            freezeTableName: true
        },
    );

    return Poll;
}