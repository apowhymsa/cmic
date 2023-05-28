import React from 'react';
import { Image } from '@chakra-ui/react';
import { SiSecurityscorecard } from 'react-icons/si';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div className="bg-[#2b353a] text-white flex flex-col p-6 justify-between">
      <div className="flex items-center justify-between">
        <nav>
          <ul className="flex gap-10 h-[inherit]">
            <li className="h-[inherit] flex items-center cursor-pointer">
              <Link to="/home">Головна</Link>
            </li>
            <li className="h-[inherit] flex items-center cursor-pointer">
              <Link to="/home/profile">Профіль</Link>
            </li>
            {localStorage.getItem('workplaceID') && (
              <>
                <li className="h-[inherit] flex items-center cursor-pointer">
                  <Link
                    to={`workplace/${localStorage.getItem(
                      'workplaceID'
                    )}/chats`}
                  >
                    Мессенджер
                  </Link>
                </li>
                <li className="h-[inherit] flex items-center cursor-pointer">
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
        <div className="flex items-center gap-5">
          <Image
            className="w-10 h-10 cursor-pointer"
            as={SiSecurityscorecard}
            fill="#319795"
          />
          <span>CMIC</span>
        </div>
      </div>
      <hr className="w-full h-0.5 my-2.5 border-[gray]" />
      <div className="text-center text-sm">&copy; 2023 Copyright CMIC</div>
    </div>
  );
}

export default Footer;
