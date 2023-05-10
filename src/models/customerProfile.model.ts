import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'SW_TBL_PROFILE_CUST' })
export class CustomerProfileModel extends Model {
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
    type: DataType.STRING(100),
    allowNull: false,
  })
  First_Name: string;
  @Column({
    type: DataType.STRING(30),
    allowNull: false,
  })
  Last_Name: string;
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  Email: string;
  @Column({
    type: DataType.INTEGER,
  })
  ID_Type: bigint;
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  ID_Number: string;
  @Column({
    type: DataType.STRING(300),
    allowNull: false,
  })
  PIN: string;
  @Column({
    type: DataType.TINYINT,
  })
  Wallet_Type: bigint;
  @Column({
    type: DataType.TINYINT,
  })
  Keyword_Commission_ID: bigint;
  @Column({
    type: DataType.TINYINT,
  })
  Status: bigint;
  @Column({
    type: DataType.TINYINT,
  })
  KYC_Status: bigint;
  @Column({
    type: DataType.STRING(255),
  })
  Photo_URL: string;
  @Column({
    type: DataType.STRING(255),
  })
  ID_Doc_URL: string;
  @Column({
    type: DataType.TINYINT,
  })
  Fail_Attempt: bigint;
  @Column({
    type: DataType.TINYINT,
  })
  Keyword_Charge_Id: bigint;
  @Column({
    type: DataType.CHAR,
  })
  Gender: string;
  @Column({
    type: DataType.DATEONLY,
  })
  DOB: Date;
  @Column({
    type: DataType.BIGINT,
  })
  Agent_ID: bigint;
  Created_By: string;
  @Column({
    type: DataType.DATEONLY,
  })
  Created_Date: Date;
  @Column({
    type: DataType.STRING(20),
  })
  Modified_By: string;
  @Column({
    type: DataType.DATEONLY,
  })
  Modified_Date: Date;
  @Column({
    type: DataType.STRING(20),
  })
  Approved_By: string;
  @Column({
    type: DataType.DATEONLY,
  })
  Approved_Date: Date;
  @Column({ type: DataType.INTEGER })
  Nationality: bigint;
  @Column({ type: DataType.DATEONLY })
  ID_Expiry_Date: Date;
  @Column({
    type: DataType.STRING(50),
  })
  Permanent_District: string;
  @Column({
    type: DataType.DATEONLY,
  })
  KYC_Approved_Date: Date;
  @Column({
    type: DataType.STRING(100),
  })
  Front_Id_Image_Url: string;
  @Column({
    type: DataType.STRING(100),
  })
  Back_Id_Image_Url: string;
  @Column({
    type: DataType.STRING(100),
  })
  Permanent_City: string;
  @Column({ type: DataType.TINYINT })
  Reset_Pin_Attempt: bigint;
  @Column({
    type: DataType.STRING(100),
  })
  Mimics_AuthCode: string;
  @Column({
    type: DataType.STRING(200),
  })
  username: string;
  @Column({ type: DataType.SMALLINT })
  new_pin_set: bigint;
}