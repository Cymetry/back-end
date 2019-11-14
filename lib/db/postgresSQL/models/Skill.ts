import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    Column,
    CreatedAt,
    ForeignKey,
    Model,
    PrimaryKey, Table
} from "sequelize-typescript";
import {Subtopic} from "./Subtopic";

@Table
export class Skill extends Model<Skill> {

    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @AllowNull(false)
    @Column
    name: string;

    @ForeignKey(() => Subtopic)
    @AllowNull(false)
    @Column
    subtopicId!: number;

    @BelongsTo(() => Subtopic)
    subtopic: Subtopic;

    @CreatedAt
    creationDate: Date;

}