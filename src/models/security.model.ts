import { Model, Column, Table, DataType } from 'sequelize-typescript';
import { Sequelize } from 'sequelize-typescript';
@Table({
  tableName: 'SW_TBL_SECURITY_QUESTION_ANSWER_SET',
})
export class SecurityQuestionAnswerModel extends Model {
  @Column({
    primaryKey: true,
    type: DataType.BIGINT,
    autoIncrement:true
  })
  Row_ID: number;
  @Column({
    primaryKey: true,
    type: DataType.BIGINT,
  })
  Wallet_MSISDN: number;

  @Column(DataType.TINYINT)
  Question_ID: number;

  @Column(DataType.STRING)
  Answer: string;

  @Column({
    type: DataType.DATEONLY,
    defaultValue: Sequelize.fn('getdate'),
  })
  Created_Date: Date;

  @Column(DataType.STRING)
  Security_Token: string;
}
