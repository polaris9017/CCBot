import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  expression: `
    select user.id                     as id,
           user.uid                    as uid,
           user.naver_uid              as naver_uid,
           user_info.channel_id        as channel_id,
           user_info.channel_name      as channel_name,
           user_info.channel_image_url as channel_image_url
    from user
           join user_info on user.id = user_info.user_id;
  `,
})
export class UserView {
  @ViewColumn()
  uid: string;

  @ViewColumn({
    name: 'naver_uid',
  })
  naverUid: string;

  @ViewColumn({
    name: 'channel_id',
  })
  channelId: string;

  @ViewColumn({
    name: 'channel_name',
  })
  channelName: string;

  @ViewColumn({
    name: 'channel_image_url',
  })
  channelImageUrl: string;
}
