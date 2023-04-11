import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'SW_TBL_NOTIFICATION',

})
export class NotificationModel extends Model {
  @Column({
    field: 'Notification_ID',
    primaryKey: true,
    type: DataType.INTEGER,
  })
  notificationId: number;

  @Column({
    field: 'Keyword',
    type: DataType.STRING,
  })
  keyword: string;

  @Column({
    field: 'Notification_Template',
    type: DataType.STRING
  })
  notificationTemplate: string;

  @Column({
    field: 'Language',
    type: DataType.STRING,
  })
  language: string;

  @Column({
    field: 'HasUnicode',
    type: DataType.BOOLEAN,
  })
  hasUnicode: boolean;

  @Column({
    field: 'Created_By',
    type: DataType.STRING,
  })
  createdBy: string;

  @Column({
    field: 'Created_Date',
    type: DataType.DATE
  })
  createdDate: Date;

  @Column({
    field: 'Modified_By',
    type: DataType.STRING,
  })
  modifiedBy: string;

  @Column({
    field: 'Modified_Date',
    type: DataType.DATE
  })
  modifiedDate: Date;

  @Column({
    field: 'Approved_By',
    type: DataType.STRING,
  })
  approvedBy: string;

  @Column({
    field: 'Approved_Date',
    type: DataType.DATE
  })
  approvedDate: Date;

  @Column({
    field: 'Templete_Type',
    type: DataType.STRING,
  })
  templateType: string;

  @Column({
    field: 'Is_Financial',
    type: DataType.STRING,
  })
  isFinancial: string;

  @Column({
    field: 'SendSms',
    type: DataType.STRING,
  })
  sendSms: string;

  @Column({
    field: 'MsgFor',
    type: DataType.STRING,
  })
  msgFor: string;

  @Column({
    field: 'Template_Description',
    type: DataType.STRING,
  })
  templateDescription: string;

  @Column({
    field: 'message_type',
    type: DataType.STRING,
  })
  messageType: string;
}
