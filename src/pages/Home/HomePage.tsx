import React, { memo, useEffect, useState } from 'react';
import { User, getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { Button } from '@chakra-ui/react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { RootState } from '../../utils/redux/store';
import { setAuthUser, setUserProps } from '../../utils/redux/userSlice';
import Header from '../../components/Header/Header';
import './HomePage.css';
import { getDatabase, onValue, ref as refD } from 'firebase/database';
import { IUser } from '../../types';
import WorkPlaces from '../../components/WorkPlace/WorkPlaces';
import { setWorkplaces } from '../../utils/redux/workplacesSlice';
import Footer from '../../components/Footer/Footer';

interface IWorkPlace {
  creatorID: string | null;
  workPlaceID: string | null;
  name: string | null;
  members: string[] | null;
}
function HomePage() {
  console.log('render');
  const dispath = useAppDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser | undefined>();
  const [workplaces, setWorkplaces] = useState<IWorkPlace[]>([]);
  const [isLoading, setLoading] = useState(false);
  const authUser = useAppSelector((state: RootState) => state.authUser.userId);

  function getCurrentUser() {
    setLoading(true);
    onAuthStateChanged(getAuth(), (user) => {
      dispath(setAuthUser(user?.uid));
      onValue(refD(getDatabase(), `users/${user?.uid}`), (snapshot) => {
        setUser(snapshot.val());
      });
      onValue(refD(getDatabase(), `workplaces/`), (snapshot) => {
        setWorkplaces([]);
        snapshot.forEach((value) => {
          const isMember = value.val().members.join(',').includes(authUser);
          if (value.val().creatorID === user?.uid || isMember) {
            setWorkplaces((prev) => [
              ...prev,
              {
                creatorID: value.val().creatorID,
                workPlaceID: value.key,
                name: value.val().name,
                members: value.val().members,
              },
            ]);
          }
        });
        setLoading(false);
      });

      if (!user) {
        navigate('/auth/login');
      }
    });
  }

  useEffect(() => {
    getCurrentUser();

    return () => {
      setUser(undefined);
      setWorkplaces([]);
    };
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // bg - bg-[#f3f2ef]
  return (
    <div className="home-container">
      <Header user={user} />
      <Outlet context={[workplaces, user]} />
      <Footer />
    </div>
  );
}

export default HomePage;
