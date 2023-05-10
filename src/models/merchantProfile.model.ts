import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'SW_TBL_PROFILE_MERCHANT' })
export class MerchantProfileModel extends Model {
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    primaryKey: true,
  })
  MSISDN: bigint;
  @Column({
    type: DataType.STRING(16),
    allowNull: false,
  })
  Acc_Code: string;
  @Column({
    type: DataType.STRING(300),
    allowNull: false,
  })
  PIN: string;

}