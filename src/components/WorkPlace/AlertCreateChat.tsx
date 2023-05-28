import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Input,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { getDatabase, push, ref as refD, set, update } from 'firebase/database';
import React, { useState } from 'react';

interface IProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  workplaceID: string | undefined;
  chatID: string | undefined;
}
function AlertCreateChat({
  isOpen,
  onOpen,
  onClose,
  workplaceID,
  chatID,
}: IProps) {
  const cancelRef = React.useRef(null);
  const [chatName, setChatName] = useState<string>('');
  const toast = useToast();

  function createChat() {
    const chatRef = refD(getDatabase(), `workplaces/${workplaceID}/chats`);
    push(chatRef, {
      name: chatName,
      message: null,
    }).then((data) => {
      console.log('success', data);
      setChatName('');

      onClose();
      toast({
        variant: 'subtle',
        position: 'top-right',
        title: 'Новий чат було створено',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    });
  }

  return (
    <div>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Створення чату
            </AlertDialogHeader>

            <AlertDialogBody>
              <Input
                variant="filled"
                type="text"
                value={chatName}
                onChange={(e) => setChatName(e.target.value)}
                placeholder="Назва чату"
              />
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Закрити
              </Button>
              <Button colorScheme="telegram" onClick={createChat} ml={3}>
                Створити
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </div>
  );
}

export default AlertCreateChat;
