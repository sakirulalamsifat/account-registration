import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
} from 'sequelize-typescript';

@Table({ tableName: 'SW_TBL_WALLET' })
export class WalletModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.BIGINT })
  Wallet_MSISDN!: number;

  @Column({ type: DataType.INTEGER })
  Wallet_Code: number;

  @Column({ type: DataType.DECIMAL(10, 2) })
  Amount: number;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  Created_Date: Date;

  @Column({ type: DataType.STRING })
  Created_By: string;

  @Column({ type: DataType.TINYINT })
  Status: number;

  @Column({ type: DataType.BIGINT })
  Last_Transaction_ID: number;

  @Column({ type: DataType.DECIMAL(10, 2) })
  Last_Transaction_Amount: number;

  @Column({ type: DataType.DECIMAL(10, 2) })
  Balance_Before: number;

  @Column({ type: DataType.DATE })
  Modified_Date: Date;

  @Column({ type: DataType.STRING })
  Modified_By: string;

  @Column({ type: DataType.BIGINT, defaultValue: 0 })
  Current_Year_Reward_Point: number;

  @Column({ type: DataType.BIGINT, defaultValue: 0 })
  Last_Year_Reward_Point: number;

  @Column({ type: DataType.BIGINT })
  Parent: number;

  @Column({ type: DataType.BIGINT })
  Mobile_Number: number;
}
