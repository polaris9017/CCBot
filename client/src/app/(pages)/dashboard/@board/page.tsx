import React from 'react';
import { getSession } from '@/serverActions/auth';
import BoardPageComponent from './BoardPageComponent';

export default async function Board() {
  const session = await getSession();
  const uid = session?.user.uid;
  const channelId = session?.user.channelId;

  return (
    <>
      {channelId ? (
        <div>
          <div className="flex items-center justify-center p-4">
            <h1 className="text-4xl font-bold text-center">안녕하세요!</h1>
          </div>
          <div className="flex items-center justify-center p-4">
            <h4 className="text-center">좌상단 메뉴에서 항목을 선택하세요</h4>
          </div>
        </div>
      ) : (
        <BoardPageComponent uid={uid!} />
      )}
    </>
  );
}
