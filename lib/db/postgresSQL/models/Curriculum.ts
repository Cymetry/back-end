import {
    AllowNull,
    BelongsTo,
    Column,
    CreatedAt,
    ForeignKey,
    Model,
    PrimaryKey, Table,
} from "sequelize-typescript";
import {Program} from "./Program";

@Table
export class Curriculum extends Model<Curriculum> {

    @PrimaryKey
    @Column
    public id!: number;

    @AllowNull(false)
    @Column
    public name!: string;

    @AllowNull(true)
    @Column
    public logo!: string;

    @ForeignKey(() => Program)
    @AllowNull(false)
    @Column
    public programId!: number;

    @BelongsTo(() => Program)
    public program!: Program;

    @CreatedAt
    public creationDate!: Date;

}
