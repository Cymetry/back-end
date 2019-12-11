import * as bcrypt from "bcryptjs";
import {Length} from "class-validator";
import {AllowNull, AutoIncrement, Column, CreatedAt, Model, PrimaryKey, Table, UpdatedAt} from "sequelize-typescript";

@Table
export class User extends Model<User> {
    @PrimaryKey
    @AutoIncrement
    @Column
    public id!: number;

    @Length(4, 20)
    @AllowNull(false)
    @Column
    public username!: string;

    @Length(4, 20)
    @AllowNull(false)
    @Column
    public password!: string;

    @AllowNull(false)
    @Column
    public role!: string;

    @CreatedAt
    @Column
    public createdAt!: Date;


    @UpdatedAt
    @Column
    public updatedAt!: Date;

    public hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }

    public checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }
}
