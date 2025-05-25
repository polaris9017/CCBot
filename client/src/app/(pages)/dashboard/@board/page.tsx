import React from 'react';
import { getSession } from '@/serverActions/auth';
import BoardPageComponent from '@/app/(pages)/dashboard/@board/BoardPageComponent';

async function Board() {
  const session = await getSession();
  const uid = session?.user.uid;
  const channelId = session?.user.channelId;

  return <>{channelId ? channelId : <BoardPageComponent uid={uid!} />}</>;
}

export default Board;
