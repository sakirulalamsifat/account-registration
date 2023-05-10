import { Model, Column, Table, DataType } from 'sequelize-typescript';
@Table({
  tableName: 'SW_TBL_SECURITY_QUESTION_HISTORY',
})
export class SecurityQuestionHistoryModel extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement : true,
    primaryKey: true
})
Question_ID: bigint;

@Column({
    type: DataType.TEXT
    
})
  Question_Description: string
  
  @Column({
    type: DataType.TEXT
    
})
  Created_By: string

  @Column({
    type: DataType.TEXT
    
})
  Approved_By: string
  
  @Column({
    type: DataType.DATE
    
})
  Created_Date: Date
  
  @Column({
    type: DataType.TEXT
    
})
  Question_Description_Local: string
  
  @Column({
    type: DataType.TEXT
    
})
Action: string


}
