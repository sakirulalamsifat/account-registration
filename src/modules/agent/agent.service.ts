import { Injectable, Inject } from '@nestjs/common';
import {
  CreateAgentbankingDto,
  OffnetWithdrawalDto,
} from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { ClientKafka } from '@nestjs/microservices';
import { AgentPorfileModel, JsonrxModel, AgentModel } from '../../models';
import {
  DATABASE_CONNECTION,
  AGENTPROFILE_REPOSITORY,
  TRANSACTION_REPOSITORY,
  JSONRX_REPOSITORY,
} from '../../config/constants';
import { Sequelize } from 'sequelize-typescript';
@Injectable()
export class AgentService {
  constructor(
    @Inject(AGENTPROFILE_REPOSITORY)
    private readonly agentprofileRepository: typeof AgentPorfileModel,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: typeof AgentModel,
    @Inject(JSONRX_REPOSITORY)
    private readonly jsonrxRepository: typeof JsonrxModel,
    @Inject(DATABASE_CONNECTION) private DB: Sequelize,
    @Inject('kafka_module') // Receiving kafka client from Module to connect with Kafka service bus
    private readonly client: ClientKafka,
  ) {}
  //KAFKA CONNECT
  async onModuleInit() {
    [process.env.KAFKA_REQ_TOPIC].forEach((key) =>
      this.client.subscribeToResponseOf(`${key}`),
    );
    await this.client.connect();
  }
  async onModuleDestroy() {
    await this.client.close();
  }
 // Generate Transaction ID
  async genTransectionId() {
    const curentDateTime = new Date();
    const year = curentDateTime.getFullYear().toString().substr(-2);
    const month = (curentDateTime.getMonth() + 1).toString().padStart(2, '0');
    const date = curentDateTime.getDate().toString().padStart(2, '0');
    const hour = curentDateTime.getHours().toString().padStart(2, '0');
    const minit = curentDateTime.getMinutes().toString().padStart(2, '0');
    const seconds = curentDateTime.getSeconds().toString().padStart(2, '0');
    const milliseconds = curentDateTime
      .getMilliseconds()
      .toString()
      .padStart(3, '0');

    const transectionId = `${year}${month}${date}${hour}${minit}${seconds}${milliseconds}`;
    return transectionId;
  }
  async create(createAgentDto: CreateAgentbankingDto) {
    return 'This action adds a new agent';
  }

  async withdrawal(createAgentDto: CreateAgentbankingDto) {
    return 'WITHDRAWAL';
  }

  async offnetwithdrawal(offnetWithdrawDto: OffnetWithdrawalDto) {
    return 'offnet';
  }
  findAll() {
    return `This action returns all agent`;
  }

  findOne(id: number) {
    return `This action returns a #${id} agent`;
  }

  update(id: number, updateAgentDto: UpdateAgentDto) {
    return `This action updates a #${id} agent`;
  }

  remove(id: number) {
    return `This action removes a #${id} agent`;
  }
}
