import { User } from 'src/users/entities/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Subscriber {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.my_followers)
  user_subscribe: User;

  @ManyToOne(() => User, (user) => user.following)
  user_to_subscribe: User;
}
