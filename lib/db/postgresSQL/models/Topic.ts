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
import {Curriculum} from "./Curriculum";

@Table
export class Topic extends Model<Topic> {

    @PrimaryKey
    @AutoIncrement
    @Column
    public id!: number;

    @AllowNull(false)
    @Column
    public name!: string;

    @AllowNull(false)
    @Column
    public skillCount!: number;

    @ForeignKey(() => Curriculum)
    @AllowNull(false)
    @Column
    public curriculumId!: number;

    @BelongsTo(() => Curriculum)
    public curriculum!: Curriculum;

    @CreatedAt
    public creationDate!: Date;


}
