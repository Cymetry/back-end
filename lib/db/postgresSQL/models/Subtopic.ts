import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    Column,
    CreatedAt,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
} from "sequelize-typescript";
import {Topic} from "./Topic";


@Table
export class Subtopic extends Model<Subtopic> {

    @PrimaryKey
    @AutoIncrement
    @Column
    public id!: number;

    @AllowNull(false)
    @Column
    public name!: string;


    @ForeignKey(() => Topic)
    @AllowNull(false)
    @Column
    public topicId!: number;

    @BelongsTo(() => Topic)
    public topic!: Topic;

    @CreatedAt
    public creationDate!: Date;

}
