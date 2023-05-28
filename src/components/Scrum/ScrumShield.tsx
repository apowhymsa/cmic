// import {
//   ColumnDirective,
//   ColumnsDirective,
//   KanbanComponent,
// } from '@syncfusion/ej2-react-kanban';
import React, { useEffect, useState } from 'react';
import Column from './Column';
import { useParams } from 'react-router-dom';
import './Scrum.css';
import { RiAddFill } from 'react-icons/ri';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useDisclosure,
  Image,
  AlertDialogFooter,
  useToast,
} from '@chakra-ui/react';
import { MdOutlineSubject, MdOutlineTitle } from 'react-icons/md';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase, onValue, push, ref, set } from 'firebase/database';

interface ITask {
  key?: string | null;
  id: string;
  title: string;
  desc: string;
  status: string;
}

function ScrumShield() {
  const { id } = useParams();
  const [tasks, setTasks] = useState<ITask[]>([]);
  const {
    isOpen: isOpenCreate,
    onOpen: onOpenCreate,
    onClose: onCloseCreate,
  } = useDisclosure();

  useEffect(() => {
    const db = getDatabase();
    const tasksRef = ref(db, `workplaces/${id}/scrum`);
    onValue(tasksRef, (snap) => {
      setTasks([]);
      snap.forEach((task) => {
        console.log(task.key);
        setTasks((prev) => [
          ...prev,
          {
            key: task.key,
            id: task.val().id,
            title: task.val().title,
            desc: task.val().desc,
            status: task.val().status,
          },
        ]);
      });
    });
  }, []);
  return (
    <>
      <div className="flex flex-col my-3 px-3">
        <Button
          leftIcon={<RiAddFill />}
          className="w-fit"
          mb={3}
          colorScheme="telegram"
          onClick={() => onOpenCreate()}
        >
          Додати нову задачу
        </Button>
        <div className="flex flex-1 gap-4">
          <Column
            headerTitle="TO DO"
            tasks={tasks}
            status="1"
            setTasks={setTasks}
            isOpenCreate={isOpenCreate}
            onOpenCreate={onOpenCreate}
            onCloseCreate={onCloseCreate}
          />
          <Column
            headerTitle="IN PROGRESS"
            tasks={tasks}
            status="2"
            setTasks={setTasks}
            isOpenCreate={isOpenCreate}
            onOpenCreate={onOpenCreate}
            onCloseCreate={onCloseCreate}
          />
          <Column
            headerTitle="DONE"
            tasks={tasks}
            status="3"
            setTasks={setTasks}
            isOpenCreate={isOpenCreate}
            onOpenCreate={onOpenCreate}
            onCloseCreate={onCloseCreate}
          />
        </div>
      </div>
      <AlertCreateTask
        tasks={tasks}
        setTasks={setTasks}
        isOpen={isOpenCreate}
        onOpen={onOpenCreate}
        onClose={onCloseCreate}
      />
    </>
  );
}

export default ScrumShield;

interface IAlertProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  task?: ITask;
  tasks?: ITask[];
  setTasks: Function;
}
function AlertCreateTask({
  isOpen,
  onOpen,
  onClose,
  tasks,
  task,
  setTasks,
}: IAlertProps) {
  const { id } = useParams();
  const toast = useToast();
  const [cardTask, setCardTask] = useState<ITask>({
    id: '',
    desc: '',
    status: '1',
    title: '',
  });

  const cancelRef = React.useRef(null);
  return (
    <AlertDialog
      size="2xl"
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="md" fontWeight="bold">
            Створення нової задачі
          </AlertDialogHeader>

          <AlertDialogBody className="flex flex-col gap-3">
            <FormControl>
              <FormLabel>
                <span className="flex items-center gap-3">
                  <Image
                    className="w-6 h-6 cursor-pointer"
                    as={MdOutlineTitle}
                  />
                  Назва задачі
                </span>
              </FormLabel>
              <Input
                variant="filled"
                type="text"
                value={cardTask?.title}
                onChange={(e) =>
                  setCardTask({ ...cardTask!, title: e.target.value })
                }
                placeholder="Заголовок задачі"
              />
            </FormControl>

            <FormControl>
              <FormLabel>
                <span className="flex items-center gap-3">
                  <Image
                    className="w-6 h-6 cursor-pointer"
                    as={MdOutlineSubject}
                  />
                  Опис задачі
                </span>
              </FormLabel>
              <Textarea
                resize="vertical"
                variant="filled"
                placeholder="Опис задачі"
                value={cardTask?.desc}
                onChange={(e) =>
                  setCardTask({ ...cardTask!, desc: e.target.value })
                }
              />
            </FormControl>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Закрити
            </Button>
            <Button
              colorScheme="telegram"
              ml={3}
              onClick={() => {
                setCardTask({ ...cardTask, id: uuidv4(), status: '1' });
                setTasks((prev: ITask[]) => [...prev, { ...cardTask }]);

                push(ref(getDatabase(), `workplaces/${id}/scrum`), {
                  ...cardTask,
                }).then(() => {
                  setCardTask({
                    ...cardTask,
                    title: '',
                    desc: '',
                  });
                  onClose();
                  toast({
                    title: 'Картка SCRUM задачі була створена.',
                    position: 'top-right',
                    variant: 'top-accent',
                    isClosable: true,
                    status: 'success',
                  });
                });
              }}
            >
              Створити
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
