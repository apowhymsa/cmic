import {
  Button,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  useMergeRefs,
} from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { BsCheck } from 'react-icons/bs';
import { IoCloseOutline } from 'react-icons/io5';
import { AiOutlineEdit } from 'react-icons/ai';
import {
  MdOutlineAlternateEmail,
  MdOutlinePassword,
  MdOutlineErrorOutline,
  MdOutlineAccountCircle,
} from 'react-icons/md';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

interface IProps {
  value: string;
  type: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}
function EditableCustomInput({ value, type, onChange }: IProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isShow, setShow] = useState(false);
  const [isEditable, setEditable] = useState(false);

  const mergedRef = useMergeRefs(inputRef);

  useEffect(() => {
    if (!isEditable) return;

    inputRef.current?.focus();
  }, [isEditable]);

  return (
    <div className="flex gap-2 items-center w-full">
      {isEditable && (
        <InputGroup>
          {type === 'email' && (
            <InputLeftElement>
              <Icon as={MdOutlineAlternateEmail} />
            </InputLeftElement>
          )}
          {type === 'text' && (
            <InputLeftElement>
              <Icon as={MdOutlineAccountCircle} />
            </InputLeftElement>
          )}
          <Input
            type={type === 'password' ? (isShow ? 'text' : 'password') : type}
            value={value}
            required
            variant="filled"
            size="md"
            className="editable-input rounded-md"
            onChange={onChange}
            ref={mergedRef}
          />
          {type === 'password' && (
            <InputRightElement
              className="cursor-pointer"
              onClick={() => setShow(!isShow)}
            >
              <Icon as={isShow ? AiOutlineEyeInvisible : AiOutlineEye} />
            </InputRightElement>
          )}
        </InputGroup>
      )}

      {isEditable ? (
        <div>
          <Button
            colorScheme="teal"
            size="sm"
            onClick={() => {
              setShow(false);
              setEditable(!isEditable);
            }}
          >
            <BsCheck />
          </Button>
          {/* <Button
            colorScheme="teal"
            size="sm"
            onClick={() => setEditable(!isEditable)}
          >
            <IoCloseOutline />
          </Button> */}
        </div>
      ) : (
        <>
          {type === 'password' ? (
            <InputGroup>
              <Input
                type={type === 'password' && isShow ? 'text' : 'password'}
                value={value}
                required
                readOnly={true}
                variant="filled"
                size="md"
                className="rounded-md"
                onChange={onChange}
              />
              <InputRightElement
                className="cursor-pointer"
                onClick={() => setShow(!isShow)}
              >
                <Icon as={isShow ? AiOutlineEyeInvisible : AiOutlineEye} />
              </InputRightElement>
            </InputGroup>
          ) : (
            <span className="px-4 py-2 inline-block w-full rounded-md bg-[#EDF2F7] hover:bg-[#E2E8F0]">
              {value}
            </span>
          )}
          <Button
            colorScheme="teal"
            size="sm"
            onClick={() => {
              setShow(false);
              setEditable(!isEditable);
            }}
          >
            <AiOutlineEdit />
          </Button>
        </>
      )}
    </div>
  );
}

export default EditableCustomInput;
