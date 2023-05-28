import {
  Button,
  Image,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Input,
  Textarea,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { BiRightArrowAlt } from 'react-icons/bi';
import { TbDots } from 'react-icons/tb';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import WorkPlaceDefault from '../../assets/workplace-default.png';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
import './WorkPlaceCard.css';
import {
  getDatabase,
  onValue,
  ref as refD,
  remove,
  update,
} from 'firebase/database';
import { useAppSelector } from '../../hooks/hooks';
import { workerData } from 'worker_threads';

interface IWorkPlace {
  creatorID: string | null;
  workPlaceID: string | null;
  name: string | null;
  members: string[] | null;
}

interface IProps {
  workplace: IWorkPlace;
}

interface IUserDataSearch {
  value: string | null;
  label: string | null;
}

function WorkPlaceCard({ workplace }: IProps) {
  const [workplaceData, setWorkplaceData] = useState<IWorkPlace>({
    creatorID: '',
    workPlaceID: '',
    name: '',
    members: [],
  });
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const animatedComponents = makeAnimated();
  const [users, setUsers] = useState<IUserDataSearch[]>([]);
  const [members, setMembers] = useState<IUserDataSearch[]>([]);
  const [isLoading, setLoading] = useState(false);
  const uid = useAppSelector((state) => state.authUser.userId);

  useEffect(() => {
    setWorkplaceData(workplace);
    if (!isOpen) return;

    getUsers();
    getMembers();

    return () => {
      setUsers([]);
      setMembers([]);
    };
  }, [isOpen]);

  function handlerDeleteWorkPlace() {
    const database = getDatabase();
    const workplaceRef = refD(database, `workplaces/${workplace.workPlaceID}`);

    remove(workplaceRef)
      .then(() => {
        toast({
          variant: 'subtle',
          position: 'top-right',
          title: 'Робоча область була видалена',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.error(errorCode, errorMessage);
      });
  }

  function getUsers() {
    setLoading(true);
    const database = getDatabase();
    const usersRef = refD(database, 'users');
    onValue(usersRef, (snapshot) => {
      snapshot.forEach((value) => {
        if (value.key !== uid) {
          setUsers((prev) => [
            ...prev,
            {
              value: value.key,
              label: `${value.val().email} (${value.val().firstName} ${
                value.val().surname
              })`,
            },
          ]);
        }
      });
    });
  }

  function getMembers() {
    const database = getDatabase();
    const usersRef = refD(database, `users`);

    onValue(usersRef, (snapshot) => {
      snapshot.forEach((value) => {
        workplaceData.members?.forEach((member) => {
          if (value.key === member) {
            setMembers((prev) => [
              ...prev,
              {
                value: member,
                label: `${value.val().email} (${value.val().firstName} ${
                  value.val().surname
                })`,
              },
            ]);
          }
        });
      });
      setLoading(false);
    });
  }

  function handlerSubmit(event: React.SyntheticEvent<HTMLFormElement>): void {
    event.preventDefault();
    console.log(workplaceData);

    const database = getDatabase();
    const workplaceRef = refD(database, `workplaces/${workplace.workPlaceID}`);

    update(workplaceRef, { ...workplaceData })
      .then(() => {
        toast({
          variant: 'subtle',
          position: 'top-right',
          title: 'Робоча область була оновлена',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.error(errorCode, errorMessage);
      });
  }

  return (
    <Box
      boxShadow="xs"
      className="workplace-card flex justify-between h-[110px] p-4 gap-5 items-center bg-[#ffffff] hover:bg-[#fafafa]"
    >
      <div className="workplace-card__edit-menu">
        <Menu>
          <MenuButton
            height="16px"
            as={IconButton}
            icon={<TbDots />}
            variant="ghost"
          ></MenuButton>
          <MenuList>
            <MenuItem
              icon={<AiOutlineDelete />}
              onClick={handlerDeleteWorkPlace}
            >
              Видалити
            </MenuItem>
            <MenuItem icon={<AiOutlineEdit />} onClick={onOpen}>
              Редагувати
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
      <div className="flex gap-5 items-center">
        <Image
          src={WorkPlaceDefault}
          className="rounded-lg h-[68px] w-[68px]"
        />
        <div className="flex flex-col">
          <span className="font-semibold">{workplace.name}</span>
          <span>Кількість співробітників: {workplace.members?.length}</span>
        </div>
      </div>
      <Button
        colorScheme="teal"
        variant="solid"
        rightIcon={<BiRightArrowAlt />}
        onClick={() => {
          localStorage.setItem('workplaceID', workplace.workPlaceID!);
          navigate(`/home/workplace/${workplace.workPlaceID}/chats`);
        }}
      >
        Запустити робочу область
      </Button>
      {!isLoading && (
        <>
          <Drawer
            size="sm"
            isOpen={isOpen}
            placement="right"
            // initialFocusRef={firstField}
            onClose={onClose}
          >
            <DrawerOverlay />
            <form onSubmit={handlerSubmit}>
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader borderBottomWidth="1px">
                  Редагування робочу область
                </DrawerHeader>

                <DrawerBody className="flex flex-col gap-5">
                  <Input type="hidden" value={workplaceData?.creatorID!} />
                  <FormControl>
                    <FormLabel>Назва робочої області</FormLabel>
                    <Input
                      value={workplaceData?.name!}
                      required
                      variant="filled"
                      size="md"
                      className="rounded-md"
                      type="text"
                      name="work-place-name"
                      placeholder="Назва робочої області"
                      onChange={(e) =>
                        setWorkplaceData({
                          ...workplaceData,
                          name: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Перелік учасників робочої області</FormLabel>
                    <Select
                      placeholder="Електронна адреса співробітника"
                      onChange={(e) => {
                        setMembers([]);
                        const data: string[] = e.map((value) => {
                          setMembers((prev) => [
                            ...prev,
                            {
                              value: Object.values(value as Object)[0],
                              label: Object.values(value as Object)[1],
                            },
                          ]);
                          return Object.values(value as Object)[0];
                        });

                        setWorkplaceData({ ...workplace, members: data });
                      }}
                      value={members}
                      options={users}
                      isMulti
                      components={animatedComponents}
                    />
                  </FormControl>
                </DrawerBody>

                <DrawerFooter borderTopWidth="1px">
                  <Button variant="outline" mr={3} onClick={onClose}>
                    Закрити
                  </Button>
                  <Button type="submit" colorScheme="blue">
                    Редагувати
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </form>
          </Drawer>
        </>
      )}
    </Box>
  );
}

export default WorkPlaceCard;
