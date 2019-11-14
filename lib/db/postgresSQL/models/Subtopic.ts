import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    Column,
    CreatedAt,
    ForeignKey,
    Model,
    PrimaryKey,
    Table
} from "sequelize-typescript";
import {Topic} from "./Topic";


@Table
export class Subtopic extends Model<Subtopic> {

    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @AllowNull(false)
    @Column
    name: string;


    @ForeignKey(() => Topic)
    @AllowNull(false)
    @Column
    topicId: number;

    @BelongsTo(() => Topic)
    topic: Topic;

    @CreatedAt
    creationDate: Date;

}