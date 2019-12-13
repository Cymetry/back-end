import {
    AllowNull,
    AutoIncrement,
    Column,
    CreatedAt,
    Model,
    PrimaryKey, Table,
} from "sequelize-typescript";

@Table
export class Program extends Model<Program> {

    @PrimaryKey
    @AutoIncrement
    @Column
    public id!: number;

    @AllowNull(false)
    @Column
    public name!: string;

    @CreatedAt
    public creationDate!: Date;

}
