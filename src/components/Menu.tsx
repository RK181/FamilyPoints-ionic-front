import {
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonLoading,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import { useHistory, useLocation } from 'react-router-dom';
import { logIn, logInOutline, logOutOutline, logOut , logoReact, people, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, trashOutline, trashSharp, warningOutline, warningSharp } from 'ionicons/icons';
import './Menu.css';
import { AuthApi } from '../api';
import { useApp } from '../context/AppContext';
import { useState } from 'react';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
  authRequired: boolean;
}

const appPages: AppPage[] = [
  {
    title: 'SignUp',
    url: '/signup',
    iosIcon: logoReact,
    mdIcon: logoReact,
    authRequired: false
  },
  {
    title: 'Login',
    url: '/login',
    iosIcon: logInOutline,
    mdIcon: logIn,
    authRequired: false
  },
  {
    title: 'Group',
    url: '/group',
    iosIcon: people,
    mdIcon: people,
    authRequired: true
  }
];

const labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

const Menu: React.FC = () => {
  const location = useLocation();
  const navigate = useHistory();
  const {isAuthenticated, apiConf, setSession} = useApp();


  const logOutSession = async (event: any) => {
    try {
        var api = new AuthApi(apiConf);
        api.logoutUser();
        setSession!(false, '', '');

        navigate.push("/login");
    } catch (error: any) {
        console.log("error:" + error.response?.status )
    }
}

  return (
    <IonMenu contentId="main">
        <IonHeader>
          <IonToolbar color="tertiary">
            <IonTitle>Menu Content</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding" scrollY={false}>
          <IonList id="inbox-list">
            {appPages.map((appPage, index) => {
              return (
                appPage.authRequired === isAuthenticated ?
                <IonMenuToggle key={index} autoHide={false}>
                  <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="inset" detail={false}>
                    <IonIcon aria-hidden="true" slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                    <IonLabel>{appPage.title}</IonLabel>
                  </IonItem>
                </IonMenuToggle>
                :
                ''
              );
            })}
          </IonList>
        </IonContent>
        <IonFooter>
          <IonToolbar color='light'>
            {isAuthenticated ?
              <IonItem color='light' button onClick={logOutSession}>
                <IonIcon aria-hidden="true" slot="start" color="danger" ios={logOutOutline} md={logOut} />
                <IonLabel color="danger">LogOut</IonLabel>
              </IonItem>
            :
            ''}
          </IonToolbar>
        </IonFooter>
      </IonMenu>
  );
};

export default Menu;
