import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { userInfo } from 'os';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { Subscriber } from './entities/subscriber.entity';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
    private readonly usersService: UsersService,
  ) {}

  async create(userId: number, userToSubscribeId: number) {
    // Finding the user
    const user_1 = await this.usersService.findOne(userId);
    const user_2 = await this.usersService.findOne(userToSubscribeId);
    const subscribe = this.subscriberRepository.create({
      user_subscribe: user_1,
      user_to_subscribe: user_2,
    });
    return this.subscriberRepository.save(subscribe);
  }

  findAll() {
    return this.subscriberRepository.find();
  }

  findOne(id: number) {
    return this.subscriberRepository.findOne(id);
  }

  async update(id: number, updateSubscriberDto: UpdateSubscriberDto) {
    const subscription = await this.subscriberRepository.preload({
      id: id,
      ...updateSubscriberDto,
    });
    if (!subscription) {
      throw new NotFoundException(`Subscription with id ${id} not found`);
    }
    return this.subscriberRepository.save(subscription);
  }

  async remove(id: number) {
    const subscription = await this.findOne(id);
    return this.subscriberRepository.remove(subscription);
  }
}
