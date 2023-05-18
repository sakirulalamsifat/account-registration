import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { Sequelize } from 'sequelize-typescript';

@Table({ tableName: 'SW_TBL_DORMANT_CONFIG_TEMP' })
export class DormantTempModel extends Model {
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement:true
  })
  Row_Id: bigint;
  @Column({
    type: DataType.BIGINT
  })
  Dm_Row_Id: bigint;
  @Column({
    type: DataType.INTEGER
  })
  Wallet_Type: number;

  @Column({
    type: DataType.INTEGER
  })
  Dormant_Inactive_Days: number;

  @Column({
    type: DataType.INTEGER
  })
  Status: number;

  @Column({
    type: DataType.STRING(10)
  })
  Operation: string;

  @Column({
    type: DataType.STRING(100)
  })
  Remarks: string;

  @Column({
    type: DataType.STRING(20)
  })
  Created_By: string;

  @Column({

    type: DataType.DATEONLY,
    defaultValue: Sequelize.fn('getdate'),
  })
  Created_Date: Date;

  @Column({
    type: DataType.STRING(20)
  })
  Modified_By: string;

  @Column({

    type: DataType.DATEONLY,
  })
  Modified_Date: Date;

  @Column({
    type: DataType.STRING(20)
  })
  Approved_By: string;

  @Column({

    type: DataType.DATEONLY,
  })
  Approved_Date: Date;

  @Column({
    type: DataType.BIGINT,
  })
  Main_Row_Id: bigint;
}