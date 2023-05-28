import React, { useEffect, useState } from 'react';
import EditableCustomInput from './EditableCustomInput';
import {
  getDatabase,
  onValue,
  ref as refD,
  set,
  update,
} from 'firebase/database';
import { useAppSelector } from '../../hooks/hooks';
import { Button, Image, Input, useToast } from '@chakra-ui/react';
import image from '../../assets/image.svg';
import {
  getBlob,
  getDownloadURL,
  getStorage,
  ref as refS,
  uploadBytes,
} from 'firebase/storage';
// import { IUser } from '../../types';

export interface IUser {
  email: string;
  password: string;
  nickname: string;
  firstName: string;
  surname: string;
  image: File | Blob | string;
}

function Profile() {
  const toast = useToast();
  const [previewImage, setPreviewImage] = useState<File>();
  const [isLoading, setLoading] = useState(false);
  const authUserID = useAppSelector((state) => state.authUser.userId);
  const [userData, setUserData] = useState<IUser>({
    email: '',
    password: '',
    firstName: '',
    image: '',
    nickname: '',
    surname: '',
  } as IUser);

  function handlerSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    console.log(userData);
    const imageName = (userData.image as File).name;

    const storageRef = refS(getStorage(), `avatars/${imageName}`);
    uploadBytes(storageRef, userData.image as File)
      .then((snapshot) => {
        const database = getDatabase();
        const userRef = refD(database, `users/${authUserID}`);
        console.log(snapshot);
        update(userRef, {
          ...userData,
          image: `avatars/${imageName}`,
        })
          .then(() => {
            console.log('updated');

            toast({
              variant: 'subtle',
              position: 'top-right',
              title: 'Дані облікового запису були оновлені',
              status: 'success',
              duration: 3000,
              isClosable: true,
            });
          })
          .catch((error) => console.error(error.code, error.message));
      })
      .catch((error) => console.log(error.code, error.message))
      .finally(() => setLoading(false));
  }

  function getUserData() {
    const database = getDatabase();

    const userRef = refD(database, `users/${authUserID}`);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      const storageRef = refS(getStorage(), `${data.image}`);
      getDownloadURL(storageRef)
        .then((url) => {
          console.log(url);
          setUserData({ ...data, image: url });
        })
        .catch((error) => console.error(error.code, `123 ${error.message}`));
    });
  }

  function fileToURL(file: File): string {
    return URL.createObjectURL(file);
  }

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className="flex px-14 py-10 items-center">
      <form
        className="flex justify-between gap-4 flex-1 flex-col"
        onSubmit={handlerSubmit}
      >
        <label
          htmlFor="image"
          className="flex items-center justify-center cursor-pointer"
        >
          <Image
            className="image-register border-solid border-4 border-[#319795]"
            borderRadius="full"
            boxSize="150px"
            objectFit={userData.image ? 'cover' : 'none'}
            src={
              previewImage
                ? fileToURL(previewImage)
                : (userData.image as string)
            }
          />
        </label>
        <Input
          variant="filled"
          size="md"
          className="rounded-md hidden"
          type="file"
          name="image"
          id="image"
          onChange={(e) => {
            setPreviewImage(e.target.files![0] as File);
            setUserData({
              ...userData,
              image: e.target.files![0] as File,
            });
          }}
        />
        <div className="flex-1">
          <h3 className="font-semibold text-md">Контактна інформація</h3>
          <hr className="w-full h-0.5 my-2.5" />
          <div className="flex flex-col gap-5">
            <EditableCustomInput
              type="text"
              value={userData.firstName}
              onChange={(e) =>
                setUserData({ ...userData, firstName: e.target.value })
              }
            />
            <EditableCustomInput
              type="text"
              value={userData.surname}
              onChange={(e) =>
                setUserData({ ...userData, surname: e.target.value })
              }
            />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-md">Інформація про аккаунт</h3>
          <hr className="w-full h-0.5 my-2.5" />
          <div className="flex flex-col gap-5">
            <EditableCustomInput
              type="email"
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
            />
            <EditableCustomInput
              type="text"
              value={userData.nickname}
              onChange={(e) =>
                setUserData({ ...userData, nickname: e.target.value })
              }
            />
            <EditableCustomInput
              type="password"
              value={userData.password}
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
            />
          </div>
          <Button
            isLoading={isLoading}
            colorScheme="telegram"
            type="submit"
            className="mt-5"
          >
            Зберегти зміни
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
