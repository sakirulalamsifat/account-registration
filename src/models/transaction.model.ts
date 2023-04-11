import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({ tableName: 'SW_VIEW_TOPFIVE_TRANSACTION' })
export class TransactionModel extends Model {
  @Column({
    type: DataType.BIGINT,
    allowNull: false,

    primaryKey: true,
  })
  Transaction_ID: bigint;

  @Column({
    type: DataType.STRING(5),
  })
  Keyword: string;
  @Column({
    type: DataType.STRING(160),
  })
  Keyword_Description: string;
  @Column({
    type: DataType.BIGINT,
  })
  Source_Wallet_ID: bigint;
  @Column({
    type: DataType.BIGINT,
  })
  Dest_Wallet_ID: bigint;
  @Column({
    type: DataType.DECIMAL(10, 2),
  })
  Amount: number;

  @Column({
    type: DataType.TINYINT,
  })
  Status: bigint;
}
