import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useDisclosure,
  Image,
  Box,
  useToast,
} from '@chakra-ui/react';
import {
  getDatabase,
  ref as refD,
  remove,
  set,
  update,
} from 'firebase/database';
import React, { useEffect, useRef, useState } from 'react';
import { MdOutlineSubject, MdOutlineTitle } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

interface ITask {
  key?: string | null;
  id: string;
  title: string;
  desc: string;
  status: string;
}

interface IColumnProps {
  headerTitle: string;
  status: string;
  tasks: ITask[];
  setTasks: Function;
  isOpenCreate: boolean;
  onOpenCreate: () => void;
  onCloseCreate: () => void;
}

interface IAlertProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  task?: ITask;
  setTasks: Function;
}

function Column({
  headerTitle,
  status,
  tasks,
  setTasks,
  isOpenCreate,
  onOpenCreate,
  onCloseCreate,
}: IColumnProps) {
  const { id } = useParams();
  function handlerDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();

    const currentTask = JSON.parse(localStorage.getItem('currentDragTask')!);
    let selectedBoardStatus = (event.target as HTMLDivElement).dataset
      .boardStatus;

    const db = getDatabase();
    const scrumRef = refD(db, `workplaces/${id}/scrum/${currentTask}`);
    if (
      (event.target as HTMLDivElement).className.includes('cards-container')
    ) {
      update(scrumRef, {
        status: selectedBoardStatus,
      });
    } else {
      selectedBoardStatus = (event.target as HTMLDivElement).parentElement
        ?.dataset.boardStatus;

      update(scrumRef, {
        status: selectedBoardStatus,
      });
    }
  }

  function handlerDragOver(event: React.DragEvent<HTMLDivElement>): void {
    event.preventDefault();
  }

  return (
    <div
      className="flex flex-col gap-3 flex-1 bg-[#ffffff] cards-container"
      data-board-status={status}
      onDrop={handlerDrop}
      onDragOver={handlerDragOver}
    >
      <div className="bg-[#dce1f5] rounded-xl flex flex-col items-center py-2">
        <h2 className="text-center font-semibold">{headerTitle}</h2>
        <span>
          Кількість задач:{' '}
          {tasks.filter((task) => task.status === status).length}
        </span>
      </div>
      {tasks
        .filter((task) => task.status === status)
        .map((task) => (
          <TaskCard
            task={task}
            setTasks={setTasks}
            isOpenCreate={isOpenCreate}
            onOpenCreate={onOpenCreate}
            onCloseCreate={onCloseCreate}
          />
        ))}
    </div>
  );
}

export default Column;

interface ITaskCardProps {
  task: ITask;
  setTasks: Function;
  isOpenCreate: boolean;
  onOpenCreate: () => void;
  onCloseCreate: () => void;
}
function TaskCard({
  task,
  setTasks,
  isOpenCreate,
  onOpenCreate,
  onCloseCreate,
}: ITaskCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [currentBoard, setCurrentBoard] = useState<string | undefined>();
  const { title, status, desc } = task;
  const {
    isOpen: isOpenUpdate,
    onOpen: onOpenUpdate,
    onClose: onCloseUpdate,
  } = useDisclosure();

  function handlerOnDragStart(
    e: React.DragEvent<HTMLDivElement>,
    task: ITask
  ): void {
    localStorage.setItem('currentDragTask', JSON.stringify(task?.key));
  }

  function handlerOnDragEnd(e: React.DragEvent<HTMLDivElement>): void {
    document.querySelectorAll('.task-card').forEach((item) => {
      (item as HTMLDivElement).style.border = '2px solid #4444441f';
    });
  }

  function handlerOnDragLeave(e: React.DragEvent<HTMLDivElement>): void {
    document.querySelectorAll('.task-card').forEach((item) => {
      (item as HTMLDivElement).style.border = '2px solid #4444441f';
    });
  }
  function handlerOnDragOver(e: React.DragEvent<HTMLDivElement>): void {
    e.preventDefault();
    if ((e.target as HTMLDivElement).className.includes('task-card')) {
      (e.target as HTMLDivElement).style.border = '2px solid green';
    }
  }
  function handlerOnDrop(e: React.DragEvent<HTMLDivElement>): void {
    e.preventDefault();
  }

  return (
    <Box
      shadow="sm"
      ref={cardRef}
      data-task-status={task.status}
      data-task-id={task?.id}
      data-task={JSON.stringify(task)}
      className="task-card p-2 bg-white rounded-md cursor-pointer"
      onClick={onOpenUpdate}
      draggable={true}
      onDragStart={(e) => handlerOnDragStart(e, task)}
      onDragEnd={(e) => handlerOnDragEnd(e)}
      onDragLeave={(e) => handlerOnDragLeave(e)}
      onDragOver={(e) => handlerOnDragOver(e)}
      onDrop={(e) => handlerOnDrop(e)}
    >
      <div style={{ pointerEvents: 'none' }}>
        <p className="font-semibold text-center">{title}</p>
        <hr className="w-full h-0.5 my-2.5 border-[gray]" />
        <p className="text-[14px]">{desc}</p>
      </div>
      <AlertUpdateTask
        setTasks={setTasks}
        isOpen={isOpenUpdate}
        onOpen={onOpenUpdate}
        onClose={onCloseUpdate}
        task={task}
      />
    </Box>
  );
}

function AlertUpdateTask({
  isOpen,
  onOpen,
  onClose,
  task,
  setTasks,
}: IAlertProps) {
  const { id } = useParams();
  const toast = useToast();
  const cancelRef = React.useRef(null);
  const [cardTask, setCardTask] = useState<ITask | undefined>(task);

  // useEffect(() => {
  //   console.log(tasks);
  // }, []);
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
            {`Перегляд та керування задачею з ідентифікатором: ${task?.id}`}
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
                minHeight="200px"
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

          <AlertDialogFooter className="flex gap-3">
            <Button
              colorScheme="red"
              onClick={() => {
                const db = getDatabase();
                const ref = refD(db, `workplaces/${id}/scrum/${task?.key}`);
                remove(ref).then(() => {
                  setCardTask({
                    ...cardTask,
                    title: '',
                    desc: '',
                    id: '',
                    key: '',
                    status: '',
                  });
                  onClose();
                  toast({
                    title: 'Картка SCRUM задачі була видалена.',
                    position: 'top-right',
                    variant: 'top-accent',
                    isClosable: true,
                    status: 'success',
                  });
                });
              }}
            >
              Видалити
            </Button>
            <Button ref={cancelRef} onClick={onClose}>
              Закрити
            </Button>
            <Button
              colorScheme="telegram"
              onClick={() => {
                setCardTask({ ...cardTask! });
                setTasks((prev: ITask[]) => [
                  ...prev.map((current) =>
                    current.id === task?.id
                      ? {
                          ...current,
                          title: cardTask?.title,
                          desc: cardTask?.desc,
                        }
                      : current
                  ),
                ]);

                const db = getDatabase();
                const ref = refD(db, `workplaces/${id}/scrum/${task?.key}`);
                update(ref, { ...cardTask }).then(() => {
                  onClose();
                  toast({
                    title: 'SCRUM задачa була оновлена.',
                    position: 'top-right',
                    variant: 'top-accent',
                    isClosable: true,
                    status: 'success',
                  });
                });
              }}
            >
              Оновити
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
