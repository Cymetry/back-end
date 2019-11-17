import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    Column,
    CreatedAt,
    ForeignKey,
    Model,
    PrimaryKey, Table,
} from "sequelize-typescript";
import {Subtopic} from "./Subtopic";

@Table
export class Skill extends Model<Skill> {

    @PrimaryKey
    @AutoIncrement
    @Column
    public id: number;

    @AllowNull(false)
    @Column
    public name: string;

    @ForeignKey(() => Subtopic)
    @AllowNull(false)
    @Column
    public subtopicId!: number;

    @BelongsTo(() => Subtopic)
    public subtopic: Subtopic;

    @CreatedAt
    public creationDate: Date;

}
