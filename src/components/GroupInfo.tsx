import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonItemDivider, IonLabel, IonList, IonLoading, IonNav, IonNavLink, IonPage, IonRow, IonTabBar, IonTabButton, IonTabs, IonText, IonTitle, IonToolbar, useIonViewDidEnter, useIonViewWillEnter } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { person, call, settings, airplane, bluetooth, wifi, settingsOutline } from 'ionicons/icons';
import Login from '../pages/Login';
import SignUp from '../pages/Signup';
import { AuthApi, Group, GroupApi } from '../api';
import { useHistory } from 'react-router-dom';
import GroupAddUserForm from './GroupAddUserForm';
import { getIcon } from '../constants/constants';

interface Props {
    group: Group
}

const GroupInfo: React.FC<Props> = ({group}) => {
    const navigate = useHistory();
    const {apiConf, isAuthenticated} = useApp();

    useIonViewWillEnter(() => {
        console.log("group");
        console.log(group);
    });

    return (
        <IonCardContent>
            <div>Auth: {isAuthenticated ? 'true':'false'}</div>
            <IonItemDivider color="light" className="ion-margin-top">
                <IonLabel>Participants</IonLabel>
                <IonButton slot='end' fill="clear" color={'dark'}>
                    <IonIcon icon={settingsOutline}></IonIcon>
                </IonButton>
            </IonItemDivider>
            <IonList>
                <IonItem>
                    <IonLabel>{group?.creator?.name}</IonLabel>
                    <small>{group?.creator?.points +' '+ group?.points_name}</small>
                    <IonIcon slot="end" src={getIcon(group.points_icon!)}></IonIcon>
                </IonItem>
                {group?.couple ?
                <IonItem>
                    <IonLabel>{group?.couple?.name}</IonLabel>
                    <small>{group.couple.points +' '+ group?.points_name}</small>
                    <IonIcon slot="end" src={getIcon(group.points_icon!)}></IonIcon>
                </IonItem>
                :
                <IonItem>
                    <IonLabel slot="start"><p>No user found</p></IonLabel>
                    <IonButton slot="end" type='button' expand="full" routerLink="/groupAddUser" color={'secondary'}>
                        Add user
                    </IonButton>
                </IonItem>
                }
            </IonList>

            <IonItemDivider color="light" >
                <IonLabel>Manage</IonLabel>
            </IonItemDivider>
            <IonRow>
                
                <IonCol>
                    <IonButton type='button' expand="full" routerLink="/taskForm" >
                        New Task
                    </IonButton>
                </IonCol>
                <IonCol>
                    <IonButton type='button' expand="full" routerLink="/rewardForm">
                        New Reward
                    </IonButton>
                </IonCol>
                
            </IonRow>
            <IonRow>
                <IonCol>
                    <IonButton type='button' expand="full" routerLink="/taskList">
                        Tasks
                    </IonButton>
                </IonCol>
                <IonCol>
                    <IonButton type='button' expand="full" routerLink="/rewardList">
                        Rewards
                    </IonButton>
                </IonCol>
                
            </IonRow>
            
       
        </IonCardContent>
    );
};

export default GroupInfo;