import React from 'react';

type Props = {
  title: string;
  desc?: string;
  rightComp?: React.ReactNode;
};
export function SubHeader({ title, desc, rightComp }: Props) {
  return (
    <div className='flex flex-row items-center justify-between bg-white -mx-2    py-3 px-4 -mt-2 shadow rounded'>
      <div className='flex flex-row items-center gap-3'>
        <h2 className='font-semibold text-base text-gray-600'>{title}</h2>
        <p className='text-xs font-medium text-gray-400'>{desc}</p>
      </div>

      <div>{rightComp}</div>
    </div>
  );
}
