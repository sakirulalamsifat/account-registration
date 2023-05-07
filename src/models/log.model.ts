import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({ tableName: 'SW_TBL_LOG_DETAILS' })
export class LogModel extends Model {
  @Column({
    type: DataType.BIGINT,
    allowNull: false,

    primaryKey: true,
  })
  Transaction_ID: bigint;

  @Column({
    type: DataType.STRING(5),
  })
  level: string;

  @Column({
    type: DataType.STRING(500),
  })
  message: string;
  @Column({
    type: DataType.DATE,
  })
  timestamp: Date;
  @Column({
    type: DataType.STRING(50),
  })
  module: string;
}
