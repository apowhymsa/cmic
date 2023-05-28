import {
  get,
  getDatabase,
  onValue,
  push,
  ref as refD,
} from 'firebase/database';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../hooks/hooks';
import {
  Button,
  IconButton,
  Input,
  background,
  useDisclosure,
  Image,
  Menu,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { RiChatVoiceLine } from 'react-icons/ri';
import './WorkPlace.css';
import AlertCreateChat from './AlertCreateChat';
import { HiOutlinePlusCircle } from 'react-icons/hi';
import { getDownloadURL, getStorage, ref as refS } from 'firebase/storage';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';

interface IUserData {
  fullName: string;
  image: string;
}
interface IMessage {
  from: string;
  text: string;
  date: string;
  userData: IUserData;
}

interface IChat {
  key: string;
  message: IMessage[];
  name: string;
}

interface IWorkplace {
  chats: IChat;
  creatorID: string;
  members: string[];
  name: string;
}

function WorkPlace() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenContext,
    onOpen: onOpenContext,
    onClose: onCloseContext,
  } = useDisclosure();
  const { id } = useParams();
  const [chatID, setChatID] = useState<string>();
  const [message, setMessage] = useState<string>('');
  const [chats, setChats] = useState<IChat[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [selectChat, setSelectChat] = useState(false);
  const messageContainerRef = useRef(null);
  const userID = useAppSelector((state) => state.authUser.userId);

  function sendMessage() {
    const now = new Date();
    const messageRef = refD(
      getDatabase(),
      `workplaces/${id}/chats/${chatID}/message`
    );
    const userRef = refD(getDatabase(), `users/${userID}`);
    get(userRef).then((usersnap) => {
      const storageRef = refS(getStorage(), `${usersnap.val().image}`);
      getDownloadURL(storageRef).then((url) => {
        push(messageRef, {
          from: userID,
          text: message,
          date: `${now.getHours()}:${now.getMinutes()}`,
          userData: {
            fullName: `${usersnap.val().firstName} ${usersnap.val().surname}`,
            image: url,
          },
        });
      });
    });

    setMessage('');
  }

  function loadChats() {
    const chatsRef = refD(getDatabase(), `workplaces/${id}/chats`);
    onValue(chatsRef, (snapshot) => {
      setChats([]);
      snapshot.forEach((value) => {
        setChats((prev) => [...prev, { ...value.val(), key: value.key }]);
      });
    });
  }

  function loadMessages(chatKey: string) {
    setChatID(chatKey);
    const messagesRef = refD(
      getDatabase(),
      `workplaces/${id}/chats/${chatKey}/message`
    );
    onValue(messagesRef, (snapshot) => {
      setMessages([]);
      snapshot.forEach((value) => {
        setMessages((prev) => [
          ...prev,
          {
            text: value.val().text,
            from: value.val().from,
            date: value.val().date,
            userData: {
              fullName: value.val().userData.fullName,
              image: value.val().userData.image,
            },
          },
        ]);
      });
      setSelectChat(true);
    });
  }

  useEffect(() => {
    loadChats();

    return () => {
      setChats([]);
      setMessages([]);
    };
  }, []);

  useEffect(() => {
    (messageContainerRef.current as unknown as HTMLDivElement)?.scroll(0, 5000);
    console.log(messageContainerRef.current);
  }, [messages]);
  return (
    <div className="workplace-container mt-4 pb-4">
      <div className="flex flex-col workplace-chats bg-[#ffffff] shadow-sm">
        <div
          className="add-chat-btn-container cursor-pointer flex justify-center border-teal-600 border-dotted border-[3px] p-3"
          onClick={onOpen}
        >
          <HiOutlinePlusCircle
            cursor="pointer"
            className="w-6 h-6"
            color="#0f766e"
          />
        </div>

        <div className="chats-container">
          {chats.map((chat) => {
            return (
              <div
                onContextMenu={() => alert('clicked')}
                className="chat flex items-center justify-center p-3 cursor-pointer bg-inherit hover:bg-[#f1f1f1]"
                onClick={(e) => {
                  const parentElement = (e.target as HTMLDivElement)
                    .parentElement;
                  parentElement?.childNodes.forEach((item) => {
                    (item as HTMLDivElement).classList.remove('chat-active');
                  });
                  (e.target as HTMLDivElement).classList.add('chat-active');
                  loadMessages(chat.key);
                }}
              >
                {chat.name}
              </div>
            );
          })}
        </div>
      </div>
      <div className="workplace-messages-container flex justify-between flex-col shadow-sm">
        {selectChat && (
          <>
            <div ref={messageContainerRef} className="workplace-messages">
              {messages.map((value) => {
                return (
                  <div
                    className={
                      value.from === userID
                        ? 'flex gap-2 items-end mx-5 justify-end'
                        : 'flex gap-2 items-end mx-5'
                    }
                  >
                    <Image
                      src={value.userData.image}
                      width={35}
                      height={35}
                      className={
                        value.from === userID
                          ? 'rounded-full order-2'
                          : 'rounded-full order-1'
                      }
                    />
                    <div
                      className={
                        value.from === userID
                          ? 'bg-teal-600 p-3 pb-6 m-2 text-white w-fit justify-end relative min-w-[50px] rounded-lg order-1'
                          : 'p-3 pb-6 m-2 w-fit justify-end relative min-w-[50px] rounded-lg bg-[#e2e8f0] order-2'
                      }
                    >
                      <div className="text-xs font-semibold">
                        {value.userData.fullName}
                      </div>
                      {value.text}
                      <span className="text-xs absolute bottom-[7px] right-[10px]">
                        {value.date}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className=" mt-3  mx-5 flex gap-5 items-end">
              <Input
                variant="filled"
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button
                className="w-fit"
                colorScheme="teal"
                onClick={sendMessage}
              >
                <RiChatVoiceLine />
              </Button>
            </div>
          </>
        )}
      </div>
      <AlertCreateChat
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        chatID={chatID}
        workplaceID={id}
      />
    </div>
  );
}

export default WorkPlace;
