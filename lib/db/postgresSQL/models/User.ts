import * as bcrypt from "bcryptjs";
import {Length} from "class-validator";
import {
    AllowNull,
    AutoIncrement,
    Column,
    CreatedAt,
    Default,
    Model,
    PrimaryKey,
    Table,
    UpdatedAt,
} from "sequelize-typescript";

@Table
export class User extends Model<User> {
    @PrimaryKey
    @AutoIncrement
    @Column
    public id!: number;

    @Length(4, 20)
    @AllowNull(false)
    @Column
    public name!: string;

    @Length(4, 20)
    @AllowNull(false)
    @Column
    public surname!: string;

    @Length(4, 40)
    @AllowNull(false)
    @Column
    public email!: string;

    @Length(4, 20)
    @AllowNull(false)
    @Column
    public password!: string;

    @AllowNull(false)
    @Column
    public dob!: Date;

    @AllowNull(true)
    @Column
    public country!: string;

    @AllowNull(true)
    @Column
    public city!: string;

    @AllowNull(true)
    @Column
    public school!: string;

    @AllowNull(false)
    @Default(false)
    @Column
    public isPremium!: boolean;

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
