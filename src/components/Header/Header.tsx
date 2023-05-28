import {
  Image,
  Menu,
  Button,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Input,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useRef, useState, memo, useEffect } from 'react';
import { SiSecurityscorecard } from 'react-icons/si';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import './Header.css';
import { getAuth, signOut } from 'firebase/auth';
import { setAuthUser } from '../../utils/redux/userSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { IUser } from '../../types';
import DrawerMenu from './DrawerMenu';
import { getDatabase, onValue, ref as refD } from 'firebase/database';
import { Link, useNavigate } from 'react-router-dom';

interface IProps {
  user: IUser | undefined;
}
function Header({ user }: IProps) {
  console.log('header render');
  const navigate = useNavigate();
  const [isOpenMenu, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  function logout() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        dispatch(setAuthUser(''));
        console.log('success logout');
        navigate('/auth/login');
      })
      .catch((error) => console.error(error.message));
  }

  return (
    <header className="w-full shadow-lg bg-[#ffffff]">
      <div className="flex h-16 items-center justify-between px-16">
        <div className="flex items-center gap-24 h-[inherit]">
          <Image
            className="w-6 h-6 cursor-pointer"
            as={SiSecurityscorecard}
            fill="#319795"
          />
          <nav className="h-[inherit]">
            <ul className="flex gap-10 h-[inherit]">
              <li className="header-nav-element h-[inherit] flex items-center cursor-pointer">
                <Link to="/home">Головна</Link>
              </li>
              <li className="header-nav-element h-[inherit] flex items-center cursor-pointer">
                <Link to="/home/profile">Профіль</Link>
              </li>
              {localStorage.getItem('workplaceID') && (
                <>
                  <li className="header-nav-element h-[inherit] flex items-center cursor-pointer">
                    <Link
                      to={`workplace/${localStorage.getItem(
                        'workplaceID'
                      )}/chats`}
                    >
                      Мессенджер
                    </Link>
                  </li>
                  <li className="header-nav-element h-[inherit] flex items-center cursor-pointer">
                    <Link
                      to={`workplace/${localStorage.getItem(
                        'workplaceID'
                      )}/scrum`}
                    >
                      SCRUM
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
        <div className="flex gap-10">
          <DrawerMenu />
          <Menu
            onOpen={() => setOpen(!isOpenMenu)}
            onClose={() => setOpen(!isOpenMenu)}
          >
            <MenuButton
              colorScheme="teal"
              variant="solid"
              as={Button}
              rightIcon={
                isOpenMenu ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />
              }
            >
              {(user as IUser)?.nickname}
            </MenuButton>
            <MenuList>
              <MenuItem>
                <Link to="/home/profile">Профіль</Link>
              </MenuItem>
              <MenuItem onClick={logout}>Вийти з облікового запису</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
    </header>
  );
}

export default Header;
