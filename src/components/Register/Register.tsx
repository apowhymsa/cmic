import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';
import image from '../../assets/image.svg';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import {
  MdOutlineAlternateEmail,
  MdOutlinePassword,
  MdOutlineErrorOutline,
  MdOutlineAccountCircle,
  MdOutlineUpload,
} from 'react-icons/md';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import {
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Button,
  Image,
  useToast,
} from '@chakra-ui/react';
import { IUser } from '../../types';
import { IUserData } from './types';
import { IconType } from 'react-icons/lib';
import { getStorage, ref as refS, uploadBytes } from 'firebase/storage';
import { getDatabase, ref as refD, set } from 'firebase/database';

function Register() {
  const [step, setStep] = useState(0);
  const toast = useToast();
  const [isLoading, setLoading] = useState(false);
  const [userData, setUserData] = useState<IUser>({
    email: '',
    password: '',
    firstName: '',
    surname: '',
    nickname: '',
    image: undefined,
  } as IUser);

  function handlerSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    const auth = getAuth();
    setLoading(true);
    createUserWithEmailAndPassword(auth, userData.email, userData.password)
      .then((userCredential) => {
        toast({
          title: 'Обліковий запис створено',
          variant: 'top-accent',
          isClosable: true,
          status: 'success',
        });
        const storage = getStorage();
        const storageRef = refS(
          storage,
          `avatars/${(userData.image as File).name}`
        );
        uploadBytes(storageRef, userData.image as File)
          .then((snapshot) => {
            const database = getDatabase();
            set(refD(database, `users/${userCredential.user.uid}`), {
              email: userData.email,
              password: userData.password,
              firstName: userData.firstName,
              surname: userData.surname,
              image: snapshot.metadata.fullPath,
              nickname: userData.nickname,
            });
            console.log(snapshot);
          })
          .catch((error) => console.log(error.code, error.message));

        console.log(userCredential);
        console.log(userData);
      })
      .catch((error) => {
        console.error(`Code: ${error.code}`, `Message: ${error.message}`);
      })
      .finally(() => setLoading(false));
  }

  return (
    <div className="form w-[450px] text-base">
      <h3 className="font-semibold text-lg">Реєстрація облікового запису</h3>
      <hr className="w-full h-0.5 my-2.5" />
      <div className="flex justify-evenly my-3.5">
        <div
          className={
            step >= 0
              ? 'step-1 w-6 h-6 text-center rounded-full bg-[#319795] text-[#f2ffff] after:bg-[#319795]'
              : 'step-1 w-6 h-6 text-center rounded-full bg-[#e2e8f0] text-black after:bg-[#e2e8f0]'
          }
        >
          1
        </div>
        <div
          className={
            step >= 1
              ? 'step-2 w-6 h-6 text-center rounded-full bg-[#319795] text-[#f2ffff] after:bg-[#319795]'
              : 'step-2 w-6 h-6 text-center rounded-full bg-[#e2e8f0] text-black after:bg-[#e2e8f0]'
          }
        >
          2
        </div>
        <div
          className={
            step >= 2
              ? 'step-3 w-6 h-6 text-center rounded-full bg-[#319795] text-[#f2ffff]'
              : 'step-3 w-6 h-6 text-center rounded-full bg-[#e2e8f0] text-black'
          }
        >
          3
        </div>
      </div>
      <form className="flex flex-col gap-2.5" onSubmit={handlerSubmit}>
        {step === 0 && (
          <>
            <RegisterStepOne userData={userData} setUserData={setUserData} />
            <Button
              name="next"
              colorScheme="teal"
              variant="solid"
              onClick={(e) => setStep((prev) => prev + 1)}
            >
              Далі
            </Button>
          </>
        )}
        {step === 1 && (
          <>
            <RegisterStepTwo userData={userData} setUserData={setUserData} />
            <div className="flex gap-2.5">
              <Button
                className="w-full"
                name="back"
                colorScheme="teal"
                variant="solid"
                onClick={() => setStep((prev) => prev - 1)}
              >
                Назад
              </Button>
              <Button
                className="w-full"
                name="next"
                colorScheme="teal"
                variant="solid"
                onClick={() => setStep((prev) => prev + 1)}
              >
                Далі
              </Button>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <RegisterStepThree userData={userData} setUserData={setUserData} />
            <div className="flex gap-2.5">
              <Button
                className="w-2/6"
                name="back"
                colorScheme="teal"
                variant="solid"
                onClick={() => setStep((prev) => prev - 1)}
              >
                Назад
              </Button>
              <Button
                className="w-4/6"
                isLoading={isLoading}
                type="submit"
                name="submit"
                colorScheme="teal"
                variant="solid"
              >
                Реєстрація облікового запису
              </Button>
            </div>
          </>
        )}
      </form>
      <div className="text-xs">
        <hr className="w-full h-0.5 my-2.5" />
        <p>
          Вже маєте обліковий запис?
          <Link
            className="text-blue-600 underline underline-offset-4 ml-1"
            to="/auth/login"
          >
            Увійти в обліковий запис
          </Link>
        </p>
      </div>
    </div>
  );
}

