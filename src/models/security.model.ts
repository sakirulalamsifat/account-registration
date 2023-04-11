import { Model, Column, Table, DataType } from 'sequelize-typescript';
@Table({
  tableName: 'SW_TBL_SECURITY_QUESTION_ANSWER_SET',
})
export class SecurityQuestioneModel extends Model {
  @Column({
    primaryKey: true,
    type: DataType.BIGINT,
  })
  Row_ID: number;
  @Column({
    primaryKey: true,
    type: DataType.BIGINT,
  })
  MSISDN: number;
  @Column(DataType.TINYINT)
  Question_ID: number;

  @Column(DataType.STRING)
  Answer: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  Created_Date: Date;
  @Column(DataType.STRING)
  Security_Token: string;
}
