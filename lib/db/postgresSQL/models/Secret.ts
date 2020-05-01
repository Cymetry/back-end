import {
    AllowNull,
    Column,
    CreatedAt,
    Model,
    PrimaryKey, Table,
} from "sequelize-typescript";

@Table
export class Secret extends Model<Secret> {

    @PrimaryKey
    @Column
    public id!: number;

    @AllowNull(false)
    @Column
    public userId!: number;

    @AllowNull(false)
    @Column
    public token!: number;

    @CreatedAt
    public creationDate!: Date;

}
