import React, { useEffect, useState } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  useDisclosure,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  useToast,
} from '@chakra-ui/react';
import { RiAddFill } from 'react-icons/ri';
import {
  getDatabase,
  onValue,
  push,
  ref as refD,
  set,
} from 'firebase/database';
import { useAppSelector } from '../../hooks/hooks';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

// interface IProps {
//   isOpen: boolean;
//   onOpen: () => void;
//   onClose: () => void;
// }

interface IUserDataSearch {
  value: string | null;
  label: string | null;
}

interface IWorkSpace {
  creatorID?: string | undefined;
  name?: string | undefined;
  members?: string[] | undefined;
}

function DrawerMenu() {
  const toast = useToast();
  const animatedComponents = makeAnimated();
  const uid = useAppSelector((state) => state.authUser.userId);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [users, setUsers] = useState<IUserDataSearch[]>([]);
  const [workSpace, setWorkSpace] = useState<IWorkSpace>({
    creatorID: uid,
    name: '',
    members: [],
  });

  function handlerSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    const database = getDatabase();
    const workplaceRef = refD(database, 'workplaces/');
    console.log(workSpace);
    push(workplaceRef, {
      ...workSpace,
    })
      .then(() => {
        console.log('added');
        setWorkSpace({});
        onClose();

        toast({
          variant: 'subtle',
          position: 'top-right',
          title: 'Робоча область була створенна',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((error) => console.error(error.code, error.message));
  }

  function getUsers() {
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

  useEffect(() => {
    if (!isOpen) return;

    getUsers();

    return () => {
      setUsers([]);
    };
  }, [isOpen]);

  return (
    <>
      <Button
        className="open-drawer-create-workplace"
        leftIcon={<RiAddFill />}
        colorScheme="telegram"
        onClick={onOpen}
      >
        Створити робочу область
      </Button>
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
              Створити робочу область
            </DrawerHeader>

            <DrawerBody className="flex flex-col gap-5">
              <Input type="hidden" value={workSpace.creatorID} />
              <FormControl>
                <FormLabel>Назва робочої області</FormLabel>
                <Input
                  value={workSpace?.name}
                  required
                  variant="filled"
                  size="md"
                  className="rounded-md"
                  type="text"
                  name="work-place-name"
                  placeholder="Назва робочої області"
                  onChange={(e) =>
                    setWorkSpace({ ...workSpace, name: e.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Перелік учасників робочої області</FormLabel>
                <Select
                  placeholder="Електронна адреса співробітника"
                  onChange={(e) => {
                    const data: string[] = e.map((value) => {
                      return Object.values(value as Object)[0];
                    });
                    console.log(data);

                    setWorkSpace({ ...workSpace, members: data });
                  }}
                  isMulti
                  options={users}
                  components={animatedComponents}
                />
              </FormControl>
            </DrawerBody>

            <DrawerFooter borderTopWidth="1px">
              <Button variant="outline" mr={3} onClick={onClose}>
                Закрити
              </Button>
              <Button type="submit" colorScheme="blue">
                Створити
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </form>
      </Drawer>
    </>
  );
}

export default DrawerMenu;
