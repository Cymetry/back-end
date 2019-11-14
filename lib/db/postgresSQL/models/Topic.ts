import {AllowNull, AutoIncrement, Column, CreatedAt, Model, PrimaryKey, Table} from "sequelize-typescript";

@Table
export class Topic extends Model<Topic> {

    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @AllowNull(false)
    @Column
    name: string;

    @CreatedAt
    creationDate: Date;


}