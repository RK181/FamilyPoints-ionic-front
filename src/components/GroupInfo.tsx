import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonItemDivider, IonLabel, IonList, IonLoading, IonNav, IonNavLink, IonPage, IonRow, IonTabBar, IonTabButton, IonTabs, IonText, IonTitle, IonToolbar, useIonViewDidEnter, useIonViewWillEnter } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { person, call, settings, airplane, bluetooth, wifi } from 'ionicons/icons';
import Login from '../pages/Login';
import SignUp from '../pages/Signup';
import { AuthApi, Group, GroupApi } from '../api';
import { useHistory } from 'react-router-dom';
import GroupAddUserForm from './GroupAddUserForm';


const GroupInfo: React.FC = () => {
    const navigate = useHistory();
    const {apiConf, isAuthenticated} = useApp();
    const [group, setGroup] = useState<Group>();
    const [tabs, settab] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useIonViewWillEnter(() => {
        load();
        console.log('ionViewDidEnter event fired');
    });
      
    const change = async () => {
        if (tabs) {
            settab(false);
        }else{
            settab(true);

        }
    }

    const load = async () => {
        setLoading(true);
        
        try {
            var api = new GroupApi(apiConf);
            var response = await api.getGroup();

            setGroup(response.data)
            console.log(response);

        } catch (error: any) {
            if (error.response?.status == 404) {
                navigate.push("/login");
            }
            else if (error.response?.status == 401) {
                navigate.push("/login");
            }

        }finally {
            setLoading(false);
        }

    }



    return (
        <IonCardContent>
            <IonLoading className="custom-loading" isOpen={loading} message="Loading" spinner="circles" />

            <div>Auth: {isAuthenticated ? 'true':'false'}</div>
            <IonItemDivider color="light" className="ion-margin-top">
                <IonLabel>Participants</IonLabel>
            </IonItemDivider>
            <IonList>
                <IonItem>
                    <IonLabel slot="start">{group?.creator?.name}</IonLabel>
                    <IonLabel slot="end"><small>123 {group?.points_name}</small></IonLabel>
                </IonItem>
                {group?.couple ?
                <IonItem>
                    <IonLabel slot="start">{group?.couple?.name}</IonLabel>
                    <IonLabel slot="end"><small>123 {group?.points_name}</small></IonLabel>
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
                    <IonButton type='button' expand="full" onClick={change}>
                        New Task
                    </IonButton>
                </IonCol>
                <IonCol>
                    <IonButton type='button' expand="full" onClick={change}>
                        New Reward
                    </IonButton>
                </IonCol>
                
            </IonRow>
            <IonRow>
                <IonCol>
                    <IonButton type='button' expand="full" onClick={change}>
                        Tasks
                    </IonButton>
                </IonCol>
                <IonCol>
                    <IonButton type='button' expand="full" onClick={change}>
                        Rewards
                    </IonButton>
                </IonCol>
                
            </IonRow>
            
       
        </IonCardContent>
    );
};

export default GroupInfo;