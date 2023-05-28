import { getDatabase, onValue, ref as refD } from 'firebase/database';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { v4 as uuidv4 } from 'uuid';
import { IUser } from '../../types';
import WorkPlaceCard from './WorkPlaceCard';
import { Button, Image } from '@chakra-ui/react';
import emptyWorkPlacesImage from '../../assets/emptyWorkPlacesImage.svg';
import { useOutletContext } from 'react-router-dom';

interface IWorkPlace {
  creatorID: string | null;
  workPlaceID: string | null;
  name: string | null;
  members: string[] | null;
}

interface IProps {
  workplaces: IWorkPlace[];
  user: IUser | undefined;
}

function WorkPlaces() {
  const uid = useAppSelector((state) => state.authUser.userId);
  const [workplaces, user] = useOutletContext<[IWorkPlace[], IUser]>();

  return (
    <div
      className={
        workplaces.length <= 0
          ? 'flex flex-col items-center justify-center w-[60%] mx-auto min-w-[800px] mt-10  rounded-lg'
          : 'flex flex-col w-[60%] mx-auto min-w-[800px] mt-10  rounded-lg'
      }
    >
      {workplaces.length <= 0 ? (
        <div className="flex justify-between items-center">
          <div className="flex flex-col w-1/2 gap-5">
            <h3 className="font-semibold text-2xl">
              Створіть свою першу робочу область
            </h3>
            <span>
              CMIC дає можливість створити свою область для роботи з командою
              для спілкування та розподілення задач. Для створення нової робочої
              області, натисніть на кнопку нижче.
            </span>
            <Button
              colorScheme="telegram"
              onClick={() =>
                (
                  document.querySelector(
                    '.open-drawer-create-workplace'
                  ) as HTMLElement
                )?.click()
              }
            >
              Створити робочу область
            </Button>
          </div>
          <div>
            <Image src={emptyWorkPlacesImage} />
          </div>
        </div>
      ) : (
        <>
          <span className="p-5 border-teal-600 border-dotted border-[3px]">
            Робочі області для{' '}
            <span className="font-medium">{user?.email}</span>
          </span>
          {workplaces.map((value) => {
            return <WorkPlaceCard workplace={value} key={uuidv4()} />;
          })}
        </>
      )}
    </div>
  );
}

export default WorkPlaces;