function RegisterStepOne(props: IUserData) {
  const [isShow, setShow] = useState(false);
  const { userData, setUserData } = props;
  return (
    <>
      <InputGroup>
        <InputLeftElement>
          <Icon as={MdOutlineAlternateEmail} />
        </InputLeftElement>
        <Input
          required
          variant="filled"
          size="md"
          className="rounded-md"
          type="email"
          name="email"
          placeholder="Електронна адреса"
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        />
      </InputGroup>
      <InputGroup>
        <InputLeftElement>
          <Icon as={MdOutlinePassword} />
        </InputLeftElement>
        <Input
          required
          variant="filled"
          size="md"
          className="rounded-md"
          type={isShow === true ? 'text' : 'password'}
          name="password"
          placeholder="Пароль"
          value={userData.password}
          onChange={(e) =>
            setUserData({ ...userData, password: e.target.value })
          }
        />
        <InputRightElement
          className="cursor-pointer"
          onClick={() => setShow(!isShow)}
        >
          <Icon as={isShow ? AiOutlineEyeInvisible : AiOutlineEye} />
        </InputRightElement>
      </InputGroup>
    </>
  );
}

function RegisterStepTwo(props: IUserData) {
  const { userData, setUserData } = props;

  return (
    <>
      <InputGroup>
        <InputLeftElement>
          <Icon as={MdOutlineAccountCircle} />
        </InputLeftElement>
        <Input
          required
          variant="filled"
          size="md"
          className="rounded-md"
          type="text"
          name="firstName"
          placeholder="Ім'я"
          value={userData.firstName}
          onChange={(e) =>
            setUserData({ ...userData, firstName: e.target.value })
          }
        />
      </InputGroup>
      <InputGroup>
        <InputLeftElement>
          <Icon as={MdOutlineAccountCircle} />
        </InputLeftElement>
        <Input
          required
          variant="filled"
          size="md"
          className="rounded-md"
          type="text"
          name="surname"
          placeholder="Прізвище"
          value={userData.surname}
          onChange={(e) =>
            setUserData({ ...userData, surname: e.target.value })
          }
        />
      </InputGroup>
    </>
  );
}

function RegisterStepThree(props: IUserData) {
  const { userData, setUserData } = props;

  function fileToURL(file: Blob): string {
    return URL.createObjectURL(file);
  }

  return (
    <>
      <label
        htmlFor="image"
        className="flex items-center justify-center cursor-pointer"
      >
        <Image
          className="image-register border-solid border-4 border-[#319795]"
          borderRadius="full"
          boxSize="150px"
          objectFit={userData.image ? 'cover' : 'none'}
          src={userData.image ? fileToURL(userData.image as Blob) : image}
          alt="profile image"
        />
      </label>
      <Input
        variant="filled"
        size="md"
        className="rounded-md hidden"
        type="file"
        name="image"
        id="image"
        onChange={(e) =>
          setUserData({ ...userData, image: e.target.files![0] })
        }
      />
      <InputGroup>
        <InputLeftElement>
          <Icon as={MdOutlineAccountCircle} />
        </InputLeftElement>
        <Input
          required
          variant="filled"
          size="md"
          className="rounded-md"
          type="text"
          name="nickname"
          placeholder="Псевдонім"
          value={userData.nickname}
          onChange={(e) =>
            setUserData({ ...userData, nickname: e.target.value })
          }
        />
      </InputGroup>
    </>
  );
}

export default Register;
