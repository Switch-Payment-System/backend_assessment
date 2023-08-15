import { Column, Entity } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseTable } from '../../base';
import { UserType } from '../../interfaces/user.interface';

@Entity({ name: 'users' })
export class Users extends BaseTable {
  @Column({ type: 'varchar' })
  firstName: string;

  @Column({ type: 'varchar' })
  lastName: string;

  @Column({ type: 'varchar' })
  fullName: string;

  @Column({ type: 'varchar' })
  businessName: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  userType: UserType;

  @Exclude()
  @Column({ type: 'text', nullable: true })
  password: string;

  @Column({ type: 'varchar' })
  gender: string;

  @Column({ type: 'varchar' })
  dob: string;

  @Column({ type: 'varchar' })
  bvn: string;

  @Column({ type: 'varchar' })
  avatar: string;

  @Column({ type: 'varchar', unique: true })
  phoneNumber: string;

  @Column({ type: 'varchar' })
  maritalStatus: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'boolean', default: false })
  isWaitlistUser: boolean;
}
