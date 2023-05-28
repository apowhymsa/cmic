import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import './Login.css';
import {
  MdOutlineAlternateEmail,
  MdOutlinePassword,
  MdOutlineErrorOutline,
} from 'react-icons/md';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import {
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Button,
  Divider,
  useToast,
} from '@chakra-ui/react';
import { IUser } from '../../types';
import { useAppDispatch } from '../../hooks/hooks';
import { setAuthUser } from '../../utils/redux/userSlice';

function Login() {
  const toast = useToast();
  const navigate = useNavigate();
  const dispath = useAppDispatch();
  const [isShow, setShow] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [userData, setUserData] = useState<IUser>({
    email: '',
    password: '',
  } as IUser);

  function handlerSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    const auth = getAuth();
    setLoading(true);
    signInWithEmailAndPassword(auth, userData.email, userData.password)
      .then((userCredential) => {
        console.log(userCredential);
        dispath(setAuthUser(userCredential.user.uid));
        navigate('/home');
      })
      .catch((error) => {
        console.error(`Code: ${error.code}`, `Message: ${error.message}`);
      })
      .finally(() => setLoading(false));
  }

  return (
    <div className="form w-[450px] text-base">
      <h3 className="font-semibold text-lg">Авторизація в обліковий запис</h3>
      <hr className="w-full h-0.5 my-2.5" />
      <form className="flex flex-col gap-2.5" onSubmit={handlerSubmit}>
        <InputGroup>
          <InputLeftElement>
            <Icon as={MdOutlineAlternateEmail} />
          </InputLeftElement>
          <Input
            variant="filled"
            size="md"
            className="rounded-md"
            type="email"
            name="email"
            placeholder="Електронна адреса"
            value={userData.email}
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
          />
        </InputGroup>
        <InputGroup>
          <InputLeftElement>
            <Icon as={MdOutlinePassword} />
          </InputLeftElement>
          <Input
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
        <Button
          isLoading={isLoading}
          type="submit"
          name="submit"
          colorScheme="teal"
          variant="solid"
        >
          Авторизація в обліковий запис
        </Button>
      </form>
      <div className="text-xs">
        <hr className="w-full h-0.5 my-2.5" />
        <p>
          Немає облікового запису?
          <Link
            className="text-blue-600 underline underline-offset-4 ml-1"
            to="/auth/register"
          >
            Зареєструвати обліковий запис
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
